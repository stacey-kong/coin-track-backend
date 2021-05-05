var mongoose = require("mongoose");

var Schema = mongoose.Schema;

var LendingRateSchema = new Schema({
  coin: {
    type: String,
    required: true,
    unique: false,
    minlength: 1,
    maxlength: 20,
  },
  time: {
    type: Number,
    required: true,
    unique: true,
    minlength: 1,
    maxlength: 20,
  },
  rate: {
    type: Number,
    required: true,
    unique: false,
    minlength: 1,
    maxlength: 20,
  },
});

//Export model
module.exports = mongoose.model("LendingRate", LendingRateSchema);
