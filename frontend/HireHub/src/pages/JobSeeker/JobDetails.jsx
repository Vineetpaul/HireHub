import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ArrowLeft, MapPin, DollarSign, Clock, Briefcase,
  Bookmark, BookmarkCheck, Send, Loader, Building2
} from 'lucide-react';
import moment from 'moment';
import Navbar from '../../components/layout/Navbar';
import axiosInstance from '../../utils/axiosInstance';
import { API_PATHS } from '../../utils/apiPaths';

const JobDetails = () => {
  const { jobId } = useParams();
  const navigate = useNavigate();

  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [user, setUser] = useState(null);
  const [applying, setApplying] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  // Decode user from token
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        setUser(payload);
      } catch { }
    }
  }, []);

  // Fetch job details
  useEffect(() => {
    const fetchJob = async () => {
      setLoading(true);
      try {
        const params = {};
        if (user) params.userId = user.id;
        const { data } = await axiosInstance.get(API_PATHS.JOBS.GET_JOB_BY_ID(jobId), { params });
        setJob(data);
        setIsSaved(data.isSaved || false);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load job details');
      } finally {
        setLoading(false);
      }
    };
    if (jobId) fetchJob();
  }, [jobId, user]);

  // Handle Apply
  const handleApply = async () => {
    if (!user) { navigate('/Login'); return; }
    if (!job || job.applicationStatus) return;
    setApplying(true);
    try {
      await axiosInstance.post(API_PATHS.APPLICATIONS.APPLY_TO_JOB(jobId));
      setJob(prev => ({ ...prev, applicationStatus: 'Applied' }));
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to apply');
    } finally {
      setApplying(false);
    }
  };

  // Handle Save/Unsave
  const handleSaveToggle = async () => {
    if (!user) { navigate('/Login'); return; }
    try {
      if (isSaved) {
        await axiosInstance.delete(API_PATHS.JOBS.UNSAVE_JOB(jobId));
        setIsSaved(false);
      } else {
        await axiosInstance.post(API_PATHS.JOBS.SAVE_JOB(jobId));
        setIsSaved(true);
      }
    } catch { }
  };

  // Color for job type badge
  const typeColor = {
    Remote: 'bg-green-100 text-green-700',
    'Full-Time': 'bg-blue-100 text-blue-700',
    'Part-Time': 'bg-orange-100 text-orange-700',
    Contract: 'bg-purple-100 text-purple-700',
    Internship: 'bg-pink-100 text-pink-700',
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-[#f7fafe]">
        <Navbar />
        <div className="flex items-center justify-center h-screen">
          <div className="text-center">
            <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4" />
            <p className="text-gray-500">Loading job details...</p>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-[#f7fafe]">
        <Navbar />
        <div className="container mx-auto px-4 pt-28 text-center">
          <p className="text-red-500 mb-4">{error}</p>
          <Link to="/find-jobs" className="text-blue-600 hover:underline">? Back to jobs</Link>
        </div>
      </div>
    );
  }

  if (!job) return null;

  return (
    <div className="min-h-screen bg-[#f7fafe]">
      <Navbar />
      <main className="container mx-auto px-4 pt-24 pb-12">
        {/* Back button */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 mb-6 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Back</span>
        </button>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main content - 2 columns */}
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8"
            >
              {/* Company + Job Header */}
              <div className="flex items-start justify-between mb-6">
                <div className="flex items-center space-x-4">
                  <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center">
                    {job.company?.companyLogo ? (
                      <img src={job.company.companyLogo} alt="" className="w-12 h-12 rounded-lg object-cover" />
                    ) : (
                      <Building2 className="w-7 h-7 text-blue-600" />
                    )}
                  </div>
                  <div>
                    <h1 className="text-2xl font-bold text-gray-900 mb-1">{job.title}</h1>
                    <p className="text-gray-600">
                      {job.company?.companyName || job.company?.name || 'Unknown Company'}
                    </p>
                  </div>
                </div>
                {/* Save button */}
                <button
                  onClick={handleSaveToggle}
                  className={`p-2.5 rounded-xl transition-all ${isSaved ? 'bg-blue-50 text-blue-600' : 'bg-gray-50 text-gray-400 hover:text-blue-600'}`}
                >
                  {isSaved ? <BookmarkCheck className="w-5 h-5" /> : <Bookmark className="w-5 h-5" />}
                </button>
              </div>
              {/* Tags */}
              <div className="flex flex-wrap gap-2 mb-6">
                {job.type && (
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${typeColor[job.type] || 'bg-gray-100 text-gray-700'}`}>
                    {job.type}
                  </span>
                )}
                {job.category && (
                  <span className="px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-600">
                    {job.category}
                  </span>
                )}
                {job.applicationStatus && (
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${typeColor[job.type] || 'bg-gray-100 text-gray-700'}`}>
                    {job.applicationStatus}
                  </span>
                )}
              </div>
              {/* Meta info */}
              <div className="flex flex-wrap gap-4 text-sm text-gray-500 mb-8 pb-6 border-b border-gray-100">
                {job.location && (
                  <span className="flex items-center space-x-1.5">
                    <MapPin className="w-4 h-4" /><span>{job.location}</span>
                  </span>
                )}
                {(job.salaryMin || job.salaryMax) && (
                  <span className="flex items-center space-x-1.5">
                    <DollarSign className="w-4 h-4" />
                    <span className="font-medium text-gray-700">
                       - 
                    </span>
                  </span>
                )}
                {job.createdAt && (
                  <span className="flex items-center space-x-1.5">
                    <Clock className="w-4 h-4" /><span>Posted {moment(job.createdAt).fromNow()}</span>
                  </span>
                )}
              </div>
              {/* Description */}
              <div className="mb-8">
                <h2 className="text-lg font-semibold text-gray-900 mb-3">Description</h2>
                <p className="text-gray-600 leading-relaxed whitespace-pre-wrap">{job.description}</p>
              </div>
              {/* Requirements */}
              {job.requirements && (
                <div>
                  <h2 className="text-lg font-semibold text-gray-900 mb-3">Requirements</h2>
                  <p className="text-gray-600 leading-relaxed whitespace-pre-wrap">{job.requirements}</p>
                </div>
              )}
            </motion.div>
          </div>
          {/* Sidebar - 1 column */}
          <div className="lg:col-span-1">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sticky top-28"
            >
              {/* Apply section */}
              {user?.role === 'jobSeeker' && !job.applicationStatus && (
                <button
                  onClick={handleApply}
                  disabled={applying}
                  className="w-full py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-medium rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all shadow-md flex items-center justify-center space-x-2"
                >
                  {applying ? (
                    <><Loader className="w-5 h-5 animate-spin" /><span>Applying...</span></>
                  ) : (
                    <><Send className="w-5 h-5" /><span>Apply Now</span></>
                  )}
                </button>
              )}
              {job.applicationStatus === 'Applied' && (
                <div className="w-full py-3 bg-blue-50 text-blue-700 font-medium rounded-xl text-center">
                  ? Application Submitted
                </div>
              )}
              {!user && (
                <button
                  onClick={() => navigate('/Login')}
                  className="w-full py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-medium rounded-xl hover:from-blue-700 hover:to-purple-700 shadow-md"
                >
                  Login to Apply
                </button>
              )}
              {user?.role === 'employer' && (
                <p className="text-center text-gray-500 text-sm py-3">
                  Employers can view applications from their dashboard
                </p>
              )}
              {/* Quick info */}
              <div className="mt-6 space-y-4 text-sm">
                <div className="flex items-center space-x-3 text-gray-600">
                  <Briefcase className="w-4 h-4 text-gray-400" />
                  <span>{job.type || 'Not specified'}</span>
                </div>
                {job.location && (
                  <div className="flex items-center space-x-3 text-gray-600">
                    <MapPin className="w-4 h-4 text-gray-400" />
                    <span>{job.location}</span>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default JobDetails;


