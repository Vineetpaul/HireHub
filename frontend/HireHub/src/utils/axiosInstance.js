import axios from "axios";
export const BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";


// creating instance for the axios:-

const axiosInstance = axios.create({
    baseURL : BASE_URL,
    timeout: 80000,
    headers:{
        'Content-Type':'application/json',
        Accept:'application/json'
    }
})

// creating request interceptor:-

axiosInstance.interceptors.request.use(
    (config)=>{
        const accessToken = localStorage.getItem('token');
        if(accessToken){
        config.headers.Authorization = `Bearer ${accessToken}`;
        }
        return config;

    },
    (error)=>{
        return Promise.reject(error)
    }
)

// creating response interceptor

axiosInstance.interceptors.response.use(
    (response)=>{
        return response
    },
    (error)=>{
        if(error.response){
            if(error.response.status === 401){
                window.location.href='/'
            }
            else if(error.response.status === 500){
                console.log("Server error please try again later")
            }
        }
        else if(error.code === 'ECONNABORTED'){
            console.error('Request Timeout: please try again later')
        }
        return Promise.reject(error)
    }
)

export default axiosInstance