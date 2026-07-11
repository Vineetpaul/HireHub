import { useState } from 'react'
import { motion } from 'framer-motion'
import { validateEmail, validatePassword, validateAvatar } from '../../utils/helper'
import {
  Mail,
  Lock,
  Upload,
  Eye,
  EyeOff,
  UserCheck,
  Building2,
  CheckCircle,
  AlertCircle,
  Loader,
  User,
} from 'lucide-react'

const SignUp = () => {

  // defining states For the form fields
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    role: '',
    avatar: null,
  });

  const [formState, setFormState] = useState({
    loading: false,
    errors: {},
    showPassword: false,
    avatarPreview: null,
    success: false
  });

  // handling input changes here

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));

    // clear errors when user starts typing
    if (formState.errors[name]) {
      setFormState(prev => ({
        ...prev,
        errors: {
          ...prev.errors,
          [name]: ''
        }
      }));
    }
  };

  // handling Validation here
  const handleRoleChange = (role) => {
  setFormData((prev) => ({
    ...prev,
    role,
  }));

  if (formState.errors.role) {
    setFormState((prev) => ({
      ...prev,
      errors: {
        ...prev.errors,
        role: "",
      },
    }));
  }
};
// handling Avatar changes
  const handleAvatarChange = (e) => {
  const file = e.target.files[0];

  if (file) {
    const error = validateAvatar(file);

    if (error) {
      setFormState((prev) => ({
        ...prev,
        errors: {
          ...prev.errors,
          avatar: error,
        },
      }));
      return;
    }

    setFormData((prev) => ({
      ...prev,
      avatar: file,
    }));

    // Create Preview
    const reader = new FileReader();

    reader.onload = (e) => {
      setFormState((prev) => ({
        ...prev,
        avatarPreview: e.target.result,
        errors: {
          ...prev.errors,
          avatar: "",
        },
      }));
    };

    reader.readAsDataURL(file);
  }
};
// handling form submission
   const handleSubmit = async (e) => {
    e.preventDefault();
    if(!validateForm()){
      return;
    }
    setFormState(prev=>({...prev, loading:true, errors:{}}));

    try{
      // Simulating an API call with a timeout
    }
    catch(error){
      setFormState(prev=>({...prev, loading:false, errors:{submit:error.response?.data?.message||'Registration failed. Please try again.'}}));
    }
    
  };

  const validateForm = () => {
const errors = {
  fullName: !formData.fullName ? "Enter you Name" : "",
  email: validateEmail(formData.email),
  password: validatePassword(formData.password),
  role: !formData.role ? "Please select an Role" : "",
  avatar : "",
}
Object.keys(errors).forEach((key)=>{
  if(!errors[key]) delete errors[key]
})

setFormState((prev)=>({...prev,errors}));
return Object.keys(errors).length === 0;
  };

  if (formState.success) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4 bg-gray-50">
        <motion.div className="bg-white rounded-xl p-8 shadow-lg max-w-md w-full text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}>
          <CheckCircle className="w-12 h-12 text-green-500 animate-bounce mx-auto "></CheckCircle>
          <h2 className="text-2xl font-bold text-gray-900 ml-4">Account Created!</h2>
          <p className="text-green-600 text-lg font-semibold ml-4 mb-2">Welcome to HireHub your account has been successfully created</p>

          <div className="animate-spin w-5 h-5 rounded-full border-2 mb-2 border-blue-500 mx-auto border-t-transparent " />
          <p className="text-gray-600 text-sm">Redirecting to your dashboard...</p>

        </motion.div>
      </div>
    )
  }


  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-gray-100 py-8">
      <motion.div className="max-w-md w-full bg-white rounded-2xl px-4 py-6 shadow-lg"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}>
        <div className="text-center mb-8">
          <h1 className="font-bold text-xl text-gray-900 mb-2 bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent">Create Account</h1>
          <p className="text-gray-600 text-sm">Join thousands of proffesionals finding their dream jobs</p>

        </div>
        <form className="space-y-6" onSubmit={handleSubmit}>
          {/* creating full name section */}
          <div className="">
            {/* Email section */}
            <label className="text-sm font-medium text-gray-600 mb-2 block">
              Full Name *
            </label>
            <div className="relative">
              <User className="absolute w-5 h-5 text-gray-500 left-3 top-1/2 -translate-y-1/2"></User>
              <input type="text"
                name="fullName"
                value={formData.fullName}
                onChange={handleInputChange}
                placeholder="Enter your full name"
                className={`w-full pl-10 pr-4 py-3 rounded-xl border ${formState.errors.fullName ? 'border-red-500' : 'border-gray-300'
                  } focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors`} />
            </div>
            {formState.errors.fullName && (
              <p className="text-sm text-red-700 flex items-center">
                <AlertCircle className="w-4 h-4 mr-1"></AlertCircle>
                {formState.errors.fullName}
              </p>
            )}
          </div>

          {/* creating email Input */}
          <div className="">
            {/* Email section */}
            <label className="text-sm font-medium text-gray-600 mb-2 block">
              Email Address *
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

          {/* creating password setion here */}
          <div className="">
            {/* password section */}
            <label className="text-sm font-medium text-gray-600 mb-2 block">
              Password *
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

          {/* creating Avatar Section here */}

          <div className="">
            <label className="text-sm font-medium text-gray-600 mb-2 block">
              Profile Picture / Optional
            </label>
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center overflow-hidden ">
                {formState.avatarPreview ? (
                  <img src={formState.avatarPreview} alt="Avatar Preview" className="w-full h-full object-cover" />)
                  : (<User className="w-8 h-8 text-gray-400"></User>)}

              </div>
              <div className="flex-1">
                <input type="file"
                  id="avatarInput"
                  name="avatar"
                  accept=".jpg,.jpeg,.png"
                  onChange={handleAvatarChange}
                  className="hidden" />
                <label htmlFor="avatarInput" className="cursor-pointer text-gray-500 text-sm font-medium  flex items-center border border-gray-300 rounded-lg px-4 py-2 hover:bg-gray-50 transition-color space-x-2 ">
                  <Upload className="w-4 h-4 "></Upload>
                  Upload Avatar
                </label>
                <p className="text-sm text-gray-500">JPG, PNG upto 2mb</p>
              </div>
            </div>
            {formState.errors.avatar && (
              <p className="text-sm text-red-500 mt-1 flex items-center">
                <AlertCircle className="w-4 h-4 mr-1"></AlertCircle>
                {formState.errors.avatar}
              </p>
            )}
          </div>

          {/* role selection */}

          <div className="">
            <label className="text-gray-600 font-medium mb-2 text-sm block">
              I am a*
            </label>
            {/* For job seekers */}


            <div className="grid grid-cols-2 gap-4">
              <button type="button"
                onClick={() => handleRoleChange('jobSeeker')}
                className={`p-4 rounded-lg border-2 transition-all ${formData.role === 'jobSeeker' ? 'border-blue-500 bg-blue-50 text-blue-700'
                  : 'border-gray-200  hover:border-gray-300'}`}>
                <UserCheck className="mx-auto mb-2 w-5 h-5 "></UserCheck>
                <div className="font-medium">Job Seeker</div>
                <div className="text-sm text-gray-500 ">Looking for opportunity</div>
              </button>


              {/* For Employer */}
              <button type="button"
                onClick={() => handleRoleChange('employer')}
                className={`p-4 rounded-lg border-2 transition-all ${formData.role === 'employer' ? 'border-blue-500 bg-blue-50 text-blue-700'
                  : 'border-gray-200  hover:border-gray-300'}`}>
                <Building2 className="mx-auto mb-2 w-5 h-5"></Building2>
                <div className="font-medium">Employer</div>
                <div className="text-sm text-gray-500">Hiring Talent</div>
              </button>
            </div>

            {formState.errors.role && (
              <p className='text-red-500 text-sm mt-2 flex items-center'>
                <AlertCircle className="w-4 h-4 mr-1"></AlertCircle>
                {formState.errors.role}
              </p>
            )}
          </div>

          {/* submit error */}
          {formState.errors.submit && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3">
              <p className="text-sm text-red-700 flex items-center">
                <AlertCircle className="w-4 h-4 mr-1"></AlertCircle>
                {formState.errors.submit}
              </p>
            </div>
          )}

          {/* Submit button */}
          <button type="submit"
            className="w-full bg-gradient-to-r from-blue-500 to-purple-500 text-white font-semibold px-3 py-2 rounded-xl hover:from-blue-600 hover:to-purple-600 transition-colors duration-300 flex items-center justify-center shadow-md hover:shadow-lg"
            disabled={formState.loading}>
            {formState.loading ? <><Loader className="w-5 h-5 animate-spin"></Loader>
              <span>Registering User...</span></> : (<span>Create Account</span>)}
          </button>

          {/* do not have an account */}
          <div className="text-center">
            <p className="text-gray-600">
              Already have an account?{' '} <a href="/Login" className="text-blue-500 font-medium hover:text-blue-700 transition-colors duration-200">Sign in here</a>
            </p>
          </div>


        </form>
      </motion.div>

    </div>
  )
}

export default SignUp
