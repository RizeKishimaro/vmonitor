// src/services/axiosClient.js
import axios from 'axios';

const axiosClient = axios.create({
  baseURL: 'https://api.example.com', // Replace with your API endpoint
  timeout: 10000,
});

axiosClient.interceptors.request.use(
  config => {
    // Add token to headers if needed
    // config.headers.Authorization = `Bearer ${your_token}`;
    return config;
  },
  error => Promise.reject(error)
);

axiosClient.interceptors.response.use(
  response => response,
  error => Promise.reject(error)
);

export default axiosClient;

