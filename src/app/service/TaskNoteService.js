import { environment } from '../../environment/environment';
import httpClient from './HttpClient';

// Define the base URL for your API
// const api = environment.task;
const userApi = environment.userTask;
const api = environment.task;

export const TaskNoteService = {

  // Method to add a task note
  addTaskNote: async (taskNoteData) => {
    try {
      const response = await httpClient.post(`${userApi}/AddTaskNote`, taskNoteData);
      return response.data;
    } catch (error) {
      console.error('Failed to add task:', error);
      throw error;
    }
  },

  // Method to get tasks note by task Id
  getTaskNoteByTaskId: async (taskId) => {
    try {
      const response = await httpClient.get(`${api}/GetTaskNote/${taskId}`);
      return response.data;
    } catch (error) {
      console.error("Failed to fetch tasks:", error);
      throw error;
    }
  },

  // Method to get tasks note By Id
  getTaskNoteById: async (taskNoteId) => {
    try {
      const response = await httpClient.get(`${userApi}/GetByIdTaskNote/${taskNoteId}`);
      return response.data;
    } catch (error) {
      console.error("Failed to fetch tasks:", error);
      throw error;
    }
  },

  // Method to update task note by id
  updateTaskNote: async (taskNoteId, taskNoteData) => {
    try {
      //debugger;
      const response = await httpClient.put(`${userApi}/UpdateTaskNote/${taskNoteId}`, taskNoteData);
      return response.data;
    } catch (error) {
      console.error('Failed to fetch taskNotes:', error);
      throw error;
    }
  },

  // Method to detete task note
  deleteTaskNote: async (taskNoteId) => {
    debugger;
    try {
      const response = await httpClient.delete(`${userApi}/DeleteTaskNote/${taskNoteId}`); 
      return response.data;
    } catch (error) {
      console.error('Failed to delete tasknote:', error);
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