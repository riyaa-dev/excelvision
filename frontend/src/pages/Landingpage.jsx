import React from 'react';
import { useNavigate } from 'react-router-dom';

const Landing = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
      <h1 className="text-4xl font-bold mb-8">Welcome to Excel Analytics Platform</h1>

      <div className="space-x-4">
        <button 
          onClick={() => navigate('/login')} // or 
          className="bg-blue-600 text-white px-6 py-2 rounded"
        >
          Login
        </button>

        <button 
          onClick={() => navigate('/register')}
          className="bg-green-600 text-white px-6 py-2 rounded"
        >
          Register
        </button>
      </div>
    </div>
  );
};

export default Landing;
