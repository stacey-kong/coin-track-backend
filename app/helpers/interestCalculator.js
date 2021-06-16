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

  let AccumulateRate = 0;
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

calculatePeriodInterest = async function (startTime, endTime, rates) {
  let AccumulateRate = 0;
  rates.map((rate) => {
    if (rate.time >= startTime && rate.time <= endTime) {
      AccumulateRate += rate.rate;
    } else {
      AccumulateRate += 0;
    }
  });
  // console.log(`AccumulateRate:${AccumulateRate}`);
  return AccumulateRate;
};

exports.interestInWeeks = async function (amount, timestamp, coin) {
  const lendingrate = interestRate.get(coin);
  let now = new Date();
  let today_start_local = now.setHours(0, 0, 0, 0);
  let day = now.getDay();
  let mon_of_this_week = today_start_local - (day - 1) * 8.64e7;
  let totaldays = mon_of_this_week === timestamp ? day : 7;
  let dayilyInterest = [];

  for (let i = 0; i < totaldays; i++) {
    let startTime = timestamp + i * 8.64e7;
    // console.log(startTime);
    let AccumulateRate = await calculatePeriodInterest(
      startTime,
      //23 hours in milliseconds 12:00 is regards as the new day begins
      startTime + (8.64e7 - 3.6e6),
      lendingrate
    );

    let lendingInterest = {
      x: startTime,
      y: amount * AccumulateRate,
    };

    dayilyInterest.push(lendingInterest);
    // console.log(`interest:${interest}`)
  }
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
