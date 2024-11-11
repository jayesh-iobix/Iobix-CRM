import axios from 'axios';
import { environment } from '../../environment/environment';

// Define the base URL for your API
const api = environment.auth;

export const AuthService = {

  // Method to Admin Login
  signInAdmin: async (signInData) => {
    try {
      const response = await axios.post(`${api}/SignIn`, signInData);
      return response.data;
    } catch (error) {
      console.error('Failed to add department:', error);
      throw error;
    }
  },
  
};
