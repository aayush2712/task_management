const cron = require("node-cron");
const Task = require("../models/task");
const User = require("../models/user");
const { Resend } = require("resend");

const resend = new Resend(process.env.RESEND_API_KEY);
async function checkDeadlines() {
  const now = new Date();
  const next24hrs = new Date(now.getTime() + 24 * 60 * 60 * 1000);

  const tasks = await Task.find({
    dueDate: { $gte: now, $lte: next24hrs },
    status: { $ne: "Completed" },
  }).lean();

  for (const task of tasks) {
    const user = await User.findByPk(task.userId);
    if (!user) continue;

    const emailHTML = `
      <h2>Task Deadline Reminder</h2>
      <p>Your task <strong>${task.title}</strong> is nearing its deadline.</p>
      <p>Due Date: ${task.dueDate.toISOString().split("T")[0]}</p>
    `;

    await resend.emails.send({
      from: "onboarding@resend.dev",
      to: user.email,
      subject: "Task Deadline Reminder",
      html: emailHTML,
    });

    console.log("Email sent to:", user.email);
  }
}

cron.schedule("0 0 * * *", checkDeadlines);

module.exports = { checkDeadlines };
