module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn("Tasks", "UserId");
  },

  down: async (queryInterface, Sequelize) => {
    const tableDesc = await queryInterface.describeTable("Tasks");

    if (!tableDesc.UserId) {
      await queryInterface.addColumn("Tasks", "UserId", {
        type: Sequelize.INTEGER,
        references: { model: "Users", key: "id" },
        onDelete: "CASCADE",
      });
    }
  },
};
