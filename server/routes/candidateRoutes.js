const express = require('express');
const {
    addCandidate,
    getCandidates,
    getCandidate,
    analyzeResume,
    getMyApplications,
    deleteCandidate
} = require('../controllers/candidateController');

const { protect } = require('../middlewares/auth');
const upload = require('../middlewares/upload'); // Need to create this

const router = express.Router({ mergeParams: true });

router.get('/my-applications', protect, getMyApplications);

router.post('/analyze', upload.single('resume'), analyzeResume);
router.route('/')
    .get(getCandidates)
    .post(protect, upload.single('resume'), addCandidate);

router.route('/:id')
    .get(protect, getCandidate)
    .delete(protect, deleteCandidate);

module.exports = router;
