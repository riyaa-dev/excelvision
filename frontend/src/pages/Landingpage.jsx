import React from 'react';
import { useNavigate } from 'react-router-dom';

const Landing = () => {
  const navigate = useNavigate();

  return (
    <section className="relative bg-white overflow-hidden h-screen flex items-center justify-center">
      {/* Background SVG Wave */}
      <div className="absolute top-0 left-0 w-full z-0">
        <svg viewBox="0 0 1440 320" className="w-full h-auto">
          <path
            fill="#e5e5e5"
            fillOpacity="1"
            d="M0,64L48,80C96,96,192,128,288,133.3C384,139,480,117,576,101.3C672,85,768,75,864,101.3C960,128,1056,192,1152,192C1248,192,1344,128,1392,96L1440,64V320H0Z"
          ></path>
        </svg>
      </div>

      {/* Foreground Content */}
      <div className="relative z-10 flex flex-col items-center justify-center px-6 text-center">
        <h1 className="text-5xl font-extrabold text-gray-900 mb-4 border-b-2 border-gray-400 pb-2">
          Excel Analytics Platform
        </h1>
        <p className="text-lg text-gray-700 max-w-2xl mb-8">
          Upload, parse, and visualize Excel data with ease. Dive into insights, view upload history, and track trends with interactive charts.
        </p>

        <div className="flex flex-col sm:flex-row gap-4">
          <button
            onClick={() => navigate('/login')}
            className="border border-blue-800 text-blue-800 px-6 py-3 rounded-full font-semibold hover:bg-blue-100 transition"
          >
            Login
          </button>
          <button
            onClick={() => navigate('/register')}
            className="bg-blue-800 text-white px-6 py-3 rounded-full font-semibold hover:bg-blue-900 transition"
          >
            Register
          </button>
        </div>
      </div>
    </section>
  );
};

export default Landing;
