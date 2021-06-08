const express = require("express");

const router = express.Router();

const controllerUser = require("../controller/user");

//********User***********
router.post("/user/create",controllerUser.create);
router.post("/user/login",controllerUser.login);

module.exports = router;