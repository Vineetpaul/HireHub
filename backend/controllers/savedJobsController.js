const SavedJob = require('../models/SavedJob');


exports.saveJob = async (req, res) => {
    try {
        const exists = await SavedJob.findOne({ job: req.params.jobId, jobseeker: req.user._id })
        if (exists) return res.status(400).json({ message: "Job already saved" })

        const saved = await SavedJob.create({
            job: req.params.jobId,
            jobseeker: req.user._id
        })

        res.status(201).json(saved);

    } catch (err) {
        return res.status(500).json({ message: "Failed to save the job", error: err.message })
    }
}

exports.unsaveJob = async (req, res) => {
    try {
        const result = await SavedJob.findOneAndDelete({ job: req.params.jobId, jobseeker: req.user._id })
        if (!result) return res.status(404).json({ message: "Saved job not found" })

        res.json({ message: "Job removed successfully" })

    } catch (err) {
        return res.status(500).json({ message: "Failed to remove the job", error: err.message })
    }
}

exports.getMySavedJobs = async (req, res) => {
    try {
        const savedJobs = await SavedJob.find({ jobseeker: req.user._id })
            .populate({
                path: "job",
                populate: {
                    path: "company",
                    select: "name companyName companyLogo",

                }
            })
            res.json(savedJobs);

    } catch (err) {
        return res.status(500).json({ message: "Failed to fetch the job", error: err.message })
    }
}
