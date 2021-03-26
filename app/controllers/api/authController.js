const { success, error, validation } = require("../../helpers/responseApi");
const { randomString } = require("../../helpers/common");
const { validationResult } = require("express-validator");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../../models/user");
const Verification = require("../../models/verification");
const config = require("config");

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
      username: username.toLowerCase().replace(/\s+/, ""),
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
        "Register success, please contact admin to activate your account.",
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

/**
 * @desc    Login a user
 * @method  POST api/auth/login
 * @access  public
 */
exports.login = async (req, res) => {
  // Validation
  const errors = validationResult(req);
  if (!errors.isEmpty())
    return res.status(422).json(validation(errors.array()));

  const { username, password } = req.body;

  try {
    const user = await User.findOne({ username });

    // Check the username
    // If there's not exists
    // Throw the error
    if (!user)
      return res
        .status(422)
        .json(validation("Not a exsiting user or the password is not correct"));

    // Check the password
    let checkPassword = await bcrypt.compare(password, user.password);
    if (!checkPassword)
      return res
        .status(422)
        .json(validation("Not a exsiting user or the password is not correct"));

    // Check user if not activated yet
    // If not activated, send error response
    if (user && !user.verified)
      return res
        .status(400)
        .json(error("Your account is not active yet.", res.statusCode));

    // If the requirement above pass
    // Lets send the response with JWT token in it
    const payload = {
      user: {
        id: user._id,
        username: user.username,
      },
    };

    jwt.sign(
      payload,
      config.get("jwtSecret"),
      { expiresIn: 86400 },
      (err, token) => {
        if (err) throw err;

        res
          .status(200)
          .json(
            success(
              "Login success",
              { token, userId: payload.user.id },
              res.statusCode
            )
          );
      }
    );
  } catch (err) {
    console.log(err.message);
    res.status(500).json(error("Server error", res.statusCode));
  }
};
