import axios from 'axios';


const axiosInstance = axios.create({
    baseURL: 'https://public-infrastructure-issue-server.vercel.app' 
});

const useAxios = () => {
    return axiosInstance;
};

export default useAxios;