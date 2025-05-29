import axios from 'axios';
import { environment } from '../../environment/environment';
import httpClient from './HttpClient';

// Define the base URL for your API
const api = environment.invoice;

export const InvoiceService = {
  // Method to add a invoice
  addInvoice: async (invoiceData) => {
    try {
      const response = await httpClient.post(`${api}/Add`, invoiceData);
      return response.data;
    } catch (error) {
      console.error('Failed to add invoice:', error);
      throw error;
    }
  },

  // Send Invoice Email
  sendInvocieEmail: async (invoicemasterid, gtmclientserviceId) => {
  try {
    debugger;
    const response = await httpClient.get(`${api}/SendInvoiceEmail`, {
      params: {
        invoicemasterid: invoicemasterid,
        gtmclientserviceId: gtmclientserviceId     
      },
      
    });
    console.log("Send Email:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error sending a email:", error);
    throw error;
  }
  },

  // Method to get all invoice
  getInvoice: async () => {
    try {
      const response = await httpClient.get(`${api}/GetAll`); // Update 'GetAll' with actual endpoint if different
      return response.data;
    } catch (error) {
      console.error('Failed to fetch invoice:', error);
      throw error;
    }
  },

  // Method to get all invoice hitory
  getInvoiceHistory: async () => {
    try {
      const response = await httpClient.get(`${api}/GetInvoiceHistory`); 
      return response.data;
    } catch (error) {
      console.error('Failed to fetch invoice history:', error);
      throw error;
    }
  },

  getInvoicesByClientMonthYear: async (gtmclientserviceId, month, year) => {
  try {
    // debugger;
    const response = await httpClient.get(`${api}/GetInvoiceHistory/${gtmclientserviceId}`, {
      params: {
        month: month,
        year: year     
        // gtmclientserviceId,
        // month,
        // year,
      },
      
    });
    console.log("Invoice history:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error fetching invoices by client, month, and year:", error);
    throw error;
  }
  },

  // Method to get by id invoice
  getInvoiceHistoryById: async (invoiceId) => {
    try {
      const response = await httpClient.get(`${api}/${invoiceId}`); 
      return response.data;
    } catch (error) {
      console.error('Failed to fetch invoice:', error);
      throw error;
    }
  },

  // Method to get by id invoice
  getByIdInvoice: async (invoiceId) => {
    try {
      const response = await httpClient.get(`${api}/GetById/${invoiceId}`); 
      return response.data;
    } catch (error) {
      console.error('Failed to fetch invoice:', error);
      throw error;
    }
  },

  // Method to update invoice
  updateInvoice: async (invoiceId,invoiceData) => {
    try {
      const response = await httpClient.put(`${api}/${invoiceId}`,invoiceData); 
      return response.data;
    } catch (error) {
      console.error('Failed to update holiday:', error);
      throw error;
    }
  },

  // Method to delete a invoice
  deleteInvoice: async (invoiceId) => {
    try {
      const response = await httpClient.delete(`${api}/${invoiceId}`);
      return response.data;
    } catch (error) {
      console.error('Failed to delete invoice:', error);
      throw error;
    }
  },

  // Method to attendance task report
  downloadInvoiceReport: async (invoiceMasterId) => {
    // debugger;
    try {
      const response = await httpClient.get(`${api}/download-invoice/${invoiceMasterId}`, {
        responseType: 'blob', // Important
      });
      debugger
      // Create a link element, use it to download the blob, and then remove it
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `Invoice_Report.pdf`); // Specify the file name
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error('Error downloading the report:', error);
    }
  },

};
