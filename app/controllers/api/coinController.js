const CoinInstance = require("../../models/coininstance");
const Coin = require("../../models/coin");
const { success, error, validation } = require("../../helpers/responseApi");

/**
 * @desc    Track a new coin
 * @method  GET api/coin/price
 * @access  public
 */
exports.price = async (req, res) => {
  const { abb } = req.body;

  try {
    let coin = await Coin.findOne({ abbreviation: abb });

    if (!coin) {
      return res.status(404).json(error("Not a tracking coin", res.statusCode));
    }

    let coinDetail = await CoinInstance.find({
      coin: coin._id,
    }).then(async (coins) => {
      let list = [];
      for (let i = 0; i < coins.length; i++) {
        let data = {
          price: coins[i].price,
          exchange: coins[i].exchange,
        };

        list.push(data);
      }
      return list;
    });

    if (coin && coinDetail) {
      return res.status(201).json(
        success(
          {
            data: {
              name: coin.abbreviation,
              price: coinDetail,
            },
          },
          res.statusCode
        )
      );
    }
  } catch (err) {
    console.error(err.message);
    res.status(500).json(error("Server error", res.statusCode));
  }
};
