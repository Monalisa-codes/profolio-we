//backend/controllers/authController.js

const express = require('express');
const User = require('../models/User');
// const bcrypt = require('bcryptjs');
const router = express.Router();

// 🔹 Register Route
const bcrypt = require('bcrypt');
// const User = require('../models/User'); // Adjust path as per your project structure

router.post('/register', async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // Check if user with the same email already exists
    let existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ error: 'Email is already registered' });

    // Check if username is already taken
    let existingUsername = await User.findOne({ username });
    if (existingUsername) return res.status(400).json({ error: 'Username is already taken' });

    // Ensure password is trimmed to avoid unnecessary spaces
    const trimmedPassword = password.trim();

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(trimmedPassword, salt);

    // Create new user
    const newUser = new User({
      username,
      email,
      password: hashedPassword, // Store the hashed password
      savedWork: []
    });

    await newUser.save();
    res.json({ message: 'User registered successfully!' });

  } catch (error) {
    console.error('Error in /register:', error);
    res.status(500).json({ error: 'Server error' });
  }
});


module.exports = router; // ✅ Export the entire router
