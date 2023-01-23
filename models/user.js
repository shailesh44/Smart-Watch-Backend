var mongoose = require("mongoose");
const crypto = require("crypto");
const bcrypt = require("bcryptjs");
var jwt = require("jsonwebtoken");
var expressJwt = require("express-jwt");

var userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      // required: true,
      maxlength: 32,
      trim: true,
    },
    lastname: {
      type: String,
      maxlength: 32,
      trim: true,
    },    
    phonenumber: {
      type: String,
      maxlength: 32,
      trim: true,
      required: true,
    },
    email: {
      type: String,
      trim: true,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    salt: String,
    role: {
      type: String,
      default: "user",
    },
    plan: {
      type: String,
      trim: true,
    },
    token: {
      type: String,
      default: ''
    },
    otp:{
      type: String,
      default: ''
     },
    // mobileotp:{
    //   type: String,
    //   default: ''
    // },

    forgotPasswordToken: String,
    forgotPasswordExpiry: Date,

    emailVerificationToken: String,
    emailVerificationExpiry: Date,

    isVerified: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
});

userSchema.methods.autheticate = async function (usersendpass) {
  let result = await bcrypt.compare(usersendpass, this.password);
  return result;
};

userSchema.methods.getJwtToken = function () {
  return jwt.sign({ id: this._id }, process.env.SECRET, {
    expiresIn: "2d",
  });
};

userSchema.methods.getforgotPasswordToken = function () {
  const forgotToken = crypto.randomBytes(20).toString("hex");
  this.forgotPasswordToken = crypto
    .createHash("sha256")
    .update(forgotToken)
    .digest("hex");
  this.forgotPasswordExpiry = Date.now() + 20 * 60 * 1000;
  return forgotToken;
};

userSchema.methods.getemailVerificationToken = function () {

  const verificationToken = crypto.randomBytes(20).toString("hex");
  this.emailVerificationToken = crypto.createHash("sha256").update(verificationToken).digest("hex");
  this.emailVerificationExpiry = Date.now() + 24 * 60 * 1000;
  return verificationToken;
}

module.exports = mongoose.model("User", userSchema);
