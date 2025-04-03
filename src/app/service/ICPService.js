import axios from 'axios';
import { environment } from '../../environment/environment';
import httpClient from './HttpClient';

// Define the base URL for your API
const api = environment.icp;

export const ICPService = {

  // Method to add a ICP
  addICP: async (icpData) => {
    try {
      // debugger;
      const response = await axios.post(`${api}/Add`, icpData);
      return response.data;
    } catch (error) {
      console.error('Failed to add icp:', error);
      throw error;
    }
  },

  // Method to get all ICP
  getICP: async () => {
    try {
      const response = await httpClient.get(`${api}/GetAll`); // Update 'GetAll' with actual endpoint if different
      return response.data;
    } catch (error) {
      console.error('Failed to fetch icp:', error);
      throw error;
    }
  },

  // Method to get a ICP by ID
  getByIdICP: async (idealCustomerProfileId) => {
    try {
      const response = await httpClient.get(`${api}/${idealCustomerProfileId}`); 
      return response.data;
    } catch (error) {
      console.error('Failed to fetch icp:', error);
      throw error;
    }
  },

  // Methos to update icp
  updateICP: async (id, icpData) => {
    try {
      const response = await httpClient.put(`${api}/${id}`,icpData); 
      return response.data;
    } catch (error) {
      console.error('Failed to update ico:', error);
      throw error;
   }
  },

  // Methos to delete Employee
//   deleteEmployee: async (employeeId) => {
//     try {
//       const response = await httpClient.delete(${api}/${employeeId}); 
//       return response.data;
//     } catch (error) {
//       console.error('Failed to fetch employee:', error);
//       throw error;
//     }
//   },
  

};
