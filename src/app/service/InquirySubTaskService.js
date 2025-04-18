import { environment } from '../../environment/environment';
import httpClient from './HttpClient';

// Define the base URL for your API
const api = environment.inquirySubTask;
const userApi = environment.userSubTask;

export const InquirySubTaskService = {

  // Method to add a task
  addInquirySubTask: async (inquirySubTaskData) => {
    try {
      const response = await httpClient.post(`${api}/Add`, inquirySubTaskData);
      return response.data;
    } catch (error) {
      console.error('Failed to add task:', error);
      throw error;
    }
  },

  // Method to get all tasks
  getInquirySubTasksByTaskId: async (inquiryTaskAllocationId) => {
    try {
      const response = await httpClient.get(`${api}/GetByInquiryTask/${inquiryTaskAllocationId}`); // Update 'GetAll' with actual endpoint if different
      return response.data;
    } catch (error) {
      console.error('Failed to fetch inquiry sub tasks:', error);
      throw error;
    }
  },

  // Method to get inquiry cub tasks by inquirySubTaskAllocationId
  getInquirySubTasksById: async (inquirySubTaskAllocationId) => {
    try {
      const response = await httpClient.get(`${api}/${inquirySubTaskAllocationId}`);
      return response.data;
    } catch (error) {
      console.error("Failed to fetch inquiry sub tasks:", error);
      throw error;
    }
  },

  // Method to get sub tasks which is assign by user own
  getUserSubTaskByUser: async (inquiryTaskAllocationId) => {
    try {
      const response = await httpClient.get(`${api}/GetByTaskAllocationIdByTaskAssignBy/${inquiryTaskAllocationId}`); // Update 'GetAll' with actual endpoint if different
      return response.data;
    } catch (error) {
      console.error('Failed to fetch sub tasks:', error);
      throw error;
    }
  },

  // Method to get sub tasks by main task which is assign by other
  getUserSubTask: async (inquiryTaskAllocationId) => {
    try {
      const response = await httpClient.get(`${api}/GetByTaskAllocationIdByTaskAssignTo/${inquiryTaskAllocationId}`); // Update 'GetAll' with actual endpoint if different
      return response.data;
    } catch (error) {
      console.error('Failed to fetch sub tasks:', error);
      throw error;
    }
  },

  // Method to get sub tasks by main task which is assign by other
  getUserSubTaskByEmployeeId: async (inquiryTaskAllocationId, employeeId) => {
    try {
      const response = await httpClient.get(`${api}/GetSubTaskByTaskIdEmployeeId/${inquiryTaskAllocationId}/${employeeId}`); // Update 'GetAll' with actual endpoint if different
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

   // Method to detete inquiry sub task
  deleteInquirySubTask: async (inquirySubTaskAllocationId) => {
    try {
      const response = await httpClient.delete(`${api}/${inquirySubTaskAllocationId}`);
      return response.data;
    } catch (error) {
      console.error("Failed to delete inquiry sub tasks:", error);
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

    // Method to transfer a task
  transferInquirySubTask: async (transferInquiryTaskData) => {
    try {
      const response = await httpClient.post(`${api}/InquirySubTaskTransfer`, transferInquiryTaskData);
      return response.data;
    } catch (error) {
      console.error('Failed to transfer inquirytask:', error);
      throw error;
    }
  },

};