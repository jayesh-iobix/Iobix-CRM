import axios from 'axios';
import { environment } from '../../environment/environment';
import httpClient from './HttpClient';

// Define the base URL for your API
const api = environment.designation;

export const DesignationService = {
  // Method to add a department
  addDesignation: async (designationData) => {
    try {
      const response = await httpClient.post(`${api}/Add`, designationData);
      return response.data;
    } catch (error) {
      console.error('Failed to add department:', error);
      throw error;
    }
  },

  // Method to get all departments
  getDesignation: async () => {
    try {
      const response = await httpClient.get(`${api}/GetAll`); // Update 'GetAll' with actual endpoint if different
      return response.data;
    } catch (error) {
      console.error('Failed to fetch departments:', error);
      throw error;
    }
  },
  
};
