const jwt = require("jsonwebtoken");

const models = require("../models");

const tableMessage = models.Message;
const tableUser = models.User;
const tableFile = models.File;

exports.sendMessage = async (req, res) => {
  const myUserId = req.myUserId;

  const chatID = req.params.chatId;


  const sendMessage = await tableMessage.create({
    chatId: 1,
    userId: myUserId.id,
    text: req.body.text,
  });

  if (req.file) {
    await tableFile.create({
      messageId: sendMessage.id,
      ...req.file,
    });
  }

  const result = await tableMessage.findOne({
    where: { id: sendMessage.id },
    include: {
      model: tableFile,
      as: "file",
    },
  });
  

  return res.json(result);
};

exports.showMessage = async (req, res) => {
  const chatId = req.params.chatId;

  const showMessage = await tableMessage.findAll({
    where: { chatId: chatId },
    include: {
      model: tableUser,
      as: "users",
      attributes: { exclude: ["password"] },
    },
    include: {
      model: tableFile,
      as: "file",
    },
  });

  return res.json(showMessage);
};
