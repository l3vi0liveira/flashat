const models = require("../models");
const tableMessage = models.Message;
const tableUser = models.User;
const jwt = require("jsonwebtoken");
const { search, get } = require("../routes");


exports.sendMessage = async (req, res) => {
  const getToken = req.headers.authorization.split(" ")[1];
  const myUserId = jwt.decode(getToken);
  const chatID = req.params.chatId;
  const message = req.body.text;
  const newMessage = await tableMessage.create({
    chatId: chatID,
    userId: myUserId.id,
    text: message,
  });
  return res.json(newMessage);
};

exports.showMessage = async (req, res) => {
  const showMessage = await tableMessage.findAll({
    include:{
      model: tableUser,
      as:"users",
      attributes: {exclude:["password"]}
    },
    
  })
  return res.json(showMessage);
};
