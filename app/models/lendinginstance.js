var mongoose = require("mongoose");

var Schema = mongoose.Schema;

var LendingAmountSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: "user",
    require: true,
  },
  amount: {
    type: Number,
    required: true,
  },
});



//Export model
module.exports = mongoose.model("LendingAmount", LendingAmountSchema);
