const socketio = require("socket.io");
const coinPriceHandler = require("./coinPriceHandler");
const subscriptionHandler = require("./subscriptionHandler");

exports.socker = (server) => {
  const io = socketio(server, {
    cors: {
      origin: "http://localhost:9009",
      methods: ["GET", "POST"],
    },
  });

  const onConnection = (socket) => {
    console.log("Client Connected");
    coinPriceHandler(io, socket);
    subscriptionHandler(io, socket);
  };

  io.on("connection", onConnection);
  return io;
};
