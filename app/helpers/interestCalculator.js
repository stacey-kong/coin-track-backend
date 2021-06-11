const LendingRate = require("../models/lending");

let interestRate = new Map();

calculateInterest = async function (amount, timeType, zoneType, rates) {
  let timestamp;
  let now = new Date();
  switch (timeType) {
    case "Day":
      //day

      let localHour = now.getHours();
      let utcHour = now.getUTCHours();
      let nowatUTC = now.setUTCHours(utcHour, 0, 0, 0);
      let nowatLoacl = now.setHours(localHour, 0, 0, 0);
      let today_start = nowatUTC - utcHour * 3.6e6;
      let today_start_local = nowatLoacl - localHour * 3.6e6;
      timestamp = zoneType === "local" ? today_start_local : today_start;
      break;
    case "Week":
      //week
      //  Date object of todayatUTC
      let today = new Date(now.setUTCHours(0, 0, 0, 0));
      //  Date object of todayatLocal
      let todayLocal = new Date(now.setHours(0, 0, 0, 0));
      //   the timestamp of this weeek beginning(mon)
      let thisweek_start = today.getTime() - (today.getDay() - 1) * 8.64e7;
      let thisweek_start_local =
        todayLocal.getTime() - (todayLocal.getDay() - 1) * 8.64e7;
      timestamp = zoneType === "local" ? thisweek_start_local : thisweek_start;
      break;
    case "Month":
      //month
      let thisMonthatUTC = now.getUTCMonth();
      let thisMonth = new Date(now.setUTCMonth(thisMonthatUTC, 1));
      let thisMonth_start = new Date(
        thisMonth.setUTCHours(0, 0, 0, 0)
      ).getTime();
      let thisMonth_start_local = new Date(
        thisMonth.setUTCHours(-8, 0, 0, 0)
      ).getTime();
      timestamp =
        zoneType === "local" ? thisMonth_start_local : thisMonth_start;
      break;
  }

  let AccumulateRate=0;
  rates.map((rate) => {
    if (rate.time > timestamp) {
      AccumulateRate += rate.rate;
    } else {
      AccumulateRate += 0;
    }
  });
  let interest = amount * AccumulateRate;
  return interest;
};

calculatePeriodInterest = async function (startTime, endTime) {
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

calculateRecentDayInterest = async function (userId, timestamp, days) {
  let now = new Date(timestamp);
  let now_start_local = now.setHours(0, 0, 0, 0);
  let realNow = new Date();
  let day = realNow.getDay();
  let realNowStart = realNow.setHours(0, 0, 0, 0) - (day - 1) * 8.64e7;
  // console.log(`realNowStart:${realNowStart}`);
  // console.log(`timestamp:${timestamp}`);
  let totaldays = realNowStart === timestamp ? day : 7;

  // console.log(`totaldays:${totaldays}`);

  const dayilyInterest = await LendingAmount.findOne({ user: userId }).then(
    async (res) => {
      let amount = res.amount;
      let interest = [];

      for (let i = 0; i < totaldays; i++) {
        let startTime = now_start_local + i * 8.64e7;
        // console.log(startTime);
        let AccumulateRate = await calculatePeriodInterest(
          startTime,
          //23 hours in milliseconds 12:00 is regards as the new day begins
          startTime + (8.64e7 - 3.6e6)
        );

        // let date = new Date(startTime);

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

exports.interestSum = async (coin, amount, zoneType) => {
  const lendingrate = await LendingRate.find({
    coin: coin,
  }).then((data) => data);
  interestRate.set(coin, lendingrate);
  const monthlyinterst = await calculateInterest(
    amount,
    "Month",
    zoneType,
    lendingrate
  );
  const weeklyinterst = await calculateInterest(
    amount,
    "Week",
    zoneType,
    lendingrate
  );
  const dailyinterest = await calculateInterest(
    amount,
    "Day",
    zoneType,
    lendingrate
  );
  const interest = {
    today: dailyinterest,
    week: weeklyinterst,
    month: monthlyinterst,
  };
  return interest;
};
