const socketio = require("socket.io");
const coinPriceHandler = require("./coinPriceHandler");
const subscriptionHandler = require("./subscriptionHandler");
const coinTrackingListHandler = require("./coinTrackingListHandler");
const lendingInterestHandler = require("./lendingInterestHandler");
const landingListener = require("./landingListener");

// const {pushAveragePrice}=require("./coinPriceHandler")
const { data } = require("../BackendService/index");

// let data = {
//   PriceList: PriceList,
// };

const pushAveragePrice = (io) => {
  const pushAveragePriceOnce = () => {
    io.to("room1").emit("price", data.PriceList);
  };
  pushAveragePriceOnce();
  updatePriceList();
  function updatePriceList() {
    setTimeout(async function () {
      pushAveragePriceOnce();
      updatePriceList();
    }, 1000);
  }
};

exports.socker = (server) => {
  const io = socketio(server, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"],
    },
  });

  // const onConnection = (socket) => {
  //   console.log("Client Connected");
  //   landingListener( socket);
  //   coinPriceHandler( socket);
  //   subscriptionHandler( socket);
  //   coinTrackingListHandler(socket);
  //   lendingInterestHandler( socket);
  // };

  io.on("connection", function(socket){
    console.log("Client Connected");
    landingListener(socket);
    coinPriceHandler(socket);
    subscriptionHandler(socket);
    coinTrackingListHandler(socket);
    lendingInterestHandler(socket);
  });
  // io.on("disconnect", () => {
  //   console.log("disconnect");
  //   io.close();
  // });
  pushAveragePrice(io);
  return io;
};
