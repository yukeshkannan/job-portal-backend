const mongoose = require('mongoose');

const CandidateSchema = new mongoose.Schema({
    jobId: {
        type: mongoose.Schema.ObjectId,
        ref: 'Job',
        required: true
    },
    name: {
        type: String,
        required: [true, 'Please add a name']
    },
    email: {
        type: String,
        required: [true, 'Please add an email'],
        match: [
            /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
            'Please add a valid email'
        ]
    },
    status: {
        type: String,
        enum: ['Applied', 'Shortlisted', 'Rejected', 'Hired'],
        default: 'Applied'
    },
    resumePath: {
        type: String,
        required: [true, 'Please upload a resume']
    },
    skills: [String],
    experience: Number,
    matchScore: {
        type: Number,
        default: 0
    },
    aiSummary: String,
    addedBy: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: true // Recruiter who added/processed this candidate
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Candidate', CandidateSchema);
