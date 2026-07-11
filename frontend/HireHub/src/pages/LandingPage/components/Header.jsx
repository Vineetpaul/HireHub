import { motion } from 'framer-motion'
import { Briefcase } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

const Header = () => {
  const isAuthenticated = false;
  const user = { fullName: 'John Doe', role: 'jobseeker' };
  const navigate = useNavigate();

  return (
    <motion.header 
    className='bg-white shadow-md fixed top-0 left-0 w-full z-50'
    initial={{opacity:0, y:-20}}
    animate={{opacity:1, y:0}}
    transition={{duration:0.5}}>
      <div className='container mx-auto px-4'>
        <div className='flex items-center justify-between h-16'>
          {/* Logo creation */}
          <div className='flex items-center space-x-3'>
            <div className='w-8 h-8 flex items-center justify-center bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg'>
            <Briefcase className='text-2xl text-white' />
            </div>
            <span className='text-xl font-bold text-gray-900'>HireHub</span>
          </div>
          {/* Navigation links */}
          <nav className='hidden md:flex items-center space-x-6'>
            <a className='text-lg text-gray-700 hover:text-gray-900 font-medium transition-colors duration-300 cursor-pointer'
              onClick={() => navigate('/find-jobs')}
            >Find Job</a>
            <a className='text-lg text-gray-700 hover:text-gray-900 font-medium transition-colors duration-300 cursor-pointer'
              onClick={() => navigate(isAuthenticated && user?.role === 'employer'
                ? '/employer/dashboard'
                : '/Login')}
            >For Employers</a>
          </nav>
          {/* Authentication buttons */}
          <div className='text-lg flex items-center space-x-4'>
            {isAuthenticated ? (
              <div className='flex items-center space-x-4'>
                <span className=''>Welcome. {user?.fullName}</span>
                <a className='bg-gradient-to-r from-blue-600 to-purple-600 text-white font-medium px-4 py-2 rounded-lg hover:from-blue-700 hover:to-purple-700 transition-colors duration-300 cursor-pointer shadow-sm hover:shadow-md'
                  href={
                    user?.role === 'employer'
                      ? '/employer/dashboard'
                      : '/find-jobs'
                  }>Dashboard</a>
              </div>
            ) : (
              <>
                <a className='text-gray-500 hover:text-gray-900 px-4 py-2 hover:bg-gray-300 rounded-lg font-medium transition-colors duration-300 cursor-pointer shadow-sm hover:shadow-md'
                  href='/Login'>Login</a>
                <a className='bg-gradient-to-r from-blue-600 to-purple-600 text-white font-medium px-3 py-2 rounded-lg hover:from-blue-700 hover:to-purple-700 transition-colors duration-300 cursor-pointer shadow-sm hover:shadow-md'
                  href='/signup'>Sign Up</a>

              </>
            )}
          </div>
        </div>
      </div>
    </motion.header>
  )
}

export default Header
