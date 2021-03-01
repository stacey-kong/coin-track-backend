const mongoose = require("mongoose");

const verificationSchema = new mongoose.Schema({
  token: {
    type: String,
    maxlength: 255,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  type: {
    type: String,
    required: true,
    maxlength: 255,
  },
});


module.exports = mongoose.model("Verification", verificationSchema);