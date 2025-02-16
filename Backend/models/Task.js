module.exports = (sequelize, DataTypes) => {
  const Task = sequelize.define("Task", {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    title: { type: DataTypes.STRING, allowNull: false },
    description: { type: DataTypes.TEXT },
  });

  Task.associate = (models) => {
    Task.belongsToMany(models.User, {
      through: "TaskUsers",
      foreignKey: "TaskId",
    });
    Task.belongsTo(models.Column, {
      foreignKey: "ColumnId",
      onDelete: "SET NULL",
    }); // A Task belongs to a Column
  };

  return Task;
};
