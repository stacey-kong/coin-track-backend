const CoinInstance = require("./app/models/coininstance");
const Coin = require("./app/models/coin");
const axios = require("axios");

var mongoose = require("mongoose");
const coininstance = require("./app/models/coininstance");
const { response } = require("express");
var mongoDB =
  "mongodb+srv://dbStacey:Db123456@cluster0.sq0s8.mongodb.net/coin?retryWrites=true&w=majority";
mongoose.connect(mongoDB, { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.Promise = global.Promise;
var db = mongoose.connection;
db.on("error", console.error.bind(console, "MongoDB connection error:"));

const ftxApi = "https://ftx.com/api/markets/";
const binanceApi = "https://api1.binance.com/api/v3/ticker/price?symbol=";

async function updateFTXCoinPrice() {
  await Coin.find({}, function (err, doc) {
    let price;
    doc.forEach((coin) => {
      const api = `${ftxApi}${coin.abbreviation}/USD`;
      const query = { coin: coin._id, exchange: "FTX" };
      axios
        .get(api)
        .then(async (response) => {
          price = response.data.result.price;
          await CoinInstance.findOneAndUpdate(query, {
            price: price,
          });
        })
        .catch((error) => {
          console.log(error);
        });
    });
  });
}

async function updateBinanceCoinPrice() {
  const usdtPrice = `https://api1.binance.com/api/v3/ticker/price?symbol=BTCUSDT`;
  let binanceUsdtPrice;
  binanceUsdtPrice = await axios
    .get(usdtPrice)
    .then((res) => {
      return res.data.price;
    })
    .catch((err) => {
      console.log(err);
    });

  await Coin.find({}, function (err, doc) {
    let price;
    doc.forEach(async (coin) => {
      const query = { coin: coin._id, exchange: "Binance" };
      if (coin.abbreviation === "BTC") {
        await CoinInstance.findOneAndUpdate(query, {
          price: binanceUsdtPrice,
        });
      } else if (coin.abbreviation != "BTC") {
        const api = `${binanceApi}${coin.abbreviation}BTC`;
        axios
          .get(api)
          .then(async (response) => {
            price = (await response.data.price) * binanceUsdtPrice;
            await CoinInstance.findOneAndUpdate(query, {
              price: price.toFixed(6),
            });
          })
          .catch((error) => {
            console.log(error);
            return;
          });
      }
    });
  });
}

async function updateCoinPrice() {
  await updateFTXCoinPrice();
  await updateBinanceCoinPrice();
}

function run() {
  setInterval(updateCoinPrice, 5000);
}
run();
