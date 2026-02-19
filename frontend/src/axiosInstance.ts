// import axios from 'axios';
// const axiosInstance = axios.create({
//   // Keep baseURL as server root — route paths in the frontend include `/api` already.
//   baseURL: 'http://localhost:5000',
//   headers: {
//     'Content-Type': 'application/json',
//   },
// });


// axiosInstance.interceptors.request.use(
//   (req) => {
//     const token = localStorage.getItem('token');
//     if (token && req.headers) {
//       req.headers['Authorization'] = `Bearer ${token}`;
//     }
//     return req;
//   },
// );
// export default axiosInstance;
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
