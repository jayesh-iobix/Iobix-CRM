import axios from 'axios';
import { environment } from '../../environment/environment';
import httpClient from './HttpClient';

// Define the base URL for your API
const api = environment.agreement;

export const AgreementService = {
  // Method to add a agreement
  addAgreement: async (agreementData) => {
    try {
      const response = await httpClient.post(`${api}/Add`, agreementData);
      return response.data;
    } catch (error) {
      console.error('Failed to add agreement:', error);
      throw error;
    }
  },

  // Method to get all agreement
  getAgreement: async () => {
    try {
      const response = await httpClient.get(`${api}/GetAll`); // Update 'GetAll' with actual endpoint if different
      return response.data;
    } catch (error) {
      console.error('Failed to fetch agreement:', error);
      throw error;
    }
  },

  // Method to get by id agreement
  getByIdAgreement: async (gTMClientAgreementId) => {
    try {
      const response = await httpClient.get(`${api}/${gTMClientAgreementId}`); 
      return response.data;
    } catch (error) {
      console.error('Failed to fetch agreement:', error);
      throw error;
    }
  },

  // Method to update agreement
  updateAgreement: async (gTMClientAgreementId,agreementData) => {
    try {
      const response = await httpClient.put(`${api}/${gTMClientAgreementId}`,agreementData); 
      return response.data;
    } catch (error) {
      console.error('Failed to update agreement:', error);
      throw error;
    }
  },

  // Method to delete a agreement
  deleteAgreement: async (gTMClientAgreementId) => {
    try {
      const response = await httpClient.delete(`${api}/${gTMClientAgreementId}`); 
      return response.data;
    } catch (error) {
      console.error('Failed to delete agreement:', error);
      throw error;
    }
  },
  
};
