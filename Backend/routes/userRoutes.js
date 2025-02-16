const express = require("express");
const router = express.Router();
const { User, Role } = require("../models");

// Create a new user
router.post("/", async (req, res) => {
  try {
    const { name, email, roleId } = req.body;
    if (!name || !email || !roleId) {
      return res
        .status(400)
        .json({ error: "Name, email, and roleId are required" });
    }

    const user = await User.create({ name, email, RoleId: roleId });
    res.status(201).json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Get all users
router.get("/", async (req, res) => {
  try {
    const users = await User.findAll({ include: "Role" });
    res.json(users);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;
