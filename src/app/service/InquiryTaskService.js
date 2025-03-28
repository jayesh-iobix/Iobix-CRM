import { environment } from "../../environment/environment";
import httpClient from "./HttpClient";

// Define the base URL for your API
const api = environment.inquiryTask;
// const userApi = environment.userSubTask;

export const InquiryTaskService = {
  // Method to add a task
  addInquiryTask: async (inquiryTaskData) => {
    try {
      const response = await httpClient.post(`${api}/Add`, inquiryTaskData);
      return response.data;
    } catch (error) {
      console.error("Failed to add inquiryTask:", error);
      throw error;
    }
  },

  // Method to get all inquiry tasks
  getInquiryTasks: async (inquiryRegistrationId) => {
    try {
      const response = await httpClient.get(`${api}/GetAll/${inquiryRegistrationId}`); // Update 'GetAll' with actual endpoint if different
      return response.data;
    } catch (error) {
      console.error('Failed to fetch inquiry tasks:', error);
      throw error;
    }
  },

  // Method to get all inquiry tasks
  getCreateInquiryTaskInPartner: async (inquiryRegistrationId) => {
    try {
      const response = await httpClient.get(`${api}/GetInquiryTaskAssignBy/${inquiryRegistrationId}`); // Update 'GetAll' with actual endpoint if different
      return response.data;
    } catch (error) {
      console.error('Failed to fetch inquiry tasks:', error);
      throw error;
    }
  },

  // Method to get all inquiry tasks
  getCreateInquiryTaskInUser: async (inquiryRegistrationId) => {
    try {
      const response = await httpClient.get(`${api}/GetInquiryTaskAssignBy/${inquiryRegistrationId}`); // Update 'GetAll' with actual endpoint if different
      return response.data;
    } catch (error) {
      console.error('Failed to fetch inquiry tasks:', error);
      throw error;
    }
  },

  // Method to get all inquiry tasks
  getInquiryTaskInPartner: async (inquiryRegistrationId) => {
    try {
      const response = await httpClient.get(`${api}/GetInquiryTask/${inquiryRegistrationId}`); // Update 'GetAll' with actual endpoint if different
      return response.data;
    } catch (error) {
      console.error('Failed to fetch inquiry tasks in partner:', error);
      throw error;
    }
  },

  // Method to get all inquiry tasks
  getInquiryTaskInUser: async (inquiryRegistrationId) => {
    try {
      const response = await httpClient.get(`${api}/GetInquiryTask/${inquiryRegistrationId}`); // Update 'GetAll' with actual endpoint if different
      return response.data;
    } catch (error) {
      console.error('Failed to fetch inquiry tasks in User:', error);
      throw error;
    }
  },

  // Method to get inquiry tasks by inquiryTaskAllocationId
  getInquiryTasksById: async (inquiryTaskAllocationId) => {
    try {
      const response = await httpClient.get(`${api}/${inquiryTaskAllocationId}`);
      return response.data;
    } catch (error) {
      console.error("Failed to fetch inquiry tasks:", error);
      throw error;
    }
  },

  // Method to update inquiry task by id
  updateInquiryTask: async (inquiryTaskAllocationId, inquiryTaskData) => {
    try {
      // debugger;
      const response = await httpClient.put(`${api}/${inquiryTaskAllocationId}`, inquiryTaskData);
      return response.data;
    } catch (error) {
      console.error("Failed to update inquiry sub tasks:", error);
      throw error;
    }
  },
  
  // Method to get sub tasks by main task which is assign by other
  getUserSubTaskByEmployeeId: async (taskAllocationId, employeeId) => {
    try {
      const response = await httpClient.get(
        `${api}/GetSubTaskByTaskIdEmployeeId/${taskAllocationId}/${employeeId}`
      ); // Update 'GetAll' with actual endpoint if different
      return response.data;
    } catch (error) {
      console.error("Failed to fetch sub tasks:", error);
      throw error;
    }
  },

  // Method to detete inquiry task
  deleteInquiryTask: async (inquiryTaskAllocationId) => {
    try {
      const response = await httpClient.delete(`${api}/${inquiryTaskAllocationId}`);
      return response.data;
    } catch (error) {
      console.error("Failed to delete inquiry sub tasks:", error);
      throw error;
    }
  },

  //Method to update inquiry taskActualStartingDate
  updateInquiryTaskActualStartingDate: async (inquiryTaskAllocationId, inquiryTaskData) => {
    try {
      // debugger;
      const response = await httpClient.put(`${api}/InquiryTaskActualStartingDate/${inquiryTaskAllocationId}`, inquiryTaskData);
      return response.data;
    } catch (error) {
      console.error('Failed to add ActualStartingDate:', error);
      throw error;
    }
  },

  //Method to update inquiry taskCompletionDate
  updateInquiryTaskCompletionDate: async (inquiryTaskAllocationId, inquiryTaskData) => {
    try {
      // debugger;
      const response = await httpClient.put(`${api}/InquiryTaskComplete/${inquiryTaskAllocationId}`, inquiryTaskData);
      return response.data;
    } catch (error) {
      console.error('Failed to add TaskCompletionDate:', error);
      throw error;
    }
  },

  // Method to transfer a task
  transferInquiryTask: async (transferInquiryTaskData) => {
    try {
      const response = await httpClient.post(`${api}/InquiryTaskTransfer`, transferInquiryTaskData);
      return response.data;
    } catch (error) {
      console.error('Failed to transfer inquirytask:', error);
      throw error;
    }
  },

};
