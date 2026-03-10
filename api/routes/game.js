const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const GameProgress = require('../models/GameProgress');
const User = require('../models/user');

const SECRET_KEY = process.env.JWT_SECRET || "your_secret_key";

// Middleware to verify JWT token
const authenticate = (req, res, next) => {
    const token = req.header('Authorization')?.split(' ')[1];
    if (!token) return res.status(401).json({ error: "Access denied. No token provided." });

    try {
        const decoded = jwt.verify(token, SECRET_KEY);
        req.user = decoded; // Adds userId to request
        next();
    } catch (err) {
        res.status(400).json({ error: "Invalid token." });
    }
};

// ✅ Start a new game session
router.post('/start', authenticate, async (req, res) => {
    try {
        const { language, difficulty } = req.body;
        
        const newGame = new GameProgress({
            userId: req.user.userId,
            language,
            difficulty: parseFloat(difficulty) || 1
        });
        
        await newGame.save();
        res.status(201).json({ message: "Game started", gameId: newGame._id });
    } catch (error) {
        console.error("Error starting game:", error);
        res.status(500).json({ error: "Failed to start game" });
    }
});

// ✅ Update game progress (door completed, mistakes made)
router.post('/progress/:gameId', authenticate, async (req, res) => {
    try {
        const { doorNumber, timeTakenForDoor, mistakesAdded } = req.body;
        
        const game = await GameProgress.findOne({ _id: req.params.gameId, userId: req.user.userId });
        if (!game) return res.status(404).json({ error: "Game not found or unauthorized" });

        // If door was completed
        if (doorNumber && timeTakenForDoor !== undefined) {
            game.doorsCompleted = Math.max(game.doorsCompleted, doorNumber);
            game.doorTimes.push({ doorNumber, timeTaken: timeTakenForDoor });
            game.totalTimeTaken += timeTakenForDoor;
        }

        // If mistake was made
        if (mistakesAdded) {
            game.mistakes += mistakesAdded;
        }

        await game.save();
        res.json({ message: "Progress updated", game });
    } catch (error) {
        console.error("Error updating progress:", error);
        res.status(500).json({ error: "Failed to update progress" });
    }
});

// ✅ Finish
router.post('/finish/:gameId', authenticate, async (req, res) => {
    try {
        const { status } = req.body; // 'completed' or 'failed'
        
        const game = await GameProgress.findOne({ _id: req.params.gameId, userId: req.user.userId });
        if (!game) return res.status(404).json({ error: "Game not found or unauthorized" });

        game.status = status || 'completed';
        game.completedAt = new Date();
        
        await game.save();
        res.json({ message: "Game finished", game });
    } catch (error) {
        console.error("Error finishing game:", error);
        res.status(500).json({ error: "Failed to finish game" });
    }
});

// ✅ Fetch Main Leaderboard (Top 10 Fastest Times across all languages)
router.get('/leaderboard', async (req, res) => {
    try {
        const topScores = await GameProgress.find({ status: 'completed' })
            .populate('userId', 'username') // get username from User model
            .sort({ totalTimeTaken: 1, mistakes: 1 }) // sort by fastest time, then least mistakes
            .limit(10);
            
        // Map data to clean format
        const leaderboard = topScores.map(score => ({
            username: score.userId ? score.userId.username : 'Unknown Escapee',
            timeTaken: score.totalTimeTaken,
            mistakes: score.mistakes,
            language: score.language,
            difficulty: score.difficulty,
            date: score.completedAt
        }));

        res.json(leaderboard);
    } catch (error) {
        console.error("Error fetching leaderboard:", error);
        res.status(500).json({ error: "Failed to fetch leaderboard" });
    }
});

// ✅ Fetch Personal Dashboard Stats
router.get('/stats', authenticate, async (req, res) => {
    try {
        const history = await GameProgress.find({ userId: req.user.userId })
            .sort({ startedAt: -1 })
            .limit(20);
            
        const completedRuns = history.filter(run => run.status === 'completed');
        
        let totalPlayTime = 0;
        let totalMistakes = 0;
        let bestTime = Infinity;

        completedRuns.forEach(run => {
            totalPlayTime += run.totalTimeTaken;
            totalMistakes += run.mistakes;
            if (run.totalTimeTaken < bestTime) bestTime = run.totalTimeTaken;
        });

        const stats = {
            gamesPlayed: history.length,
            gamesCompleted: completedRuns.length,
            averageTime: completedRuns.length > 0 ? (totalPlayTime / completedRuns.length).toFixed(2) : 0,
            bestTime: bestTime === Infinity ? null : bestTime,
            totalMistakes,
            recentHistory: history
        };

        res.json(stats);
    } catch (error) {
        console.error("Error fetching user stats:", error);
        res.status(500).json({ error: "Failed to fetch user stats" });
    }
});

module.exports = router;
