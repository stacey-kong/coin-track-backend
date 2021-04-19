const socker = require("./sockerController");
const { coinCreate } = require("../BackendService/populateCoin");

module.exports = async (io, socket) => {
  socket.on("addCoin", (payload) => {
    console.log(payload);
  });
};
