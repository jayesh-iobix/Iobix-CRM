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
      console.error('Failed to SignIn:', error);
      throw error;
    }
  },

  // Method to Forgot Password
  forgotPassword: async (signInData) => {
    try {
      const response = await httpClient.post(`${api}/ForgotPassword`, signInData);
      return response.data;
    } catch (error) {
      console.error('Failed to Reset Password:', error);
      throw error;
    }
  },

  // Method to Reset Password
  resetPassword: async (signInData) => {
    try {
      const response = await httpClient.post(`${api}/ResetPassword`, signInData);
      // If login is successful, the response will contain a token
      // if (response.status === 1 && response.data && response.data.token) {
      //   // Store the JWT token in session storage (or local storage if needed)
      //   sessionStorage.setItem('token', response.data.token);
      // }
      return response.data;
    } catch (error) {
      console.error('Failed to ResetPassword :', error);
      throw error;
    }
  },

  getBasicDetail: async () => {
    try {
      const response = await httpClient.get(`${api}/GetBasicDetail`);
      return response.data;
    } catch (error) {
      console.error('Failed to add department:', error);
      throw error;
    }
  },
  
};
