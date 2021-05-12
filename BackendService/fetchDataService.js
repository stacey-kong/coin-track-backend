const CoinInstance = require("../app/models/coininstance");
const Coin = require("../app/models/coin");
const LendingRate = require("../app/models/lending");
const axios = require("axios");

// var mongoose = require("mongoose");
// var mongoDB =
//   "mongodb+srv://dbStacey:Db123456@cluster0.sq0s8.mongodb.net/coin?retryWrites=true&w=majority";
// mongoose.connect(mongoDB, { useNewUrlParser: true, useUnifiedTopology: true });
// mongoose.Promise = global.Promise;
// var db = mongoose.connection;
// db.on("error", console.error.bind(console, "MongoDB connection error:"));

const ftxApi = "https://ftx.com/api/markets/";
const ftxFutureApi = "https://ftx.com/api/futures/";
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
          .catch(
            (err) => {}
            // console.log(`no ftx market price of ${coin.abbreviation}`)
          );
        let perpPrice = await axios
          .get(`${ftxFutureApi}${coin.abbreviation}-PERP`)
          .then((res) => {
            return res.data.result.bid;
          })
          .catch((err) => {});

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
      // console.log(err);
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
            // console.log(`no binance price of ${coin.abbreviation}`);
            return;
          });
      }
    });
  }).catch((error) => {
    console.log(error);
    return;
  });
}

async function fetchingLendingRate() {
  let now = new Date();
  let UTCHours = now.getUTCHours();
  let timestamp = now.setUTCHours(UTCHours, 0, 0, 0);

  await LendingRate.findOne({ time: timestamp }, function (err, res) {
    if (!res) {
      axios
        .get("https://ftx.com/api/spot_margin/history?coin=USD")
        .then((res) => {
          data = res.data.result;
          let Rate = data[0];
          let time = Rate.time;
          timestamp = new Date(time).getTime();
          // console.log(typeof timestamp);
          let lendingRateDetail = {
            coin: Rate.coin,
            time: timestamp,
            rate: Rate.rate,
          };
          let lendingRate = new LendingRate(lendingRateDetail);
          lendingRate.save();
        });
    }
  });
}

async function populateLendingRate() {
  // enter start time and end time to get period lending rate
  let now = new Date();
  let UTCHours = now.getUTCHours();
  const startTimestamp = 1614528000; //2021 March 1th
  const endTime = now.setUTCHours(UTCHours, 0, 0, 0);
  endTimestamp = endTime / 1000;

  console.log(endTimestamp);
  axios
    .get(
      `https://ftx.com/api/spot_margin/history?coin=USD&start_time=${startTimestamp}&end_time=${endTimestamp}`
    )
    .then(async (res) => {
      data = res.data.result;
      for (i = 0; i < data.length; i++) {
        let Rate = data[i];
        let time = Rate.time;
        timestamp = new Date(time).getTime();
        // let lendingRateDetail = {
        //   coin: Rate.coin,
        //   time: timestamp,
        //   rate: Rate.rate,
        // };
        // let lendingRate = new LendingRate(lendingRateDetail);
        // lendingRate.save();
        // console.log(typeof timestamp);
        // incase backend service accidentially stopped ,fetch all data again and update the missing one
        await LendingRate.findOne({ time: timestamp }, function (err, res) {
          if (!res) {
            // console.log(timestamp);
            let lendingRateDetail = {
              coin: Rate.coin,
              time: timestamp,
              rate: Rate.rate,
            };
            let lendingRate = new LendingRate(lendingRateDetail);
            lendingRate.save();
          }
        });
      }
      // }
    })
    .catch((err) => console.log(err));
}

populateLendingRate();

async function updateCoinPrice() {
  await updateFTXCoinPrice();
  await updateBinanceCoinPrice();
}

function run() {
  // fetch once first
  updateCoinPrice();
  fetchingLendingRate();

  setInterval(updateCoinPrice, 1000);
  // try update lending rate every 10 mins
  setInterval(fetchingLendingRate, 600000);
}

module.exports = { run, populateLendingRate };
