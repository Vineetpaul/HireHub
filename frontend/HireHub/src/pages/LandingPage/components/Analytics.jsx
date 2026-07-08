import React from 'react'
import { motion } from 'framer-motion'
import { TrendingUp, Briefcase, User, Target } from 'lucide-react'

const Analytics = () => {

    const stats = [
        { icon: User, title: "Activer Users", value: '2.4M+', growth: '+15%', bgClass: 'bg-blue-100', textClass: 'text-blue-600' },
        { icon: Briefcase, title: "Job Portal", value: '150k+', growth: '+22%', bgClass: 'bg-purple-100', textClass: 'text-purple-600' },
        { icon: Target, title: "Successful Hires", value: '89k+', growth: '+18%', bgClass: 'bg-green-100', textClass: 'text-green-600' },
        { icon: TrendingUp, title: "Match Rate", value: '94%', growth: '+8%', bgClass: 'bg-orange-100', textClass: 'text-orange-600' },
    ]

    return (
        <section className=" overflow-hidden">
            <div className="container mx-auto p-4">
                <motion.h1 className="text-center mb-8 text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight mb-6 pt-10"
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                >Platform
                    <span className="block bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mt-2"> Analytics</span></motion.h1>

                {/* craeting Subheading */}
                <motion.p className="text-center text-xl md:text-xl text-gray-600 mb-10 leading-relaxed max-w-2xl mx-auto"
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2, duration: 0.8 }}>
                    Real-Time insight and data driven result that show case that showcase the power of our plateform in connecting talent with opportunities
                </motion.p>

                {/* creating stats cards*/}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
                    {stats.map((stat, index)=>(
                        <motion.div className="bg-white p-6 rounded-2xl shadow-md hover:shadow-lg transition-all duration-300"
                        key={index}
                        initial={{opacity:0, y:30}}
                        whileInView={{opacity:1 , y:0}}
                        transition={{delay:index*0.1,duration:0.6}}
                        viewport={{once:true}}
                        >
                            <div className="flex items-center justify-between mb-4  ">
                                <div className={`w-12 h-12 ${stat.bgClass} rounded-xl flex items-center justify-center`}>
                                    <stat.icon className={`w-6 h-6 ${stat.textClass}`}></stat.icon>
                                
                                </div>
                                <span className='text-green-500 bg-green-50 rounded-xl px-2 py-1 text-sm font-semibold'>{stat.growth}</span>
                            </div>
                            <h3 className="text-2xl font-bold mb-2 text-gray-900">{stat.value}</h3>
                            <p className="text-sm text-gray-600">{stat.title}</p>

                        </motion.div>

                    ))}
                    
                </div>
            </div>
        </section>
    )
}

export default Analytics
