const socketio = require("socket.io");
// const coinPriceHandler = require("./coinPriceHandler");
// const coinTrackingListHandler = require("./coinTrackingListHandler");
// const lendingInterestHandler = require("./lendingInterestHandler");
const landingListener = require("./landingListener");

const { data } = require("../BackendService/index");

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

  const onConnection = (socket) => {
    console.log("connected");
    landingListener(socket);
  };

  io.on("connection", onConnection);

  io.on("disconnect", () => {
    console.log("disconnect");
    io.close();
  });
  pushAveragePrice(io);
  return io;
};
