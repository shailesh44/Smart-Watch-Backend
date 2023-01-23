var express = require("express");
var router = express.Router();
const { check, validationResult } = require("express-validator");
const {helpsupport,findHelpSupportData}
= require("../controllers/helpsupport.auth");


router.post(
    "/helpsupport",helpsupport
)

router.get(
    "/findHelpSupportData",findHelpSupportData
)

module.exports = router;