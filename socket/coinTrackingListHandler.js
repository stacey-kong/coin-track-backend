const socker = require("./sockerController");
const coinCreate = require("../BackendService/populateCoin");
const axios = require("axios");

module.exports = async (io, socket) => {
  socket.on("addCoin", async (payload, cb) => {
    const ftxApi = "https://ftx.com/api/markets/";
    const binanceApi = "https://api1.binance.com/api/v3/ticker/price?symbol=";
    let checkftxStatus = await axios
      .get(`${ftxApi}${payload.symbol}/USD`)
      .then((res) => {
        let status = true;
        return status;
      })
      .catch((err) => console.log(`no ftx market price of ${payload.symbol}`));

    let checkbinanceStatus = await axios
      .get(`${binanceApi}${payload.symbol}BTC`)
      .then((response) => {
        let status = true;
        return status;
      })
      .catch((error) => {
        console.log(`no binance price of ${payload.symbol}`);
      });

    if (checkbinanceStatus | checkftxStatus) {
      const res = await coinCreate(payload.name, payload.symbol);
      if (!res) {
        cb({
          status: false,
          message: "Coin already exist",
        });
      } else if (res) {
        cb({
          status: true,
          message: "Successfully add coin to database",
        });
      }
    } else {
      cb({
        status: false,
        message: "Can't find the coin on exchange Pleace check your typing",
      });
    }
  });
};
