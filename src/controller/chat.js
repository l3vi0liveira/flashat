const models = require("../models");
const { search, get } = require("../routes");
const tableChat = models.Chat;
const tableUser = models.User;
const {Op} = require("sequelize")
const jwt = require("jsonwebtoken");

exports.createchat = async (req, res) => {
  const getToken = req.headers.authorization.split(" ")[1];
  const myUserId = jwt.decode(getToken);
  const otherUserId = req.body.userId;
  const ids = [myUserId.id, otherUserId];

  const findChat = await tableChat.findOne({
    include: [
      {
        model: models.User,
        as: "user",
        where: {
          id: {
            [Op.in]: ids,
          },
        },
      },
    ],
  }); 
    console.log("1////////////////////////////////////////dhauhdushasudhdsuashudhaushduashduhasudhushduashduash")

    
   
  console.log(findChat)

  if(findChat.user.length != 2) {
    const userChat = await tableChat.create(req.body);
    await userChat.addUser(otherUserId);yarn 
    await userChat.addUser(myUserId.id);
    console.log("2////////////////////////////////////////dhauhdushasudhdsuashudhaushduashduhasudhushduashduash")
    return res.json(userChat);


  }
  console.log("3////////////////////////////////////////dhauhdushasudhdsuashudhaushduashduhasudhushduashduash")

  return res.json(findChat);
};
