import React from 'react'
import { employerFeatures, jobSeekersFeatures } from '../../../utils/data'
import { motion } from 'framer-motion'
const Features = () => {
    return (
        <section className="flex items-center justify-center pt-10 pb-16 min-h-screen">
            <div className='container mx-auto px-4'>
                <div className="max-w-4xl mx-auto text-center">

                    <motion.h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight mb-6 pt-10"
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                    >Everything You Need To
                        <span className="block bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mt-2"> Succeed</span></motion.h1>

                    {/* craeting Subheading */}
                    <motion.p className="text-xl md:text-xl text-gray-600 mb-10 leading-relaxed max-w-2xl mx-auto "
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2, duration: 0.8 }}>
                        Whether you're a job seeker or an employer, HireHub provides the tools and resources you need to achieve your goals. Explore our features and discover how we can help you succeed in your career or business.
                    </motion.p>
                </div>

                {/* creating features */}
                <div className="grid md:grid-cols-2 gap-16 lg:gap-24">
                    {/* creating jobSeeker  */}
                    <div className="">
                        <div className="text-center mb-12">
                            <h3 className="text-gray-900 font-bold text-2xl mb-4">For JobSeekers</h3>
                            <div className="w-24 h-1 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full mx-auto"></div>
                        </div>
                        <div className="space-y-8" >
                            {jobSeekersFeatures.map((feature, index) => (
                                <div className="group flex items-start space-x-4 p-4 rounded-xl hover:bg-blue-50 transition-all duration-300 cursor-pointer" key={index}>
                                    <div className="flex-shrink-0 w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center group-hover:bg-blue-200 transition-all duration-300">
                                        <feature.icon className='w-6 h-6 text-blue-500'></feature.icon>
                                    </div>
                                    <div className="">
                                        <h1 className="text-xl font-semibold text-gray-900 mb-2 ">{feature.title}</h1>
                                        <p className="text-gray-600 leading-relaxed">{feature.description}</p>
                                    </div>


                                </div>
                            ))}

                        </div>


                    </div>

                    {/* creating Employer side */}
                   
                     <div className="">
                        <div className="text-center mb-12">
                            <h3 className="text-gray-900 font-bold text-2xl mb-4">For Employer</h3>
                            <div className="w-24 h-1 bg-gradient-to-r from-purple-500 to-purple-600 rounded-full mx-auto"></div>
                        </div>
                        <div className="space-y-8" >
                            {employerFeatures.map((feature, index) => (
                                <div className="group flex items-start space-x-4 p-4 rounded-xl hover:bg-purple-100 transition-all duration-300 cursor-pointer" key={index}>
                                    <div className="flex-shrink-0 w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center group-hover:bg-purple-300 transition-all duration-300">
                                        <feature.icon className='w-6 h-6 text-purple-500'></feature.icon>
                                    </div>
                                    <div className="">
                                        <h1 className="text-xl font-semibold text-gray-900 mb-2 ">{feature.title}</h1>
                                        <p className="text-gray-600 leading-relaxed">{feature.description}</p>
                                    </div>


                                </div>
                            ))}

                        </div>


                    </div>
                </div>
            </div>
        </section>
    )
}

export default Features
