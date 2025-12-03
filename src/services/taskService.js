const Task = require("../models/task");

const VALID_STATUSES = ["Pending", "In Progress", "Completed"];
const VALID_PRIORITIES = ["Low", "Medium", "High"];

module.exports = {
  // Validate payload for creation
  validateCreate(data) {
    if (!data || typeof data !== "object") throw new Error("invalid payload");
    if (!data.title || typeof data.title !== "string" || !data.title.trim()) {
      throw new Error("title is required");
    }
    if (
      !data.description ||
      typeof data.description !== "string" ||
      !data.description.trim()
    ) {
      throw new Error("description is required");
    }

    if (data.status && !VALID_STATUSES.includes(data.status)) {
      throw new Error("invalid status");
    }

    if (data.priority && !VALID_PRIORITIES.includes(data.priority)) {
      throw new Error("invalid priority");
    }

    if (data.dueDate) {
      this.parseDueDate(data.dueDate);
    }
  },

  // Validate payload for updates
  validateUpdate(data) {
    if (!data || typeof data !== "object") throw new Error("invalid payload");
    const hasStatus = Object.prototype.hasOwnProperty.call(data, "status");
    const hasPriority = Object.prototype.hasOwnProperty.call(data, "priority");

    if (!hasStatus && !hasPriority) throw new Error("nothing to update");

    if (hasStatus && !VALID_STATUSES.includes(data.status))
      throw new Error("invalid status");
    if (hasPriority && !VALID_PRIORITIES.includes(data.priority))
      throw new Error("invalid priority");
  },

  // Create Task
  async createTask(userId, data) {
    this.validateCreate(data);

    const payload = {
      userId,
      title: data.title.trim(),
      description: data.description ? String(data.description) : undefined,
      dueDate: data.dueDate ? this.parseDueDate(data.dueDate) : undefined,
      status: data.status,
      priority: data.priority,
    };

    const created = await Task.create(payload);
    return created;
  },

  // Get Task
  async getTasks(userId, filters = {}) {
    const query = { userId };

    if (filters.status) {
      if (!VALID_STATUSES.includes(filters.status))
        throw new Error("invalid status");
      query.status = filters.status;
    }

    if (filters.priority) {
      if (!VALID_PRIORITIES.includes(filters.priority))
        throw new Error("invalid priority");
      query.priority = filters.priority;
    }

    if (filters.dueDate) {
      const parsedDate = this.parseDueDate(filters.dueDate);

      const year = parsedDate.getUTCFullYear();
      const month = parsedDate.getUTCMonth();
      const day = parsedDate.getUTCDate();

      const start = new Date(Date.UTC(year, month, day, 0, 0, 0, 0));
      const end = new Date(Date.UTC(year, month, day, 23, 59, 59, 999));

      query.dueDate = { $gte: start, $lte: end };
    }

    // Pagination defaults
    const page = Number(filters.page) || 1;
    const limit = Number(filters.limit) || 10;
    const skip = (page - 1) * limit;

    const tasks = await Task.find(query, {
      title: 1,
      status: 1,
      priority: 1,
      dueDate: 1,
      description: 1,
    })
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 })
      .lean();

    const total = await Task.countDocuments(query);

    return {
      page,
      limit,
      total,
      data: tasks,
    };
  },

  // Update Task
  async updateTask(taskId, data) {
    this.validateUpdate(data);

    const updatePayload = {};
    if (Object.prototype.hasOwnProperty.call(data, "status"))
      updatePayload.status = data.status;
    if (Object.prototype.hasOwnProperty.call(data, "priority"))
      updatePayload.priority = data.priority;

    return await Task.findByIdAndUpdate(
      taskId,
      { $set: updatePayload },
      { new: true }
    );
  },

  // Delete Task
  async deleteTask(taskId) {
    if (!taskId) throw new Error("taskId required");
    return await Task.findByIdAndDelete(taskId);
  },

  parseDueDate(dueDate) {
    const regex = /^(0?[1-9]|1[0-2])[-/](0?[1-9]|[12][0-9]|3[01])[-/](\d{4})$/;

    if (!regex.test(dueDate)) {
      throw new Error("dueDate must be in MM-DD-YYYY format");
    }

    const [month, day, year] = dueDate.split(/[-/]/).map(Number);

    if (!month || !day || !year) {
      throw new Error("dueDate must be MM-DD-YYYY");
    }

    const date = new Date(Date.UTC(year, month - 1, day, 0, 0, 0, 0));

    if (isNaN(date.getTime())) {
      throw new Error("invalid dueDate format");
    }

    return date;
  },

  async getTaskById(taskId) {
    if (!taskId) throw new Error("taskId required");
    return await Task.findById(taskId);
  },
};
