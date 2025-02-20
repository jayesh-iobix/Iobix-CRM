import axios from 'axios';
import { environment } from '../../environment/environment';
import httpClient from './HttpClient';

// Define the base URL for your API
const api = environment.holiday;

export const HolidayService = {
  // Method to add a holiday
  addHoliday: async (holidayData) => {
    try {
      const response = await httpClient.post(`${api}/Add`, holidayData);
      return response.data;
    } catch (error) {
      console.error('Failed to add holiday:', error);
      throw error;
    }
  },

  // Method to get all holiday
  getHolidays: async () => {
    try {
      const response = await httpClient.get(`${api}/GetAll`); // Update 'GetAll' with actual endpoint if different
      return response.data;
    } catch (error) {
      console.error('Failed to fetch holiday:', error);
      throw error;
    }
  },

  // Method to get by id holidays
  getByIdHoliday: async (holidayId) => {
    try {
      const response = await httpClient.get(`${api}/${holidayId}`); 
      return response.data;
    } catch (error) {
      console.error('Failed to fetch holiday:', error);
      throw error;
    }
  },

  // Method to update holiday
  updateHoliday: async (holidayId,holidayData) => {
    try {
      const response = await httpClient.put(`${api}/${holidayId}`,holidayData); 
      return response.data;
    } catch (error) {
      console.error('Failed to fetch holiday:', error);
      throw error;
    }
  },

  // Method to delete a holiday
  deleteHoliday: async (holidayId) => {
    try {
      const response = await httpClient.delete(`${api}/${holidayId}`); // Update 'GetAll' with actual endpoint if different
      return response.data;
    } catch (error) {
      console.error('Failed to fetch departments:', error);
      throw error;
    }
  },
  
};
