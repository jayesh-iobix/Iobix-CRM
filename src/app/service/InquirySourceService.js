import axios from 'axios';
import { environment } from '../../environment/environment';
import httpClient from './HttpClient';

// Define the base URL for your API
const api = environment.inquirySource;

export const InquirySourceService = {

  // Method to add a InquirySource
  addInquirySource: async (inquirySourceData) => {
    try {
      const response = await httpClient.post(`${api}/Add`, inquirySourceData);
      return response.data;
    } catch (error) {
      console.error('Failed to add InquirySource:', error);
      throw error;
    }
  },

   // Method to get all InquirySource
   getInquirySource: async () => {
    try {
      const response = await axios.get(`${api}/GetAll`); // Update 'GetAll' with actual endpoint if different
      return response.data;
    } catch (error) {
      console.error('Failed to fetch InquirySource:', error);
      throw error;
    }
  },

   // Methos to update Employee
   updateInquirySource: async (inquirySourceId, inquirySourceData) => {
    try {
      const response = await httpClient.put(`${api}/${inquirySourceId}`,inquirySourceData); 
      return response.data;
    } catch (error) {
      console.error('Failed to Update InquirySource:', error);
      throw error;
    }
  },

  // Methos to delete InquirySource
  deleteInquirySource: async (inquirySourceId) => {
    try {
      const response = await httpClient.delete(`${api}/${inquirySourceId}`); 
      return response.data;
    } catch (error) {
      console.error('Failed to Delete InquirySource:', error);
      throw error;
    }
  },
  
  // Method to get single InquirySource
  getByIdInquirySource: async (inquirySourceId) => {
    try {
      const response = await httpClient.get(`${api}/${inquirySourceId}`); // Update 'GetAll' with actual endpoint if different
      return response.data;
    } catch (error) {
      console.error('Failed to fetch InquirySource:', error);
      throw error;
    }
  },
 
};