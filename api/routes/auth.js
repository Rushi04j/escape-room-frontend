const jwt = require('jsonwebtoken'); // Add this
const express = require('express');
const bcrypt = require('bcryptjs');
const User = require('../models/user');
const router = express.Router();

const SECRET_KEY = process.env.JWT_SECRET || "your_secret_key"; // Ensure this is in .env

// ✅ SIGNUP Route
router.post('/signup', async (req, res) => {
    try {
        const { username, email, password } = req.body;
        const existingUser = await User.findOne({ email });

        if (existingUser) return res.status(400).json({ error: "User already exists." });

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({ username, email, password: hashedPassword });
        await newUser.save();

        // 🔹 Generate JWT Token
        const token = jwt.sign({ userId: newUser._id }, SECRET_KEY, { expiresIn: "1h" });

        res.status(201).json({ message: "User registered successfully!", token });
    } catch (err) {
        res.status(500).json({ error: "Internal Server Error" });
    }
});

// ✅ LOGIN Route (Returns JWT)
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });

        if (!user) return res.status(401).json({ error: "User not found." });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(401).json({ error: "Invalid credentials." });

        // 🔹 Generate JWT Token
        const token = jwt.sign({ userId: user._id }, SECRET_KEY, { expiresIn: "1h" });

        res.json({ message: "Login successful!", token });
    } catch (err) {
        res.status(500).json({ error: "Internal Server Error" });
    }
});

module.exports = router;
