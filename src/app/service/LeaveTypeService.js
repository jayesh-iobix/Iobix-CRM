import axios from 'axios';
import { environment } from '../../environment/environment';
import httpClient from './HttpClient';

// Define the base URL for your API
const api = environment.leaveType;

export const LeaveTypeService = {
  // Method to add a department
  addLeaveType: async (leaveTypeData) => {
    try {
      const response = await httpClient.post(`${api}/Add`, leaveTypeData);
      return response.data;
    } catch (error) {
      console.error('Failed to add leaveType:', error);
      throw error;
    }
  },

  // Method to get all leaveTypes
  getLeaveTypes: async () => {
    try {
      const response = await httpClient.get(`${api}/GetAll`); // Update 'GetAll' with actual endpoint if different
      return response.data;
    } catch (error) {
      console.error('Failed to fetch leaveTypes:', error);
      throw error;
    }
  },

  // Method to get by Id leaveTypes
  getByIdLeaveTypes: async (leaveTypeId) => {
    try {
      const response = await httpClient.get(`${api}/${leaveTypeId}`); 
      return response.data;
    } catch (error) {
      console.error('Failed to fetch leaveTypes:', error);
      throw error;
    }
  },

  // Method to update leaveTypes
  updateLeaveTypes: async (leaveTypeId,leaveTypeData) => {
    try {
      const response = await httpClient.put(`${api}/${leaveTypeId}`,leaveTypeData); 
      return response.data;
    } catch (error) {
      console.error('Failed to fetch leaveTypes:', error);
      throw error;
    }
  },

  // Method to delete leaveTypes
  deleteLeaveTypes: async (leaveTypeId ) => {
    try {
      const response = await httpClient.delete(`${api}/${leaveTypeId}`); 
      return response.data;
    } catch (error) {
      console.error('Failed to fetch leaveTypes:', error);
      throw error;
    }
  },
  
};
