const User = require("../models/user");
const { check, validationResult } = require("express-validator");
const res = require("express/lib/response")
var jwt = require("jsonwebtoken");
require('dotenv').config();
var expressJwt = require("express-jwt");
const { lowerFirst } = require("lodash");
const user = require("../models/user");
const nodemailer = require("nodemailer");
const crypto = require("crypto");
const bcrypt = require("bcryptjs");
const randomstring = require("randomstring")
const sgMail = require('@sendgrid/mail')
const twilio = require('twilio');
const securePassword = async(password) =>{
    const passwordHash = await bcrypt.hash(password,10)
    return passwordHash      
}

const sendResetPasswordMail = async(email,token) =>{
  try {
sgMail.setApiKey(process.env.SENDGRID_API_KEY)
const msg = {
  to: email, // Change to your recipient
  from: 'noobslayer144@gmail.com', // Change to your verified sender
  subject: 'Reset your password',
  text: 'and easy to do anywhere, even with Node.js',
  html: '<p>Hii '+email+', please copy the link and <a href="http://localhost:3000/ConfirmPass?token='+token+'">reset your password</a></p>',
}
sgMail
  .send(msg)
  .then(() => {
    console.log('Email sent')
  })
  .catch((error) => {
    console.error(error)
  })
  }

catch{
  console.log("error");
}
}

const sendOtp = async(phonenumber,otp) =>{
  try {    
const accountSid = process.env.accountSid;
const authToken = process.env.authToken;
const client = new twilio(accountSid, authToken);
 return client.messages.create({
  body: `Hi ${phonenumber},\nYour verification code for forgot password is ${otp}`,
  to:'+91'+ phonenumber, // Text this number
  from: process.env.TWILIO_FROM, // From a valid Twilio number
})
.then((message) => console.log(message.sid));
  } catch (error) {
    console.log(error)
  }
}

// signup function
exports.signup = async (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(422).json({
      error: errors.array()[0].msg,
    });
  }

  try {
    const email = req.body.email;

    const checkuser = await User.findOne({ email });

    if (checkuser) {
      return res.status(400).json({
        error: "USER email already exists",
      });
    }

    const phonenumber = req.body.phonenumber;

    const checkphonenumber = await User.findOne({ phonenumber });

    if (checkphonenumber) {
      return res.status(400).json({
        error: "USER phonenumber already exists",
      });
    }
    const user = new User(req.body);
    await user.save();
    return res.status(200).json({
      success: true,
      message: "User created successfully ",
    });
  }
  
  catch (error) {
        return res.status(500).json({                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         
          error: error.message,
        });
      }
}


// signin function                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        
exports.signin = async (req, res) => {
const errors = validationResult(req);
    const { email, password, phonenumber } = req.body;

//  console.log("pass", password);

    if (!errors.isEmpty()) {
      return res.status(422).json({
        error: errors.array()[0].msg,
      });
    }
    try{
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({
        error: "USER email or phonenumber does not exists",
      });
    }

    const check = await user.autheticate(password);

    if (!check) {
      return res.status(401).json({
        error: "Email and password do not match",
      });
    }

    // const number = await User.findOne({phonenumber});

    // if (!number){
    //   return res.status(400).json({
    //     error: "USER phonenumber does not exists",
    //   });
    // }

    //create token
    const token = user.getJwtToken();
    //put token in cookie
    res.cookie("token", token, {
      expires: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
      httpOnly: true,
    });

    const { _id, role } = user;
  //   return res.status(200).json({
  //     success: true,
  //     message: "User created successfully ",
  //   });
  // }

  return res.status(200).json({ user: { success: true,_id,token, email, role, message: "User logged in "} });        
  }
   catch (err) {
    return res.status(500).json({
      error: err.message,
    });
  }
};

// forgotPassword function
exports.updatePassword = async (req, res, next) => {
  const errors = validationResult(req);
  const { email } = req.body;
  const { password} = req.body;

  if (!errors.isEmpty()) {
    return res.status(422).json({
      error: errors.array()[0].msg,
    });
  }

  const user = await User.findOne({ email });

  if (user) {
    const newPassword = await securePassword(password);
    await User.updateOne({email: email},{$set:{
      password : newPassword
    }})
    return res.status(200).json({
      success: true,
      message: "password has been updated",
    });
  }
  else{
    res.status(200).json({success: false, message: "email doesnt exist"})
  }

  
};

//forgot password fubction

exports.forgotPassword = async (req, res, next) => {
  const errors = validationResult(req);
  const { email } = req.body;


  if (!errors.isEmpty()) {
    return res.status(422).json({
      error: errors.array()[0].msg,
    });
  }

  const user = await User.findOne({ email });

  if (user) {
    const randomstring1 = randomstring.generate()
    await User.updateOne({email: email},{$set:{
      token: randomstring1
    }})
    await sendResetPasswordMail(user.email,randomstring1);
    return res.status(200).json({
      success: true,
      message: "check your inbox",
    });
  }
  else{
    res.status(200).json({success: false, message: "email doesnt exist"})
  }
 
};
 //password reset using otp


exports.forgotPasswordOtp = async (req, res, next) => {
  const errors = validationResult(req);
  const {phonenumber} = req.body;
 
  if (!errors.isEmpty()) {
    return res.status(422).json({
      error: errors.array()[0].msg,
    });
  }
  const user = await User.findOne({ phonenumber });
  if (user) {
    const otp1 = Math.floor(100000 + Math.random() * 900000);
  const ttl = 2 * 60 * 1000;
  let expires = Date.now();
  expires+=ttl;
    await User.updateOne({phonenumber: phonenumber},{$set:{
      otp: otp1
    }})
    await sendOtp(user.phonenumber,otp1);
    return res.status(200).json({
      success: true,
      message: "Check you phone message",
    });
  }
  else{
    res.status(200).json({success: false, message: "phonenumber doesnt exist"})
  }
}


// reset Pssword function
exports.passwordResetOtp = async (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(422).json({
      error: errors.array()[0].msg,
    });
  }

  try {
    const {otp} = req.body;
    const tokenData = await User.findOne({otp:otp})
    if (tokenData) {
      const { password, confirmpassword } = req.body;
      if (password !== confirmpassword) {
        return res.status(400).json({
          error: "password and confirmpassword do not match",
        });
      }
      const newPassword = await securePassword(password);
      const userData = await User.findByIdAndUpdate({_id: tokenData._id},{$set:{password: newPassword,otp:''}},{new:true})
      res.status(200).json({success: true, message: "User password has been updated", data:userData});
    } else {
      res.status(400).json({success: false, message: "Otp has been expired or invalid"});
    }
  } catch (error) {
    res.status(400).json({success: false, msg:error.message});
  }


};

// reset Pssword function
exports.passwordReset = async (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(422).json({
      error: errors.array()[0].msg,
    });
  }

  try {
    const token = req.query.token;
    const tokenData = await User.findOne({token:token})
    if (tokenData) {
      const { password, confirmpassword } = req.body;
      if (password !== confirmpassword) {
        return res.status(400).json({
          error: "password and confirmpassword do not match",
        });
      }
      const newPassword = await securePassword(password);
      const userData = await User.findByIdAndUpdate({_id: tokenData._id},{$set:{password: newPassword,token:''}},{new:true})
      res.status(200).json({success: true, message: "User password has been updated", data:userData});
    } else {
      res.status(200).json({success: true, message: "Link has been expired"});
    }
  } catch (error) {
    res.status(400).json({success: false, msg:error.message});
  }


};

// get email-verification  function
exports.getemailVerificationCode = async (req, res, next) => {
  const errors = validationResult(req);
  const { email } = req.body;

  if (!errors.isEmpty()) {
    return res.status(422).json({
      error: errors.array()[0].msg,
    });
  }

  const user = await User.findOne({ email });

  if (!user) {
    return res.status(400).json({
      error: "USER email does not exists",
    });
  }

  if (user.isVerified) {
    return res.status(400).json({
      error: "USER already verified",
    });
  }

  const verificationToken = Math.random().toString().substr(2, 6);
  user.emailVerificationToken = verificationToken;
  user.emailVerificationExpiry = Date.now() + 24 * 60 * 60 * 1000;

  await user.save({ validateBeforeSave: false });

  const message = `Your verification code is: . \n\n ${verificationToken} \n\n This code will expire in 24 hours.`;

  try {
    await mailhelper({
      email: user.email,
      subject: "ttdata - Please verify your e-mail",
      message,
    });

    res.status(200).json({
      success: true,
      msg: "email sent successfully",
    });
  } catch (error) {
    user.emailVerificationToken = undefined;
    user.emailVerificationExpiry = undefined;
    await user.save({ validateBeforeSave: false });

    return res.status(50).json({
      error: error.message,
    });
  }
};

// verify email function
exports.verifyEmail = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    const { email, verificationtoken } = req.body;

    if (!errors.isEmpty()) {
      return res.status(422).json({
        error: errors.array()[0].msg,
      });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({
        error: "USER email does not exists",
      });
    }

    const isuserVerified = await user.isVerified;

    if (isuserVerified) {
      return res.status(400).json({
        error: "USER already verified",
      });
    }

    if (
      !(
        verificationtoken === user.emailVerificationToken &&
        Date.now() < user.emailVerificationExpiry
      )
    ) {
      return res.status(400).json({
        error: "Token is invalid or expire",
      });
    }

    user.emailVerificationToken = undefined;
    user.emailVerificationExpiry = undefined;
    user.isVerified = true;
    await user.save({ validateBeforeSave: false });

    return res.status(200).json({
      success: true,
      message: "email verification success",
    });
  } catch (error) {
    console.log("err", error);
    next(error);
  }
};

// signout function
exports.signout = (req, res) => {
  // res.clearCookie("token");
  res.cookie("token", null, { expires: new Date(Date.now()), httpOnly: true });
  res.json({
    message: "User signout successfully",
  });
};

//protected routes
exports.isSignedIn = expressJwt({
  secret: process.env.SECRET,
  userProperty: "auth",
});

//custom middlewares
exports.isAuthenticated = (req, res, next) => {
  console.log(req);
  let checker = req.profile && req.auth && req.profile._id == req.auth._id;
  if (!checker) {
    return res.status(403).json({
      error: "ACCESS DENIED",
    });
  }
  next();
};

exports.isAdmin = (req, res, next) => {
  if (req.profile.role === "user") {
    return res.status(403).json({
      error: "You are not ADMIN, Access denied",
    });
  }
  next();
};
