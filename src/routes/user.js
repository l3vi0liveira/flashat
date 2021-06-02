const express = require("express");

const router = express.Router();

const conttrolerUser = require("../controller/user");

//********User***********
router.post("/user/create",conttrolerUser.create);
router.post("/user/login",conttrolerUser.login);

module.exports = router