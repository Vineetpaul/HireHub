const express = require('express');

const { register, login, getMe } = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

const router = express.Router();

// Creating some routes for login signup and getMe

router.post('/register', register);
router.post('/login', login);
router.get('/me', protect, getMe);


router.post('/upload-image', protect, upload.single("image"),(req,res)=>{
    if(!req.file){
        return res.status(400).json({message:"No file is uploaded"})
    }
    const imageUrl = req.protocol + "://" + req.get("host") + "/upload/" + req.file.filename;
    res.status(200).json({message:"Image uploaded successfully", imageUrl})
})
// exporting mosule

module.exports = router;