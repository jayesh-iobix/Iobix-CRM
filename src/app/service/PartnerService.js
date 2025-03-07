import axios from 'axios';
import { environment } from '../../environment/environment';
import httpClient from './HttpClient';

// Define the base URL for your API
const api = environment.partner;

export const PartnerService = {

  // Method to add a Partner
  addPartner: async (partnerData) => {
    try {
      const response = await axios.post(`${api}/Add`, partnerData);
      return response.data;
    } catch (error) {
      console.error('Failed to add Partner:', error);
      throw error;
    }
  },

  // Method to get all Partner 
   getPartner: async () => {
    try {
      const response = await httpClient.get(`${api}/GetAll`); // Update 'GetAll' with actual endpoint if different
      return response.data;
    } catch (error) {
      console.error('Failed to fetch Partner:', error);
      throw error;
    }
  },

   // Methos to update Partner 
   updatePartner: async (partnerRegistrationId, partnerData) => {
    try {
      const response = await httpClient.put(`${api}/${partnerRegistrationId}`,partnerData); 
      return response.data;
    } catch (error) {
      console.error('Failed to Update Partner:', error);
      throw error;
    }
  },

  // Methos to delete Partner 
  deletePartner: async (partnerRegistrationId) => {
    try {
      const response = await httpClient.delete(`${api}/${partnerRegistrationId}`); 
      return response.data;
    } catch (error) {
      console.error('Failed to Delete Partner:', error);
      throw error;
    }
  },
  
  // Method to get Partner by id 
  getByIdPartner: async (partnerRegistrationId) => {
    try {
      const response = await httpClient.get(`${api}/${partnerRegistrationId}`); 
      return response.data;
    } catch (error) {
      console.error('Failed to fetch Partner:', error);
      throw error;
    }
  },
 
};