var express = require("express");
var router = express.Router();
const bcrypt = require("bcrypt");
const User = require("../models/user");

const rounds = 10;

/* GET users listing. */
router.get("/login", function (req, res, next) {
  res.send("respond with a resource");
});

router.post("/signup", (req, res) => {
  bcrypt.hash(req.body.password, rounds, (error, hash) => {
    if (error) res.status(500).json(error);
    else {
      const newUser = User({ username: req.body.username, password: hash });
      newUser
        .save()
        .then((user) => {
          res.status(200).json(user);
        })
        .catch((error) => {
          res.status(500).json(error);
        });
    }
  });
});

module.exports = router;
