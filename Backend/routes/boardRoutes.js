const express = require("express");
const router = express.Router();
const { Board } = require("../models");

router.get("/", async (req, res) => {
  const boards = await Board.findAll();
  res.json(boards);
});

// Create a new board
router.post("/", async (req, res) => {
  try {
    const { title } = req.body;
    if (!title) {
      return res.status(400).json({ error: "Title is required" });
    }

    const board = await Board.create({ title });
    res.status(201).json(board);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;
