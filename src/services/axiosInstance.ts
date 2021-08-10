
import axios from 'axios';

const axiosInstance = axios.create({
    baseURL: 'https://6112596889c6d00017ac0269.mockapi.io/api/v1/',
});

export default axiosInstance;
