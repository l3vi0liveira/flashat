const express = require("express");

const router = express.Router();

const { verifyToken } = require("../middleware/token");
const controllerChat = require("../controller/chat");

router.post("/chat/enterchat",verifyToken, controllerChat.enterchat);


module.exports = router;