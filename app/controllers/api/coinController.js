const CoinInstance = require("../../models/coininstance");
const Coin = require("../../models/coin");
const { success, error } = require("../../helpers/responseApi");
const coinCreate = require("../../../BackendService/populateCoin");
const axios = require("axios");

/**
 * @desc    Check a coin price on different exchange
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

/**
 * @desc    Add a coin to data base to track it price
 * @method  GET api/coin/add
 * @access  admin
 */
exports.addCoin = async (req, res) => {
  const { symbol, name } = req.body;
  const ftxApi = "https://ftx.com/api/markets/";
  const ftxFutureApi = "https://ftx.com/api/futures/";
  const binanceApi = "https://api1.binance.com/api/v3/ticker/price?symbol=";

  try {
    let checkftxStatus = await axios
      .get(`${ftxApi}${symbol}/USD`)
      .then((res) => {
        let status = true;
        return status;
      })
      .catch((err) => console.log(`no ftx market price of ${symbol}`));

    let checkftxFutureStatus = await axios
      .get(`${ftxFutureApi}${symbol}-PERP`)
      .then((res) => {
        let status = true;
        return status;
      })
      .catch((err) => {
        (err) => console.log(`no ftx future price of ${symbol}`);
      });
    let checkbinanceStatus = await axios
      .get(`${binanceApi}${symbol}BTC`)
      .then((response) => {
        let status = true;
        return status;
      })
      .catch((error) => {
        console.log(`no binance price of ${symbol}`);
      });

    if (checkbinanceStatus | checkftxStatus | checkftxFutureStatus) {
      const coinResult = await coinCreate(name, symbol);
      if (!coinResult) {
        return res.status(201).json(
          error(
            {
              data: {
                status: false,
                message: "Coin already exist",
              },
            },
            res.statusCode
          )
        );
      } else if (coinResult) {
        return res.status(201).json(
          success(
            {
              data: {
                status: true,
                message: "Successfully add coin to database",
              },
            },
            res.statusCode
          )
        );
      }
    } else {
      return res.status(201).json(
        error(
          {
            data: {
              status: false,
              message:
                "Can't find the coin on exchange Pleace check your typing",
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
