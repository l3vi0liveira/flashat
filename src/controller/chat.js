const models = require("../models");
const tableChat = models.Chat;
const tableUser = models.User;
const tableEvents = models.Events;
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

      await tableEvents.create({
        event: `Um chat foi criado entre os usuários : ${myUserId.id} e ${otherUserId}`,
      });

      return res.json({ chat: userChat, otherUser: findUser });
    }

    const chatExist = await tableChat.findByPk(teste);

    await tableEvents.create({
      event: `Um chat foi encontrado entre os usuários : ${myUserId.id} e ${otherUserId}`,
    });

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
      lastMessage: { [Op.ne]: null },
    },
    include: ["users"],
  });

  await tableEvents.create({
    userId: myUserId.id,
    event: `Usuário de Id : ${myUserId.id} visualizou seus chats existentes`,
  });

  return res.json(response);
};
