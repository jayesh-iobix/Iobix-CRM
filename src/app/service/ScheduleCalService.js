import { environment } from '../../environment/environment';
import httpClient from './HttpClient';

// Define the base URL for your API
const api = environment.schedule;

export const ScheduleCalService = {

  // Method to add a schedule
  addSchedule: async (scheduleData) => {
    try {
      const response = await httpClient.post(`${api}/Add`, scheduleData);
      return response.data;
    } catch (error) {
      console.error('Failed to add schedule:', error);
      throw error;
    }
  },

  // Method to get all schedules
  getSchedules: async () => {
    try {
      const response = await httpClient.get(`${api}/GetAll`); // Update 'GetAll' with actual endpoint if different
      return response.data;
    } catch (error) {
      console.error('Failed to fetch schedules:', error);
      throw error;
    }
  },

  // Method to get all emails
  getAllEmail: async () => {
    try {
      const response = await httpClient.get(`${api}/GetAllEmail`); // Update 'GetAll' with actual endpoint if different
      return response.data;
    } catch (error) {
      console.error('Failed to fetch schedules:', error);
      throw error;
    }
  },

  // Method to get schedule by ID
  getScheduleById: async (scheduleId) => {
    try {
      const response = await httpClient.get(`${api}/${scheduleId}`);
      return response.data;
    } catch (error) {
      console.error('Failed to fetch schedule:', error);
      throw error;
    }
  },

  // Method to get schedule reminder by scheduleId
  getScheduleReminderById: async (scheduleId) => {
    try {
      const response = await httpClient.get(`${api}/GetReminder/${scheduleId}`);
      return response.data;
    } catch (error) {
      console.error('Failed to fetch schedule:', error);
      throw error;
    }
  },

  // Method to get schedule by userId
  getScheduleByUserId: async (userId) => {
    try {
      const response = await httpClient.get(`${api}/GetByUserId/${userId}`);
      return response.data;
    } catch (error) {
      console.error('Failed to fetch schedule:', error);
      throw error;
    }
  },

  // Method to update schedule
  updateSchedule: async (scheduleId, updatedScheduleData) => {
    try {
      const response = await httpClient.put(`${api}/${scheduleId}`, updatedScheduleData); 
      return response.data;
    } catch (error) {
      console.error('Failed to update schedule:', error);
      throw error;
    }
  },

  // Method to delete schedule
  deleteSchedule: async (scheduleId) => {
    try {
      const response = await httpClient.delete(`${api}/${scheduleId}`); 
      return response.data;
    } catch (error) {
      console.error('Failed to delete schedule:', error);
      throw error;
    }
  },

};
