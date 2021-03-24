const CoinInstance = require("../app/models/coininstance");
const Coin = require("../app/models/coin");
const coin = require("../app/models/coin");

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

exports.averagePriceList = async function () {
  let averagePrice;
  averagePrice = await Coin.find({})
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
