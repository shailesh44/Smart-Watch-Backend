const Device = require("../models/device");
const { check, validationResult } = require("express-validator");
const res = require("express/lib/response")
var jwt = require("jsonwebtoken");
require('dotenv').config();
var expressJwt = require("express-jwt");
const { lowerFirst } = require("lodash");
const user = require("../models/user");
const Mobile = require("../models/mobile")
const crypto = require("crypto");
const bcrypt = require("bcryptjs");
const { isValidObjectId } = require("mongoose");
const {MongoClient} = require('mongodb');
const moment = require("moment");
const securePassword = async(password) =>{
    const passwordHash = await bcrypt.hash(password,10)
    return passwordHash      
}
const findDeviceNo =async(phonenumber) =>{ await Device.find({userid : phonenumber._id}).count()}
 
// signup function 
exports.login = async (req, res) => {
    const errors = validationResult(req);
  
    if (!errors.isEmpty()) {
      return res.status(422).json({
        error: errors.array()[0].msg,
      });
    }
  
    try {
      const {name,lastname,countrycode,phonenumber,safeKey,registeredOn,status} = req.body;   
      const checkphonenumber = await Mobile.findOne({ phonenumber });
      const newPassword = await securePassword(safeKey);  
      if (!checkphonenumber) {
        const date = moment().format("DD/MM/YYYY HH:mm:ss");
        const user = new Mobile(req.body);
        await user.save();
        await Mobile.updateMany({phonenumber: phonenumber},{$set:{
        registeredOn: date,
        safeKey: newPassword
      }})
      
    
      }
            
      const otp = Math.floor(100000 + Math.random() * 900000);

      res.cookie("mobileotp", otp, {
        expires: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
        httpOnly: true,
      });
      
      await Mobile.updateOne({phonenumber: phonenumber},{$set:{
        mobileotp: otp
      }})

      return res.status(200).json({
        success: true,
        message: "Otp send successfully",
        otpverify: otp
      });
    
}    
    catch (error) {
          return res.status(500).json({
            error: error.message,
          });
        }
  }

exports.otpVerify = async (req, res) => {
    const errors = validationResult(req);
  
    if (!errors.isEmpty()) {
      return res.status(422).json({
        error: errors.array()[0].msg,
      });
    }
    const mobileotp =req.body.otp;

    const checkOtp = await Mobile.findOne({ mobileotp });
    if(!checkOtp){
        return res.status(400).json({
            error: "otp is not valid",
          });
    }
    const userData = await Mobile.findByIdAndUpdate({_id: checkOtp._id},{$set:{mobileotp:''}},{new:true})
      if (checkOtp) {
        return res.status(200).json({
            user: { success: true,
            message: "User logged in successfully",
            data: userData
          }});
      }
      else{
        return res.status(400).json({
            error: "otp is not verified",
          });
      }
}


exports.updateUser = async(req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({
          error: errors.array()[0].msg,
        });
      }
    const {countrycode,phonenumber,name,lastname,safeKey} = req.body
    // const checknumber = await Mobile.findOne({ phonenumber });
    // if(checknumber) {
    //   res.status(200).json({
    //     success: true,
    //     data: checknumber
    //  })
    // }
    const checkphonenumber = await Mobile.findOne({ phonenumber });
    
    if (!checkphonenumber) {
        res.status(400).json({
            success: false,
           message: "Phone number is not registered"
         })}
    if (checkphonenumber){
    const data =  await Mobile.updateMany(
            { phonenumber: phonenumber },{
                $set:{"countrycode":countrycode,
                    "safeKey":safeKey,
                    "name":name,
                    "lastname":lastname
                    } 
            }
            ,{new:true}
        )
      res.status(200).json({
        success: true,
       message: "Data updated successfully :D",
       data: data,
       devices: findDeviceNo
     })
      }
      else{
        return res.status(400).json({
            error: "data is not updated",
          });
      }
    } 


exports.statusUser = async(req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(422).json({
              error: errors.array()[0].msg,
            });
          }
          const {phonenumber,status} = req.body;
          const checknumber = await Mobile.findOne({phonenumber});
          const checkphonenumber = await Mobile.find({ phonenumber:phonenumber, status:status });
          if (!checknumber) {
            res.status(400).json({
                success: false,
               message: "Phone number is not registered"
             })}
    
         if (checkphonenumber && status == 'INACTIVE'){
         const userData = await Mobile.findByIdAndUpdate({_id: checknumber._id},{$set:{status:'INACTIVE'}},{new:true})
         if (checkphonenumber) {
           return res.status(200).json({
               user: { success: true,
               message: "User status changed in successfully",
               data: userData
             }});
         }}
         const changestatus = await Mobile.find({ phonenumber:phonenumber, status:status });
         if(changestatus && status == 'ACTIVE'){
          const changedStatus = await Mobile.findByIdAndUpdate({_id: checknumber._id},{$set:{status:'ACTIVE'}},{new:true})
          if (changedStatus) {
            return res.status(200).json({
                user: { success: true,
                message: "User status changed in successfully",
                data: changedStatus
              }});
          }
         }
              else{
                return res.status(400).json({
                    error: "Status is not changed",
                  });
                }       
}

exports.findAllUser = async(req, res) => {
  // const {userid} = req.body
    const alldata =await Mobile.find()
    // const allDevices = await Device.find({userid:userid}).count();
    if (alldata) {
        return res.status(200).json({
            user: { success: true,
            message: "Users fetched successfully",
            data: alldata
          }}); 
    } else {
        return res.status(400).json({
            error: "No user found in db",
          }); 
    }    
   }



//delete user

exports.deleteUser = async (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(422).json({
      error: errors.array()[0].msg,
    });
  }
  const phonenumber =req.body;

  const checkPhonenumber = await Mobile.findOne({ phonenumber });
  if(!checkPhonenumber){
      return res.status(400).json({
          error: "Phone number is not valid",
        });
  }

  if(checkPhonenumber){
    const deleteUser = await Mobile.findOneAndDelete({ phonenumber:phonenumber });
    return res.status(200).json({
      user: { success: true,
      message: "User deleted successfully",
      data: deleteUser
    }}); 
  }
  else{
    return res.status(400).json({
      error: "User not deleted",
    });
  }
}

//view specific user

exports.viewUser = async (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(422).json({
      error: errors.array()[0].msg,
    });
  }
  const {phonenumber} =req.body;

  const checkPhonenumber = await Mobile.findOne({ phonenumber:phonenumber });
  if(checkPhonenumber){
      return res.status(200).json({
        success: true,
        message: "User fetched successfully",
        data: checkPhonenumber
        });  
    }
  if(!checkPhonenumber){
    return res.status(400).json({
      success:false,
      message:"Phone number doesn't exist"
    })
}
}
