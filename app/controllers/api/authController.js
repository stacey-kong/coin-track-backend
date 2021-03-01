const { success, error, validation } = require("../../helpers/responseApi");
const { randomString } = require("../../helpers/common");
const { validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../../models/User");
const Verification = require("../../models/verification");

/**
 * @desc    Register a new user
 * @method  POST api/auth/register
 * @access  public 
 */
exports.register = async (req, res) => {
  // Validation
  const errors = validationResult(req);
  if (!errors.isEmpty())
    return res.status(422).json(validation(errors.array()));

  const { username, password } = req.body;

  try {
    let user = await User.findOne({ username: username.toLowerCase() });

    // Check the user email
    if (user)
      return res
        .status(422)
        .json(validation({ msg: "Username already registered" }));

    let newUser = new User({
      Username: Username.toLowerCase().replace(/\s+/, ""),
      password,
    });

    // Hash the password
    const hash = await bcrypt.genSalt(10);
    newUser.password = await bcrypt.hash(password, hash);

    // Save the user
    await newUser.save();

    // Save token for user to start verificating the account
    let verification = new Verification({
      token: randomString(50),
      userId: newUser._id,
      type: "Register New Account",
    });

    // Save the verification data
    await verification.save();

    // Send the response to server
    res.status(201).json(
      success(
        "Register success, please activate your account.",
        {
          user: {
            id: newUser._id,
            username: newUser.username,
            verified: newUser.verified,
          },
          verification,
        },
        res.statusCode
      )
    );
  } catch (err) {
    console.error(err.message);
    res.status(500).json(error("Server error", res.statusCode));
  }
};