const jwt = require("jsonwebtoken");
const { Op } = require("sequelize");

const models = require("../models");

const tableUser = models.User;

exports.mycontacts = async (req, res) => {
  const myUserId = req.myUserId;

  const findUsers = await tableUser.findAll({
    where: {
      id: {
        [Op.ne]: myUserId.id,
      },
    },
    attributes: {exclude: ["password", "createdAt","updatedAt"]}
  });
  return res.json(findUsers);
};
