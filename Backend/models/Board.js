module.exports = (sequelize, DataTypes) => {
  const Board = sequelize.define("Board", {
    title: { type: DataTypes.STRING, allowNull: false },
  });

  Board.associate = (models) => {
    Board.hasMany(models.Column, { onDelete: "CASCADE" });
  };

  return Board;
};
