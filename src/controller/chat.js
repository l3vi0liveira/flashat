const models = require("../models");
const tableChat = models.Chat;
const tableUser = models.User;
const tableMessage = models.Message;
const { Op } = require("sequelize");
const jwt = require("jsonwebtoken");

exports.createchat = async (req, res) => {
  const myUserId = req.myUserId;
  const otherUserId = req.body.userId;

  const findUser = await tableUser.findOne({
    where: { id: otherUserId },
    attributes: { exclude: "password" },
  });

  if (otherUserId == myUserId.id) {
    return res.json({
      message: "It is not possible to add a chat with yourself",
    });
  }

  if (findUser) {
    const findUm = await tableChat.findAll({
      include: [
        {
          model: models.User,
          as: "users",
          where: {
            id: myUserId.id,
          },
        },
      ],
    });

    const findDois = await tableChat.findAll({
      include: [
        {
          model: models.User,
          as: "users",
          where: {
            id: otherUserId,
          },
        },
      ],
    });

    let teste;

    for (let i = 0; i < findUm.length; i = i + 1) {
      for (let j = 0; j < findDois.length; j = j + 1) {
        if (findUm[i].id === findDois[j].id) {
          teste = findUm[i].id;
        }
      }
    }

    if (!teste) {
      const userChat = await tableChat.create(req.body);
      await userChat.addUser(myUserId.id);
      await userChat.addUser(otherUserId);
      return res.json({ chat: chatExist, otherUser: findUser });
    }

    const chatExist = await tableChat.findByPk(teste);

    return res.json({ chat: chatExist, otherUser: findUser });
  }

  return res.json({ message: "UserId not exists" });
};

exports.showchats = async (req, res) => {
  const myUserId = req.myUserId;
  const listChats = await tableChat.findAll({
    include: [
      {
        model: tableUser,
        as: "users",
        where: { id: myUserId.id },
      },
    ],
  });
  const chatsIds = listChats.map((item) => item.id);
  const response = await tableChat.findAll({
    where: {
      id: { [Op.in]: chatsIds },
    },
    include: ["users"],
  });
  return res.json(response);
};
