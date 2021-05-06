const LendingRate = require("../app/models/lending");
const LendingAmount = require("../app/models/lendinginstance");

exports.reviseLendingRate = async function (userId, Amount) {
  await LendingAmount.findOneAndUpdate(
    { user: userId },
    { amount: Amount },
    (err, res) => {
      if (!res) {
        let LendingAmountDetails = {
          user: userId,
          amount: Amount,
        };
        let lendingAmount = new LendingAmount(LendingAmountDetails);
        lendingAmount.save();
      }
    }
  );
};

exports.checkingAmount = async function (userId) {
  return LendingAmount.findOne({ user: userId }).then((res) => {
    return res.amount;
  });
};

exports.calculatemonthlyInterest = async function (userId) {
  let now = new Date();

  let thisMonthatUTC = now.getUTCMonth();
  let thisMonth = new Date(now.setUTCMonth(thisMonthatUTC, 1));
  let thisMonth_start = new Date(thisMonth.setUTCHours(0, 0, 0, 0)).getTime();
  // let queryTimestamp = thisMonth_start.getTime();

  console.log(thisMonth_start);
  const interest = await LendingAmount.findOne({ user: userId }).then(
    async (res) => {
      let amount = res.amount;
      // console.log(`week:${amount}`);
      let monthAccumulateRate = await LendingRate.find({
        time: { $gte: thisMonth_start },
      }).then((rates) => {
        let rate = 0;
        for (i = 0; i < rates.length; i++) {
          rate = rate + rates[i].rate;
        }
        return rate;
      });
      return amount * monthAccumulateRate;
    }
  );

  return interest;
};

exports.calculateWeeklyInterest = async function (userId) {
  let now = new Date();
  // today beginning at utc time
  let todayatUTC = now.setUTCHours(0, 0, 0, 0);
  //  Date object of todayatUTC
  let today = new Date(todayatUTC);
  //   the timestamp of this weeek beginning(mon)
  let thisweek_start = today.getTime() - (today.getDay() - 1) * 8.64e7;

  const interest = await LendingAmount.findOne({ user: userId }).then(
    async (res) => {
      let amount = res.amount;
      // console.log(`week:${amount}`);
      let weekAccumulateRate = await LendingRate.find({
        time: { $gte: thisweek_start },
      }).then((rates) => {
        let rate = 0;
        for (i = 0; i < rates.length; i++) {
          rate = rate + rates[i].rate;
        }
        return rate;
      });
      return amount * weekAccumulateRate;
    }
  );

  return interest;
};

exports.calculateDailyInterest = async function (userId) {
  let now = new Date();
  let utcHour = now.getUTCHours();
  let nowatUTC = now.setUTCHours(utcHour, 0, 0, 0);
  let today_start = nowatUTC - utcHour * 3.6e6;
  let interest = await LendingAmount.findOne({ user: userId }).then(
    async (res) => {
      let amount = res.amount;
      // console.log(`day:${amount}`);
      let dayAccumulateRate = await LendingRate.find({
        time: { $gte: today_start },
      }).then((rates) => {
        let rate = 0;
        for (i = 0; i < rates.length; i++) {
          rate = rate + rates[i].rate;
        }
        return rate;
      });
      return amount * dayAccumulateRate;
    }
  );

  return interest;
};
