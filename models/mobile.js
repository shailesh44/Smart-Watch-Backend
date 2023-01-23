var mongoose = require("mongoose");

var mobileSchema = new mongoose.Schema(
  {
    phonenumber: {
        type: String,
        maxlength: 32,
        trim: true,
      },
      name: {
        type: String,
        maxlength: 32,
        trim: true,
      },
      lastname: {
        type: String,
        maxlength: 32,
        trim: true,
      },
      countrycode: {
        type: String,
        trim: true,
      } ,
      mobileotp:{
        type: String,
        default: ''
      },
      registeredOn:{
        type: String,
      },
      device:{
        type:String
      },
      status: {
        type: String,
        enum: ['ACTIVE', 'INACTIVE'],
        default: 'ACTIVE',
      }
    },
)

module.exports = mongoose.model("Mobile", mobileSchema);