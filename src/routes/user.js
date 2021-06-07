const express = require("express");

const router = express.Router();

const conttrolerUser = require("../controller/user");
const { verifyToken } = require("../middleware/token");

//********User***********
router.post("/user/create",conttrolerUser.create);
router.post("/user/login",conttrolerUser.login);
router.post("/user/chat",verifyToken, conttrolerUser.chat)

module.exports = router