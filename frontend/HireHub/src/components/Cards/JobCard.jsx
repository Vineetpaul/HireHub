import { motion } from 'framer-motion';
import { MapPin, Briefcase, Clock, DollarSign, Bookmark, BookmarkCheck, ExternalLink } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import moment from 'moment';

const JobCard = ({ job, onSaveToggle, isSaved }) => {
  const navigate = useNavigate();

  const salaryDisplay = job.salaryMin || job.salaryMax
    ? `$${job.salaryMin?.toLocaleString() || '0'} - $${job.salaryMax?.toLocaleString() || '∞'}`
    : null;

  const typeColors = {
    'Remote': 'bg-green-100 text-green-700',
    'Full-Time': 'bg-blue-100 text-blue-700',
    'Part-Time': 'bg-orange-100 text-orange-700',
    'Contract': 'bg-purple-100 text-purple-700',
    'Internship': 'bg-pink-100 text-pink-700',
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="bg-white rounded-2xl shadow-sm hover:shadow-md border border-gray-100 p-6 transition-all duration-300 cursor-pointer group"
      onClick={() => navigate(`/job/${job._id}`)}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1 min-w-0">
          {/* Company info */}
          <div className="flex items-center space-x-3 mb-3">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center flex-shrink-0">
              {job.company?.companyLogo ? (
                <img src={job.company.companyLogo} alt="" className="w-8 h-8 rounded-lg object-cover" />
              ) : (
                <Briefcase className="w-5 h-5 text-blue-600" />
              )}
            </div>
            <div className="min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">
                {job.company?.companyName || job.company?.name || 'Unknown Company'}
              </p>
            </div>
          </div>

          {/* Job Title */}
          <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors duration-200 line-clamp-1">
            {job.title}
          </h3>

          {/* Tags */}
          <div className="flex flex-wrap items-center gap-2 mb-3">
            {job.type && (
              <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${typeColors[job.type] || 'bg-gray-100 text-gray-700'}`}>
                {job.type}
              </span>
            )}
            {job.category && (
              <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-600">
                {job.category}
              </span>
            )}
          </div>

          {/* Details */}
          <div className="flex flex-wrap items-center gap-3 text-sm text-gray-500">
            {job.location && (
              <span className="flex items-center space-x-1">
                <MapPin className="w-3.5 h-3.5" />
                <span>{job.location}</span>
              </span>
            )}
            {salaryDisplay && (
              <span className="flex items-center space-x-1">
                <DollarSign className="w-3.5 h-3.5" />
                <span className="font-medium text-gray-700">{salaryDisplay}</span>
              </span>
            )}
            <span className="flex items-center space-x-1">
              <Clock className="w-3.5 h-3.5" />
              <span>{moment(job.createdAt).fromNow()}</span>
            </span>
          </div>
        </div>

        {/* Save button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onSaveToggle?.(job._id);
          }}
          className={`p-2 rounded-lg transition-all duration-200 flex-shrink-0 ${
            isSaved
              ? 'bg-blue-50 text-blue-600 hover:bg-blue-100'
              : 'text-gray-400 hover:text-blue-600 hover:bg-blue-50'
          }`}
        >
          {isSaved ? (
            <BookmarkCheck className="w-5 h-5" />
          ) : (
            <Bookmark className="w-5 h-5" />
          )}
        </button>
      </div>

      {/* Application status badge */}
      {job.applicationStatus && (
        <div className="mt-4 pt-3 border-t border-gray-100">
          <span className={`inline-flex items-center space-x-1 text-xs font-medium px-2.5 py-1 rounded-full ${
            job.applicationStatus === 'Accepted' ? 'bg-green-100 text-green-700' :
            job.applicationStatus === 'Rejected' ? 'bg-red-100 text-red-700' :
            job.applicationStatus === 'In Review' ? 'bg-yellow-100 text-yellow-700' :
            'bg-blue-100 text-blue-700'
          }`}>
            <ExternalLink className="w-3 h-3" />
            <span>{job.applicationStatus}</span>
          </span>
        </div>
      )}
    </motion.div>
  );
};

export default JobCard;