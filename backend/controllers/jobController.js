const Job = require('../models/Job');
const Application = require('../models/Application');
const SavedJobs = require('../models/SavedJob');
const mongoose = require('mongoose');

const escapeRegex = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

exports.createJob = async (req, res) => {
    try {
        if (req.user.role !== "employer")
            return res.status(403).json({ message: "Only employers can post jobs" });

        const job = await Job.create({ ...req.body, company: req.user._id })
        res.status(201).json(job);

    } catch (err) {
        res.status(500).json({ message: err.message })
    }
}


exports.getJobs = async (req, res) => {
    const {
        keyword,
        location,
        category,
        type,
        minSalary,
        maxSalary,
    } = req.query;

    if (
        (keyword !== undefined && typeof keyword !== "string") ||
        (location !== undefined && typeof location !== "string") ||
        (category !== undefined && typeof category !== "string") ||
        (type !== undefined && typeof type !== "string")
    ) {
        return res.status(400).json({ message: "Invalid job filters" });
    }

    const minSalaryValue = minSalary === undefined || minSalary === "" ? undefined : Number(minSalary);
    const maxSalaryValue = maxSalary === undefined || maxSalary === "" ? undefined : Number(maxSalary);
    if (
        (minSalaryValue !== undefined && (!Number.isFinite(minSalaryValue) || minSalaryValue < 0)) ||
        (maxSalaryValue !== undefined && (!Number.isFinite(maxSalaryValue) || maxSalaryValue < 0)) ||
        (minSalaryValue !== undefined && maxSalaryValue !== undefined && minSalaryValue > maxSalaryValue)
    ) {
        return res.status(400).json({ message: "Invalid salary range" });
    }

    const query = {
        isClosed: false,
        ...(keyword && { title: { $regex: escapeRegex(keyword), $options: "i" } }),
        ...(location && { location: { $regex: escapeRegex(location), $options: "i" } }),
        ...(category && { category }),
        ...(type && { type }),
    }

    if (minSalaryValue !== undefined || maxSalaryValue !== undefined) {
        query.$and = [];

        if (minSalaryValue !== undefined) {
            query.$and.push({ salaryMax: { $gte: minSalaryValue } });
        }
        if (maxSalaryValue !== undefined) {
            query.$and.push({ salaryMin: { $lte: maxSalaryValue } });
        }
        if (query.$and.length === 0) {
            delete query.$and;
        }
    }
    try {
        const jobs = await Job.find(query).populate(
            "company",
            "name companyName companyLogo"
        );

        let savedJobIds = [];
        let appliedJobStatusMap = {};

        if (req.user?.role === "jobSeeker") {
            // Saved Jobs
            const savedJobs = await SavedJobs.find({ jobseeker: req.user._id }).select("job");
            savedJobIds = savedJobs.map((s) => String(s.job));

            // Applications
            const applications = await Application.find({ applicant: req.user._id }).select("job status");

            applications.forEach((app) => {
                appliedJobStatusMap[String(app.job)] = app.status;
            });
        }

        // Add isSaved and applicationStatus to each job
        const jobsWithExtras = jobs.map((job) => {
            const jobIdStr = String(job._id);

            return {
                ...job.toObject(),
                isSaved: savedJobIds.includes(jobIdStr),
                applicationStatus: appliedJobStatusMap[jobIdStr] || null,
            };
        });

        return res.status(200).json(jobsWithExtras);

    } catch (error) {
        return res.status(500).json({
            message: error.message
        });
    }

}

exports.getJobsEmployer = async (req, res) => {
    try {

        const userId = req.user._id;
        const { role } = req.user;

        if (role !== "employer") {
            return res.status(403).json({ message: "Access denied" })
        }
        // get all jobs posted by employer

        const jobs = await Job.find({ company: userId }).populate("company", "name companyName companyLogo")
            .lean();

        const jobsWithApplicationCount = await Promise.all(
            jobs.map(async (job) => {
                const countApplication = await Application.countDocuments({ job: job._id });
                return {
                    ...job,
                    countApplication
                };
            })
        );

        res.status(200).json(jobsWithApplicationCount);

    } catch (err) {
        res.status(500).json({ message: err.message })
    }
}


exports.getJobById = async (req, res) => {
    try {
        if (!mongoose.isValidObjectId(req.params.id)) {
            return res.status(400).json({ message: "Invalid job ID" });
        }

        const job = await Job.findById(req.params.id).populate(
            "company",
            "name companyName companyLogo"
        );

        if (!job) {
            return res.status(404).json({
                message: "Job not found"
            });
        }

        let applicationStatus = null;
        let isSaved = false;
        if (req.user?.role === "jobSeeker") {
            const [application, savedJob] = await Promise.all([
                Application.findOne({ job: job._id, applicant: req.user._id }).select("status"),
                SavedJobs.exists({ job: job._id, jobseeker: req.user._id }),
            ]);
            applicationStatus = application?.status || null;
            isSaved = Boolean(savedJob);
        }

        res.json({
            ...job.toObject(),
            applicationStatus,
            isSaved,
        });
    } catch (err) {
        res.status(500).json({ message: err.message })
    }
}


exports.updateJob = async (req, res) => {
    try {
        if (!mongoose.isValidObjectId(req.params.id)) {
            return res.status(400).json({ message: "Invalid job ID" });
        }
        const job = await Job.findById(req.params.id);
        if (!job) return res.status(404).json({ message: "Job not found" });

        if (job.company.toString() !== req.user._id.toString())
            return res.status(403).json({ message: "Not authorized to update this job" })

        const editableFields = [
            "title",
            "description",
            "requirements",
            "location",
            "category",
            "type",
            "salaryMin",
            "salaryMax",
        ];
        editableFields.forEach((field) => {
            if (req.body[field] !== undefined) job[field] = req.body[field];
        });
        const update = await job.save();
        res.json(update);

    } catch (err) {
        res.status(500).json({ message: err.message })
    }
}

exports.deleteJob = async (req, res) => {
    try {
        if (!mongoose.isValidObjectId(req.params.id)) {
            return res.status(400).json({ message: "Invalid job ID" });
        }
        const job = await Job.findById(req.params.id)
        if (!job) return res.status(404).json({ message: "Job not found" })

        if (job.company.toString() !== req.user._id.toString())
            return res.status(403).json({ message: "Not authorized to delete the job" })

        await job.deleteOne();
        res.json({ message: "Job deleted successfully" })

    } catch (err) {
        res.status(500).json({ message: err.message })
    }
}


exports.toggleCloseJob = async (req, res) => {
    try {
        if (!mongoose.isValidObjectId(req.params.id)) {
            return res.status(400).json({ message: "Invalid job ID" });
        }
        const job = await Job.findById(req.params.id)
        if(!job) 
            return res.status(404).json({message:"Job not found"})

        if(job.company.toString() !== req.user._id.toString())
            return res.status(403).json({message:"Not authorized to close the job"})

        job.isClosed = !job.isClosed;
        await job.save();
        res.json({message: `Job ${job.isClosed ? "closed" : "opened"} successfully`})


    } catch (err) {
        res.status(500).json({ message: err.message })
    }
}