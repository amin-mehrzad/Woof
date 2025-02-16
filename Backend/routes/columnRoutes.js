const express = require("express");
const { Column } = require("../models");
const router = express.Router();

router.put("/:columnId", async (req, res) => {
  try {
    const { columnId } = req.params;
    const updateData = req.body; // Fields to update

    // Find the column
    const column = await Column.findByPk(columnId);
    if (!column) {
      return res.status(404).json({ error: "Column not found" });
    }

    // Update column with provided fields
    await column.update(updateData);

    res.json({
      message: "Column updated successfully",
      column,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/", async (req, res) => {
  const columns = await Column.findAll();
  res.json(columns);
});

// Create a new column
router.post("/", async (req, res) => {
  try {
    const { title, BoardId } = req.body; // You might want to assign a board, too
    if (!title) {
      return res.status(400).json({ error: "Title is required" });
    }

    const newColumn = await Column.create({ title, BoardId });
    res.status(201).json(newColumn);
  } catch (error) {
    console.error("Error creating column:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});
module.exports = router;
