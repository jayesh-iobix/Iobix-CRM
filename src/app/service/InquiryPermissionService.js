import { environment } from '../../environment/environment';
import httpClient from './HttpClient';

// Define the base URL for your API
const api = environment.inquiryPermission;

export const InquiryPermissionService = {

  // Method to add a InquiryPermission
  addInquiryPermission: async (inquiryPermissionData) => {
    debugger;
    try {
      const response = await httpClient.post(`${api}/Add`, inquiryPermissionData);
      return response.data;
    } catch (error) {
      console.error('Failed to add InquiryPermission:', error);
      throw error;
    }
  },

  // Method to get all InquiryPermission for admin
  getInquiryPermissionForAdmin: async () => {
    try {
      const response = await httpClient.get(`${api}/GetForAdmin`); // Update 'GetAll' with actual endpoint if different
      return response.data;
    } catch (error) {
      console.error('Failed to fetch InquiryPermission:', error);
      throw error;
    }
  },

   // Method to get all InquiryPermission for employee
   getInquiryPermissionForUser: async () => {
    try {
      const response = await httpClient.get(`${api}/GetForEmployee`); // Update 'GetAll' with actual endpoint if different
      return response.data;
    } catch (error) {
      console.error('Failed to fetch InquiryPermission:', error);
      throw error;
    }
  },

   // Methos to update InquiryPermission
   updateInquiryPermission: async (inquiryPermissionId, inquiryPermissionData) => {
    try {
      const response = await httpClient.put(`${api}/${inquiryPermissionId}`,inquiryPermissionData); 
      return response.data;
    } catch (error) {
      console.error('Failed to Update InquiryPermission:', error);
      throw error;
    }
  },

  // Methos to delete InquiryPermission
  deleteInquiryPermission: async (inquiryPermissionId) => {
    try {
      const response = await httpClient.delete(`${api}/${inquiryPermissionId}`); 
      return response.data;
    } catch (error) {
      console.error('Failed to Delete InquiryPermission:', error);
      throw error;
    }
  },
  
  // Method to get single InquiryPermission
  getByIdInquiryPermission: async (inquiryPermissionId) => {
    try {
      const response = await httpClient.get(`${api}/${inquiryPermissionId}`); // Update 'GetAll' with actual endpoint if different
      return response.data;
    } catch (error) {
      console.error('Failed to fetch InquiryPermission:', error);
      throw error;
    }
  },

  // Method to get Access of Inquiry in Admin
  getAccessOfInquiryInAdmin: async (inquiryRegistrationId ) => {
    try {
      const response = await httpClient.get(`${api}/AccessOfInquiryInAdmin/${inquiryRegistrationId}`); 
      return response.data;
    } catch (error) {
      console.error('Failed to fetch AccessOfInquiryInAdmin:', error);
      throw error;
    }
  },


 
};