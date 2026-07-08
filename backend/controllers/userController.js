const fs = require('fs')
const path = require('path')
const User = require('../models/User')

// @desc Updating user profile

exports.updateProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user._id)
        if (!user) return res.status(404).json({ message: "user not found" });

        const { name, avatar, resume, companyName, companyLogo, companyDescription } = req.body;

        user.name = name || user.name;
        user.avatar = avatar || user.avatar;
        user.resume = resume || user.resume;

        // if role = employer
        if (user.role === "employer") {
            user.companyName = companyName || user.companyName;
            user.companyLogo = companyLogo || user.companyLogo;
            user.companyDescription = companyDescription || user.companyDescription;
        }

        await user.save();

        res.json({
            _id: user._id,
            name: user.name,
            avatar: user.avatar,
            resume: user.resume,
            role: user.role,
            companyName: user.companyName,
            companyLogo: user.companyLogo,
            companyDescription: user.companyDescription,


        })


    } catch (err) {
        res.status(500).json({ message: err.message });
    }
}

// @desc Deleting resume

exports.deleteResume = async (req, res) => {
    try {
        const { resumeUrl } = req.body; // expect resumeUrl to be the URL of the resume

        // Extract file name from the URL
        const fileName = resumeUrl?.split("/")?.pop();

        const user = await User.findById(req.user._id);

        if (!user)
            return res.status(404).json({ message: "User not found" });

        if (user.role !== "jobseeker")
            return res
                .status(403)
                .json({ message: "Only jobseekers can delete resume" });

        // Construct the full file path
        const filePath = path.join(__dirname, "../uploads", fileName);

        // Check if the file exists and then delete
        if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath); // Delete the file
        }

        // Set the user's resume to an empty string
        user.resume = "";

        await user.save();

        res.json({ message: "Resume deleted successfully" });

    } catch (err) {
        res.status(500).json({ message: err.message })
    }
}


// @desc getting public profile
exports.getPublicProfile = async (req, res) => {
    try {
        const user = await User.findById(req.params.id).select('-password');

        if (!user)
            return res.status(404).json({ message: "User not found" });

        res.json(user);


    } catch (err) {
        res.status(500).json({ message: err.message })
    }
}