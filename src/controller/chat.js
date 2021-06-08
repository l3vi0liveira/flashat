const models = require("../models");
const { search } = require("../routes");
const tableChat = models.Chat;

exports.enterchat = async (req, res) => {
const aa = await tableChat.findAll();
res.json(aa)
};
