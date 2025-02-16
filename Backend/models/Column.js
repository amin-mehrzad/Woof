module.exports = (sequelize, DataTypes) => {
  const Column = sequelize.define("Column", {
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  });

  Column.associate = (models) => {
    Column.belongsTo(models.Board, {
      foreignKey: "BoardId",
      onDelete: "CASCADE",
    });
    Column.hasMany(models.Task, {
      foreignKey: "ColumnId",
      onDelete: "CASCADE",
    }); // One Column has many Tasks
  };

  return Column;
};
