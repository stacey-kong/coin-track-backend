const { check } = require("express-validator");

exports.registerValidation = [
  check("email", "Email is required").not().isEmpty(),
  check("password", "Password is required").not().isEmpty(),
];
