const LendingAmount = require("../../models/lendinginstance");
const {
  interestSum,
  interestInWeeks,
} = require("../../helpers/interestCalculator");
const { success, error } = require("../../helpers/responseApi");

let lendingAmount = new Map();

exports.reviseLendingAmount = async function (req, res) {
  const { coin, userId, amount } = req.body;
  try {
    await LendingAmount.findOneAndUpdate(
      { user: userId },
      { amount: amount },
      (err, res) => {
        if (!res) {
          let LendingAmountDetails = {
            user: userId,
            amount: amount,
          };
          let lendingAmount = new LendingAmount(LendingAmountDetails);
          lendingAmount.save();
        }
      }
    );
    lendingAmount.set(userId, amount);
    let interest = await interestSum(coin, amount, "UTC");

    return res.status(201).json(
      success(
        {
          data: {
            amount,
            interest,
          },
        },
        res.statusCode
      )
    );
  } catch (err) {
    console.error(err.message);
    res.status(500).json(error("Server error", res.statusCode));
  }
};

exports.getLendingInfo = async function (req, res) {
  const { userId, coin, zoneType } = req.body;
  try {
    let amount = await LendingAmount.findOne({ user: userId }).then((res) => {
      return res.amount;
    });
    lendingAmount.set(userId, amount);

    let interest = await interestSum(coin, amount, zoneType);
    console.log(interest);

    return res.status(201).json(
      success(
        {
          data: {
            amount,
            interest,
          },
        },
        res.statusCode
      )
    );
  } catch (err) {
    console.error(err.message);
    res.status(500).json(error("Server error", res.statusCode));
  }
};

exports.getHistoryInterestSum = async function (req, res) {
  const { coin, timestamp, userId } = req.body;
  try {
    let amount = lendingAmount.get(userId);

    let interest = await interestInWeeks(+amount, timestamp, coin);

    return res.status(201).json(
      success(
        {
          data: {
            interest,
          },
        },
        res.statusCode
      )
    );
  } catch (err) {
    console.error(err.message);
    res.status(500).json(error("Server error", res.statusCode));
  }
};
