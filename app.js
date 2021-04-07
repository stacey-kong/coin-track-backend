const createError = require("http-errors");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const mongoose = require("mongoose");
const path = require("path");
const cors = require("cors");

const authRouter = require("./routes/auth");
const coinRouter = require("./routes/coin");

// implement the server with socket.io
const { socker } = require("./socket/sockerController");
const express = require("express");
const http = require("http");

const app = express();
const server = new http.Server(app);
socker(server);

var authPort = process.env.PORT || 9010;

var socketPort = process.env.PORT || 9011;

app.listen(authPort, () => {
  console.log(`Api listening on port 9010!`);
});

server.listen(socketPort, () => {
  console.log(`Socker listening on port 9011!`);
  // logger.info(`Api and socker whitelisted for ${host}`);
});

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "jade");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));
app.use(cors());

// connect to mongoDB
const dbURI =
  "mongodb+srv://dbStacey:Db123456@cluster0.sq0s8.mongodb.net/coin?retryWrites=true&w=majority";
mongoose.connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true });
const db = mongoose.connection;
// force findand{dosth} series to use it original function in mongodb
mongoose.set("useFindAndModify", false);

db.on("error", (err) => {
  console.error(err);
});
db.once("open", () => {
  console.log("DB started successfully");
});

// expose route
app.use("/api/auth", authRouter);
app.use("/api/coin", coinRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;
