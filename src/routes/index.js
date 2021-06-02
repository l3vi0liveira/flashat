const express = require("express");

const userRoutes = require('./user')

const router = express.Router();

router.use(userRoutes)

module.exports = router;