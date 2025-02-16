module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define("User", {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true,
      },
    },
  });

  User.associate = (models) => {
    User.belongsTo(models.Role); // A user has one role
    User.belongsToMany(models.Task, {
      through: "TaskUsers",
      foreignKey: "UserId",
    });
  };

  return User;
};
