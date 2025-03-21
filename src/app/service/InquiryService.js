import axios from 'axios';
import { environment } from '../../environment/environment';
import httpClient from './HttpClient';

// Define the base URL for your API
const api = environment.inquiry;

export const InquiryService = {

  // Method to add a Inquiry by partner
  addInquiry: async (inquiryData) => {
    try {
      const response = await httpClient.post(`${api}/addFromPrt`, inquiryData);
      // debugger
      // const response = await httpClient.post(`${api}/AddFromPrt`, inquiryData);
      return response.data;
    } catch (error) {
      console.error('Failed to add Inquiry:', error);
      throw error;
    }
  },

  // Method to take a Inquiry by partner
  takeInquiry: async (inquiryregistrationid ) => {
    try {
      const response = await httpClient.post(`${api}/InquiryHandler/${inquiryregistrationid }`);
      // debugger
      // const response = await httpClient.post(`${api}/AddFromPrt`, inquiryData);
      return response.data;
    } catch (error) {
      console.error('Failed to take Inquiry:', error);
      throw error;
    }
  },
  // Method to take a Inquiry by partner
  takeInquiry: async (inquiryregistrationid) => {
    try {
      const response = await httpClient.post(`${api}/InquiryHandler/${inquiryregistrationid}`);
      // debugger
      // const response = await httpClient.post(`${api}/AddFromPrt`, inquiryData);
      return response.data;
    } catch (error) {
      console.error('Failed to take Inquiry:', error);
      throw error;
    }
  },

  // Method to take a Inquiry by partner
  cancleInquiry: async (inquiryregistrationid) => {
    try {
      const response = await httpClient.post(`${api}/InquiryCancle/${inquiryregistrationid}`);
      // debugger
      // const response = await httpClient.post(`${api}/AddFromPrt`, inquiryData);
      return response.data;
    } catch (error) {
      console.error('Failed to cancle Inquiry:', error);
      throw error;
    }
  },

  // Method to add a Inquiry by client company
  addInquiryByCompany: async (inquiryData) => {
    try {
      const response = await httpClient.post(`${api}/addFromClient`, inquiryData);
      // debugger
      return response.data;
    } catch (error) {
      console.error('Failed to add Inquiry:', error);
      throw error;
    }
  },

  // Method to add a Inquiry by admin for partner or client
  addInquiryByAdmin: async (inquiryData) => {
    try {
      const response = await httpClient.post(`${api}/addFromEmp`, inquiryData);
      // debugger
      return response.data;
    } catch (error) {
      console.error('Failed to add Inquiry:', error);
      throw error;
    }
  },

  // Method to get Inquiry in partner list
  getPartnerInquiry: async () => {
   try {
     const response = await httpClient.get(`${api}/GetPartnerSent`); // Update 'GetAll' with actual endpoint if different
     return response.data;
   } catch (error) {
     console.error('Failed to fetch Inquiry', error);
     throw error;
   }
  },

  // Method to get Inquiry in client company list
  getCompanyInquiry: async () => {
   try {
     const response = await httpClient.get(`${api}/GetClientSent`); // Update 'GetAll' with actual endpoint if different
     return response.data;
   } catch (error) {
     console.error('Failed to fetch Inquiry', error);
     throw error;
   }
  },

  // Method to get all Inquiry in partner by admin
  getPartnerInquiryFromIbx: async () => {
   try {
     const response = await httpClient.get(`${api}/GetPartnerReceived`); // Update 'GetAll' with actual endpoint if different
     return response.data;
   } catch (error) {
     console.error('Failed to fetch Inquiry', error);
     throw error;
   }
  },

  // Method to get all Inquiry in client by admin
  getCompanyInquiryFromIbx: async () => {
   try {
     const response = await httpClient.get(`${api}/GetClientReceived`); // Update 'GetAll' with actual endpoint if different
     return response.data;
   } catch (error) {
     console.error('Failed to fetch Inquiry', error);
     throw error;
   }
  },

  // Method to get all Inquiry in admin by partner
  getInquiryFromPartner: async () => {
   try {
     const response = await httpClient.get(`${api}/GetPartnerApplyInqInAdmin`); // Update 'GetAll' with actual endpoint if different
     return response.data;
   } catch (error) {
     console.error('Failed to fetch Inquiry', error);
     throw error;
   }
  },

  // Method to get all Inquiry in admin by client company
  getInquiryFromCompany: async () => {
   try {
     const response = await httpClient.get(`${api}/GetClientApplyInqInAdmin`); // Update 'GetAll' with actual endpoint if different
     return response.data;
   } catch (error) {
     console.error('Failed to fetch Inquiry', error);
     throw error;
   }
  },

  // Method to get all Inquiry in admin which is created by admin to give client
  getInquiryInAdminToClient: async () => {
   try {
     const response = await httpClient.get(`${api}/GetInqSendToClientInAdmin`); // Update 'GetAll' with actual endpoint if different
     return response.data;
   } catch (error) {
     console.error('Failed to fetch Inquiry', error);
     throw error;
   }
  },

  // Method to get all Inquiry in admin which is created by admin to give partner
  getInquiryInAdminToPartner: async () => {
   try {
     const response = await httpClient.get(`${api}/GetInqSendToPartnerInAdmin`); // Update 'GetAll' with actual endpoint if different
     return response.data;
   } catch (error) {
     console.error('Failed to fetch Inquiry', error);
     throw error;
   }
  },

  // Method to get all Inquiry in employee which is created by employee to give partner
  getInquiryInUserToPartner: async () => {
   try {
     const response = await httpClient.get(`${api}/GetPartnerApplyInqInEmp`); // Update 'GetAll' with actual endpoint if different
     return response.data;
   } catch (error) {
     console.error('Failed to fetch Inquiry', error);
     throw error;
   }
  },

  // Method to get all Inquiry in employee which is created by employee to give client company
  getInquiryInUserToCompany: async () => {
   try {
     const response = await httpClient.get(`${api}/GetClientApplyInqInEmp`); // Update 'GetAll' with actual endpoint if different
     return response.data;
   } catch (error) {
     console.error('Failed to fetch Inquiry', error);
     throw error;
   }
  },

  // Method to get all Inquiry of partner in employee which is forwaded by admin.
  getForwardedPartnerInqryInUser: async () => {
   try {
     const response = await httpClient.get(`${api}/GetAdminForwPartnerInqInemp`); // Update 'GetAll' with actual endpoint if different
     return response.data;
   } catch (error) {
     console.error('Failed to fetch Inquiry', error);
     throw error;
   }
  },

  // Method to get all Inquiry of client company in employee which is forwaded by admin.
  getForwardedCompanyInqryInUser: async () => {
   try {
     const response = await httpClient.get(`${api}/GetAdminForwClientInqInemp`); // Update 'GetAll' with actual endpoint if different
     return response.data;
   } catch (error) {
     console.error('Failed to fetch Inquiry', error);
     throw error;
   }
  },

  // Methos to update Inquiry
    updateInquiry: async (inquiryRegistrationId, inquiryData) => {
     try {
       const response = await httpClient.put(`${api}/${inquiryRegistrationId}`,inquiryData); 
       return response.data;
     } catch (error) {
       console.error('Failed to Update Inquiry:', error);
       throw error;
     }
    },

  // Methos to delete Inquiry
  deleteInquiry: async (inquiryRegistrationId) => {
    try {
      const response = await httpClient.delete(`${api}/${inquiryRegistrationId}`); 
      return response.data;
    } catch (error) {
      console.error('Failed to Delete Inquiry:', error);
      throw error;
    }
  },
  
  // Method to get Inquiry by  id
  getByIdInquiry: async (inquiryRegistrationId ) => {
    try {
      const response = await httpClient.get(`${api}/${inquiryRegistrationId}`); // Update 'GetAll' with actual endpoint if different
      return response.data;
    } catch (error) {
      console.error('Failed to fetch Inquiry:', error);
      throw error;
    }
  },

  // Method to recived all project in admin
  receivedAllProjects: async () => {
    try {
      const response = await httpClient.get(`${api}/ReceiveAllInqInAdmin`); 
      return response.data;
    } catch (error) {
      console.error('Failed to fetch project', error);
      throw error;
    }

   },
  // Method to recived all project in employee
  receivedAllProjectsInUser: async () => {
    try {
      const response = await httpClient.get(`${api}/ReceiveAllInqInEmployee`); 
      return response.data;
    } catch (error) {
      console.error('Failed to fetch project', error);
      throw error;
    }
   },

  // Method to created all project 
  createdAllProjects: async () => {
    try {
      const response = await httpClient.get(`${api}/CreatedAllInqInAdmin`); 
      return response.data;
    } catch (error) {
      console.error('Failed to fetch project', error);
      throw error;
    }
   },
 
};