const fs = require('fs');
const path = require('path');
const Candidate = require('../models/Candidate');
const Job = require('../models/Job');
const pdf = require('pdf-parse-fork');
const { generateResumeSummary, calculateMatchScore } = require('../services/aiService');

// @desc    Add candidate to job
// @route   POST /api/jobs/:jobId/candidates
// @access  Private
exports.addCandidate = async (req, res, next) => {
    try {
        req.body.jobId = req.params.jobId;
        req.body.addedBy = req.user.id;

        const job = await Job.findById(req.params.jobId);

        if (!job) {
            return res.status(404).json({ success: false, error: 'Job not found' });
        }

        // Check if file is uploaded
        if (!req.file) {
            return res.status(400).json({ success: false, error: 'Please upload a resume' });
        }

        req.body.resumePath = req.file.path;

        // Parse Resume & AI Processing
        try {
            const dataBuffer = fs.readFileSync(req.file.path);
            const data = await pdf(dataBuffer);
            const resumeText = data.text;

            // Generate AI Summary
            req.body.aiSummary = await generateResumeSummary(resumeText);

            // Calculate Match Score
            const matchResult = await calculateMatchScore(resumeText, job.description, job.skills);
            req.body.matchScore = matchResult.score; // Assuming AI returns { score: 85, reason: "..." }
            
            // Optional: You could save the match reason too if you add a field for it
            
        } catch (error) {
            console.error('AI Processing Error:', error);
            // Continue without AI data if it fails
        }

        const candidate = await Candidate.create(req.body);

        res.status(201).json({
            success: true,
            data: candidate
        });
    } catch (err) {
        res.status(400).json({ success: false, error: err.message });
    }
};

// @desc    Analyze resume without applying
// @route   POST /api/jobs/:jobId/analyze
// @access  Public
exports.analyzeResume = async (req, res, next) => {
    console.log("Analyze Resume Request Received for Job:", req.params.jobId);
    try {
        const job = await Job.findById(req.params.jobId);

        if (!job) {
            console.log("Job Not Found");
            return res.status(404).json({ success: false, error: 'Job not found' });
        }

        if (!req.file) {
            console.log("No File Uploaded");
            return res.status(400).json({ success: false, error: 'Please upload a resume' });
        }

        console.log("File Uploaded:", req.file.path);

        // Parse Resume
        const dataBuffer = fs.readFileSync(req.file.path);
        console.log("File Read Success. Parsing PDF...");
        
        const data = await pdf(dataBuffer);
        const resumeText = data.text;
        console.log("PDF Parsed. Text Length:", resumeText.length);

        // Cleanup: Delete the temp uploaded file
        // Use async unlink and ignore errors to prevent crashing the request if file is locked
        fs.unlink(req.file.path, (err) => {
            if (err) console.error("Failed to delete temp resume:", err.message);
        });

        // Get AI Match Score & Feedback
        console.log("Calling AI Match Score...");
        const matchResult = await calculateMatchScore(resumeText, job.description, job.skills);
        console.log("Match Score Result:", matchResult);
        
        console.log("Calling AI Summary...");
        const aiSummary = await generateResumeSummary(resumeText);
        console.log("AI Summary Result:", aiSummary);

        res.status(200).json({
            success: true,
            data: {
                score: matchResult.score || 0,
                reason: matchResult.reason || "No detailed reason provided.",
                feedback: aiSummary // Adding the summary as general feedback
            }
        });

    } catch (err) {
        console.error("ANALYSIS ERROR DETAILS:", err);
        fs.writeFileSync('error.log', `Error (${new Date().toISOString()}): ${err.stack}\n`, { flag: 'a' });
        res.status(500).json({ success: false, error: 'Analysis Failed: ' + err.message });
    }
};

// @desc    Get candidates for a job
// @route   GET /api/jobs/:jobId/candidates
// @access  Private
exports.getCandidates = async (req, res, next) => {
    try {
        const candidates = await Candidate.find({ jobId: req.params.jobId });

        res.status(200).json({
            success: true,
            count: candidates.length,
            data: candidates
        });
    } catch (err) {
        res.status(400).json({ success: false, error: err.message });
    }
};

// @desc    Get single candidate
// @route   GET /api/candidates/:id
// @access  Private
exports.getCandidate = async (req, res, next) => {
    try {
        const candidate = await Candidate.findById(req.params.id).populate('jobId');

        if (!candidate) {
            return res.status(404).json({ success: false, error: 'Candidate not found' });
        }

        res.status(200).json({
            success: true,
            data: candidate
        });
    } catch (err) {
        res.status(400).json({ success: false, error: err.message });
    }
};

// @desc    Get current user's applications
// @route   GET /api/candidates/my-applications
// @access  Private
exports.getMyApplications = async (req, res, next) => {
    try {
        const applications = await Candidate.find({ addedBy: req.user.id })
            .populate({
                path: 'jobId',
                select: 'title company location jobType'
            })
            .sort('-createdAt');

        res.status(200).json({
            success: true,
            count: applications.length,
            data: applications
        });
    } catch (err) {
        res.status(400).json({ success: false, error: err.message });
    }
};

// @desc    Delete candidate
// @route   DELETE /api/candidates/:id
// @access  Private
exports.deleteCandidate = async (req, res, next) => {
    try {
        const candidate = await Candidate.findById(req.params.id);

        if (!candidate) {
            return res.status(404).json({ success: false, error: 'Candidate not found' });
        }

        // Attempt to delete the resume file
        if (candidate.resumePath && fs.existsSync(candidate.resumePath)) {
            try {
                fs.unlinkSync(candidate.resumePath);
            } catch (err) {
                console.error("Failed to delete resume file:", err);
            }
        }

        await candidate.deleteOne();

        res.status(200).json({
            success: true,
            data: {}
        });
    } catch (err) {
        res.status(400).json({ success: false, error: err.message });
    }
};
