import axios from 'axios';
import { environment } from '../../environment/environment';
import httpClient from './HttpClient';

// Define the base URL for your API
const api = environment.vendor;

export const VendorService = {

  // Method to add a Vendor
  addVendor: async (vendorData) => {
    try {
      const response = await axios.post(`${api}/Add`, vendorData);
      return response.data;
    } catch (error) {
      console.error('Failed to add Vendor:', error);
      throw error;
    }
  },

  // Method to get all Vendor 
   getVendor: async () => {
    try {
      const response = await httpClient.get(`${api}/GetAll`); // Update 'GetAll' with actual endpoint if different
      return response.data;
    } catch (error) {
      console.error('Failed to fetch Vendor:', error);
      throw error;
    }
  },

   // Methos to update Vendor 
   updateVendor: async (vendorRegistrationId, vendorData) => {
    try {
      const response = await httpClient.put(`${api}/${vendorRegistrationId}`,vendorData); 
      return response.data;
    } catch (error) {
      console.error('Failed to Update Vendor:', error);
      throw error;
    }
  },

  // Methos to delete Vendor 
  deleteVendor: async (vendorRegistrationId) => {
    try {
      const response = await httpClient.delete(`${api}/${vendorRegistrationId}`); 
      return response.data;
    } catch (error) {
      console.error('Failed to Delete Vendor:', error);
      throw error;
    }
  },
  
  // Method to get Vendor by id 
  getByIdVendor: async (vendorRegistrationId) => {
    try {
      const response = await httpClient.get(`${api}/${vendorRegistrationId}`); 
      return response.data;
    } catch (error) {
      console.error('Failed to fetch Vendor:', error);
      throw error;
    }
  },
 
};