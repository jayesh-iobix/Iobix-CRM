import axios from 'axios';
import { environment } from '../../environment/environment';
import httpClient from './HttpClient';

// Define the base URL for your API
const api = environment.clientCompany;

export const ClientCompanyService = {

  // Method to add a Client Company Registration
  addClientCompany: async (companyData) => {
    try {
      const response = await axios.post(`${api}/Add`, companyData);
      return response.data;
    } catch (error) {
      console.error('Failed to add Client Company:', error);
      throw error;
    }
  },

   // Method to get all Client Company
   getClientCompany: async () => {
    try {
      const response = await httpClient.get(`${api}/GetAll`); // Update 'GetAll' with actual endpoint if different
      return response.data;
    } catch (error) {
      console.error('Failed to fetch Client Company:', error);
      throw error;
    }
  },

   // Methos to update Client Company
   updateClientCompany: async (clientRegistrationId, companyData) => {
    try {
      const response = await httpClient.put(`${api}/${clientRegistrationId}`,companyData); 
      return response.data;
    } catch (error) {
      console.error('Failed to Update Client Company:', error);
      throw error;
    }
  },

  // Methos to delete Client Company
  deleteClientCompany: async (clientRegistrationId) => {
    try {
      const response = await httpClient.delete(`${api}/${clientRegistrationId}`); 
      return response.data;
    } catch (error) {
      console.error('Failed to Delete Client Company:', error);
      throw error;
    }
  },
  
  // Method to get Client Company by  id
  getByIdClientCompany: async (clientRegistrationId) => {
    try {
      const response = await httpClient.get(`${api}/${clientRegistrationId}`); // Update 'GetAll' with actual endpoint if different
      return response.data;
    } catch (error) {
      console.error('Failed to fetch Client Company:', error);
      throw error;
    }
  },
 
};