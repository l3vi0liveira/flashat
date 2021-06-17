"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("message", { 
      id: {
       type: Sequelize.INTEGER,
       autoIncrement: true,
       primaryKey: true,
      },
      chatId: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          key: "id",
          model: "chat",
        },
      },
      userId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          key: "id",
          model: "users",
        },
      },
      text:Sequelize.TEXT,
      createdAt: Sequelize.DATE,
      updatedAt: Sequelize.DATE,
     });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable("message");
  },
};
