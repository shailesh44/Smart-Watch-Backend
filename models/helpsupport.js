var mongoose = require("mongoose");

var helpsupportSchema = new mongoose.Schema(
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
      email: {
        type: String,
      },
      countrycode: {
        type:String
    },
      registeredOn:{
        type: String,
      },
      query:{
        type: String
      },
      status: {
        type: String,
        enum: ['RESOLVED', 'UNRESOLVED'],
        default: 'UNRESOLVED',
      }
    },
    { timestamps: true }
)

module.exports = mongoose.model("HelpSupport", helpsupportSchema);