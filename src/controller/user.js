const models = require("../models");
const sequelize = require("sequelize");
const { search } = require("../routes");
const crypto = require("crypto");
const { createHash, compare } = require("../utils/crypto");
const tableUser = models.User;
const jwt = require("jsonwebtoken");

exports.create = async (req, res) => {
  const { phone, name, password, email } = req.body;
  if (!phone || !name || !password || !email) {
    return res.json({ message: "All fields are mandatory" });
  }
  const verifyPhone = await tableUser.findOne({
    where: { phone },
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
  const { phone, password } = req.body;
  if (!phone || !password) {
    res.json({ message: "Please, insert a user and password" });
  }
  const verifyPhone = await tableUser.findOne({
    where: { phone: req.body.phone },
  });
  if (!verifyPhone || !compare(verifyPhone.password, req.body.password)) {
    res.json({ message: "User not found" });
  }
  token = jwt.sign(
    { id: verifyPhone.id, phone: verifyPhone.phone },
    process.env.SECRET,
    {
      expiresIn: 3600,
    }
  );
  return res.json({ message: "Successfully logged:", token });
};

///////////////////////////////////////////////////////////////////////////////////////////////////////

exports.show = async (req, res) => {
  const getToken = req.headers.authorization.split(" ")[1];
  const myUserId = jwt.decode(getToken);
  const showUser = await tableUser.findOne({
    where: { id: myUserId.id },
    attributes: { exclude: ["password"] },
  });
  res.json(showUser);
};

///////////////////////////////////////////////////////////////////////////////////////////////////////

exports.modify = async (req, res) => {
  const getToken = req.headers.authorization.split(" ")[1];
  const myUserId = jwt.decode(getToken);

  const { name, password, email } = req.body;

  const passwordHash = createHash(password);

  await tableUser.update(
    { name, password: passwordHash, email },
    { where: { id: myUserId.id } }
  );

  const modifyUser = await tableUser.findByPk(myUserId.id);
  res.json(modifyUser);
};

///////////////////////////////////////////////////////////////////////////////////////////////////////
