import axios from 'axios';

const axiosInstance = axios.create({
  //baseURL: 'http://localhost:5001', // local
  baseURL: 'http://16.176.219.14', // live EC2 via Nginx
  headers: { 'Content-Type': 'application/json' },
});

export default axiosInstance;