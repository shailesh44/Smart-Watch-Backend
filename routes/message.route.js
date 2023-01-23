var express = require("express");
var router = express.Router();
const { check, validationResult } = require("express-validator");
const {broadcastMessage,findAllMessage}
= require("../controllers/message.auth");


router.post(
    "/broadcastMessage",broadcastMessage
)

router.get(
    "/findAllMessage",findAllMessage
)

module.exports = router;