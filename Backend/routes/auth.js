const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { UserModel, findBy, add } = require("../models/User.js");
require("dotenv").config();

const router = express.Router();

router.post("/register", async (req, res) => {
  try {
    const user = req.body;

    if (!user.username || !user.password || !user.email) {
      return res.status(400).json({ error: "All fields are required" });
    }

    console.log("🟢 Registering User:", user.username);

    // Hash password
    // const hash = await bcrypt.hash(user.password.trim(), 10);
    // user.password = hash;

    // Save to DB
    const newUser = await UserModel.create(user);

    console.log("✅ User Registered:", newUser.username);

    const token = generateToken(newUser);

    res.status(201).json({ created_user: newUser, token, user_id: newUser.id });
    // res.redirect("/login"); // Redirect to login page
  } catch (error) {
    console.error("❌ Error Registering User:", error);
    res.status(500).json({ message: "Error adding user to DB", error });
  }
});

router.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ error: "Username and password are required" });
    }

    console.log("🔍 Searching User:", username);

    const user = await findBy({ username });

    if (!user) {
      console.log("❌ User Not Found:", username);
      return res.status(401).json({ message: "Invalid Credentials" });
    }

    console.log("✅ User Found:", user.username);

    // Compare passwords
    const isMatch = await bcrypt.compare(password.trim(), user.password);

    console.log("🔹 Entered Password:", password.trim());
    console.log("🔹 Stored Hashed Password:", user.password);
    console.log("🔍 Password Match:", isMatch);

    if (!isMatch) {
      return res.status(401).json({ message: "Invalid Credentials" });
    }

    // Generate JWT Token
    const token = generateToken(user);

    res.status(200).json({
      username: user.username,
      first_name: user.first_name,
      last_name: user.last_name,
      email: user.email,
      token,
      user_id: user.id,
      portfolioId: user.portfolioId, // Include portfolioId in response
    });

  } catch (error) {
    console.error("❌ Error Logging In:", error);
    res.status(500).json({ error: "Server error", details: error.message });
  }
});


function generateToken(user) {
  const payload = {
    userid: user.id,
    username: user.username,
  };
  const options = {
    expiresIn: "1h",
  };
  const token = jwt.sign(payload, process.env.JWT_SECRET, options);

  return token;
}

module.exports = router;
