const socker = require("./sockerController");
const {
  binancePriceList,
  ftxPriceList,
  averagePriceList,
} = require("./renderPrice");

module.exports = async (io, socket) => {
  const sendData = async () => {
    const averageprice = await averagePriceList();
    socket.emit("Price", averageprice);
  };

  setInterval(sendData, 3000);
};


