const { success, error } = require("../../helpers/responseApi");
const Subscription = require("../../models/subscription");
const Coin = require("../../models/coin");
const subscription = require("../../models/subscription");

// const getUserSubscription = async function (user) {
//   userSubscription = await Subscription.findOne({ user: user }).then((data) => {
//     return data.subscription;
//   });
//   return userSubscription;
// };

let subscriptionList = new Map();

// return coin list with user subscription imformation
exports.getSubscriptionList = async (req, res) => {
  const userId = req.body.userId;
  const userSubscription = await Subscription.findOne({ user: userId }).then(
    (data) => {
      return data.subscription;
    }
  );

  try {
    await Coin.find({}).then(async (coins) => {
      let list = [];
      for (let i = 0; i < coins.length; i++) {
        let data = {
          name: coins[i].name,
          symbol: coins[i].abbreviation,
          subscribed: userSubscription.includes(coins[i].abbreviation),
        };
        list.push(data);
      }
      subscriptionList.set(userId, list);
    });

    return res.status(201).json(
      success(
        {
          data: {
            coin: subscriptionList.get(userId),
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

exports.deleteSubscription = async (req, res) => {
  const { userId, coin } = req.body;

  try {
    let userSubscription = await subscription
      .findOneAndUpdate(
        { user: userId },
        { $pull: { subscription: coin } },
        { new: true }
      )
      .then((data) => {
        return data.subscription;
      });

    const oldlist = subscriptionList.get(userId);
    oldlist.map((ele) => {
      if (userSubscription.includes(ele.symbol)) {
        ele.subscribed = true;
        return ele;
      } else {
        ele.subscribed = false;
        return ele;
      }
    });
    subscriptionList.set(userId, oldlist);

    return res.status(201).json(
      success(
        {
          data: {
            coin: subscriptionList.get(userId),
          },
          message: "Delete coin sucessfully",
        },
        res.statusCode
      )
    );
  } catch (err) {
    console.error(err.message);
    res.status(500).json(error("Server error", res.statusCode));
  }
};

exports.addScription = async (req, res) => {
  const { userId, coin } = req.body;

  try {
    let userSubscription = await subscription
      .findOneAndUpdate(
        { user: userId },
        { $addToSet: { subscription: coin } },
        { new: true }
      )
      .then((data) => {
        return data.subscription;
      });

    const oldlist = subscriptionList.get(userId);
    oldlist.map((ele) => {
      if (userSubscription.includes(ele.symbol)) {
        ele.subscribed = true;
        return ele;
      } else {
        ele.subscribed = false;
        return ele;
      }
    });
    subscriptionList.set(userId, oldlist);

    return res.status(201).json(
      success(
        {
          data: {
            coin: subscriptionList.get(userId),
          },
          message: "Add coin sucessfully",
        },
        res.statusCode
      )
    );
  } catch (err) {
    console.error(err.message);
    res.status(500).json(error("Server error", res.statusCode));
  }
};
