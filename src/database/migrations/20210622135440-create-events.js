"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("events", {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      userId: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          key: "id",
          model: "users",
        },
      },
      chatId: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          key: "id",
          model: "chat",
        },
      },
      event: Sequelize.TEXT,
      createdAt: Sequelize.DATE,
      updatedAt: Sequelize.DATE,
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable("events");
  },
};
