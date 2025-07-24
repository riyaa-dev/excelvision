import React, { useState } from 'react';


import {useDispatch ,useSelector} from  'react-redux';
import {registerUser} from '../features/authSlice';
import { useNavigate} from 'react-router-dom';

const Register =()=>{
    const dispatch=useDispatch();
    const navigate = useNavigate(); 
    const {loading,error}=useSelector(state =>state.auth);
    const[formData,setformData]=useState({name : "", email : "" , password :""})

    const handleChange =(e)=>setformData({...formData,[e.target.name]:e.target.value});
    const handleSubmit =(e)=>{
        e.preventDefault();
        dispatch(registerUser(formData)).then(res=>{
           if (!res.error) navigate("/dashboard");

        });
    };
    
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-100 to-purple-200 px-4">
      <div className="bg-white shadow-lg rounded-lg px-10 py-10 w-full max-w-md">
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-1">Welcome!</h1>
        <p className="text-center text-gray-600 mb-6">Create your account</p>

        {error && <p className="text-red-500 text-center mb-4">{error}</p>}

        <form onSubmit={handleSubmit} className="space-y-5">
          <input
            name="name"
            placeholder="Name"
            value={formData.name}
            onChange={handleChange}
            className="w-full px-4 py-3 rounded border border-gray-300 text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
          <input
            name="email"
            type="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            className="w-full px-4 py-3 rounded border border-gray-300 text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
          <input
            name="password"
            type="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            className="w-full px-4 py-3 rounded border border-gray-300 text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
          <button
            type="submit"
            className="w-full bg-purple-600 hover:bg-purple-700 text-white py-3 rounded transition"
          >
            {loading ? 'Creating Account...' : 'Register'}
          </button>
        </form>

        <div className="mt-6 text-center text-gray-700">
          Already have an account?{' '}
          <span
            onClick={() => navigate('/login')}
            className="text-purple-600 hover:underline cursor-pointer"
          >
            Login
          </span>
        </div>
      </div>
    </div>
  );

};

export default Register;