const router = require("express").Router();

// Controllers
const { price, addCoin } = require("../app/controllers/api/coinController");

// Routes
router.post("/price", price);
router.post("/addcoin", addCoin);

module.exports = router;
