
// src/services/axiosClient.js
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const axiosClient = axios.create({
  baseURL: 'https://api.example.com', // Replace with your API endpoint
  timeout: 10000,
});

// Add a request interceptor
axiosClient.interceptors.request.use(
  config => {
    // Check for token in localStorage
    const token = localStorage.getItem('token'); // Change 'token' to your key name
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  error => Promise.reject(error)
);

// Add a response interceptor
axiosClient.interceptors.response.use(
  response => {
    return response;
  },
  error => {
    const navigate = useNavigate()

    if (error.response) {
      const { status } = error.response;

      if (status === 401) {
        localStorage.removeItem('access_token');
        navigate('/login');
      }

      // Handle other status codes as needed
      if (status === 403) {
        // Handle forbidden access
        navigate('/forbidden');
      }

      // Add more status handling as required...
    }
    return Promise.reject(error);
  }
);

export default axiosClient;


