const models = require("../models");
const tableUser = models.User;

exports.mycontacts = async (req, res) => {
const findUsers = await tableUser.findAll()
  return res.json(findUsers);
};

