require("dotenv").config();
const express = require("express");
const cors = require("cors");
const db = require("./models");
const boardRoutes = require("./routes/boardRoutes");
const columnRoutes = require("./routes/columnRoutes");
const taskRoutes = require("./routes/taskRoutes");
const userRoutes = require("./routes/userRoutes");
const roleRoutes = require("./routes/roleRoutes");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Routes
app.use("/api/boards", boardRoutes);
app.use("/api/columns", columnRoutes);
app.use("/api/tasks", taskRoutes);
app.use("/api/users", userRoutes);
app.use("/api/roles", roleRoutes);

// Sync Database
db.sequelize.sync({ alter: true }).then(() => {
  console.log("Database synced");
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
