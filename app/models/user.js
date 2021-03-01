const mongoose = require("mongoose");

const model = mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    minlength: 1,
    maxlength: 10,
  },
  password: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 255,
  },
  verified: {
    type: Boolean,
    default: false,
  },
});

module.exports = new mongoose.model("User", model);
