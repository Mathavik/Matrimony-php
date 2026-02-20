
import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: 'http://localhost/Matrimony-php/backend',
  headers: {
    'Content-Type': 'application/json',
  },
});

axiosInstance.interceptors.request.use((req) => {
  const token = localStorage.getItem('adminToken'); // important change
  if (token && req.headers) {
    req.headers['Authorization'] = `Bearer ${token}`;
  }
  return req;
});

export default axiosInstance;
