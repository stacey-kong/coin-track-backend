var mongoose = require("mongoose");

var Schema = mongoose.Schema;

var CoinSchema = new Schema({
  Momentum: { type: Number, required: true, maxlength: 3 },
  Alarmtimes: { type: Number, required: true, maxlength: 100 },
  HistoryHigh: { type: Number, required: true, maxlength: 100 },
  HistoryLow: { type: Number, required: true, maxlength: 100 },
});


// Virtual for coin's URL
CoinrSchema.virtual("url").get(function () {
  return "/coin/" + this._id;
});

//Export model
module.exports = mongoose.model("Coin", CoinSchema);
