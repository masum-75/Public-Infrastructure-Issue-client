import axios from 'axios';
import { useEffect } from 'react';
import useAuth from './useAuth';
import { useNavigate } from 'react-router';

const axiosSecure = axios.create({ 
    baseURL: 'http://localhost:5000' 
});

const useAxiosSecure = () => {
    const { user, logOut } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
     
        const reqInterceptor = axiosSecure.interceptors.request.use(
            async (config) => {
                
                if (user) {
                    const token = await user.getIdToken();
                    config.headers.Authorization = `Bearer ${token}`;
                }
                return config;
            }, 
            (error) => {
                return Promise.reject(error);
            }
        );

      
        const resInterceptor = axiosSecure.interceptors.response.use(
            (response) => {
                return response;
            }, 
            async (error) => {
                const status = error.response?.status;
                const message = error.response?.data?.message;
                
           
                if (status === 403 && message === 'user is blocked') {
                 
                    await logOut();
                    navigate('/login');
                    return Promise.reject(error);
                }

              
                if (status === 401 || status === 403) {
                    await logOut();
                    navigate('/login');
                }
                return Promise.reject(error);
            }
        );

       
        return () => {
            axiosSecure.interceptors.request.eject(reqInterceptor);
            axiosSecure.interceptors.response.eject(resInterceptor);
        };
    }, [user, logOut, navigate]);

    return axiosSecure;
};

export default useAxiosSecure;