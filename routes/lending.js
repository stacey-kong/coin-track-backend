const router = require("express").Router();

// Controllers
const {
  getLendingInfo,
  reviseLendingAmount,
} = require("../app/controllers/api/lendingController");

// Routes
router.post("/", getLendingInfo);
router.post("/amount", reviseLendingAmount);

module.exports = router;
