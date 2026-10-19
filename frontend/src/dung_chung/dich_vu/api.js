import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to attach JWT token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor to handle token expiry / errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Clear token if unauthorized on protected endpoints
      if (!window.location.pathname.includes('/dang-nhap') && !window.location.pathname.includes('/dang-ky')) {
        localStorage.removeItem('token');
        localStorage.removeItem('nguoiDung');
        window.location.href = '/dang-nhap';
      }
    }
    return Promise.reject(error);
  }
);

export default api;
