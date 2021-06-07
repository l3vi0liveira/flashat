const models = require("../models");
const sequelize = require("sequelize");
const { search } = require("../routes");
const crypto = require("crypto");
const { createHash, compare } = require("../utils/crypto");
const tableUser = models.User;
const jwt = require("jsonwebtoken");

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
  const {phone, password} = req.body;
  if(!phone || !password){res.json({message:"Please, insert a user and password"})}
  const verifyPhone = await tableUser.findOne({
    where: { phone: req.body.phone },
  });
  if (!verifyPhone || !compare(verifyPhone.password, req.body.password)) {
    res.json({ message: "User not found" });
  }
  token = jwt.sign({ id: tableUser.id }, process.env.SECRET, { expiresIn: 3000 });

  return res.json({ message: "Successfully logged:", token });
};

///////////////////////////////////////////////////////////////////////////////////////////////////////

exports.chat = async(req,res)=>{
res.json({message:"Select a conversation"})
}
