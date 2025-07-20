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
    <div className="max-w-md mx-auto mt-10 bg-white p-6 rounded shadow">
      <h2 className="text-2xl font-bold mb-4">Register</h2>
      {error && <p className="text-red-500">{error}</p>}
      <form onSubmit={handleSubmit} className="space-y-4">
        <input name="name" placeholder="Name" onChange={handleChange} className="w-full border p-2 rounded" />
        <input name="email" placeholder="Email" onChange={handleChange} className="w-full border p-2 rounded" />
        <input type="password" name="password" placeholder="Password" onChange={handleChange} className="w-full border p-2 rounded" />
        <button className="bg-blue-500 text-white py-2 px-4 rounded w-full">{loading ? 'Loading...' : 'Register'}</button>
      </form>
    </div>
  );
};

export default Register;