import axios from 'axios';
import { environment } from '../../environment/environment';
import httpClient from './HttpClient';
import { get } from 'lodash';

// Define the base URL for your API
const api = environment.taskReminder;

export const TaskReminderService = {

  // Method to get TaskReminder by taskId
   getTaskReminder: async (taskId) => {
    try {
      const response = await httpClient.get(`${api}/GetAll/${taskId}`); // Update 'GetAll' with actual endpoint if different
      return response.data;
    } catch (error) {
      console.error('Failed to fetch task reminder:', error);
      throw error;
    }
  },
  
  // Method to get taskreminder by id
  getTaskReminderById: async (taskReminderId) => {
    try {
      const response = await httpClient.get(`${api}/${taskReminderId}`); 
      return response.data;
    } catch (error) {
      console.error('Failed to fetch task reminder:', error);
      throw error;
    }
  },

  // Methos to delete taskreminder 
  deleteTaskReminder: async (taskReminderId) => {
   try {
     const response = await httpClient.delete(`${api}/${taskReminderId}`); 
     return response.data;
   } catch (error) {
     console.error('Failed to Delete task reminder:', error);
     throw error;
   }
  }

    // Method to add a Partner
//   addPartner: async (partnerData) => {
//     try {
//       const response = await axios.post(`${api}/Add`, partnerData);
//       return response.data;
//     } catch (error) {
//       console.error('Failed to add Partner:', error);
//       throw error;
//     }
//   },

   // Methos to update Partner 
//    updatePartner: async (partnerRegistrationId, partnerData) => {
//     try {
//       const response = await httpClient.put(`${api}/${partnerRegistrationId}`,partnerData); 
//       return response.data;
//     } catch (error) {
//       console.error('Failed to Update Partner:', error);
//       throw error;
//     }
//    },
 
};