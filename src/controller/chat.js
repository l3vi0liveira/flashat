const models = require("../models");

const tableChat = models.Chat;
const tableUser = models.User;
const tableFile = models.File;

const jwt = require("jsonwebtoken");
const { create_events } = require("../utils/events");
const { Op } = require("sequelize");

async function verificaCampos(req) {
  const { name, members } = req;
  console.log(name);
  if (req.name) {
    await create_events("Chat", "Create_Group_Error");
    throw { message: "All fields are mandatory", error: true };
  }
  return;
}

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
      create_events("Chat", "Create", `${myUserId.id}-${userChat.id}`);
      return res.json({ chat: userChat, otherUser: findUser });
    }

    const chatExist = await tableChat.findByPk(teste);

    create_events("Chat", "Found", chatExist.id);

    return res.json({ chat: chatExist, otherUser: findUser });
  }

  return res.json({ message: "UserId not exists" });
};

exports.createGroup = async (req, res) => {
  try {
    verificaCampos(req.body);
    console.log(req.body);
    res.json({ message: "chegou aqui" });
  } catch (error) {
    return res.json(error);
  }
};

exports.showchats = async (req, res) => {
  const myUserId = req.myUserId;

  const response = await models.sequelize.query(
    `select * from chat c
    inner join message m on c."lastMessageId" = m.id
  left join file f on f."messageId" = m.id
    inner join user_chat uc on uc."chatId" = c.id 
  inner join users u on uc."userId" = u.id
    where uc."chatId" in 
    (
        select c2.id from chat c2 
            inner join user_chat uc2 on uc2."chatId" = c2.id 
            where uc2."userId" = :userId
    );`,
    {
      replacements: { userId: myUserId.id },
      type: models.sequelize.QueryTypes.SELECT,
    }
  );

  const response2 = response.reduce((acc, cur) => {
    const payload = {
      chatId: cur.chatId,
      nome: cur.name,
      userId: cur.userId,
      lastMessage: cur.text,
    };

    if (acc[cur.chatId]) {
      return {
        ...acc,
        [cur.chatId]: {
          ...acc[cur.chatId],
          otherUser: payload,
        },
      };
    }

    return {
      ...acc,
      [cur.chatId]: payload,
    };
  }, {});

  let i = 0;
  const files = [];
  for (i = 1; i <= response.length; i += 2) {
    files.push(response[i].id);
  }
  const findFile = await tableFile.findAll({
    where: {
      userId: {
        [Op.in]: files,
      },
    },
  });
  return res.json(Object.values({ response2, findFile }));
};
