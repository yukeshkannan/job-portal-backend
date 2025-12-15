const express = require('express');
const {
    getJobs,
    getJob,
    createJob,
    updateJob,
    deleteJob
} = require('../controllers/jobController');

const { protect } = require('../middlewares/auth');

const router = express.Router();

// Re-route into other resource routers
const candidateRouter = require('./candidateRoutes');
router.use('/:jobId/candidates', candidateRouter);

router.route('/')
    .get(getJobs)
    .post(protect, createJob);

router.route('/:id')
    .get(getJob)
    .put(protect, updateJob)
    .delete(protect, deleteJob);

module.exports = router;
