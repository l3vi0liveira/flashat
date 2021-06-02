const models = require("../models");
const sequelize = require("sequelize");
const { search } = require("../routes");
const crypto = require("crypto");
const { createHash, compare } = require("../utils/crypto");
const tableUser = models.User;

exports.create = async (req, res) => {
  const verifyPhone = await tableUser.findOne({
    where: { phone: req.body.phone },
  });
  if (verifyPhone) {
    return res.json({ message: "Phone already registerd" });
  }
  const passwordHash = createHash(req.body.password);
  const include = await tableUser.create({
    ...req.body,
    password: passwordHash,
  });
  res.json(include);
};
///////////////////////////////////////////////////////////////////////////////////////////////////////

exports.login = async (req, res) => {

};
