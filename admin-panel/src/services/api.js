import axios from 'axios';

// Base API configuration (direct connect to local backend port 3000)
const API = axios.create({
  baseURL: `http://${window.location.hostname}:3000/api/admin`,
});

// Automatically inject Authorization token if present in localStorage
API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('adminToken');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default API;
