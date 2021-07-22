const models = require("../models");

const jwt = require("jsonwebtoken");
const { Op } = require("sequelize");
const { create_events } = require("../utils/events");

const tableUser = models.User;

exports.mycontacts = async (req, res) => {
  const myUserId = req.myUserId;

  const findUsers = await tableUser.findAll({
    where: {
      id: {
        [Op.ne]: myUserId.id,
      },
    },
    attributes: { exclude: ["password", "createdAt", "updatedAt"] },
    include: ["file"],
  });

  create_events("Contacts", "Show", myUserId.id);

  return res.json(findUsers);
};
