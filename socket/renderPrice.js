const CoinInstance = require("../app/models/coininstance");
const Coin = require("../app/models/coin");
const coin = require("../app/models/coin");
const { price } = require("../app/controllers/api/coinController");
const Subscription = require("../app/models/subscription");

const getUserSubscription = async function (user) {
  userSubscription = await Subscription.findOne({ user: user }).then((data) => {
    return data.subscription;
  });
  return userSubscription;
};

exports.binancePriceList = async function () {
  let ftxPriceList;
  ftxPriceList = await Coin.find({})
    .then(async (docs) => {
      let priceList = [];
      for (let i = 0; i < docs.length; i++) {
        const query = { coin: docs[i]._id, exchange: "FTX" };
        const price = await CoinInstance.findOne(query)
          .then((res) => {
            return res.price;
          })
          .catch((err) => console.log(err));
        let data = { name: docs[i].name, price: price };
        priceList.push(data);
      }
      return priceList;
    })
    .catch((err) => console.log(err));
  return binancePriceList;
};

exports.ftxPriceList = async function () {
  let ftxPriceList;
  ftxPriceList = await Coin.find({})
    .then(async (docs) => {
      let priceList = [];
      for (let i = 0; i < docs.length; i++) {
        const query = { coin: docs[i]._id, exchange: "FTX" };
        const price = await CoinInstance.findOne(query)
          .then((res) => {
            return res.price;
          })
          .catch((err) => console.log(err));
        let data = { name: docs[i].name, price: price };
        priceList.push(data);
      }
      return priceList;
    })
    .catch((err) => console.log(err));
  return ftxPriceList;
};

exports.averagePriceList = async function (userId) {
  let averagePrice;
  const subscribedCoin = await getUserSubscription(userId);
  averagePrice = await Coin.find({abbreviation:subscribedCoin})
    .then(async (docs) => {
      let priceList = [];
      for (let i = 0; i < docs.length; i++) {
        let ftxPrice = await CoinInstance.findOne({
          coin: docs[i]._id,
          exchange: "FTX",
        }).then((res) => {
          return res.price;
        });
        let binancePrice = await CoinInstance.findOne({
          coin: docs[i]._id,
          exchange: "Binance",
        }).then((res) => {
          return res.price;
        });
        let price = (ftxPrice + binancePrice) / 2;
        let data = {
          name: docs[i].name,
          abbreviation: docs[i].abbreviation,
          price: price > 1 ? price.toFixed(2) : price.toFixed(4),
        };
        // console.log(data);
        priceList.push(data);
      }
      return priceList;
    })
    .catch((err) => console.log(err));
  return averagePrice;
};

exports.checkCoinprice = async function (coin) {
  const id = await Coin.findOne({ abbreviation: coin })
    .then((coin) => {
      return coin._id;
    })
    .catch((err) => console.log(err));
  const coinprice = await CoinInstance.find({ coin: id }).then((prices) => {
    let list = [];
    for (let i = 0; i < prices.length; i++) {
      let price = prices[i];
      let data = {
        exchange: price.exchange,
        price: price.price,
        historyHigh: price.historyHigh,
        historyLow: price.historyLow,
      };
      list.push(data);
    }
    return list;
  });
  return coinprice;
};
