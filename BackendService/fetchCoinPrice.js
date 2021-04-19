const CoinInstance = require("../app/models/coininstance");
const Coin = require("../app/models/coin");
const axios = require("axios");

var mongoose = require("mongoose");
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
    doc.forEach(async (coin) => {
      const tryGetPriceFromApi = async () => {
        let price;
        let marketPrice = await axios
          .get(`${ftxApi}${coin.abbreviation}/USD`)
          .then((res) => {
            return res.data.result.price;
          })
          .catch((err) => console.log(`no ftx market price of ${coin.abbreviation}`));
        let perpPrice = await axios
          .get(`${ftxApi}${coin.abbreviation}-PERP`)
          .then((res) => {
            return res.data.result.price;
          })
          .catch((err) => console.log(`no ftx prep price of ${coin.abbreviation}`));
        if (marketPrice) {
          price = marketPrice;
        } else if (perpPrice) {
          price = perpPrice;
        }
        return price;
      };

      const price = await tryGetPriceFromApi();
      const query = { coin: coin._id, exchange: "FTX" };
      if (price) {
        await CoinInstance.findOneAndUpdate(query, {
          price: price,
        }).catch((err) => console.log(err));
      }
    });
  }).catch((error) => {
    console.log(error);
    return;
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
            console.log(`no binance price of ${coin.abbreviation}`);
            return;
          });
      }
    });
  }).catch((error) => {
    console.log(error);
    return;
  });
}

async function updateCoinPrice() {
  await updateFTXCoinPrice();
  await updateBinanceCoinPrice();
}

function run() {
  setInterval(updateCoinPrice, 1000);
}

module.exports = { run };
