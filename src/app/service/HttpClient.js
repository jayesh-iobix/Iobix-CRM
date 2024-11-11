// src/services/httpClient.js
import axios from 'axios';
import { environment } from '../../environment/environment';

// Create an axios instance with base configurations
const httpClient = axios.create({
  baseURL: environment.apiBaseUrl, // Replace with your API base URL
});

// Add a request interceptor to set the Authorization header
httpClient.interceptors.request.use(
  (config) => {
    // Retrieve token from storage
    const token = sessionStorage.getItem('token') || localStorage.getItem('token');
    if (token) {
      // Set the Authorization header
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default httpClient;
