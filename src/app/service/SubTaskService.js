import { environment } from '../../environment/environment';
import httpClient from './HttpClient';

// Define the base URL for your API
const api = environment.subTask;
const userApi = environment.userSubTask;

export const SubTaskService = {

  // Method to add a task
  addSubTask: async (subTaskData) => {
    try {
      const response = await httpClient.post(`${api}/Add`, subTaskData);
      return response.data;
    } catch (error) {
      console.error('Failed to add task:', error);
      throw error;
    }
  },

  // Method to get all tasks
  getSubTasksByTaskAllocationId: async (taskAllocationId) => {
    try {
      const response = await httpClient.get(`${api}/GetByTaskAllocation/${taskAllocationId}`); // Update 'GetAll' with actual endpoint if different
      return response.data;
    } catch (error) {
      console.error('Failed to fetch sub tasks:', error);
      throw error;
    }
  },

    // Method to get tasks by Id
    getSubTaskById: async (subTaskId) => {
      try {
        const response = await httpClient.get(`${api}/${subTaskId}`);
        return response.data;
      } catch (error) {
        console.error('Failed to fetch sub tasks:', error);
        throw error;
      }
    },

    // Method to update task by id
  updateSubTask: async (subTaskId, subTaskData) => {
    try {
      debugger;
      const response = await httpClient.put(`${api}/${subTaskId}`, subTaskData);
      return response.data;
    } catch (error) {
      console.error('Failed to fetch sub tasks:', error);
      throw error;
    }
  },

   // Method to detete task
   deleteSubTask: async (subTaskId) => {
    try {
      const response = await httpClient.delete(`${api}/${subTaskId}`); 
      return response.data;
    } catch (error) {
      console.error('Failed to fetch sub tasks:', error);
      throw error;
    }
  },

    //Method to update taskActualStartingDate
    updateSubTaskActualStartingDate: async (subTaskId, taskData) => {
      try {
        debugger;
        const response = await httpClient.put(`${userApi}/SubTaskActualStartingDate/${subTaskId}`, taskData);
        return response.data;
      } catch (error) {
        console.error('Failed to fetch ActualStartingDate:', error);
        throw error;
      }
    },
  
    //Method to update taskCompletionDate
    updateSubTaskCompletionDate: async (subTaskId, taskData) => {
      try {
        debugger;
        const response = await httpClient.put(`${userApi}/SubTaskComplete/${subTaskId}`, taskData);
        return response.data;
      } catch (error) {
        console.error('Failed to fetch TaskCompletionDate:', error);
        throw error;
      }
    },

};