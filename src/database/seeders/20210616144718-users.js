"use strict";

const { createHash } = require("../../utils/crypto");

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert("users", [
      {
        //CONTA DO ADM
        phone: "#@ADMIN_FLASHAT",
        name: "Flashat",
        password: createHash("!@#$qwerasdf"),
        email: "flashat.software@gmail.com",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        phone: "14997895586",
        name: "Levi",
        password: createHash("31031999"),
        email: "levi.carvalho99@gmail.com",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        phone: "14997895585",
        name: "Cauan",
        password: createHash("010203"),
        email: "cauan.suzuki99@gmail.com",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        phone: "14997895584",
        name: "Daniel",
        password: createHash("123456"),
        email: "dani.barbosa98@gmail.com",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete("users", null, {});
  },
};
