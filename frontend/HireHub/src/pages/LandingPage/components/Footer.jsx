import React from 'react'
import {Briefcase} from 'lucide-react'

const Footer = () => {
  return (
<footer className="bg-gray-100 text-gray-900">
  {/* Padding around the entire footer */}
  <div className="px-6 py-16">

    {/* Limits the maximum width and centers the content */}
    <div className="max-w-6xl mx-auto">

      {/* Main footer content */}
      <div className="text-center space-y-8">

        {/* ================= Brand Section ================= */}
        <div className="space-y-4">

          {/* Logo + Website Name */}
          <div className="flex items-center justify-center gap-2">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
              <Briefcase className="w-6 h-6 text-white" />
            </div>

            <h3 className="text-2xl font-bold text-gray-800">
              HireHub
            </h3>
          </div>

          {/* Short Description */}
          <p className="text-sm text-gray-600 max-w-md mx-auto">
            Connecting talented professionals with innovative companies
            worldwide. Your career success is our mission.
          </p>

        </div>

        {/* ================= Copyright Section ================= */}
        <div className="space-y-2">

          <p className="text-sm text-gray-600">
            © {new Date().getFullYear()} Time To Program.
          </p>

          <p className="text-xs text-gray-500">
            All rights reserved. Designed and developed by Vineet
          </p>

        </div>

      </div>

    </div>

  </div>
</footer>
   
  )
}

export default Footer
