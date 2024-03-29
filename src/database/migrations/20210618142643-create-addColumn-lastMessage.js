"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn("chat", "lastMessageId", {
      type: Sequelize.INTEGER,
      allowNull: true,
      references: {
        key: "id",
        model: "message",
      },
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable("chat");
  },
};
