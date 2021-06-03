const socketio = require("socket.io");
const coinPriceHandler = require("./coinPriceHandler");
const subscriptionHandler = require("./subscriptionHandler");
const coinTrackingListHandler = require("./coinTrackingListHandler");
const lendingInterestHandler = require("./lendingInterestHandler");
// const {pushAveragePrice}=require("./coinPriceHandler")
const { PriceList } = require("../BackendService/index");




const pushAveragePrice = (io) => {
  let i = 1;
  const pushAveragePriceOnce = () => {
    io.to('room1').emit(PriceList);
    console.log(`send${i}`);
    i = i + 1;
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

  const onConnection = (socket) => {
    socket.join(`room1`)
    console.log("Client Connected");
    coinPriceHandler(io, socket);
    subscriptionHandler(io, socket);
    coinTrackingListHandler(io, socket);
    lendingInterestHandler(io, socket);
  };

  io.on("connection", onConnection);
  io.on("disconnect", () => {
    console.log("disconnect");
    io.close();
  });
  pushAveragePrice(io)
  return io;
};
