const jwt = require("jsonwebtoken");

const models = require("../models");

const tableMessage = models.Message;
const tableUser = models.User;
const tableFile = models.File;
const tableChat = models.Chat;
const tableEvents = models.Events;

exports.sendMessage = async (req, res) => {
  const myUserId = req.myUserId;

  const chatID = req.params.chatId;

  const findChatUser = await tableChat.findOne({
    where: { id: chatID },
    include: {
      model: tableUser,
      as: "users",
      where: { id: myUserId.id },
    },
  });

  if (findChatUser) {
    const sendMessage = await tableMessage.create({
      chatId: chatID,
      userId: myUserId.id,
      text: req.body.text,
    });

    await tableEvents.create({
      event: `Usuário de id : ${myUserId.id} Enviou a mensagem : ${sendMessage.id} no chat : ${chatID}`,
    });

    const lastMessage = sendMessage.id;

    await tableChat.update({ lastMessage }, { where: { id: chatID } });

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
  }

  return res.json({ message: "You don't belong in this chat" });
};

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

exports.showMessage = async (req, res) => {
  const chatId = req.params.chatId;

  const myUserId = req.myUserId;

  const findChatUser = await tableChat.findOne({
    where: { id: chatId },
    include: {
      model: tableUser,
      as: "users",
      where: { id: myUserId.id },
    },
  });

  if (findChatUser) {
    const showMessage = await tableMessage.findAll({
      order: [["createdAt", "ASC"]],
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

    await tableEvents.create({
      userId: myUserId.id,
      event: `Usuário de id : ${myUserId.id} visualizou as mensagens do chat : ${chatId}`,
    });

    return res.json(showMessage);
  }
  return res.json({ message: "You don't belong in this chat" });
};
