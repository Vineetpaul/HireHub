import { motion } from 'framer-motion'
import { Mail, Lock, Eye, EyeOff, AlertCircle, Loader, CheckCircle } from 'lucide-react'
import { useState } from 'react'
import { validateEmail } from '../../utils/helper'

const Login = () => {

  // defining states For the form fields
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    remeberMe: false
  });

  const [formState, setFormState] = useState({
    loading: false,
    errors: {},
    showPassword: false,
    success: false
  });

  // creating validation functions here

  

  const validatePassword = (password) => {
    if (!password.trim()) return 'Password is required.';
    if (password.length < 6) return 'Password must be at least 6 characters long.';
    return '';
  }

  const validateForm = ()=>{
    const errors = {
      email: validateEmail(formData.email),
      password: validatePassword(formData.password)
    }
    Object.keys(errors).forEach(key=>{
      if(!errors[key])
        delete errors[key];
      });
      setFormState(prev=>({...prev, errors}));
      return Object.keys(errors).length === 0;
  }


  // handling input changes here

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));

    // clear errors when user starts typing
    if(formState.errors[name]){
      setFormState(prev => ({
        ...prev,
        errors: {
          ...prev.errors,
          [name]: ''
        }
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if(!validateForm()){
      return;
    }
    setFormState(prev=>({...prev, loading:true, errors:{}}));

    try{
      // Simulating an API call with a timeout
    }
    catch{
      setFormState(prev=>({...prev, loading:false, errors:{submit:'An error occurred. Please try again.'}}));
    }
    
  };

  if(formState.success){
    return(
    <div className="min-h-screen flex items-center justify-center px-4 bg-gray-50">
      <motion.div className="bg-white rounded-xl p-8 shadow-lg max-w-md w-full text-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}>
          <CheckCircle className="w-12 h-12 text-green-500 animate-bounce mx-auto "></CheckCircle>
          <h2 className="text-2xl font-bold text-gray-900 ml-4">Welcome Back!</h2>
          <p className="text-green-600 text-lg font-semibold ml-4 mb-2">Login Successful!</p>

          <div className="animate-spin w-5 h-5 rounded-full border-2 mb-2 border-blue-500 mx-auto border-t-transparent "/>
            <p className="text-gray-600 text-sm">Redirecting to your dashboard...</p>
          
      </motion.div>
    </div>
  )}
    


  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-gray-100">
      <motion.div className="bg-white rounded-2xl p-8 shadow-lg max-w-md w-full"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="text-center mb-8">
          <h1 className="font-bold text-xl text-gray-900 mb-2 bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent">Welcome Back!</h1>
          <p className="text-gray-600 text-sm">Sign in to your HireHub account.</p>

        </div>
        <form className="space-y-6"
          onSubmit={handleSubmit}>
          <div className="">
            {/* Email section */}
            <label className="text-sm font-medium text-gray-600 mb-2 block">
              Email Address
            </label>
            <div className="relative">
              <Mail className="absolute w-5 h-5 text-gray-500 left-3 top-1/2 -translate-y-1/2"></Mail>
              <input type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="Enter your email"
                className={`w-full pl-10 pr-4 py-3 rounded-xl border ${formState.errors.email ? 'border-red-500' : 'border-gray-300'
                  } focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors`} />
            </div>
            {formState.errors.email && (
              <p className="flex items-center text-red-500 text-sm mt-1">
                <AlertCircle className="w-4 h-4 mr-1"></AlertCircle>
                {formState.errors.email}
              </p>
            )}
          </div>

          <div className="">
            {/* password section */}
            <label className="text-sm font-medium text-gray-600 mb-2 block">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute w-5 h-5 text-gray-500 left-3 top-1/2 -translate-y-1/2"></Lock>
              <input type={formState.showPassword ? 'text' : 'password'}
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                placeholder="Enter your password"
                className={`w-full pl-10 pr-12 py-3 rounded-xl border ${formState.errors.password ? 'border-red-500' : 'border-gray-300'
                  } focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors`} />
              <button type='button'
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
                onClick={() => setFormState(prev => ({ ...prev, showPassword: !prev.showPassword }))}>
                {formState.showPassword ? <EyeOff className="w-5 h-5"></EyeOff> : <Eye className="w-5 h-5"></Eye>}
              </button>

            </div>
            {formState.errors.password && (
              <p className="flex items-center text-red-500 text-sm mt-1">
                <AlertCircle className="w-4 h-4 mr-1"></AlertCircle>
                {formState.errors.password}
              </p>
            )}
          </div>
          

          {/* submit error */}

          {formState.errors.submit && (
            <div className="border border-red-500 bg-red-100 text-red-700 px-4 py-2 rounded-md mb-4">
              <p className="text-sm flex items-center">
                <AlertCircle className="w-4 h-4 mr-1"></AlertCircle>
                {formState.errors.submit}

              </p>
            </div>
          )}

          {/* form submit button */}
          <button type="submit"
            className="w-full bg-gradient-to-r from-blue-500 to-purple-500 text-white font-semibold px-3 py-2 rounded-xl hover:from-blue-600 hover:to-purple-600 transition-colors duration-300 flex items-center justify-center shadow-md hover:shadow-lg"
            disabled={formState.loading}>
            {formState.loading ? <><Loader className="w-5 h-5 animate-spin"></Loader>
              <span>Signing in...</span></> : (<span>Sign in</span>)}
          </button>

          {/* do not have an account */}
          <div className="text-center">
            <p className="text-gray-600">
              Don't have an account?{' '} <a href="/signup" className="text-blue-500 font-medium hover:text-blue-700 transition-colors duration-200">Sign up</a>
            </p>
          </div>

        </form>



      </motion.div>
    </div>
  )
}

export default Login
