const User = require("../models/user");
const { check, validationResult } = require("express-validator");
const res = require("express/lib/response")
var jwt = require("jsonwebtoken");
require('dotenv').config();
var expressJwt = require("express-jwt");
const { lowerFirst } = require("lodash");
const Help = require("../models/helpsupport");
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

exports.helpsupport = async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(422).json({
        error: errors.array()[0].msg,
      });
    }
    const {name,email,registeredOn,phonenumber,query} = req.body;
    if(req.body){
        const date = moment().format("DD/MM/YYYY HH:mm:ss");
        const user = new Help(req.body);
        await user.save();
        const updatetime = await Help.updateMany({phonenumber: phonenumber},{$set:{registeredOn:date}})    
        return res.status(200).json({
            success:true,
            message:"Help and support saved"
        })
    }    
    else{
        return res.status(400).json({
            error: " data is not saved",
          });   
    }
}


exports.findHelpSupportData = async(req, res) => {
    
    const alldata =await Help.find()
    
    if (alldata) {
        return res.status(200).json({
            user: { success: true,
            message: "helpdata fetched successfully",
            data: alldata
          }}); 
    } else {
        return res.status(400).json({
            error: "No data found in db",
          }); 
    }    
   }