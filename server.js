require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const sequelize = require("./src/db/sql");
const { connectMongo } = require("./src/db/mongo");

const authRoutes = require("./src/routes/auth");
const tasksRoutes = require("./src/routes/tasks");
const authenticateToken = require("./src/middleware/auth");

const app = express();
app.use(bodyParser.json());

app.use("/", authRoutes);
app.use("/tasks", authenticateToken, tasksRoutes);

const PORT = process.env.PORT || 4000;

async function start() {
  try {
    await sequelize.authenticate();
    console.log("Connected to SQL DB");
    await sequelize.sync();

    await connectMongo();

    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  } catch (err) {
    console.error("Failed to start server", err);
  }
}

start();
