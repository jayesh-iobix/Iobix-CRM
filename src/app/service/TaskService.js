import { environment } from '../../environment/environment';
import httpClient from './HttpClient';

// Define the base URL for your API
const api = environment.task;

export const TaskService = {
  // Method to add a task
  addTask: async (taskData) => {
    try {
      const response = await httpClient.post(`${api}/Add`, taskData);
      return response.data;
    } catch (error) {
      console.error('Failed to add task:', error);
      throw error;
    }
  },

  // Method to get all tasks
  getTasks: async () => {
    try {
      const response = await httpClient.get(`${api}/GetAll`); // Update 'GetAll' with actual endpoint if different
      return response.data;
    } catch (error) {
      console.error('Failed to fetch tasks:', error);
      throw error;
    }
  },

    // Method to get tasks by Id
    getTaskById: async (taskId) => {
      try {
        const response = await httpClient.get(`${api}/${taskId}`);
        return response.data;
      } catch (error) {
        console.error('Failed to fetch tasks:', error);
        throw error;
      }
    },

     // Method to update task by id
  updateTask: async (taskId, taskData) => {
    try {
      debugger;
      const response = await httpClient.put(`${api}/${taskId}`, taskData);
      return response.data;
    } catch (error) {
      console.error('Failed to fetch tasks:', error);
      throw error;
    }
  },

   // Method to detete task
   deleteTask: async (taskId) => {
    try {
      const response = await httpClient.delete(`${api}/${taskId}`); 
      return response.data;
    } catch (error) {
      console.error('Failed to fetch tasks:', error);
      throw error;
    }
  },



 

 
  
};