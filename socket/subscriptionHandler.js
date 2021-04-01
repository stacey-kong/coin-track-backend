const socker = require("./sockerController");
const {
  renderCoinsubscriptionList,
  addScription,
  deleteScription,
} = require("./renderSubscription");

module.exports = async (io, socket) => {
  const sendCoinList = async (payload) => {
    const user = payload;
    const coinlist = await renderCoinsubscriptionList(user);
    socket.emit("coinList", coinlist);
  };
  socket.on("getCoinList", (payload) => {
    console.log(payload);
    sendCoinList(payload);
  });
  socket.on("addScription", (userId, coin) => {
    console.log(`userId:${userId},coin:${coin}`);
    if (!coin) return;
    addScription(userId, coin);
  });
  socket.on("deleteScription", (userId, coin) => {
    console.log(`userId:${userId},coin:${coin}`);
    if (!coin) return;
    deleteScription(userId, coin);
  });
};
