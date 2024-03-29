const express = require("express");

const router = express.Router();

const { verifyToken } = require("../middleware/token");
const controllerChat = require("../controller/chat");

router.post("/chat/createchat", verifyToken, controllerChat.createchat);
router.post("/chat/createGroup", verifyToken, controllerChat.createGroup);
router.get("/chat/showchats", verifyToken, controllerChat.showchats);

module.exports = router;
