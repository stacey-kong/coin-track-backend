var mongoose = require("mongoose");

var Schema = mongoose.Schema;

var CoinInstanseSchema = new Schema({
  coin: {
    type: Schema.Types.ObjectId,
    ref: "coin",
    require: true,
  },
  exchange: {
    type: String,
    require: true,
  },
  price: {
    type: Number,
  },
  historyHigh: {
    type: Number,
  },
  historyLow: {
    type: Number,
  },
});

//Export model
module.exports = mongoose.model("CoinInstanse", CoinInstanseSchema);
