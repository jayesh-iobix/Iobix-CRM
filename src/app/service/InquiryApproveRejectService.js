import { environment } from '../../environment/environment';
import httpClient from './HttpClient';

// Define the base URL for your API
const api = environment.inquiryApproveReject;

export const InquiryApproveRejectService = {

  // Method to add a InquiryApproveReject
  addInquiryApproveReject: async (inquiryData) => {
    try {
      const response = await httpClient.post(`${api}/Add`, inquiryData);
      return response.data;
    } catch (error) {
      console.error('Failed to add InquiryApproveReject:', error);
      throw error;
    }
  },

  // Method to add a final approval InquiryApproveReject
  addFinalInquiryApproveReject: async (inquiryData) => {
    try {
      const response = await httpClient.post(`${api}/AddFinalApproval`, inquiryData);
      return response.data;
    } catch (error) {
      console.error('Failed to add FinalApproval:', error);
      throw error;
    }
  },

  // Method to a cancel the final approval InquiryApproveReject
  cancleFinalInquiryApprove: async (inquiryData) => {
    try {
      const response = await httpClient.put(`${api}/CancleFinalApproval`, inquiryData);
      return response.data;
    } catch (error) {
      console.error('Failed to add Cancle FinalApproval:', error);
      throw error;
    }
  },

  // Method to get all GetApprovalListofPartner
  getInquiryApproveRejectPartner: async (inquiryRegistrationId) => {
    try {
      const response = await httpClient.get(`${api}/GetApprovalListofPartner/${inquiryRegistrationId}`); // Update 'GetAll' with actual endpoint if different
      return response.data;
    } catch (error) {
      console.error('Failed to fetch InquiryFollowUp:', error);
      throw error;
    }
  },

   // Method to get all GetApprovalListofClient
   getInquiryApproveRejectClient: async (inquiryRegistrationId) => {
    try {
      const response = await httpClient.get(`${api}/GetApprovalListofClient/${inquiryRegistrationId}`); // Update 'GetAll' with actual endpoint if different
      return response.data;
    } catch (error) {
      console.error('Failed to fetch InquiryFollowUp:', error);
      throw error;
    }
  },

   // Method to get all GetApprovalListofVendor
   getInquiryApproveRejectVendor: async (inquiryRegistrationId) => {
    try {
      const response = await httpClient.get(`${api}/GetApprovalListofVendor/${inquiryRegistrationId}`); // Update 'GetAll' with actual endpoint if different
      return response.data;
    } catch (error) {
      console.error('Failed to fetch InquiryFollowUp:', error);
      throw error;
    }
  },

   

 
//    // Methos to update InquiryFollowUp
//    updateInquiryFollowUp: async (inquiryOriginId, inquiryOriginData) => {
//     try {
//       const response = await httpClient.put(${api}/${inquiryOriginId},inquiryOriginData); 
//       return response.data;
//     } catch (error) {
//       console.error('Failed to Update InquiryFollowUp:', error);
//       throw error;
//     }
//   },

//   // Methos to delete InquiryFollowUp
//   deleteInquiryFollowUp: async (inquiryOriginId ) => {
//     try {
//       const response = await httpClient.delete(${api}/${inquiryOriginId}); 
//       return response.data;
//     } catch (error) {
//       console.error('Failed to Delete InquiryFollowUp:', error);
//       throw error;
//     }
//   },
  
//   // Method to get single InquiryFollowUp
//   getByIdInquiryFollowUp: async (inquiryOriginId) => {
//     try {
//       const response = await httpClient.get(${api}/${inquiryOriginId}); // Update 'GetAll' with actual endpoint if different
//       return response.data;
//     } catch (error) {
//       console.error('Failed to fetch InquiryFollowUp:', error);
//       throw error;
//     }
//   },

};
