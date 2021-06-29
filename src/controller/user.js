const models = require("../models");
const sequelize = require("sequelize");
const jwt = require("jsonwebtoken");
const validator = require("validator");
const crypto = require("crypto");

const { createHash, compare } = require("../utils/crypto");
const { create_events } = require("../utils/events");
const { sendEmail } = require("../utils/sendEmail");

const tableUser = models.User;
const tableFile = models.File;

function gerarSalt() {
  return crypto.randomBytes(Math.ceil(9)).toString("hex").slice(0, 16);
}

function verificaSeCamposEstaoPreenchidos() {}

exports.create = async (req, res) => {
  const verify = ({ phone, name, password, email } = req.body);

  if (!phone || !name || !password || !email) {
    create_events("User", "Create_Error");

    return res.json({ message: "All fields are mandatory" });
  }

  const verifyPhone = await tableUser.findOne({
    where: { phone },
  });

  if (verifyPhone) {
    create_events("User", "Create_Error");
    return res.json({ message: "Phone already registerd" });
  }

  const passwordHash = createHash(req.body.password);
  const isEmail = validator.isEmail(req.body.email);
  if (isEmail) {
    const include = await tableUser.create({
      ...req.body,
      password: passwordHash,
    });

    create_events("User", "Create", include.id);

    if (req.file)
      await tableFile.create({
        userId: include.id,
        ...req.file,
      });

    token = jwt.sign(
      { id: include.id, phone: include.phone },
      process.env.SECRET,
      {
        expiresIn: 3600,
      }
    );

    return res.json({ user: include, token });
  }
  create_events("User", "Create_Error");
  return res.json({ message: "Enter a valid email field" });
};

///////////////////////////////////////////////////////////////////////////////////////////////////////

exports.login = async (req, res) => {
  const { phone, password } = req.body;

  if (!phone || !password) {
    create_events("User", "Login_Error");
    return res.json({ message: "Please, insert a user and password" });
  }

  const verifyPhone = await tableUser.findOne({
    where: { phone: req.body.phone },
  });

  if (!verifyPhone) {
    create_events("User", "Login_Invalid_Phone");
    return res.json({ message: "User not found" });
  }
  if (verifyPhone.attempts < 5) {
    if (verifyPhone && !compare(verifyPhone.password, req.body.password)) {
      create_events("User", "Login_Invalid_Password");

      await tableUser.update(
        { attempts: verifyPhone.attempts + 1 },
        { where: { phone: verifyPhone.phone } }
      );

      return res.json({ message: "User not found" });
    }

    await tableUser.update(
      { attempts: 0 },
      { where: { phone: verifyPhone.phone } }
    );

    token = jwt.sign(
      { id: verifyPhone.id, phone: verifyPhone.phone },
      process.env.SECRET,
      {
        expiresIn: 3600,
      }
    );

    create_events("User", "Login", verifyPhone.id);

    return res.json({ token, user: verifyPhone });
  }

  const newPasswordModify = gerarSalt();

  await tableUser.update(
    { password: createHash(newPasswordModify), attempts: 0 },
    { where: { id: verifyPhone.id } }
  );

  sendEmail(
    verifyPhone.email,
    "Acesso bloqueado",
    `Olá ${verifyPhone.name} sua senha de acesso em nossa plataforma foi bloqueada para sua segurança.
    Geramos para você uma nova senha : ${newPasswordModify}`
  );
  create_events("User", "Blocked", verifyPhone.id);

  return res.json({ message: "User blocked for many attempts" });
};

///////////////////////////////////////////////////////////////////////////////////////////////////////

exports.show = async (req, res) => {
  const myUserId = req.myUserId;

  const showUser = await tableUser.findOne({
    where: { id: myUserId.id },
    attributes: { exclude: ["password"] },
    include: ["file"],
  });

  create_events("User", "Show", myUserId.id);

  return res.json(showUser);
};

///////////////////////////////////////////////////////////////////////////////////////////////////////

exports.modify = async (req, res) => {
  const myUserId = req.myUserId;

  await tableUser.update(req.body, { where: { id: myUserId.id } });

  create_events("User", "Update_Data", myUserId.id);

  if (req.file) {
    const findFile = await tableFile.findOne({
      where: { userId: myUserId.id },
    });

    if (findFile) {
      await tableFile.update(req.file, { where: { userId: myUserId.id } });

      create_events("User", "Uptate_Photo", myUserId.id);
    }

    await tableFile.create({ userId: myUserId.id, ...req.file });

    create_events("User", "Create_Photo", myUserId.id);
  }

  const modify = await tableUser.findOne({
    where: { id: myUserId.id },
    include: ["file"],
  });

  return res.json(modify);
};

///////////////////////////////////////////////////////////////////////////////////////////////////////

exports.modifyPassword = async (req, res) => {
  const myUserId = req.myUserId;

  const myUserPassword = await tableUser.findByPk(myUserId.id);

  const { currentPassword, newPassword } = req.body;

  if (!compare(myUserPassword.password, currentPassword)) {
    create_events("User", "Update_Error", myUserId.id);
    return res.json({ message: "Password entered does not match current" });
  }

  const newPasswordHash = createHash(newPassword);

  await tableUser.update(
    { password: newPasswordHash },
    { where: { id: myUserId.id } }
  );

  create_events("User", "Uptate_Password", myUserId.id);

  return res.json({ message: "Password changed successfully" });
};

///////////////////////////////////////////////////////////////////////////////////////////////////////
