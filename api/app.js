require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();

// Middleware
app.use(cors());  // Allow frontend requests
app.use(express.json());

// Check if MONGO_URI is set
if (!process.env.MONGO_URI) {
    console.error("❌ MONGO_URI is missing from .env file!");
    process.exit(1);
}

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('✅ MongoDB connected'))
    .catch(err => console.error('❌ MongoDB connection error:', err));

// Define a simple route
app.get('/', (req, res) => {
    res.send('🚀 Escape Room Backend is running!');
});

// Export app for server.js
module.exports = app;
