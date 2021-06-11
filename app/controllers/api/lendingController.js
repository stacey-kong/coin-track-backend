const LendingAmount = require("../../models/lendinginstance");
const { interestSum } = require("../../helpers/interestCalculator");
const { success, error } = require("../../helpers/responseApi");

exports.reviseLendingAmount = async function (req, res) {
  const { userId, Amount } = req.body;

  try {
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
    let interest = await insterestSum(Amount);

    return res.status(201).json(
      success(
        {
          data: {
            Amount,
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
