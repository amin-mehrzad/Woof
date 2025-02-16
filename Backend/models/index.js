const fs = require("fs");
const path = require("path");
const { Sequelize, DataTypes } = require("sequelize");
require("dotenv").config();

const sequelize = new Sequelize(process.env.DATABASE_URL, {
  dialect: "postgres",
  logging: false,
});

const db = {};

// Load all model files
fs.readdirSync(__dirname)
  .filter((file) => file.endsWith(".js") && file !== "index.js")
  .forEach((file) => {
    const modelDefinition = require(path.join(__dirname, file));

    if (typeof modelDefinition === "function") {
      const model = modelDefinition(sequelize, DataTypes);
      db[model.name] = model;
    } else {
      console.error(`❌ Error: ${file} does not export a function.`);
    }
  });

// Setup associations
Object.keys(db).forEach((modelName) => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

// Setup many-to-many association between Task and User
if (db.Task && db.User) {
  db.Task.belongsToMany(db.User, { through: "TaskUsers" });
  db.User.belongsToMany(db.Task, { through: "TaskUsers" });
}

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
