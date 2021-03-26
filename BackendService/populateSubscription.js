var async = require("async");
var User = require("../app/models/user");
var Subscription = require("../app/models/subscription");

var mongoose = require("mongoose");
var mongoDB =
  "mongodb+srv://dbStacey:Db123456@cluster0.sq0s8.mongodb.net/coin?retryWrites=true&w=majority";
mongoose.connect(mongoDB, { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.Promise = global.Promise;
var db = mongoose.connection;
db.on("error", console.error.bind(console, "MongoDB connection error:"));

function subscriptionCreate(user) {
  subscriptionDetail = {
    user: user,
  };
  let subscription = new Subscription(subscriptionDetail);
  subscription.save();
}

User.find({})
  .then((users) => users.forEach((user) => subscriptionCreate(user)))
  .catch((err) => {
    console.log(err);
  });

// mongoose.connection.close();
