const models = require("../models");
const { search, get } = require("../routes");
const tableChat = models.Chat;
const tableUser = models.User;
const { Op } = require("sequelize");
const jwt = require("jsonwebtoken");
const { configServices } = require("docker-compose");
const chat = require("../models/chat");

exports.createchat = async (req, res) => {
  const getToken = req.headers.authorization.split(" ")[1];
  const myUserId = jwt.decode(getToken);
  const otherUserId = req.body.userId;
  const ids = [myUserId.id, otherUserId];

  const findUser = await tableUser.findByPk(otherUserId);

  if (otherUserId == myUserId.id) {
    return res.json({
      message: "It is not possible to add a chat with yourself",
    });
  }
  console.log(ids);
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
      return res.json(userChat);
    }
    const chatExist = await tableChat.findByPk(teste);
    return res.json(chatExist);
  }
  return res.json({ message: "UserId not exists" });
};
