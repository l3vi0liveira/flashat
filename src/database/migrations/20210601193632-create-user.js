"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("users", {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      phone:Sequelize.NUMERIC,
      name: Sequelize.STRING,
      password:Sequelize.STRING,
      email: Sequelize.STRING,
      createdAt: Sequelize.DATE,
      updatedAt:Sequelize.DATE,
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable("users");
  },
};
