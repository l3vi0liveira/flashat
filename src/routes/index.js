const express = require("express");

const userRoutes = require('./user')
const chatRoutes = require('./chat')
const messageRoutes = require('./message')

const router = express.Router();

router.use(userRoutes)
router.use(chatRoutes)
router.use(messageRoutes)

module.exports = router;