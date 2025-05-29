import axios from 'axios';
import { environment } from '../../environment/environment';
import httpClient from './HttpClient';

// Define the base URL for your API
const api = environment.gtmConnection;

export const GtmConnectionService = {
  // Method to add a gtm connection
  addGtmConnection: async (gtmConnectionData) => {
    try {
      const response = await httpClient.post(`${api}/Add`, gtmConnectionData);
      return response.data;
    } catch (error) {
      console.error('Failed to add gtm connection:', error);
      throw error;
    }
  },

  // Method to get all gtm connection
  getGtmConnection: async () => {
    try {
      const response = await httpClient.get(`${api}/GetAll`); // Update 'GetAll' with actual endpoint if different
      return response.data;
    } catch (error) {
      console.error('Failed to fetch gtm connection:', error);
      throw error;
    }
  },

  // Method to get by id gtm connection
  getByIdGtmConnection: async (gtmInvoiceConnectionId) => {
    try {
      const response = await httpClient.get(`${api}/${gtmInvoiceConnectionId}`); 
      return response.data;
    } catch (error) {
      console.error('Failed to fetch gtm connection:', error);
      throw error;
    }
  },

  // Method to update gtm connection
  updateGtmConnection: async (gtmInvoiceConnectionId,gtmConnectionData) => {
    try {
      const response = await httpClient.put(`${api}/${gtmInvoiceConnectionId}`,gtmConnectionData); 
      return response.data;
    } catch (error) {
      console.error('Failed to update gtm connection:', error);
      throw error;
    }
  },

  // Method to delete a gtm connection
  deleteGtmConnection: async (gtmInvoiceConnectionId) => {
    try {
      const response = await httpClient.delete(`${api}/${gtmInvoiceConnectionId}`); 
      return response.data;
    } catch (error) {
      console.error('Failed to delete gtm connection:', error);
      throw error;
    }
  },
  
};
