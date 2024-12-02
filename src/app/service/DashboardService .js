import { environment } from '../../environment/environment';
import httpClient from './HttpClient';

// Define the base URL for your API
const api = environment.dashboard;

export const DashboardService = {

  // Method to get Dashboard Count 
  getDashboardCount: async () => {
    try {
      const response = await httpClient.get(`${api}/DashboardCount`); // Update 'GetAll' with actual endpoint if different
      return response.data;
    } catch (error) {
      console.error('Failed to fetch Dashboard Count:', error);
      throw error;
    }
  }

};