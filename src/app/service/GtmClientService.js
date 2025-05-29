import { environment } from '../../environment/environment';
import httpClient from './HttpClient';

// Define the base URL for your API
const api = environment.gtmClient;

export const GtmClientService = {
  // Method to add a gtm client
  addGtmClient: async (gtmClientData) => {
    try {
      const response = await httpClient.post(`${api}/Add`, gtmClientData);
      return response.data;
    } catch (error) {
      console.error('Failed to add gtm client:', error);
      throw error;
    }
  },

  // Method to get all gtm client
  getGtmClient: async () => {
    try {
      const response = await httpClient.get(`${api}/GetAll`); // Update 'GetAll' with actual endpoint if different
      return response.data;
    } catch (error) {
      console.error('Failed to fetch gtm client:', error);
      throw error;
    }
  },

  // Method to get by id gtm client
  getByIdGtmClient: async (gtmClientServiceId) => {
    try {
      const response = await httpClient.get(`${api}/${gtmClientServiceId}`); // Update 'GetAll' with actual endpoint if different
      return response.data;
    } catch (error) {
      console.error('Failed to fetch gtm client:', error);
      throw error;
    }
  },

  // Method to update gtm client
  updateGtmClient: async (gtmClientServiceId,gtmClientData) => {
    try {
      const response = await httpClient.put(`${api}/${gtmClientServiceId}`,gtmClientData); 
      return response.data;
    } catch (error) {
      console.error('Failed to update gtm client:', error);
      throw error;
    }
  },

  // Method to delete gtm client
  deleteGtmClient: async (gtmClientServiceId) => {
    try {
      const response = await httpClient.delete(`${api}/${gtmClientServiceId}`); 
      return response.data;
    } catch (error) {
      console.error('Failed to delete gtm client:', error);
      throw error;
    }
  },
  
};
