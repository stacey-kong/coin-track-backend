const CoinInstance = require("../../models/coininstance");
const Coin = require("../../models/coin");
const { success, error, validation } = require("../../helpers/responseApi");

/**
 * @desc    Track a new coin
 * @method  GET api/coin/track
 * @access  public
 */
exports.price = async (req, res) => {
  const { name, exchange } = req.body;

  try {
    let coin = await Coin.findOne({ abbreviation: name });
    console.log(coin);
    let coinDetail = await CoinInstance.findOne({
      coin: coin._id,
      exchange: exchange,
    });
    if (!coin) {
      return res.status(404).json(error("Not a tracking coin", res.statusCode));
    }
    if (coin) {
      return res.status(201).json(
        success(
          {
            data: {
              name: coin.name,
              price: coinDetail.price,
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
