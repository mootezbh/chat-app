const User = require("../models/user.model");
const bcrypt = require("bcryptjs");
const generateTokenAndSetCookie = require("../utils/generateToken");
module.exports = {
  Signup: async (req, res) => {
    try {
      const { username, password, confirmPassword, gender } = req.body;
      if (password !== confirmPassword) {
        return res.status(400).json({ message: "Passwords do not match" });
      }

      const user = await User.findOne({ username });

      if (user) {
        return res.status(400).json({ message: "User already exists" });
      }

      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      const boyProfilePic = `https://avatar.iran.liara.run/public/boy?username=${username}`;
      const girlProfilePic = `https://avatar.iran.liara.run/public/girl?username=${username}`;
      const profilePic = gender === "male" ? boyProfilePic : girlProfilePic;

      const newUser = new User({
        username,
        password: hashedPassword,
        gender,
        profilePic,
      });

      if (newUser) {
        generateTokenAndSetCookie(newUser._id, res);
        await newUser.save();
        res.status(201).json({
          _id: newUser._id,
          username: newUser.username,
          gender: newUser.gender,
          profilePic: newUser.profilePic,
        });
      } else {
        res.status(500).json({ message: "Invalid user data" });
      }
    } catch (error) {
      console.log("error in signup: ", error.message);
      res.status(500).json({ message: "Internal server error" });
    }
  },
  Login: async (req, res) => {
    try {
      const { username, password } = req.body;
      const user = await User.findOne({ username });
      const isPasswordCorrect = await bcrypt.compare(
        password,
        user?.password || ""
      );
      if (!user || !isPasswordCorrect) {
        return res.status(400).json({ message: "Invalid credentials" });
      }

      generateTokenAndSetCookie(user._id, res);

      res.status(200).json({
        _id: user._id,
        username: user.username,
        gender: user.gender,
        profilePic: user.profilePic,
      });
    } catch (error) {
      console.log("error in login: ", error.message);
      res.status(500).json({ message: "Internal server error" });
    }
  },
  Logout: async (req, res) => {
    try {
      res.clearCookie("token");
      res.status(200).json({ message: "Logged out successfully" });
    } catch (error) {
      console.log("error in logout: ", error.message);
      res.status(500).json({ message: "Internal server error" });
    }
  },
};
