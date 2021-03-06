var Coin = require("../app/models/coin");
var CoinInstance = require("../app/models/coininstance");

// var mongoose = require("mongoose");
// const coininstance = require("../app/models/coininstance");
// var mongoDB =
//   "mongodb+srv://dbStacey:Db123456@cluster0.sq0s8.mongodb.net/coin?retryWrites=true&w=majority";
// mongoose.connect(mongoDB, { useNewUrlParser: true, useUnifiedTopology: true });
// mongoose.Promise = global.Promise;
// var db = mongoose.connection;
// db.on("error", console.error.bind(console, "MongoDB connection error:"));

module.exports = async (coinname, symbol) => {
  let coins = [];
  let exchanges = ["FTX", "Binance"];

  async function coinCreate(name, abbr) {
    let res;
    coindetail = {
      name: name,
      abbreviation: abbr,
    };
    var coin = new Coin(coindetail);
    await coin
      .save()
      .then(coins.push(coin), (res = true))
      .catch((err) => (res = false));
    return res;
  }

  async function coinInstanceCreate(coin, exchange) {
    coinInstanceDetail = {
      coin: coin,
      exchange: exchange,
      price: 0,
      historyHigh: 0,
      historyLow: 0,
    };
    let coinInstance = new CoinInstance(coinInstanceDetail);
    await coinInstance.save();
  }

  let result = await coinCreate(coinname, symbol);

  if (result) {
    coins.forEach((coin) => {
      exchanges.forEach((exchange) => {
        console.log(`${coin},${exchange}`);
        coinInstanceCreate(coin, exchange);
      });
    });
  }
  return result;
};

// coinCreate("Bitcoin", "BTC");
// coinCreate("Ethereum", "ETH");
// coinCreate("FTX Token", "FTT");
// coinCreate("LINA", "LINA");
// coinCreate("Polkadot", "DOT");
// coinCreate("Tether", "USDT");
// coinCreate("Binance Coin", "BNB");
// coinCreate("Uniswap", "UNI");
// coinCreate("Bitcoin Cash", "BCH");
// coinCreate("Dogecoin", "DOGE");
// coinCreate("TORN", "TRX");
// coinCreate("EOS", "EOS");
// coinCreate("Synthetix", "SNX");
// coinCreate("Solana", "SOL");

// mongoose.connection.close();
