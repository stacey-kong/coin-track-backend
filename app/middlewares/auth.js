const { check } = require("express-validator");

exports.registerValidation = [
  check("username", "Username is required").not().isEmpty(),
  check("password", "Password is required").not().isEmpty(),
];

exports.loginValidation = [
  check("username", "Username is required").not().isEmpty(),
  check("password", "Password is required").not().isEmpty(),
];