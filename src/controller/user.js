const models = require("../models");
const sequelize = require("sequelize");
const crypto = require("crypto");
const jwt = require("jsonwebtoken");
const validator = require("validator");

const { createHash, compare } = require("../utils/crypto");

const tableUser = models.User;
const tableFile = models.File;
const tableEvents = models.Events;

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
  const isEmail = validator.isEmail(req.body.email);
  if (isEmail) {
    const include = await tableUser.create({
      ...req.body,
      password: passwordHash,
    });
    await tableEvents.create({
      userId: include.id,
      event: `Usuário de id : ${include.id} Criado com o telefone: ${include.phone}`,
    });

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
  return res.json({ message: "Enter a valid email field" });
};

///////////////////////////////////////////////////////////////////////////////////////////////////////

exports.login = async (req, res) => {
  const { phone, password } = req.body;

  if (!phone || !password) {
    return res.json({ message: "Please, insert a user and password" });
  }

  const verifyPhone = await tableUser.findOne({
    where: { phone: req.body.phone },
  });

  if (!verifyPhone || !compare(verifyPhone.password, req.body.password)) {
    return res.json({ message: "User not found" });
  }

  token = jwt.sign(
    { id: verifyPhone.id, phone: verifyPhone.phone },
    process.env.SECRET,
    {
      expiresIn: 3600,
    }
  );

  await tableEvents.create({
    userId: verifyPhone.id,
    event: `Usuário de id : ${verifyPhone.id} Logou na plataforma com o telefone: ${verifyPhone.phone}`,
  });

  return res.json({ token, user: verifyPhone });
};

///////////////////////////////////////////////////////////////////////////////////////////////////////

exports.show = async (req, res) => {
  const myUserId = req.myUserId;

  const showUser = await tableUser.findOne({
    where: { id: myUserId.id },
    attributes: { exclude: ["password"] },
    include: ["file"],
  });

  await tableEvents.create({
    userId: myUserId.id,
    event: `Usuário de id : ${myUserId.id} Visualizou seu próprio perfil`,
  });

  return res.json(showUser);
};

///////////////////////////////////////////////////////////////////////////////////////////////////////

exports.modify = async (req, res) => {
  const myUserId = req.myUserId;

  await tableUser.update(req.body, { where: { id: myUserId.id } });

  await tableEvents.create({
    userId: myUserId.id,
    event: `Usuário de id : ${myUserId.id} Fez alterações em seus dados`,
  });

  if (req.file) {
    const findFile = await tableFile.findOne({
      where: { userId: myUserId.id },
    });

    if (findFile) {
      await tableFile.update(req.file, { where: { userId: myUserId.id } });

      await tableEvents.create({
        userId: myUserId.id,
        event: `Usuário de id : ${myUserId.id} Alterou sua foto de perfil`,
      });
    }

    await tableFile.create({ userId: myUserId.id, ...req.file });

    await tableEvents.create({
      userId: myUserId.id,
      event: `Usuário de id : ${myUserId.id} Adicionou uma nova foto ao seu perfil`,
    });
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
    return res.json({ message: "Password entered does not match current" });
  }

  const newPasswordHash = createHash(newPassword);

  await tableUser.update(
    { password: newPasswordHash },
    { where: { id: myUserId.id } }
  );

  await tableEvents.create({
    userId: myUserId.id,
    event: `Usuário de id : ${myUserId.id} Alterou sua senha`,
  });

  return res.json({ message: "Password changed successfully" });
};

///////////////////////////////////////////////////////////////////////////////////////////////////////
