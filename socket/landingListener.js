const { data } = require("../BackendService/index");


module.exports = async (socket) => {
    socket.on("listeningPrice", (res) => {
    console.log("dashboard");
    socket.join(`room1`);
    if (res) {
     socket.emit("price", data.PriceList);
     socket.emit("firstloaded", true);
    }
  });
};
