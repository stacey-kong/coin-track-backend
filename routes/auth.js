
const router = require("express").Router();

// Controllers
const { register } = require("../../app/controllers/api/authController");

// Middleware
const { registerValidation } = require("../../app/middlewares/auth");

// Routes
router.post("/register", registerValidation, register);

module.exports = router;
