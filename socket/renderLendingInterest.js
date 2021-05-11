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
    todayLocal.getTime() - (todayLocal.getDay() - 1) * 8.64e7;

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
  let nowatLoacl = now.setHours(localHour, 0, 0, 0);
  let today_start = nowatUTC - utcHour * 3.6e6;
  let today_start_local = nowatLoacl - localHour * 3.6e6;

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
        // console.log(rates);
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

const calculatePeriodInterest = async function (startTime, endTime) {
  let AccumulateRate = await LendingRate.find({
    time: { $gte: startTime, $lte: endTime },
  }).then((rates) => {
    let rate = 0;
    for (i = 0; i < rates.length; i++) {
      rate = rate + rates[i].rate;
    }
    return rate;
  });
  // console.log(`AccumulateRate:${AccumulateRate}`);
  return AccumulateRate;
};

exports.calculateRecentDayInterest = async function (userId, timestamp, days) {
  let now = new Date(timestamp);
  let localHour = now.getHours();
  let nowatLocal = now.setHours(localHour, 0, 0, 0);
  let week_start_local = nowatLocal - localHour * 3.6e6;
  let totaldays = days ? days : now.getDay() + 1;
  // console.log(totaldays)

  const dayilyInterest = await LendingAmount.findOne({ user: userId }).then(
    async (res) => {
      let amount = res.amount;
      let interest = [];

      for (let i = 0; i < totaldays; i++) {
        let startTime = week_start_local + i * 8.64e7;
        // console.log(startTime);
        let AccumulateRate = await calculatePeriodInterest(
          startTime,
          //23 hours in milliseconds 12:00 is regards as the new day begins
          startTime + (8.64e7 - 3.6e6)
        );

        let date = new Date(startTime);

        let lendingInterest = {
          x: startTime,
          y: amount * AccumulateRate,
        };

        interest.push(lendingInterest);
        // console.log(`interest:${interest}`)
      }
      return interest;
    }
  );
  return dayilyInterest;
};
