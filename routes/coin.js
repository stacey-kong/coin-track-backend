const router = require("express").Router();

// Controllers
const { price } = require("../app/controllers/api/coinController");

// Routes
router.post("/price", price);

module.exports = router;
