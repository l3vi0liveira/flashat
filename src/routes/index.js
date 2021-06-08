const express = require("express");

const userRoutes = require('./user')
const chatRoutes = require('./chat')

const router = express.Router();

router.use(userRoutes)
router.use(chatRoutes)

module.exports = router;