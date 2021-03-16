const CoinInstance = require("./app/models/coininstance");
const Coin = require("./app/models/coin");
const axios = require("axios");

var mongoose = require("mongoose");
const coininstance = require("./app/models/coininstance");
var mongoDB =
  "mongodb+srv://dbStacey:Db123456@cluster0.sq0s8.mongodb.net/coin?retryWrites=true&w=majority";
mongoose.connect(mongoDB, { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.Promise = global.Promise;
var db = mongoose.connection;
db.on("error", console.error.bind(console, "MongoDB connection error:"));

const ftxApi = "https://ftx.com/api/markets/";

async function updateCoinPrice() {
  await Coin.find({}, function (err, doc) {
    let price;
    doc.forEach((coin) => {
      const api = `${ftxApi}${coin.abbreviation}/USD`;
      const query = { coin: coin._id, exchange: "FTX" };
      axios
        .get(api)
        .then(async (response) => {
          price = response.data.result.price;
          await CoinInstance.findOneAndUpdate(query, {
            price: price,
          });
        })
        .catch((error) => {
          console.log(error);
        });
    });
  });
}

function run() {
  setInterval(updateCoinPrice, 5000);
}
run();
