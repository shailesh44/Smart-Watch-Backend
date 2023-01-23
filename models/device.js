var mongoose = require("mongoose");

var deviceschema = new mongoose.Schema(
  {
      deviceID:{
        type: String,
      },
      IEMI:{
        type: String,
      },
      latitude:{
        type: String,
      },
      longitude:{
        type: String,
      },
      heartRate:{
        type: String,
      },
      location:{
        type: String,
      }
      ,
      userid:{
        type: String,
      },
      registeredOn:{
        type: String,
      },
      status: {
        type: String,
        enum: ['ACTIVE', 'INACTIVE'],
        default: 'ACTIVE',
      }
    },
    { timestamps: true }
)

module.exports = mongoose.model("Device", deviceschema);