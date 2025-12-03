const taskService = require("../services/taskService");

module.exports = {
  async createTask(req, res) {
    try {
      const userId = Number(req.user.userId);
      const payload = req.body;
      const created = await taskService.createTask(userId, payload);
      return res.status(201).json(created);
    } catch (err) {
      return res.status(500).json({ message: err.message });
    }
  },

  async listTasks(req, res) {
    try {
      const userId = Number(req.user.userId);
      const filters = req.query || {};
      const response = await taskService.getTasks(userId, filters);
      return res.json(response);
    } catch (err) {
      return res.status(500).json({ message: err.message });
    }
  },

  async updateTask(req, res) {
    try {
      const userId = Number(req.user.userId);
      const { taskId } = req.params;
      const task = await taskService.getTaskById(taskId);
      if (!task) return res.status(404).json({ message: "task not found" });
      if (Number(task.userId) !== userId)
        return res.status(500).json({ message: "forbidden - invalid user" });

      const updated = await taskService.updateTask(taskId, req.body);
      return res.json(updated);
    } catch (err) {
      return res.status(500).json({ message: err.message });
    }
  },

  async deleteTask(req, res) {
    try {
      const userId = Number(req.user.userId);
      const { taskId } = req.params;

      const task = await taskService.getTaskById(taskId);
      if (!task) return res.status(404).json({ message: "task not found" });
      if (Number(task.userId) !== userId)
        return res.status(500).json({ message: "forbidden - invalid user" });

      await taskService.deleteTask(taskId);
      return res.json({ message: "task deleted successfully" });
    } catch (err) {
      return res.status(500).json({ message: err.message });
    }
  },
};
