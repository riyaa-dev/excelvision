import React from "react";
import {useSelector} from "react-redux";
import { Navigate } from "react-router-dom"; // ✅ Correct package name


const ProtectedRoute = ({children})=>{

    const {token} = useSelector((state)=>state.auth);
    return  token ? children : <Navigate to = '/'/>;

} ;

export default ProtectedRoute;