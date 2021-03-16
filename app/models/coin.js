var mongoose = require("mongoose");

var Schema = mongoose.Schema;

var CoinSchema = new Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    minlength: 1,
    maxlength: 20,
  },
  abbreviation: {
    type: String,
    required: true,
    unique: true,
    minlength: 1,
    maxlength: 10,
  },

});

// Virtual for coin's URL
// CoinSchema.virtual("url").get(function () {
//   return "/coin/" + this._id;
// });

//Export model
module.exports = mongoose.model("Coin", CoinSchema);
