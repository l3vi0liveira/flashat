const express = require("express");

const router = express.Router();

const { verifyToken } = require("../middleware/token");
const controllerChat = require("../controller/chat");

router.post("/chat/enterchat/:id",verifyToken, controllerChat.enterchat);
router.post("/chat/createchat",verifyToken,controllerChat.createchat)


module.exports = router;