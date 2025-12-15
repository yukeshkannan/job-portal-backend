const mongoose = require('mongoose');

const InterviewSchema = new mongoose.Schema({
    jobId: {
        type: mongoose.Schema.ObjectId,
        ref: 'Job',
        required: true
    },
    candidateId: {
        type: mongoose.Schema.ObjectId,
        ref: 'Candidate',
        required: true
    },
    interviewerId: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: true
    },
    scheduledAt: {
        type: Date,
        required: [true, 'Please add the interview date and time']
    },
    mode: {
        type: String,
        enum: ['Online', 'Offline'],
        default: 'Online'
    },
    meetingLink: {
        type: String
    },
    status: {
        type: String,
        enum: ['Scheduled', 'Completed', 'Cancelled'],
        default: 'Scheduled'
    },
    feedback: {
        rating: { type: Number, min: 1, max: 5 },
        comments: String,
        decision: {
            type: String,
            enum: ['Strong Yes', 'Yes', 'No', 'Strong No', 'Pending'],
            default: 'Pending'
        }
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Interview', InterviewSchema);
