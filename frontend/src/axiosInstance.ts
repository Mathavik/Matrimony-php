import axios from 'axios';
const axiosInstance = axios.create({
  // Point to local PHP backend (XAMPP). Frontend routes include `/api/...`.
  baseURL: 'http://localhost/Matrimony-php/backend',
  headers: {
    'Content-Type': 'application/json',
  },
});


axiosInstance.interceptors.request.use(
  (req) => {
    const token = localStorage.getItem('token');
    if (token && req.headers) {
      req.headers['Authorization'] = `Bearer ${token}`;
    }
    return req;
  },
);
export default axiosInstance;
