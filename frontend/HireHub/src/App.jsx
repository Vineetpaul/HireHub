import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate
} from 'react-router-dom';

import { Toaster } from 'react-hot-toast';
import LandingPage from './pages/LandingPage/LandingPage';
import Login from './pages/Auth/Login';
import SignUp from './pages/Auth/SignUp';
import JobSeekerDashboard from './pages/JobSeeker/JobSeekerDashboard';
import JobDetails from './pages/JobSeeker/JobDetails';
import SavedJobs from './pages/JobSeeker/SavedJobs';
import EmployerDashboard from './pages/Employer/EmployerDashboard';
import ManageJobs from './pages/Employer/ManageJobs';
import UserProfile from './pages/JobSeeker/UserProfile';
import JobPostingForm from './pages/Employer/JobPostingForm';
import ApplicationViewer from './pages/Employer/ApplicationViewer';
import EmployProfilePage from './pages/Employer/EmployProfilePage';
import ProtectedRoutes from './routes/ProtectedRoutes';

const App = () => {
  return (
    <div >

      {/* creating routes for the Landing , signup and login pages and also handling the all routes by redirecting them to the Landing page */}
      <Router>
        <Routes>
          {/* public routes */}
          <Route path='/' element={<LandingPage />} />
          <Route path='/signup' element={<SignUp />} />
          <Route path='/Login' element={<Login />} />
          <Route path='/find-jobs' element={<JobSeekerDashboard />} />
          <Route path='/job/:jobId' element={<JobDetails />} />
          <Route path='saved-jobs' element={<SavedJobs />} />
          <Route path='/profile' element={<UserProfile />} />

          {/* Creating some protected routes */}
          <Route element={<ProtectedRoutes requiredRole='employer' />} />
          <Route path='/employer/dashboard' element={<EmployerDashboard />} />
          <Route path='/post-job' element={<JobPostingForm />} />
          <Route path='/manage-jobs' element={<ManageJobs />} />
          <Route path='applicants' element={<ApplicationViewer />} />
          <Route path='company-profile' element={<EmployProfilePage />} />

          {/* Handle All routes */}
          <Route path='*' element={<Navigate to='/' replace />} />
        </Routes>
      </Router>

      {/* --------------------------------------------------------------------------------------- */}

      <Toaster
        toasterOptions={{
          className: '',
          style: {
            fontSize: '13px',
          }
        }
        }

      />



    </div>
  )
}

export default App
