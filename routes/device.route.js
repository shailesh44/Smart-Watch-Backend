var express = require("express");
var router = express.Router();
const { check, validationResult } = require("express-validator");
const {watchData,registerWatch,findAllDevice,deviceDetails}
= require("../controllers/device.auth");

router.post(
    "/watchData",watchData
)

router.post(
    "/registerWatch",registerWatch
)

router.post(
    "/findAllDevice",findAllDevice
)


router.post(
    "/deviceDetails",deviceDetails
)

module.exports = router;