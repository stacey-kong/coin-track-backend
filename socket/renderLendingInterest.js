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

exports.calculatemonthlyInterest = async function (userId, timeType) {
  let now = new Date();

  let thisMonthatUTC = now.getUTCMonth();
  let thisMonth = new Date(now.setUTCMonth(thisMonthatUTC, 1));
  let thisMonth_start = new Date(thisMonth.setUTCHours(0, 0, 0, 0)).getTime();

  let thisMonth_start_local = new Date(
    thisMonth.setUTCHours(-8, 0, 0, 0)
  ).getTime();

  const timestamp =
    timeType === "local" ? thisMonth_start_local : thisMonth_start;

  // console.log(thisMonth_start);
  // console.log(thisMonth_start_local);
  // console.log(timestamp)
  const interest = await LendingAmount.findOne({ user: userId }).then(
    async (res) => {
      let amount = res.amount;
      // console.log(`week:${amount}`);
      let monthAccumulateRate = await LendingRate.find({
        time: { $gte: timestamp },
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

exports.calculateWeeklyInterest = async function (userId, timeType) {
  let now = new Date();
  // today beginning at utc time
  let todayatUTC = now.setUTCHours(0, 0, 0, 0);
  //  Date object of todayatUTC
  let today = new Date(todayatUTC);
  let todayLocal = new Date(now.setHours(0, 0, 0, 0));
  //   the timestamp of this weeek beginning(mon)
  let thisweek_start = today.getTime() - (today.getDay() - 1) * 8.64e7;
  let thisweek_start_local =
    todayLocal.getTime() - (today.getDay() - 1) * 8.64e7;

  // console.log(thisweek_start)
  // console.log(thisweek_start_local)

  const timestamp =
    timeType === "local" ? thisweek_start_local : thisweek_start;

  const interest = await LendingAmount.findOne({ user: userId }).then(
    async (res) => {
      let amount = res.amount;
      // console.log(`week:${amount}`);
      let weekAccumulateRate = await LendingRate.find({
        time: { $gte: timestamp },
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

exports.calculateDailyInterest = async function (userId, timeType) {
  let now = new Date();
  let localHour = now.getHours();
  let utcHour = now.getUTCHours();
  let nowatUTC = now.setUTCHours(utcHour, 0, 0, 0);
  let today_start = nowatUTC - utcHour * 3.6e6;
  let today_start_local = now - localHour * 3.6e6;

  // console.log(today_start);
  // console.log(today_start_local);

  const timestamp = timeType === "local" ? today_start_local : today_start;

  let interest = await LendingAmount.findOne({ user: userId }).then(
    async (res) => {
      let amount = res.amount;
      // console.log(`day:${amount}`);
      let dayAccumulateRate = await LendingRate.find({
        time: { $gte: timestamp },
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
