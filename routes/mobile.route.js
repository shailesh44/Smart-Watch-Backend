var express = require("express");
var router = express.Router();
const { check, validationResult } = require("express-validator");
const {login,otpVerify,updateUser,statusUser,findAllUser,deleteUser,viewUser}
= require("../controllers/mobile.auth");

router.post(
    "/login",   
    [check("phonenumber", "minimum 7 lengths of number is required").isLength({min:7})],
    login
);

router.post(
    "/otpVerify",otpVerify
)


router.post(
    "/findAllUser",findAllUser
)

router.post(
    "/updateUser",   
    [check("phonenumber", "minimum 7 lengths of number is required").isLength({min:7})]
    ,updateUser
)

router.post(
    "/statusUser",   
    [check("phonenumber", "minimum 7 lengths of number is required").isLength({min:7})]
    ,statusUser
)


router.post(
    "/deleteUser",   
    [check("phonenumber", "minimum 7 lengths of number is required").isLength({min:7})]
    ,deleteUser
)

router.get(
    "/viewUser",   
    [check("phonenumber", "minimum 7 lengths of number is required").isLength({min:7})]
    ,viewUser
)

module.exports = router;



