const express = require ("express");

const router = express.Router()

const { verifyToken } = require("../middleware/token");
const controllerContacts = require("../controller/contacts")

router.get("/contacts/mycontacts",verifyToken, controllerContacts.mycontacts);

module.exports = router ;