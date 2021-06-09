const models = require("../models");
const { search, get } = require("../routes");
const tableChat = models.Chat;
const tableUser = models.User;
const tableMessage = models.Message;
const jwt = require("jsonwebtoken");

exports.createchat = async (req, res) => {
  const getToken = req.headers.authorization.split(" ")[1];
  const myUserId = jwt.decode(getToken);
  const user = req.body.userId;
  const chatID = req.body.chatId;

  const findChat = await tableChat.findByPk(chatID);
  if (!findChat) {
    const userChat = await tableChat.create(req.body);
    await userChat.addUser(user);
    await userChat.addUser(myUserId.id);
    return res.json(userChat);
  }
  return res.json({ message: "Chat already exists, chat ID: " + findChat.id });
};

exports.enterchat = async (req, res) => {
  const getToken = req.headers.authorization.split(" ")[1];
  const myUserId = jwt.decode(getToken);
  const chatID = req.params.id;
  const message = req.body.text;
  const newMessage = await tableMessage.create({
    chatId: chatID,
    userId: myUserId.id,
    text: message,
  });
  const messageChat = await tableMessage.findAll({
    where: {
      chatId: chatID,
    },
    attributes:["text"], 
    include:[{
       model: tableUser,
       as:"users" ,
       attributes: ["name"]
    }]
  });
  return res.json(messageChat);
};
