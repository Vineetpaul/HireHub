import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, SlidersHorizontal, X, Briefcase, MapPin, RefreshCw } from 'lucide-react';
import Navbar from '../../components/layout/Navbar';
import JobCard from '../../components/Cards/JobCard';
import axiosInstance from '../../utils/axiosInstance';
import { API_PATHS } from '../../utils/apiPaths';
import { CATEGORIES, JOB_TYPES } from '../../utils/data';
const JobSeekerDashboard = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userId, setUserId] = useState(null);
  const [filters, setFilters] = useState({
    keyword: '', location: '', category: '', type: '', minSalary: '', maxSalary: '',
  });
  const [showFilters, setShowFilters] = useState(false);
  const [savedJobIds, setSavedJobIds] = useState(new Set());

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      try { const payload = JSON.parse(atob(token.split('.')[1])); setUserId(payload.id); } catch { }
    }
  }, []);

  const fetchJobs = useCallback(async () => {
    setLoading(true); setError(null);
    try {
      const params = {};
      if (filters.keyword.trim()) params.keyword = filters.keyword.trim();
      if (filters.location.trim()) params.location = filters.location.trim();
      if (filters.category) params.category = filters.category;
      if (filters.type) params.type = filters.type;
      if (filters.minSalary) params.minSalary = filters.minSalary;
      if (filters.maxSalary) params.maxSalary = filters.maxSalary;
      if (userId) params.userId = userId;
      const { data } = await axiosInstance.get(API_PATHS.JOBS.GET_ALL_JOBS, { params });
      setJobs(data);
      const saved = new Set();
      data.forEach((job) => { if (job.isSaved) saved.add(job._id); });
      setSavedJobIds(saved);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch jobs.');
    } finally { setLoading(false); }
  }, [filters, userId]);

  useEffect(() => { fetchJobs(); }, [fetchJobs]);

  const handleSaveToggle = async (jobId) => {
    const token = localStorage.getItem('token');
    if (!token) { window.location.href = '/Login'; return; }
    try {
      if (savedJobIds.has(jobId)) {
        await axiosInstance.delete(API_PATHS.JOBS.UNSAVE_JOB(jobId));
        setSavedJobIds((prev) => { const n = new Set(prev); n.delete(jobId); return n; });
        setJobs((prev) => prev.map((j) => (j._id === jobId ? { ...j, isSaved: false } : j)));
      } else {
        await axiosInstance.post(API_PATHS.JOBS.SAVE_JOB(jobId));
        setSavedJobIds((prev) => new Set(prev).add(jobId));
        setJobs((prev) => prev.map((j) => (j._id === jobId ? { ...j, isSaved: true } : j)));
      }
    } catch (err) { console.error('Failed to toggle save:', err); }
  };

  const clearFilters = () => setFilters({ keyword: '', location: '', category: '', type: '', minSalary: '', maxSalary: '' });
  const hasActiveFilters = Object.values(filters).some((v) => v !== '');
return (
    <div className="min-h-screen bg-[#f7fafe]">
      <Navbar />
      <section className="pt-24 pb-8 bg-gradient-to-br from-blue-600 via-blue-700 to-purple-700">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-8">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-3">Find Your Dream Job</h1>
            <p className="text-blue-100 text-lg max-w-2xl mx-auto">Browse thousands of opportunities from top companies</p>
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="max-w-4xl mx-auto">
            <div className="bg-white rounded-2xl shadow-xl p-3">
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="flex-1 relative">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input type="text" placeholder="Search by job title, skills, or keywords..."
                    value={filters.keyword} onChange={(e) => setFilters((p) => ({ ...p, keyword: e.target.value }))}
                    onKeyDown={(e) => e.key === 'Enter' && fetchJobs()}
                    className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-700 placeholder-gray-400 transition-all" />
                </div>
                <div className="flex gap-2">
                  <div className="relative flex-1 sm:flex-initial">
                    <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input type="text" placeholder="Location..." value={filters.location}
                      onChange={(e) => setFilters((p) => ({ ...p, location: e.target.value }))}
                      onKeyDown={(e) => e.key === 'Enter' && fetchJobs()}
                      className="w-full sm:w-40 pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-700 placeholder-gray-400 transition-all" />
                  </div>
                  <button onClick={() => setShowFilters(!showFilters)}
                    className={`px-4 py-3 rounded-xl border transition-all flex items-center space-x-2 ${showFilters || hasActiveFilters ? 'bg-blue-50 border-blue-200 text-blue-600' : 'border-gray-200 text-gray-600 hover:bg-gray-50'}`}>
                    <SlidersHorizontal className="w-5 h-5" /><span className="hidden sm:inline text-sm font-medium">Filters</span>
                  </button>
                  <button onClick={fetchJobs}
                    className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-medium rounded-xl hover:from-blue-700 hover:to-purple-700 shadow-md hover:shadow-lg flex items-center space-x-2">
                    <Search className="w-5 h-5" /><span className="hidden sm:inline">Search</span>
                  </button>
                </div>
              </div>

<AnimatePresence>
                {showFilters && (
                  <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.2 }} className="overflow-hidden">
                    <div className="border-t border-gray-100 mt-3 pt-4">
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                        <div>
                          <label className="block text-xs font-medium text-gray-500 mb-1.5">Category</label>
                          <select value={filters.category} onChange={(e) => setFilters((p) => ({ ...p, category: e.target.value }))}
                            className="w-full px-3 py-2.5 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm text-gray-700 bg-white">
                            <option value="">All Categories</option>
                            {CATEGORIES.map((c) => <option key={c.value} value={c.value}>{c.label}</option>)}
                          </select>
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-gray-500 mb-1.5">Job Type</label>
                          <select value={filters.type} onChange={(e) => setFilters((p) => ({ ...p, type: e.target.value }))}
                            className="w-full px-3 py-2.5 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm text-gray-700 bg-white">
                            <option value="">All Types</option>
                            {JOB_TYPES.map((t) => <option key={t.value} value={t.value}>{t.label}</option>)}
                          </select>
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-gray-500 mb-1.5">Min Salary</label>
                          <input type="number" placeholder="$0" value={filters.minSalary}
                            onChange={(e) => setFilters((p) => ({ ...p, minSalary: e.target.value }))}
                            className="w-full px-3 py-2.5 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm text-gray-700 placeholder-gray-400" />
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-gray-500 mb-1.5">Max Salary</label>
                          <input type="number" placeholder="$500k" value={filters.maxSalary}
                            onChange={(e) => setFilters((p) => ({ ...p, maxSalary: e.target.value }))}
                            className="w-full px-3 py-2.5 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm text-gray-700 placeholder-gray-400" />
                        </div>
                      </div>
                      <div className="flex items-center justify-between mt-4">
                        <div className="flex flex-wrap gap-2">
                          {hasActiveFilters && (
                            <button onClick={clearFilters} className="flex items-center space-x-1 px-3 py-1.5 bg-red-50 text-red-600 rounded-lg text-xs font-medium hover:bg-red-100">
                              <X className="w-3 h-3" /><span>Clear All</span>
                            </button>
                          )}
                        </div>
                        <button onClick={fetchJobs} className="flex items-center space-x-1 text-sm text-blue-600 font-medium hover:text-blue-700">
                          <RefreshCw className="w-4 h-4" /><span>Apply Filters</span>
                        </button>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </div>
      </section>
<section className="py-8">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-3">
              <h2 className="text-xl font-bold text-gray-900">
                {loading ? 'Searching...' : `${jobs.length} Jobs Found`}
              </h2>
              {hasActiveFilters && <span className="px-2.5 py-1 bg-blue-50 text-blue-600 text-xs font-medium rounded-full">Filtered</span>}
            </div>
            {!loading && jobs.length > 0 && <p className="text-sm text-gray-500">Showing {jobs.length} result{ jobs.length !== 1 ? 's' : ''}</p>}
          </div>

          {loading && (
            <div className="flex flex-col items-center justify-center py-20">
              <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mb-4" />
              <p className="text-gray-500 text-sm">Loading jobs...</p>
            </div>
          )}

          {error && !loading && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-red-50 border border-red-200 rounded-2xl p-8 text-center">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Briefcase className="w-8 h-8 text-red-500" />
              </div>
              <h3 className="text-lg font-semibold text-red-700 mb-2">Oops! Something went wrong</h3>
              <p className="text-red-600 text-sm mb-4">{error}</p>
              <button onClick={fetchJobs} className="px-6 py-2.5 bg-red-600 text-white rounded-xl hover:bg-red-700 font-medium text-sm">Try Again</button>
            </motion.div>
          )}

          {!loading && !error && jobs.length === 0 && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-2xl border border-gray-100 p-12 text-center shadow-sm">
              <div className="w-20 h-20 bg-gradient-to-br from-blue-50 to-purple-50 rounded-full flex items-center justify-center mx-auto mb-6">
                <Search className="w-10 h-10 text-blue-400" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">No jobs found</h3>
              <p className="text-gray-500 mb-6 max-w-md mx-auto">Try adjusting your search filters or keywords to find more opportunities.</p>
              {hasActiveFilters && (
                <button onClick={clearFilters} className="px-6 py-2.5 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:from-blue-700 hover:to-purple-700 font-medium text-sm shadow-md">Clear Filters</button>
              )}
            </motion.div>
          )}

          {!loading && !error && jobs.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
              {jobs.map((job, index) => (
                <motion.div key={job._id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.05, duration: 0.3 }}>
                  <JobCard job={job} isSaved={savedJobIds.has(job._id)} onSaveToggle={handleSaveToggle} />
                </motion.div>
              ))}
            </div>
          )}
        </div>

</section>
    </div>
  );
};

export default JobSeekerDashboard;
