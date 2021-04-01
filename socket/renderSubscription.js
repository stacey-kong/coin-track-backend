const Subscription = require("../app/models/subscription");
const Coin = require("../app/models/coin");
const subscription = require("../app/models/subscription");

const getUserSubscription = async function (user) {
  userSubscription = await Subscription.findOne({ user: user }).then((data) => {
    return data.subscription;
  });
  return userSubscription;
};

// return coin list with user subscription imformation
const renderCoinsubscriptionList = async function (user) {
  const userSubscriptionList = await getUserSubscription(user);
  const coinList = await Coin.find({}).then(async (coins) => {
    let list = [];
    for (i = 0; i < coins.length; i++) {
      let data = {
        name: coins[i].name,
        symbol: coins[i].abbreviation,
        subscribed: userSubscriptionList.includes(coins[i].abbreviation),
      };
      list.push(data);
    }
    return list;
  });
  return coinList;
};

const addScription = async function (userId, coin) {
  const userNewSubscription = await subscription.findOneAndUpdate(
    { user: userId },
    { $addToSet: { subscription: coin } }
  );
  return userNewSubscription;
};

const deleteScription = async function (userId, coin) {
  const userNewSubscription = await subscription.findOneAndUpdate(
    { user: userId },
    { $pull: { subscription: coin } }
  );
  return userNewSubscription;
};

module.exports = {
  getUserSubscription,
  renderCoinsubscriptionList,
  addScription,
  deleteScription,
};
