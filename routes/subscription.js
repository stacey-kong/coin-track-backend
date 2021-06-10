const router = require("express").Router();

// Controllers
const {
  getSubscriptionList,
  deleteSubscription,
  addScription,
} = require("../app/controllers/api/subscriptionController");

// Routes
router.post("/", getSubscriptionList);
router.post("/delete", deleteSubscription);
router.post("/add", addScription);

module.exports = router;
