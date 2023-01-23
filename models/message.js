var mongoose = require("mongoose");

var messageschema = new mongoose.Schema(
  {
      userid:{
        type: String,
      },
      message:{
        type: String,
      },
      registeredOn:{
        type: String,
      }
    },
    { timestamps: true }
)

module.exports = mongoose.model("Message", messageschema);