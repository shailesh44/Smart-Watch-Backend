const User = require("../models/user");
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
var mongoose = require("mongoose");
const Device = require("../models/device")
const moment = require("moment");
const { isValidObjectId } = require("mongoose");
const { AuthCallsCredentialListMappingList } = require("twilio/lib/rest/api/v2010/account/sip/domain/authTypes/authCallsMapping/authCallsCredentialListMapping");
const securePassword = async(password) =>{
    const passwordHash = await bcrypt.hash(password,10)
    return passwordHash      
}


exports.registerWatch = async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(422).json({
        error: errors.array()[0].msg,
      });
    }
    const {userid,deviceID,IEMI,registeredOn} = req.body;
    const checkId = await Device.findOne({ deviceID });
    if(checkId){
        return res.status(400).json({
            error: "This device is alredy registered",
          });
    }
    const checkIEMI = await Device.findOne({ IEMI });
    if(checkIEMI){
        return res.status(400).json({
            error: "This IEMI is alredy registered",
          });
    }
    if(!checkId){
    const date = moment().format("DD/MM/YYYY HH:mm:ss");
    const user = new Device(req.body);
        await user.save(); 
    const updatetime = await Device.updateMany({userid: userid},{$set:{registeredOn:date}})
        
        
        // await Device.updateOne({registeredOn: date});
        // const id = mongoose.Types.ObjectId(checkId._id);
          // console.log(id,"object id")
        return res.status(200).json({
            success: true,
            message: "Device saved successfully",
          });   
          ;
        } 
        
    else{
        return res.status(400).json({
            error: "Device data is not saved",
          });   
    }
}

exports.watchData = async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(422).json({
        error: errors.array()[0].msg,
      });
    }

    const {deviceID,IEMI,location,heartRate,latitude,longitude} = req.body;
    const watch = await Device.findOne({ deviceID});
    if(!watch){
        return res.status(400).json({
            error: "ID is not valid",
          });
    }
       
    if(watch){
        const data =  await Device.updateMany(
            {deviceID : deviceID },{
                $set:{"location":location,
                    "heartRate":heartRate,
                    "latitude":latitude,
                    "longitude":longitude} 
            }
            ,{new:true}
        )
      return res.status(200).json({
         success: true,
        message: "Watch data saved successfully :D",
        data: data
      });
    }
    else{
        return res.status(400).json({
            error: "watch data is not saved",
          });
    }
}


exports.findAllDevice = async(req, res) => {
    const {userid} = req.body
    const findDevice = await Device.find({ userid:userid});
    if(findDevice){
    const totalDevices=  await Device.find({ userid:userid}).count();
      //return res.send({data: findDevice})
        return res.status(200).json({
             success: true,
            message: "Device fetched successfully",
            data: findDevice,
            devices: totalDevices
          }); 
    }
  else {
        return res.status(400).json({
            error: "No data found in db",
          }); 
    }    
   }
  

   exports.deviceDetails = async(req, res) => {
    const {deviceID} = req.body
    const findDevice = await Device.findOne({ deviceID:deviceID});
    if(findDevice){
      //return res.send({data: findDevice})
        return res.status(200).json({
            success: true,
            message: "Device fetched successfully",
            data: [findDevice]
          }); 
    }
  else {
        return res.status(400).json({
            error: "No data found in db",
          }); 
    }    
   }
  