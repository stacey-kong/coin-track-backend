const socker = require("./sockerController");
const {
  reviseLendingRate,
  calculateWeeklyInterest,
  calculateDailyInterest,
  checkingAmount,
  calculatemonthlyInterest,
  calculateRecentDayInterest,
} = require("./renderLendingInterest");

module.exports = async (io, socket) => {
  const pushInterest = async (userId, timeType) => {
    const pushInterestOnce = async () => {
      const monthlyinterst = await calculatemonthlyInterest(userId, timeType);
      const weeklyinterst = await calculateWeeklyInterest(userId, timeType);
      const dailyinterest = await calculateDailyInterest(userId, timeType);
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
    pushInterestOnce();
    setInterval(pushInterestOnce, 1.8e6);
  };
  // half an hour equals 1.8e6

  socket.on("reviseLending", async (userId, amount) => {
    // wait lending amount update before interest calculation
    const revisement = await reviseLendingRate(userId, amount);

    pushInterest(userId, "UTC");
  });

  socket.on("lending", async (userId, timeType) => {
    // const userId=payload.useId
    // const timeType=payload.timeType
    console.log(timeType);
    pushInterest(userId, timeType);
  });

  socket.on("dailyLending", async (userId, timestamp) => {
    const interest = await calculateRecentDayInterest(userId, timestamp);
    socket.emit("dailyInterest", interest);
  });
};
