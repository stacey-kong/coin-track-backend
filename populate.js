var async = require("async");
var Coin = require("./app/models/coin");
var CoinInstance = require("./app/models/coininstance");

var mongoose = require("mongoose");
const coininstance = require("./app/models/coininstance");
var mongoDB =
  "mongodb+srv://dbStacey:Db123456@cluster0.sq0s8.mongodb.net/coin?retryWrites=true&w=majority";
mongoose.connect(mongoDB, { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.Promise = global.Promise;
var db = mongoose.connection;
db.on("error", console.error.bind(console, "MongoDB connection error:"));

let coins = [];
let exchanges = ["FTX", "Binance"];

function coinCreate(name, abbreviation) {
  coindetail = {
    name: name,
    abbreviation: abbreviation,
  };
  var coin = new Coin(coindetail);
  coin.save();
  coins.push(coin);
}

function coinInstanceCreate(coin, exchange) {
  coinInstanceDetail = {
    coin: coin,
    exchange: exchange,
    price: 0,
    historyHigh: 0,
    historyLow: 0,
  };
  let coinInstance = new CoinInstance(coinInstanceDetail);
  coinInstance.save();
}

coinCreate("Bitcoin", "BTC");

coinCreate("Ethereum", "ETH");

coinCreate("FTX Token", "FTT");

coinCreate("LINA", "LINA");

coins.forEach((coin) => {
  exchanges.forEach((exchange) => {
    coinInstanceCreate(coin, exchange);
  });
});

// mongoose.connection.close();
