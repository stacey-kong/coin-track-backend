const { run } = require("./fetchDataService");
const { averagePriceList } = require("./renderingPrice");

var mongoose = require("mongoose");
var mongoDB =process.env.DB_URL
console.log(mongoDB)
mongoose.connect(mongoDB, { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.Promise = global.Promise;
var db = mongoose.connection;
db.on("error", console.error.bind(console, "MongoDB connection error:"));

let data = {
  PriceList: [],
};
function updatePriceList() {
  setTimeout(async function () {
    data.PriceList = await averagePriceList();
    // console.log(PriceList);
    updatePriceList();
  }, 1000);
}
run();
updatePriceList();
// setInterval(()=>console.log(data.PriceList),3000)

module.exports = { data };
