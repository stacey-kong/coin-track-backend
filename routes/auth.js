const router = require("express").Router();

// Controllers
const { register, login } = require("../app/controllers/api/authController");

// Middleware
const {
  registerValidation,
  loginValidation,
} = require("../app/middlewares/auth");

// Routes
router.post("/register", registerValidation, register);
router.post("/login", loginValidation, login);

module.exports = router;
