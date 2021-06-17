const express = require("express");
const multer = require ("multer");
const multerConfig = require('../middleware/multer')

const router = express.Router();

const controllerUser = require("../controller/user");
const { verifyToken } = require("../middleware/token");


//********User***********
router.post("/user/create", multer(multerConfig).single('profilePicture'), controllerUser.create);
router.post("/user/login", controllerUser.login);
router.get("/user/showUser", verifyToken, controllerUser.show);
router.put("/user/modifyUser", multer(multerConfig).single('profilePicture'), verifyToken, controllerUser.modify);
router.put("/user/modifyPassword", verifyToken, controllerUser.modifyPassword);

module.exports = router;
