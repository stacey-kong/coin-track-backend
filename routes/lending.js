const router = require("express").Router();

// Controllers
const {
  getLendingInfo,
  reviseLendingAmount,
  getHistoryInterestSum,
} = require("../app/controllers/api/lendingController");

// Routes
router.post("/", getLendingInfo);
router.post("/amount", reviseLendingAmount);
router.post("/report", getHistoryInterestSum);

module.exports = router;
