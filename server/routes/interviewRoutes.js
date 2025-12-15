const express = require('express');
const {
    scheduleInterview,
    getInterviews,
    addFeedback
} = require('../controllers/interviewController');

const { protect } = require('../middlewares/auth');

const router = express.Router();

router.use(protect);

router.route('/')
    .get(getInterviews)
    .post(scheduleInterview);

router.route('/:id/feedback')
    .put(addFeedback);

module.exports = router;
