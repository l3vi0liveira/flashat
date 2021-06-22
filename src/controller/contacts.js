const jwt = require("jsonwebtoken");
const { Op } = require("sequelize");

const models = require("../models");

const tableUser = models.User;
const tableEvents = models.Events;

exports.mycontacts = async (req, res) => {
  const myUserId = req.myUserId;

  const findUsers = await tableUser.findAll({
    where: {
      id: {
        [Op.ne]: myUserId.id,
      },
    },
    attributes: { exclude: ["password", "createdAt", "updatedAt"] },
  });

  await tableEvents.create({
    userId: myUserId.id,
    event: `Usuário de id : ${myUserId.id} Visualizou seus contatos`,
  });

  return res.json(findUsers);
};
