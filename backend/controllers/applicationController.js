const Application = require('../models/Application');
const Job = require('../models/Job');




exports.applyToJob = async (req, res) => {
    try {
        if (req.user.role !== "jobSeeker")
            return res.status(403).json({ message: "Only Job seekers can apply" })

        const jobId = req.params.jobId;

        const existing = await Application.findOne(
            {
                job: jobId,
                applicant: req.user._id,
            }
        )
        if (existing) return res.status(400).json({ message: "You had already applied for this job" })

        const application = await Application.create({
            job: jobId,
            applicant: req.user._id,
            resume: req.user.resume,

        })
        res.status(201).json(application);

    } catch (err) {
        return res.status(500).json({ message: err.message })
    }
}


exports.getMyApplications = async (req, res) => {
    try {
        const apps = await Application.find({ applicant: req.user._id })
            .populate("job", "title company location type")
            .sort({ createdAt: -1 })

        res.json(apps);

    } catch (err) {
        return res.status(500).json({ message: err.message })
    }
}

exports.getApplicantsForJob = async (req, res) => {
    try {
        const job = await Job.findById(req.params.jobId)
        if (!job) return res.status(404).json({ message: "Job not found" })

        if (job.company.toString() !== req.user._id.toString())
            return res.status(403).json({ message: "Not authorised to view the applicants" })

        const applications = await Application.find({ job: req.params.jobId })
            .populate("job", "title location category type")
            .populate("applicant", "name email avatar resume")

        res.json(applications);

    } catch (err) {
        return res.status(500).json({ message: err.message })
    }
}

exports.getApplicationById = async (req, res) => {
    try {
        const app = await Application.findById(req.params.id)
        .populate("job","title company")
        .populate("applicant","name email avatar resume")
        if(!app) return res.status(404).json({message:"Application not found", id:req.params.id})


        const isOwner = 
        app.applicant._id.toString() === req.user._id.toString() ||
        app.job.company.toString() === req.user._id.toString();

        if(!isOwner) return res.status(403).json({message:"Not authorized to view this application"})

        res.json(app);
    } catch (err) {
        return res.status(500).json({ message: err.message })
    }
}

exports.updateStatus = async (req, res) => {
    try {
        const {status} = req.body;
        const app = await Application.findById(req.params.id).populate("job")
        if(!app) return res.status(404).json({message:"Not found"})

        if(app.job.company.toString() !== req.user._id.toString())
            return res.status(403).json({message:"Not authorised to update the status"})

        app.status = status;
        await app.save();

        res.json({message:"Status updated successfully", status: app.status});

    } catch (err) {
        return res.status(500).json({ message: err.message })
    }
}