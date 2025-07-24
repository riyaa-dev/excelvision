
import axios from "axios";
import { store } from "../app/store"; 


const axiosInstance = axios.create({
  baseURL: "http://localhost:5000/api",
});

axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
},

(error) => Promise.reject(error)

);



export default axiosInstance;
