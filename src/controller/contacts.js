const jwt = require("jsonwebtoken");
const { Op } = require("sequelize");

const models = require("../models");

const tableUser = models.User;

exports.mycontacts = async (req, res) => {
  const getToken = req.headers.authorization.split(" ")[1];
  const myUserId = jwt.decode(getToken);
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
