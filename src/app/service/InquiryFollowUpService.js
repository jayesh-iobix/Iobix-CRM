import { environment } from '../../environment/environment';
import httpClient from './HttpClient';

// Define the base URL for your API
const api = environment.inquiryFollowUp;

export const InquiryFollowUpService = {

  // Method to add a InquiryFollowUp
  addInquiryFollowUp: async (inquiryData) => {
    try {
      const response = await httpClient.post(`${api}/Add`, inquiryData);
      return response.data;
    } catch (error) {
      console.error('Failed to add InquiryFollowUp:', error);
      throw error;
    }
  },

   // Method to get all InquiryFollowUp
   getInquiryFollowUp: async (inquiryRegistrationId) => {
    try {
      const response = await httpClient.get(`${api}/GetAll/${inquiryRegistrationId}`); // Update 'GetAll' with actual endpoint if different
      return response.data;
    } catch (error) {
      console.error('Failed to fetch InquiryFollowUp:', error);
      throw error;
    }
  },

   // Method to get all InquiryFollowUp
   hideInquirybutton: async (inquiryRegistrationId) => {
    try {
      const response = await httpClient.get(`${api}/InquiryTakeHideAndShowPermission/${inquiryRegistrationId}`); // Update 'GetAll' with actual endpoint if different
      return response.data;
    } catch (error) {
      console.error('Failed to fetch InquiryFollowUp:', error);
      throw error;
    }
  },

//    // Methos to update InquiryFollowUp
//    updateInquiryFollowUp: async (inquiryOriginId, inquiryOriginData) => {
//     try {
//       const response = await httpClient.put(`${api}/${inquiryOriginId}`,inquiryOriginData); 
//       return response.data;
//     } catch (error) {
//       console.error('Failed to Update InquiryFollowUp:', error);
//       throw error;
//     }
//   },

//   // Methos to delete InquiryFollowUp
//   deleteInquiryFollowUp: async (inquiryOriginId ) => {
//     try {
//       const response = await httpClient.delete(`${api}/${inquiryOriginId}`); 
//       return response.data;
//     } catch (error) {
//       console.error('Failed to Delete InquiryFollowUp:', error);
//       throw error;
//     }
//   },
  
//   // Method to get single InquiryFollowUp
//   getByIdInquiryFollowUp: async (inquiryOriginId) => {
//     try {
//       const response = await httpClient.get(`${api}/${inquiryOriginId}`); // Update 'GetAll' with actual endpoint if different
//       return response.data;
//     } catch (error) {
//       console.error('Failed to fetch InquiryFollowUp:', error);
//       throw error;
//     }
//   },
 
};