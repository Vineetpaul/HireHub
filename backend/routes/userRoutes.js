const express = require('express')

const {updateProfile,
    deleteResume,
    getPublicProfile,
} = require('../controllers/userController');

const {protect} = require('../middleware/authMiddleware');

const router = express.Router();

// Private routes

router.put('/profile', protect, updateProfile);
router.delete('/resume', protect, deleteResume);

// public routes
router.get('/:id', getPublicProfile);

module.exports = router;