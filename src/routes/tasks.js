const express = require("express");
const router = express.Router();
const taskController = require("../controllers/taskController");

router.post("/", taskController.createTask);
router.get("/", taskController.listTasks);
router.put("/:taskId", taskController.updateTask);
router.delete("/:taskId", taskController.deleteTask);
const { checkDeadlines } = require("../cron/taskDeadlineNotifier");

router.get("/run-cron", async (req, res) => {
  try {
    await checkDeadlines();
    res.json({ message: "Cron ran manually" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
module.exports = router;
