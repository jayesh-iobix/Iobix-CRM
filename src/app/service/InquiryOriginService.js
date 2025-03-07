import { environment } from '../../environment/environment';
import httpClient from './HttpClient';

// Define the base URL for your API
const api = environment.inquiryOrigin;

export const InquiryOriginService = {

  // Method to add a InquiryOrigin
  addInquiryOrigin: async (inquiryOriginData) => {
    try {
      const response = await httpClient.post(`${api}/Add`, inquiryOriginData);
      return response.data;
    } catch (error) {
      console.error('Failed to add InquiryOrigin:', error);
      throw error;
    }
  },

   // Method to get all InquiryOrigin
   getInquiryOrigin: async () => {
    try {
      const response = await httpClient.get(`${api}/GetAll`); // Update 'GetAll' with actual endpoint if different
      return response.data;
    } catch (error) {
      console.error('Failed to fetch InquiryOrigin:', error);
      throw error;
    }
  },

   // Methos to update InquiryOrigin
   updateInquiryOrigin: async (inquiryOriginId, inquiryOriginData) => {
    try {
      const response = await httpClient.put(`${api}/${inquiryOriginId}`,inquiryOriginData); 
      return response.data;
    } catch (error) {
      console.error('Failed to Update InquiryOrigin:', error);
      throw error;
    }
  },

  // Methos to delete InquiryOrigin
  deleteInquiryOrigin: async (inquiryOriginId ) => {
    try {
      const response = await httpClient.delete(`${api}/${inquiryOriginId}`); 
      return response.data;
    } catch (error) {
      console.error('Failed to Delete InquiryOrigin:', error);
      throw error;
    }
  },
  
  // Method to get single InquiryOrigin
  getByIdInquiryOrigin: async (inquiryOriginId) => {
    try {
      const response = await httpClient.get(`${api}/${inquiryOriginId}`); // Update 'GetAll' with actual endpoint if different
      return response.data;
    } catch (error) {
      console.error('Failed to fetch InquiryOrigin:', error);
      throw error;
    }
  },
 
};