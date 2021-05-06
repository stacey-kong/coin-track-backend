const socker = require("./sockerController");
const {
  reviseLendingRate,
  calculateWeeklyInterest,
  calculateDailyInterest,
  checkingAmount,
  calculatemonthlyInterest
} = require("./renderLendingInterest");

module.exports = async (io, socket) => {
  const pushInterestOnce = async (userId) => {
    const monthlyinterst = await calculatemonthlyInterest(userId);
    const weeklyinterst = await calculateWeeklyInterest(userId);
    const dailyinterest = await calculateDailyInterest(userId);
    const interest = {
      today: dailyinterest,
      week: weeklyinterst,
      month: monthlyinterst,
    };
    let amount = await checkingAmount(userId);
    // console.log(`new:${amount}`);

    let res = [interest, amount];

    // console.log(res);
    // console.log(interest);
    socket.emit("lendingInterest", res);
  };

  const pushInterest = (userId) => {
    pushInterestOnce(userId);
    setInterval(pushInterestOnce, 1.8e6);
  };

  socket.on("reviseLending", async (userId, amount) => {
    // wait lending amount update before interest calculation
    const revisement = await reviseLendingRate(userId, amount);

    pushInterestOnce(userId);
  });

  socket.on("lending", async (userId) => {
    pushInterest(userId);
  });
};
