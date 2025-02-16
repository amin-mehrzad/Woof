module.exports = (sequelize, DataTypes) => {
  const TaskUsers = sequelize.define(
    "TaskUsers",
    {
      TaskId: {
        type: DataTypes.INTEGER,
        references: {
          model: "Tasks",
          key: "id",
        },
      },
      UserId: {
        type: DataTypes.INTEGER,
        references: {
          model: "Users",
          key: "id",
        },
      },
    },
    { timestamps: true } // Ensure timestamps exist for tracking
  );

  return TaskUsers;
};
