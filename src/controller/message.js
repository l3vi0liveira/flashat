const models = require("../models");
const jwt = require("jsonwebtoken");

const { create_events } = require("../utils/events");

const tableMessage = models.Message;
const tableUser = models.User;
const tableFile = models.File;
const tableChat = models.Chat;

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

    const messageCreated = await create_events(
      "Message",
      "Create",
      `${myUserId.id}-${chatID}-${sendMessage.id}`
    );

    const lastMessageId = sendMessage.id;

    await tableChat.update({ lastMessageId }, { where: { id: chatID } });

    if (req.file) {
      await tableFile.create({
        messageId: sendMessage.id,
        ...req.file,
      });
    }

    const result = await tableMessage.findOne({
      where: { id: sendMessage.id },
      include: ["users", "file"],
    });
    req.io.emit("new-message", result);

    return res.json({ result, event: messageCreated });
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

    const messageViewed = await create_events(
      "Message",
      "Viewed",
      `${myUserId.id}-${findChatUser.id}`
    );
    return res.json({ showMessage, Event: messageViewed.event });
  }
  return res.json({ message: "You don't belong in this chat" });
};
