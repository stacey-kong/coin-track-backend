const socker = require("./sockerController");
const { checkCoinprice } = require("./renderPrice");

module.exports = async (io, socket) => {
  const pushCoinPrice = (coin) => {
    const pushCoinPriceOnce = async () => {
      const coinprice = await checkCoinprice(coin);
      socket.emit(`${coin}`, coinprice);
    };
    pushCoinPriceOnce();
    setInterval(pushCoinPriceOnce, 3000);
  };

  socket.on("coinprice", (data) => {
    console.log(data);
    pushCoinPrice(data);
  });
};
