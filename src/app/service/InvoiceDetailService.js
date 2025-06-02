import axios from 'axios';
import { environment } from '../../environment/environment';
import httpClient from './HttpClient';

// Define the base URL for your API
const api = environment.invoiceDetail;

export const InvoiceDetailService = {

  // Method to add a invoice detail
  addInvoiceDetail: async (invoiceDetailData) => {
    try {
      const response = await httpClient.post(`${api}/Add`, invoiceDetailData);
      return response.data;
    } catch (error) {
      console.error('Failed to add invoice detail:', error);
      throw error;
    }
  },

  // Method to get all invoice detail
  getInvoiceDetail: async () => {
    try {
      const response = await httpClient.get(`${api}/GetAll`); // Update 'GetAll' with actual endpoint if different
      return response.data;
    } catch (error) {
      console.error('Failed to fetch invoice details:', error);
      throw error;
    }
  },

  // Method to get by Id invoice detail
  getByIdInvoiceDetail: async (invoiceDetailId) => {
    try {
      const response = await httpClient.get(`${api}/${invoiceDetailId}`); 
      return response.data;
    } catch (error) {
      console.error('Failed to fetch invoice detail:', error);
      throw error;
    }
  },

  // Method to update invoice detail
  updateInvoiceDetail: async (invoiceDetailId,invoiceDetailData) => {
    try {
      const response = await httpClient.put(`${api}/${invoiceDetailId}`,invoiceDetailData); 
      return response.data;
    } catch (error) {
      console.error('Failed to update invoice detail:', error);
      throw error;
    }
  },

  // Method to update active status of invoice detail
  updateActiveStatusOfInvoiceDetail: async (invoiceDetailId, IsActive) => {
    try {
      const response = await httpClient.put(`${api}/UpdateActiveStatus/${invoiceDetailId}?IsActive=${IsActive}`); 
      return response.data;
    } catch (error) {
      console.error('Failed to update invoice detail:', error);
      throw error;
    }
  },

  // Method to delete invoice detail
  deleteInvoiceDetail: async (invoiceDetailId ) => {
    try {
      const response = await httpClient.delete(`${api}/${invoiceDetailId}`); 
      return response.data;
    } catch (error) {
      console.error('Failed to delete invoice detail:', error);
      throw error;
    }
  },
  
};
