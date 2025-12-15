const Interview = require('../models/Interview');
const Candidate = require('../models/Candidate');
const Job = require('../models/Job');
const sendEmail = require('../utils/sendEmail');

// @desc    Schedule an Interview
// @route   POST /api/interviews
// @access  Private
exports.scheduleInterview = async (req, res, next) => {
    try {
        // Ensure only recruiters/admins can schedule
        if (req.user.role !== 'recruiter' && req.user.role !== 'admin') {
            return res.status(403).json({ success: false, error: 'Not authorized to schedule interviews' });
        }

        const { jobId, candidateId, scheduledAt, mode, meetingLink } = req.body;

        // Verify Candidate belongs to Job (Optional, but good practice)
        const candidate = await Candidate.findById(candidateId);
        if (!candidate) {
            return res.status(404).json({ success: false, error: 'Candidate not found' });
        }

        const interview = await Interview.create({
            jobId,
            candidateId,
            interviewerId: req.user.id,
            scheduledAt,
            mode,
            meetingLink
        });

        // Send Email to Candidate
        const message = `
            <h3>Interview Scheduled</h3>
            <p>Dear ${candidate.name},</p>
            <p>An interview has been scheduled for the position of <strong>${(await Job.findById(jobId)).title}</strong>.</p>
            <p><strong>Date & Time:</strong> ${new Date(scheduledAt).toLocaleString()}</p>
            <p><strong>Mode:</strong> ${mode}</p>
            <p><strong>${mode === 'Online' ? 'Meeting Link' : 'Location'}:</strong> ${meetingLink}</p>
            <p>Good luck!</p>
        `;

        try {
            await sendEmail({
                email: candidate.email,
                subject: 'Interview Scheduled - NextHire',
                message
            });
        } catch (error) {
            console.error(error);
            // Don't fail the request if email fails, just log it
        }

        res.status(201).json({
            success: true,
            data: interview
        });
    } catch (err) {
        res.status(400).json({ success: false, error: err.message });
    }
};

// @desc    Get Interviews (For current user/recruiter)
// @route   GET /api/interviews
// @access  Private
exports.getInterviews = async (req, res, next) => {
    try {
        let query;

        if (req.user.role === 'recruiter') {
            // Recruiter sees interviews they scheduled
            query = { interviewerId: req.user.id };
        } else {
            // Candidate sees interviews scheduled for them
            // 1. Find all Candidate profiles linked to this user (via addedBy)
            const candidateProfiles = await Candidate.find({ addedBy: req.user.id });
            const candidateIds = candidateProfiles.map(c => c._id);

            // 2. Find interviews for these candidate IDs
            query = { candidateId: { $in: candidateIds } };
        }

        const interviews = await Interview.find(query)
            .populate('candidateId', 'name email')
            .populate('jobId', 'title')
            .populate('interviewerId', 'name email'); // Populate recruiter info for candidates

        res.status(200).json({
            success: true,
            count: interviews.length,
            data: interviews
        });
    } catch (err) {
        res.status(400).json({ success: false, error: err.message });
    }
};

// @desc    Add Feedback to Interview
// @route   PUT /api/interviews/:id/feedback
// @access  Private
exports.addFeedback = async (req, res, next) => {
    try {
        const { rating, comments, decision } = req.body;

        let interview = await Interview.findById(req.params.id);

        if (!interview) {
            return res.status(404).json({ success: false, error: 'Interview not found' });
        }

        // Ensure user is the interviewer (or admin)
        if (interview.interviewerId.toString() !== req.user.id && req.user.role !== 'admin') {
            return res.status(401).json({ success: false, error: 'Not authorized to submit feedback' });
        }

        interview = await Interview.findByIdAndUpdate(req.params.id, {
            feedback: { rating, comments, decision },
            status: 'Completed'
        }, { new: true });

        res.status(200).json({
            success: true,
            data: interview
        });
    } catch (err) {
        res.status(400).json({ success: false, error: err.message });
    }
};
