const jwt = require("jsonwebtoken");

const models = require("../models");

const tableMessage = models.Message;
const tableUser = models.User;
const tableFile = models.File;

exports.sendMessage = async (req, res) => {
  const getToken = req.headers.authorization.split(" ")[1];
  const myUserId = jwt.decode(getToken);
  const chatID = req.params.chatId;
  const text = req.body.text;
  const file = req.file;
  console.log(file);
  console.log(text);

  const newMessage = await tableMessage.create({
    chatId: chatID,
    userId: myUserId.id,
    text,
  });
  if (req.file) {
    await tableFile.create({
      messageId: newMessage.id,
      ...req.file,
    });
  }

  return res.json(newMessage);
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
  });
  return res.json(showMessage);
};
