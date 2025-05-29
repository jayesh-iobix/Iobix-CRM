import { environment } from '../../environment/environment';
import httpClient from './HttpClient';

// Define the base URL for your API
const api = environment.invoicePayment;

export const InvoicePaymentService = {
  // Method to add a invoice payment
  addInvoicePayment: async (invoicePaymentData) => {
    try {
      const response = await httpClient.post(`${api}/Add`, invoicePaymentData);
      return response.data;
    } catch (error) {
      console.error('Failed to add invoice payment:', error);
      throw error;
    }
  },

  // Method to get all invoice payment
  getInvoicePayment: async () => {
    try {
      const response = await httpClient.get(`${api}/GetAll`); // Update 'GetAll' with actual endpoint if different
      return response.data;
    } catch (error) {
      console.error('Failed to fetch invoice payment:', error);
      throw error;
    }
  },

  // Method to get all invoice payment
  getInvoicePaymentByInvoiceId: async (invoiceMasterId) => {
    try {
      const response = await httpClient.get(`${api}/GetInvoicePayment/${invoiceMasterId}`); // Update 'GetAll' with actual endpoint if different
      return response.data;
    } catch (error) {
      console.error('Failed to fetch invoice payment:', error);
      throw error;
    }
  },

  // Method to get by id invoice payment
  getByIdInvoicePayment: async (gtmClientPaymentId) => {
    try {
      const response = await httpClient.get(`${api}/${gtmClientPaymentId}`); // Update 'GetAll' with actual endpoint if different
      return response.data;
    } catch (error) {
      console.error('Failed to fetch invoice payment:', error);
      throw error;
    }
  },

  // Method to update invoice payment
  updateInvoicePayment: async (gtmClientPaymentId ,invoicePaymentData) => {
    try {
      const response = await httpClient.put(`${api}/${gtmClientPaymentId}`,invoicePaymentData); 
      return response.data;
    } catch (error) {
      console.error('Failed to update invoice payment:', error);
      throw error;
    }
  },

  // Method to delete invoice payment
  deleteInvoicePayment: async (gtmClientPaymentId) => {
    try {
      const response = await httpClient.delete(`${api}/${gtmClientPaymentId}`); 
      return response.data;
    } catch (error) {
      console.error('Failed to delete invoice payment:', error);
      throw error;
    }
  },
  
};
