import { motion } from 'framer-motion'
import { Search, ArrowRight, Users, Building2, TrendingUp } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

const Hero = () => {

    const navigate = useNavigate();

    const isAuthenticated = true;
    const user = { fullName: 'John Doe', role: 'employer' };

    const stats = [
        { icon: Users, label: "Active Users", Value: "2.4M" },
        { icon: Building2, label: "Companies", Value: "500K" },
        { icon: TrendingUp, label: "Tranding Jobs", Value: "120K" },
    ];

    return (
        <section className="flex items-center justify-center pt-10 pb-16 min-h-screen">
            <div className='container mx-auto px-4'>
                <div className="max-w-4xl mx-auto text-center">

                    <motion.h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight mb-6 pt-10"
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                    >Find Your Dream Job or
                        <span className="block bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mt-2"> Perfect Hire</span></motion.h1>

                    {/* craeting Subheading */}
                    <motion.p className="text-xl md:text-xl text-gray-600 mb-10 leading-relaxed max-w-2xl mx-auto "
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2, duration: 0.8 }}>
                        Connect Talented Professionals with innovative Companies.
                        Your next career move or perfect canditate is just a click away.
                    </motion.p>

                    {/* creating CTA buttons */}
                    <motion.div className="flex justify-center flex-col sm:flex-row mb-15 gap-4 items-center "
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4, duration: 0.8 }}>
                        <motion.button className="group bg-gradient-to-r from-blue-500 to-purple-500 text-semibold text-white px-8 py-2 rounded-lg flex items-center space-x-2 hover:from-blue-600 hover-purple-600 transition-colors duration-300 shadow-lg hover:shadow-xl"
                            WhileHover={{ scale: 1.08 }}
                            WhileTap={{ scale: 0.95 }}
                            onClick={() => navigate('/find-jobs')}>
                            <Search className="w-5 h-5" />
                            <span className="text-lg">Find Jobs</span>
                            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                        </motion.button>

                        {/* creating a job posting button */}
                        <motion.button className="group bg-gradient-to-r from-blue-500 to-purple-500 text-semibold text-white px-8 py-2 rounded-lg flex items-center space-x-2 hover:from-blue-600 hover-purple-600 transition-colors duration-300 shadow-lg hover:shadow-xl"
                            WhileHover={{ scale: 1.08 }}
                            WhileTap={{ scale: 0.95 }}
                            onClick={() => navigate(isAuthenticated && user?.role === "employer" ? '/employer/dashboard' : '/Login')}>
                            <span className="text-lg">Post a Job</span>
                            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                        </motion.button>


                    </motion.div>

                    {/* creating stats  */}
                    <motion.div className="grid grid-cols-1 md:grid-cols-3 gap-3 max-w-2xl mx-auto"
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.6, duration: 0.8 }}>
                        {stats.map((stat, index) => (
                            <motion.div className="flex flex-col items-center space-y-2 p-4 rounded-xl bg-gradient-to-r hover:from-blue-100 hover:to-purple-100 duration-300 transition-colors shadow-md hover:shadow-lg"
                                key={index}
                                initial={{ opacity: 0, y: 30 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.6 + index * 0.1, duration: 0.8 }}>
                                <div className="w-12 h-12 flex items-center justify-center bg-gradient-to-r from-blue-100 to-purple-100 rounded-lg shadow-md mb-2">
                                    <stat.icon className="w-6 h-6 text-blue-500" />
                                </div>
                                <div className="font-bold text-gray-900 text-xl">{stat.Value}</div>
                                <div className="font-medium text-gray-700 text-sm">{stat.label}</div>
                            </motion.div>

                        

                        ))}

                    </motion.div>

                </div>
            </div>

            

        </section>
    )
}

export default Hero
