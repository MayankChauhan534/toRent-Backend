const express = require("express");
const User = require("../models/user");
const router = express.Router();
const jwt = require("jsonwebtoken");
const { body, validationResult } = require("express-validator");
const fetchuser = require("../middleware/fetchuser");

const JWT_SECRET = process.env.JWT_SECRET;

// /user/signup
router.post(
  "/signup",
  [
    body("name", "Enter a valid name").isLength({ min: 3 }),
    body("email", "Enter a valid email").isEmail(),
    body("password", "Password must be atleast 5 characters").isLength({
      min: 5,
    }),
  ],
  async (req, res) => {
    let success = false;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const body = req.body;
      console.log(body);
      if (await User.findOne({ email: body.email })) {
        res.status(409).json({ message: "Email already exist", success });
      } else {
        const user = await User.create({
          name: body.name,
          contactNumber: body.contactNumber,
          email: body.email,
          password: body.password,
        });

        success = true;

        const data = {
          user: {
            id: user.id,
          },
        };

        const authtoken = jwt.sign(data, JWT_SECRET);

        res
          .status(200)
          .json({ message: "User added successfully", authtoken, success });
      }
    } catch (error) {
      console.error(error.message);
      res.status(500).send("Internal Server Error");
    }
  }
);

// /user/login
router.post(
  "/login",
  [
    body("email", "Enter a valid email").isEmail(),
    body("password", "Password cannot be blank").exists(),
  ],
  async (req, res) => {
    let success = false;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const { email, password } = req.body;

      let user = await User.findOne({ email });
      if (!user) {
        success = false;
        return res.status(400).json({
          message: "Invalid email or password",
          success,
        });
      }

      const isMatched = await User.matchPassword(email, password);
      if (!isMatched) {
        success = false;
        res.status(401).json({ message: "Invalid email or password", success });
      } else {
        success = true;
        const data = {
          user: {
            id: user.id,
          },
        };

        const authtoken = jwt.sign(data, JWT_SECRET);
        res
          .status(200)
          .json({ message: "Login successfull", success, authtoken });
      }
    } catch (error) {
      console.error(error.message);
      res.status(500).send("Internal Server Error");
    }
  }
);

router.post("/getuser", fetchuser, async (req, res) => {
  try {
    const { id } = req.query;
    const user = await User.findById(id).select("id name email contactNumber");
    res.send(user);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal Server Error");
  }
});

module.exports = router;
