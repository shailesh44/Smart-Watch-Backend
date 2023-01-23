var express = require("express");
var router = express.Router();
const { check, validationResult } = require("express-validator");
const {
  signout,
  signup,
  signin,
  isSignedIn,
  test,
  forgotPassword,
  passwordReset,
  getemailVerificationCode,
  verifyEmail,
  forgotPasswordOtp,
  passwordResetOtp
} = require("../controllers/auth");

router.post(
  "/signup",
  [
    check("email", "email is required").isEmail(),
    check("password","Password should be combination of one uppercase , one lower case, one special char, one digit and min 8 , max 20 char long") .isString()
    .isLength({ min: 8 })
    .not()
    .isLowercase()
    .not()
    .isUppercase()
    .not()
    .isNumeric()
    .not()
    .isAlpha(),
    check("phonenumber", "phonenumber is required").isLength({min:10})
    // check("region", "region should be at least 3 char").isLength({ min: 3 }),
  ],
  signup
);

router.post(
  "/signin",
  [
    check("emailphone", "email or phonenumber is required"),
    check("password","Password should be combination of one uppercase , one lower case, one special char, one digit and min 8 , max 20 char long") .isString()
    .isLength({ min: 8 })
    .not()
    .isLowercase()
    .not()
    .isUppercase()
    .not()
    .isNumeric()
    .not()
    .isAlpha(),
  ],
  signin
);

router.get("/signout", signout);

router.post(
  "/updatePassword",
  [check("email", "email is required").isEmail()],
  [check("password", "password is required")],
  forgotPassword
);

router.post(
  "/forgotPassword",
  [check("email", "email is required").isEmail()],
  [check("password", "password is required")],
  forgotPassword
);

router.post(
  "/password/reset",
  [
    check("password", "password field is required").isLength({ min: 3 }),
    check("confirmpassword", "password field is required").isLength({ min: 3 }),
  ],
  passwordReset
);

router.post(
  "/getemailVerificationCode",
  [check("email", "email is required").isEmail()],
  getemailVerificationCode
);

router.post(
  "/verifyemail",
  [
    check("email", "email is required").isEmail(),
    check("token", "token is required"),
  ],
  verifyEmail
);

router.post(
  "/forgotPassword/otp",
  forgotPasswordOtp
)

router.post(
  "/resetPassword/otp",
  passwordResetOtp
)


module.exports = router;
