import { useEffect, useState } from 'react';
import { Bookmark, Search } from 'lucide-react';
import { Link } from 'react-router-dom';
import Navbar from '../../components/layout/Navbar';
import JobCard from '../../components/Cards/JobCard';
import axiosInstance from '../../utils/axiosInstance';
import { API_PATHS } from '../../utils/apiPaths';

const SavedJobs = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [actionError, setActionError] = useState('');
  const [removing, setRemoving] = useState(new Set());
  const [reload, setReload] = useState(0);

  useEffect(() => {
    let active = true;
    const fetchSavedJobs = async () => {
      try {
        const { data } = await axiosInstance.get(API_PATHS.JOBS.GET_SAVED_JOBS);
        if (active) setJobs(data.filter((savedJob) => savedJob.job).map((savedJob) => savedJob.job));
      } catch (err) {
        if (active) setError(err.response?.data?.message || 'Failed to load saved jobs.');
      } finally {
        if (active) setLoading(false);
      }
    };
    fetchSavedJobs();
    return () => { active = false; };
  }, [reload]);

  const retryFetch = () => {
    setLoading(true);
    setError('');
    setReload((current) => current + 1);
  };

  const handleUnsave = async (jobId) => {
    if (removing.has(jobId)) return;
    setRemoving((current) => new Set(current).add(jobId));
    setActionError('');
    try {
      await axiosInstance.delete(API_PATHS.JOBS.UNSAVE_JOB(jobId));
      setJobs((current) => current.filter((job) => job._id !== jobId));
    } catch (err) {
      setActionError(err.response?.data?.message || 'Could not remove this saved job. Please try again.');
    } finally {
      setRemoving((current) => {
        const next = new Set(current);
        next.delete(jobId);
        return next;
      });
    }
  };

  return (
    <div className="min-h-screen bg-[#f7fafe]">
      <Navbar />
      <main className="container mx-auto px-4 pb-12 pt-24 sm:px-6 lg:px-8">
        <div className="mb-7">
          <h1 className="text-3xl font-bold text-gray-900">Saved Jobs</h1>
          <p className="mt-1 text-gray-500">Keep track of opportunities you want to explore.</p>
        </div>

        {actionError && (
          <p role="alert" className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {actionError}
          </p>
        )}

        {loading ? (
          <div className="py-20 text-center">
            <div className="mx-auto mb-4 h-10 w-10 animate-spin rounded-full border-4 border-blue-200 border-t-blue-600" />
            <p className="text-sm text-gray-500">Loading saved jobs...</p>
          </div>
        ) : error ? (
          <div role="alert" className="rounded-2xl border border-red-200 bg-white p-8 text-center">
            <p className="mb-4 text-red-600">{error}</p>
            <button onClick={retryFetch} className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700">
              Try again
            </button>
          </div>
        ) : jobs.length === 0 ? (
          <div className="rounded-2xl border border-gray-100 bg-white px-6 py-14 text-center shadow-sm">
            <Bookmark className="mx-auto mb-4 h-10 w-10 text-blue-400" />
            <h2 className="text-xl font-semibold text-gray-900">No saved jobs yet</h2>
            <p className="mx-auto mt-2 max-w-md text-gray-500">
              Save jobs that interest you and they will be easy to find here.
            </p>
            <Link to="/find-jobs" className="mt-6 inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-blue-700">
              <Search className="h-4 w-4" />
              Browse jobs
            </Link>
          </div>
        ) : (
          <>
            <p className="mb-4 text-sm text-gray-500">{jobs.length} saved {jobs.length === 1 ? 'job' : 'jobs'}</p>
            <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
              {jobs.map((job) => (
                <JobCard key={job._id} job={job} isSaved onSaveToggle={handleUnsave} />
              ))}
            </div>
          </>
        )}
      </main>
    </div>
  );
};

export default SavedJobs;
