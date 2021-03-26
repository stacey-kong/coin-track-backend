const socker = require("./sockerController");
const {
  binancePriceList,
  ftxPriceList,
  averagePriceList,
  checkCoinprice,
} = require("./renderPrice");

module.exports = async (io, socket) => {
  const pushAveragePrice = () => {
    const pushAveragePriceOnce = async () => {
      const averageprice = await averagePriceList();
      socket.emit("allPrice", averageprice);
    };
    setInterval(pushAveragePriceOnce, 3000);
  };

  const pushCoinPrice = (coin) => {
    const pushCoinPriceOnce = async () => {
      const coinprice = await checkCoinprice(coin);
      socket.emit(`${coin}`, coinprice);
    };
    // pushCoinPriceOnce()
    setInterval(pushCoinPriceOnce, 3000);
  };
  socket.on("averageprice", pushAveragePrice);
  socket.on("coinprice", (data) => {
    console.log(data);
    pushCoinPrice(data);
  });
};
