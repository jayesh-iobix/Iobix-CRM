import axios from 'axios';
import { environment } from '../../environment/environment';
import httpClient from './HttpClient';

// Define the base URL for your API
const api = environment.taxDetail;

export const TaxDetailService = {
  // Method to add a tax detail
  addTaxDetail: async (taxDetailData) => {
    try {
      const response = await httpClient.post(`${api}/Add`, taxDetailData);
      return response.data;
    } catch (error) {
      console.error('Failed to add tax detail:', error);
      throw error;
    }
  },

  // Method to get all tax detail
  getTaxDetail: async () => {
    try {
      const response = await httpClient.get(`${api}/GetAll`); // Update 'GetAll' with actual endpoint if different
      return response.data;
    } catch (error) {
      console.error('Failed to fetch tax details:', error);
      throw error;
    }
  },

  // Method to get by Id tax detail
  getByIdTaxDetail: async (taxDetailId) => {
    try {
      const response = await httpClient.get(`${api}/${taxDetailId}`); 
      return response.data;
    } catch (error) {
      console.error('Failed to fetch tax detail:', error);
      throw error;
    }
  },

  // Method to update tax detail
  updateTaxDetail: async (taxDetailId,taxDetailData) => {
    try {
      const response = await httpClient.put(`${api}/${taxDetailId}`,taxDetailData); 
      return response.data;
    } catch (error) {
      console.error('Failed to fetch tax detail:', error);
      throw error;
    }
  },

  // Method to delete tax detail
  deleteTaxDetail: async (taxDetailId ) => {
    try {
      const response = await httpClient.delete(`${api}/${taxDetailId}`); 
      return response.data;
    } catch (error) {
      console.error('Failed to fetch tax detail:', error);
      throw error;
    }
  },
  
};
