var mongoose = require("mongoose");

var Schema = mongoose.Schema;

var SubscriptionSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: "user",
    require: true,
  },
  subscription: {
    type: Array,
    default: ["BTC", "ETH", "FTT", "LINA"],
    required: true,
  },
});

// Virtual for coin's URL
// CoinSchema.virtual("url").get(function () {
//   return "/coin/" + this._id;
// });

//Export model
module.exports = mongoose.model("Subscription", SubscriptionSchema);
