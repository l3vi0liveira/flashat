const models = require("../models");
const { search, get } = require("../routes");
const tableChat = models.Chat;
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
  return res.json({ userChat });
};
