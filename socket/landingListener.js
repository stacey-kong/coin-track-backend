const { data } = require("../BackendService/index");

module.exports = async (socket) => {
  console.log("dashboard");
  socket.join(`room1`);
  socket.emit("firstloaded", data.PriceList);
};
