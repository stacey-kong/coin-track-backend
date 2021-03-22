const CoinInstance = require("./app/models/coininstance");
const Coin = require("./app/models/coin");

exports.priceList = async function () {
  let res;
  res = await Coin.find({})
    .then(async (doc) => {
      let priceList = [];
      for (let i = 0; i < doc.length; i++) {
        const query = { coin: doc[i]._id, exchange: "FTX" };
        const price = await CoinInstance.findOne(query)
          .then((res) => {
            return res.price;
          })
          .catch((err) => console.log(err));
        let data = { name: doc[i].name, price: price };
        priceList.push(data);
      }
      return priceList;
    })
    .catch((err) => console.log(err));

  return res;
};
