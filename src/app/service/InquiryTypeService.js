import { environment } from '../../environment/environment';
import httpClient from './HttpClient';

// Define the base URL for your API
const api = environment.inquiryType;

export const InquiryTypeService = {

  // Method to add a InquiryType
  addInquiryType: async (inquiryTypeData) => {
    try {
      const response = await httpClient.post(`${api}/Add`, inquiryTypeData);
      return response.data;
    } catch (error) {
      console.error('Failed to add InquiryType:', error);
      throw error;
    }
  },

   // Method to get all InquiryType
   getInquiryType: async () => {
    try {
      const response = await httpClient.get(`${api}/GetAll`); // Update 'GetAll' with actual endpoint if different
      return response.data;
    } catch (error) {
      console.error('Failed to fetch InquiryType:', error);
      throw error;
    }
  },

   // Methos to update InquiryType
   updateInquiryType: async (inquiryTypeId, inquiryTypeData) => {
    debugger;
    try {
      const response = await httpClient.put(`${api}/${inquiryTypeId}`,inquiryTypeData); 
      return response.data;
    } catch (error) {
      console.error('Failed to Update InquiryType:', error);
      throw error;
    }
  },

  // Methos to delete InquiryType
  deleteInquiryType: async (inquiryTypeId) => {
    try {
      const response = await httpClient.delete(`${api}/${inquiryTypeId}`); 
      return response.data;
    } catch (error) {
      console.error('Failed to Delete InquiryType:', error);
      throw error;
    }
  },
  
  // Method to get single InquiryType
  getByIdInquiryType: async (inquiryTypeId) => {
    try {
      const response = await httpClient.get(`${api}/${inquiryTypeId}`); // Update 'GetAll' with actual endpoint if different
      return response.data;
    } catch (error) {
      console.error('Failed to fetch InquiryType:', error);
      throw error;
    }
  },
 
};