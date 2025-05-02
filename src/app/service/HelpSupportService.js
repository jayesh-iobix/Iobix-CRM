import axios from 'axios';
import { environment } from '../../environment/environment';
import httpClient from './HttpClient';

// Define the base URL for your API
const api = environment.helpSupport;
const contactApi = environment.helpAdmin;

export const HelpSupportService = {
  // Method to add a hepl&support
  addTicket: async (helpData) => {
    try {
      const response = await httpClient.post(`${api}/Add`, helpData);
      return response.data;
    } catch (error) {
      console.error('Failed to add hepl&support:', error);
      throw error;
    }
  },

  // Method to get all hepl&support
  getTicketIssue: async () => {
    try {
      const response = await httpClient.get(`${api}/GetAll`); // Update 'GetAll' with actual endpoint if different
      return response.data;
    } catch (error) {
      console.error('Failed to fetch hepl&support:', error);
      throw error;
    }
  },

  // Method to add a meesage to directly admin
  contactAdmin: async (contactData) => {
    try {
      const response = await httpClient.post(`${contactApi}/Add`, contactData);
      return response.data;
    } catch (error) {
      console.error('Failed to add message:', error);
      throw error;
    }
  },

  // Method to get all meesage to directly admin
  getContactAdmin: async () => {
      try {
      const response = await httpClient.get(`${contactApi}/GetAll`); // Update 'GetAll' with actual endpoint if different
      return response.data;
      } catch (error) {
      console.error('Failed to fetch messages:', error);
      throw error;
      }
  },

  // Method to delete a hepl&support
  deleteTicketIssue: async (helpIssueTicketId) => {
    try {
      const response = await httpClient.delete(`${api}/${helpIssueTicketId}`); // Update 'GetAll' with actual endpoint if different
      return response.data;
    } catch (error) {
      console.error('Failed to fetch hepl&support:', error);
      throw error;
    }
  },

  // Method to delete a meesage to directly admin
  deleteContactAdmin: async (helpAdminContactId) => {
    try {
      const response = await httpClient.delete(`${contactApi}/${helpAdminContactId}`); // Update 'GetAll' with actual endpoint if different
      return response.data;
    } catch (error) {
      console.error('Failed to delete :', error);
      throw error;
    }
  },







  // Method to get by id hepl&support
  getByIdHoliday: async (holidayId) => {
    try {
      const response = await httpClient.get(`${api}/${holidayId}`); 
      return response.data;
    } catch (error) {
      console.error('Failed to fetch holiday:', error);
      throw error;
    }
  },

  // Method to update hepl&support
  updateHoliday: async (holidayId,helpData) => {
    try {
      const response = await httpClient.put(`${api}/${holidayId}`,helpData); 
      return response.data;
    } catch (error) {
      console.error('Failed to fetch hepl&support:', error);
      throw error;
    }
  },

  // Method to delete a hepl&support
  deleteHoliday: async (holidayId) => {
    try {
      const response = await httpClient.delete(`${api}/${holidayId}`); // Update 'GetAll' with actual endpoint if different
      return response.data;
    } catch (error) {
      console.error('Failed to fetch hepl&support:', error);
      throw error;
    }
  },

};
