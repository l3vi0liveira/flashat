const express = require ("express");

const router = express.Router()

const { verifyToken } = require("../middleware/token");
const controllerMessage = require("../controller/message")

router.post("/message/sendMessage/:chatId",verifyToken, controllerMessage.sendMessage);
router.get("/message/showMessage/:chatId",verifyToken, controllerMessage.showMessage);

module.exports = router ;