const express = require("express");
const { Task, User, Column } = require("../models");
const router = express.Router();

// ✅ Assign multiple users to a task
router.put("/:taskId/assign", async (req, res) => {
  try {
    const { taskId } = req.params;
    const { userIds } = req.body; // Expecting an array of user IDs

    // Find the task
    const task = await Task.findByPk(taskId);
    if (!task) {
      return res.status(404).json({ error: "Task not found" });
    }

    // Find users
    const users = await User.findAll({ where: { id: userIds } });
    if (users.length !== userIds.length) {
      return res.status(404).json({ error: "One or more users not found" });
    }

    // ✅ Assign users to the task (Make sure Task.belongsToMany(User) is set up)
    if (typeof task.addUsers !== "function") {
      return res
        .status(500)
        .json({ error: "Task-User association not set up properly" });
    }

    await task.addUsers(users);

    // Fetch updated task with associated users
    const updatedTask = await Task.findByPk(taskId, {
      include: {
        model: User,
        attributes: ["id", "name", "email"],
        through: { attributes: [] }, // Hides TaskUsers from the response
      },
    });

    res.json({ message: "Task assigned successfully", task: updatedTask });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// ✅ Assign a task to a column
router.put("/:taskId/assign-column", async (req, res) => {
  try {
    const { taskId } = req.params;
    const { columnId } = req.body;

    // Check if task exists
    const task = await Task.findByPk(taskId);
    if (!task) {
      return res.status(404).json({ error: "Task not found" });
    }

    // Check if column exists
    const column = await Column.findByPk(columnId);
    if (!column) {
      return res.status(404).json({ error: "Column not found" });
    }

    // ✅ Assign the task to the column
    await task.update({ ColumnId: columnId });

    // Fetch updated task with column info
    const updatedTask = await Task.findByPk(taskId, {
      include: { model: Column, attributes: ["id", "title"] },
    });

    res.json({
      message: "Task assigned to column successfully",
      task: updatedTask,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// ✅ Get all tasks
router.get("/", async (req, res) => {
  const tasks = await Task.findAll({
    include: [
      {
        model: User,
        attributes: ["id", "name", "email"],
        through: { attributes: [] },
      },
      { model: Column, attributes: ["id", "title"] },
    ],
  });
  res.json(tasks);
});

// ✅ Create a new task
router.post("/", async (req, res) => {
  const task = await Task.create(req.body);
  res.json(task);
});

module.exports = router;
