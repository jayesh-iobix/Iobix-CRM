import { environment } from '../../environment/environment';
import httpClient from './HttpClient';

// Define the base URL for your API
const api = environment.task;
const userApi = environment.userTask;

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

  // Method to get user tasks
  getUserTasks: async () => {
    try {
      const response = await httpClient.get(`${userApi}/GetUserTask`); // Update 'GetAll' with actual endpoint if different
      return response.data;
    } catch (error) {
      console.error('Failed to fetch tasks:', error);
      throw error;
    }
  },


  // Method to get user main tasks in User Sub Tasks component 
  getUserTasksBySubTask: async () => {
    try {
      const response = await httpClient.get(`${userApi}/GetUserTaskBySubAllocationId`); // Update 'GetAll' with actual endpoint if different
      return response.data;
    } catch (error) {
      console.error('Failed to fetch tasks:', error);
      throw error;
    }
  },

    // Method to get user Task Assign List
    getUserAssignTasks: async () => {
      try {
        const response = await httpClient.get(`${api}/GetTaskToTaskAssigner`); // Update 'GetAll' with actual endpoint if different
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

  //Method to update taskActualStartingDate
  updateTaskActualStartingDate: async (taskId, taskData) => {
    try {
      debugger;
      const response = await httpClient.put(`${userApi}/TaskActualStartingDate/${taskId}`, taskData);
      return response.data;
    } catch (error) {
      console.error('Failed to fetch ActualStartingDate:', error);
      throw error;
    }
  },

  //Method to update taskCompletionDate
  updateTaskCompletionDate: async (taskId, taskData) => {
    try {
      debugger;
      const response = await httpClient.put(`${userApi}/TaskComplete/${taskId}`, taskData);
      return response.data;
    } catch (error) {
      console.error('Failed to fetch TaskCompletionDate:', error);
      throw error;
    }
  },

    // Method to transfer a task
    transferTask: async (transferTaskData) => {
      try {
        const response = await httpClient.post(`${api}/TaskTransfer`, transferTaskData);
        return response.data;
      } catch (error) {
        console.error('Failed to transfer task:', error);
        throw error;
      }
    },

};