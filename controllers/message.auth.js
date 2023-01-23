const User = require("../models/user");
const { check, validationResult } = require("express-validator");
const res = require("express/lib/response")
var jwt = require("jsonwebtoken");
require('dotenv').config();
var expressJwt = require("express-jwt");
const { lowerFirst } = require("lodash");
const Message = require("../models/message");
const Mobile = require("../models/mobile")
const crypto = require("crypto");
const bcrypt = require("bcryptjs");
var mongoose = require("mongoose");
const Device = require("../models/device")
const moment = require("moment");
const { isValidObjectId } = require("mongoose");
const { AuthCallsCredentialListMappingList } = require("twilio/lib/rest/api/v2010/account/sip/domain/authTypes/authCallsMapping/authCallsCredentialListMapping");
const securePassword = async(password) =>{
    const passwordHash = await bcrypt.hash(password,10)
    return passwordHash      
}

exports.broadcastMessage = async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(422).json({
        error: errors.array()[0].msg,
      });
    }
    const {userid,message,registeredOn} = req.body;
    const checkId = await Message.findOne({ userid });
    const date = moment().format("DD/MM/YYYY HH:mm:ss");
    if(req.body){
        const user = new Message(req.body);
        await user.save();  
        const updatetime = await Message.updateMany({userid: userid},{$set:{registeredOn:date}})  
        return res.status(200).json({
            message: "Data saved",
          }); 
    }
    
        
    else{
        return res.status(400).json({
            error: "Device data is not saved",
          });   
    }
}

exports.findAllMessage = async(req, res) => {
    
      const alldata =await Message.find()
      
      if (alldata) {
          return res.status(200).json({
              user: { success: true,
              message: "Messages fetched successfully",
              data: alldata
            }}); 
      } else {
          return res.status(400).json({
              error: "No message found in db",
            }); 
      }    
     }


