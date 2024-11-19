import axios from 'axios';
import { environment } from '../../environment/environment';
import httpClient from './HttpClient';

// Define the base URL for your API
const api = environment.auth;

export const AuthService = {

  // Method to Login
  signIn: async (signInData) => {
    try {
      const response = await httpClient.post(`${api}/SignIn`, signInData);
      // If login is successful, the response will contain a token
      if (response.status === 1 && response.data && response.data.token) {
        // Store the JWT token in session storage (or local storage if needed)
        sessionStorage.setItem('token', response.data.token);
      }
      return response.data;
    } catch (error) {
      console.error('Failed to add department:', error);
      throw error;
    }
  },
  
};
