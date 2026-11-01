const express = require('express')

const {
    createJob,
    getJobs,
    getJobById,
    updateJob,
    deleteJob,
    toggleCloseJob,
    getJobsEmployer
} = require('../controllers/jobController')

const { protect, optionalProtect } = require('../middleware/authMiddleware')
const router = express.Router();

//  creating routes

router.route('/').post(protect, createJob).get(optionalProtect, getJobs);
router.route('/get-jobs-employer').get(protect, getJobsEmployer);
router.route('/:id').get(optionalProtect, getJobById).put(protect, updateJob).delete(protect, deleteJob);
router.put('/:id/toggle-close', protect, toggleCloseJob)

module.exports = router;