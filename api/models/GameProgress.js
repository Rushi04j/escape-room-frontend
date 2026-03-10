const mongoose = require('mongoose');

const gameProgressSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    language: { type: String, required: true },
    difficulty: { type: Number, required: true }, // 1 = Standard, 0.75 = Hard, 0.5 = FAANG
    totalTimeTaken: { type: Number, default: 0 }, // in seconds
    mistakes: { type: Number, default: 0 },
    doorsCompleted: { type: Number, default: 0 },
    doorTimes: [
        {
            doorNumber: Number,
            timeTaken: Number // Time taken for this specific door
        }
    ],
    status: { type: String, enum: ['in-progress', 'completed', 'failed'], default: 'in-progress' },
    startedAt: { type: Date, default: Date.now },
    completedAt: { type: Date }
});

module.exports = mongoose.model('GameProgress', gameProgressSchema);
