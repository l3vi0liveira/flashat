const express = require ("express");
const multer = require ("multer");
const multerConfig = require('../middleware/multer')

const router = express.Router()

const { verifyToken } = require("../middleware/token");
const controllerMessage = require("../controller/message")

router.post("/message/sendMessage/:chatId",verifyToken, multer(multerConfig).single('file'), controllerMessage.sendMessage);
router.get("/message/showMessage/:chatId",verifyToken, controllerMessage.showMessage);

module.exports = router ;