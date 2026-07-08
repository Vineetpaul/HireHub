const Job = require('../models/Job');
const User = require('../models/User');
const Application = require('../models/Application');
const SavedJobs = require('../models/SavedJob');

exports.createJob = async (req, res) => {
    try {
        if (req.user.role !== "employer")
            return res.status(500).json({ message: "Only employer can post jobs" });

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
        userId,
    } = req.query;
    const query = {
        isClosed: false,
        ...(keyword && { title: { $regex: keyword, $options: "i" } }),
        ...(keyword && { title: { $regex: keyword, $options: "i" } }),
        ...(category && { category }),
        ...(type && { type }),
    }

    if (minSalary || maxSalary) {
        query.$and = [];

        if (minSalary) {
            query.$and.push({ salaryMax: { $gte: Number(minSalary) } });
        }
        if (maxSalary) {
            query.$and.push({ salaryMin: { $lte: Number(maxSalary) } });
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

            if (userId) {
                // Saved Jobs
                const savedJobs = await SavedJobs.find({ jobseeker: userId }).select("job");
                savedJobIds = savedJobs.map((s) => String(s.job));

                // Applications
                const applications = await Application.find({ applicant: userId }).select("job status");

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
        const {role} = req.user;

        if(role !== "employer"){
            return res.status(403).json({message:"Access deneid"})
        }
        // get all jobs posted by employer

        const jobs = Jobs.find({company:userId}).populate("name","name companyName, companyLogo")
    } catch (err) {
        res.status(500).json({ message: err.message })
    }
}


exports.getJobById = async (req, res) => {
    try {

    } catch (err) {
        res.status(500).json({ message: err.message })
    }
}


exports.updateJob = async (req, res) => {
    try {

    } catch (err) {
        res.status(500).json({ message: err.message })
    }
}

exports.deleteJob = async (req, res) => {
    try {

    } catch (err) {
        res.status(500).json({ message: err.message })
    }
}


exports.toggleCloseJob = async (req, res) => {
    try {

    } catch (err) {
        res.status(500).json({ message: err.message })
    }
}