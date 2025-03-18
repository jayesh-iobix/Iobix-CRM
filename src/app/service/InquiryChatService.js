import axios from 'axios';
import { environment } from '../../environment/environment';
import httpClient from './HttpClient';

// Define the base URL for your API
const api = environment.inquiryChat;

export const InquiryChatService = {

  // Method to add a inquiryChat
  addInquiryChat: async (chatData) => {
    try {
      // debugger;
      const response = await httpClient.post(`${api}/AddFrmAdminEmployee`, chatData);
      return response.data;
    } catch (error) {
      console.error('Failed to add chatData:', error);
      throw error;
    }
  },

  // Method to add a inquiryChat
  addPartnerInquiryChat: async (chatData) => {
    try {
      // debugger;
      const response = await httpClient.post(`${api}/AddFrmPartnerClient`, chatData);
      return response.data;
    } catch (error) {
      console.error('Failed to add chatData:', error);
      throw error;
    }
  },

// Method to get all inquiryChat
getChatInAdmin: async (inquiryRegistrationId, receiverId) => {
  try {
    // debugger;
    const response = await httpClient.get(`${api}/GetChatInAdmin/${inquiryRegistrationId}/${receiverId}`); // Update 'GetAll' with actual endpoint if different
    return response.data;
  } catch (error) {
    console.error('Failed to fetch Chat In Admin:', error);
    throw error;
  }
 },
  
  // Method to get all inquiryChat
  getPartnerClientEmployeeList: async (inquiryChatType, id) => {
   try {
     const response = await httpClient.get(`${api}/GetPartnerClientEmployeeList/${inquiryChatType}/${id}`); // Update 'GetAll' with actual endpoint if different
     return response.data;
   } catch (error) {
     console.error('Failed to fetch chatData:', error);
     throw error;
   }
  },
  
  // Method to get all inquiryChat
  getPartnerClientEmployeeInquiry: async (type, userId) => {
   try {
     const response = await httpClient.get(`${api}/GetPartnerClientEmployeeInquiry/${type}/${userId}`); 
     return response.data;
   } catch (error) {
     console.error('Failed to fetch icp:', error);
     throw error;
   }
  },

   // Method to get a inquiryChat by ID
   getByIdICP: async (idealCustomerProfileId) => {
    try {
      const response = await httpClient.get(`${api}/${idealCustomerProfileId}`); 
      return response.data;
    } catch (error) {
      console.error('Failed to fetch icp:', error);
      throw error;
    }
  },

   // Methos to update Employee
//    updateEmployee: async (employeeId, updatedEmployeeData) => {
//     try {
//       const response = await httpClient.put(${api}/${employeeId},updatedEmployeeData); 
//       return response.data;
//     } catch (error) {
//       console.error('Failed to fetch employee:', error);
//       throw error;
//     }
//   },

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
