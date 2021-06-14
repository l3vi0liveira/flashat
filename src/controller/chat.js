const models = require("../models");
const { search, get } = require("../routes");
const tableChat = models.Chat;
const tableUser = models.User;
const { Op } = require("sequelize");
const jwt = require("jsonwebtoken");
const { configServices } = require("docker-compose");

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
 
  if (findUser) {
    const findChat = await tableChat.findOne({
      include: [
        {
          model: models.User,
          as: "users",
          where: {
            id: {
              [Op.in]: ids,
            },
          },
        },
      ],
    });

    if (findChat == null) {
      const userChat = await tableChat.create(req.body);
      await userChat.addUser(otherUserId);
      await userChat.addUser(myUserId.id);
 
      return res.json(userChat);
    }

    if (findChat.users === 1) {
      const userChat = await tableChat.create(req.body);
      await userChat.addUser(otherUserId);
      await userChat.addUser(myUserId.id);
      console.log(findChat)
      return res.json(userChat);
    }

    return res.json(findChat);
  }
  return res.json({ message: "UserId not exists" });
};
