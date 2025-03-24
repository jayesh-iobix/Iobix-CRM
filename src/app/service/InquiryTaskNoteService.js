import { environment } from '../../environment/environment';
import httpClient from './HttpClient';

// Define the base URL for your API
// const api = environment.task;
const userApi = environment.userTask;
const api = environment.inquiryTaskNote;

export const InquiryTaskNoteService = {

  // Method to add a inquiry task note
  addInquiryTaskNote: async (inquiryTaskNoteData) => {
    try {
      const response = await httpClient.post(`${api}/AddTaskNote`, inquiryTaskNoteData);
      return response.data;
    } catch (error) {
      console.error('Failed to add inquiry task note:', error);
      throw error;
    }
  },

  // Method to get inquiry tasks note by task Id
  getInquiryTaskNoteByTaskId: async (inquiryTaskId) => {
    try {
      const response = await httpClient.get(`${api}/GetTaskNote/${inquiryTaskId}`);
      return response.data;
    } catch (error) {
      console.error("Failed to fetch inquiry task notes:", error);
      throw error;
    }
  },

  // Method to get inquiry tasks note By Id
  getInquiryTaskNoteById: async (inquiryTaskNoteId) => {
    try {
      const response = await httpClient.get(`${userApi}/GetByIdTaskNote/${inquiryTaskNoteId}`);
      return response.data;
    } catch (error) {
      console.error("Failed to fetch inquiry task notes:", error);
      throw error;
    }
  },

  // Method to update inquiry task note by id
  updateInquiryTaskNote: async (inquiryTaskNoteId, inquiryTaskNoteData) => {
    try {
      //debugger;
      const response = await httpClient.put(`${userApi}/UpdateTaskNote/${inquiryTaskNoteId}`, inquiryTaskNoteData);
      return response.data;
    } catch (error) {
      console.error('Failed to fetch inquiry task note:', error);
      throw error;
    }
  },

  // Method to detete inquiry task note
  deleteInquiryTaskNote: async (inquiryTaskNoteId) => {
    debugger;
    try {
      const response = await httpClient.delete(`${userApi}/DeleteTaskNote/${inquiryTaskNoteId}`); 
      return response.data;
    } catch (error) {
      console.error('Failed to delete inquiry task note:', error);
      throw error;
    }
  },
  

//   // Method to get all tasks
//   getTasks: async () => {
//     try {
//       const response = await httpClient.get(`${api}/GetAll`); // Update 'GetAll' with actual endpoint if different
//       return response.data;
//     } catch (error) {
//       console.error('Failed to fetch tasks:', error);
//       throw error;
//     }
//   },


    // // Method to get tasks by Id
    // getTaskById: async (taskId) => {
    //   try {
    //     const response = await httpClient.get(`${api}/${taskId}`);
    //     return response.data;
    //   } catch (error) {
    //     console.error('Failed to fetch tasks:', error);
    //     throw error;
    //   }
    // },

//      // Method to update task by id
//   updateTask: async (taskId, taskData) => {
//     try {
//       debugger;
//       const response = await httpClient.put(`${api}/${taskId}`, taskData);
//       return response.data;
//     } catch (error) {
//       console.error('Failed to fetch tasks:', error);
//       throw error;
//     }
//   },

   
};