const CoinInstance = require("../app/models/coininstance");
const Coin = require("../app/models/coin");

async function getCoins() {
  let coinList = [];
  await Coin.find({}).then((coins) => {
    for (let i = 0; i < coins.length; i++) {
      coinList.push(coins[i].abbreviation);
    }
  });

  console.log(coinList);
  return coinList;
}

exports.binancePriceList = async function () {
  let binancePriceList;
  binancePriceList = await Coin.find({})
    .then(async (docs) => {
      let priceList = [];
      for (let i = 0; i < docs.length; i++) {
        const query = { coin: docs[i]._id, exchange: "Binance" };
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
  averagePrice = await Coin.find()
    .then(async (docs) => {
      let priceList = [];
      for (let i = 0; i < docs.length; i++) {
        let ftxPrice = await CoinInstance.findOne({
          coin: docs[i]._id,
          exchange: "FTX",
        })
          .then((res) => {
            return res.price;
          })
          .catch((err) => {
            return;
          });
        let binancePrice = await CoinInstance.findOne({
          coin: docs[i]._id,
          exchange: "Binance",
        })
          .then((res) => {
            return res.price;
          })
          .catch((err) => {
            return;
          });
        let price;
        if (ftxPrice && binancePrice) {
          price = (ftxPrice + binancePrice) / 2;
        } else if (ftxPrice) {
          price = ftxPrice;
        } else if (binancePrice) {
          price = binancePrice;
        } else {
          price = 0;
        }
        let data = {
          name: docs[i].name,
          abbreviation: docs[i].abbreviation,
          price:
            price > 1
              ? price.toFixed(2)
              : price < 0.0001
              ? price.toFixed(7)
              : price.toFixed(4),
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
