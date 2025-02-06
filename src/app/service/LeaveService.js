import axios from 'axios';
import { environment } from '../../environment/environment';
import httpClient from './HttpClient';

// Define the base URL for your API
const api = environment.leave;

export const LeaveService = {
  // Method to add a leave
  applyLeave: async (leaveData) => {
    // debugger;
    try {
      const response = await httpClient.post(`${api}/Add`, leaveData);
      return response.data;
    } catch (error) {
      console.error('Failed to add leaveData:', error);
      throw error;
    }
  },

  // Method to getByEmployee leave
  getLeaveRecords: async (employeeId) => {
    try {
      const response = await httpClient.get(`${api}/GetByEmployee/${employeeId}`); // Update 'GetAll' with actual endpoint if different
      return response.data;
    } catch (error) {
      console.error('Failed to fetch attendance:', error);
      throw error;
    }
  },

  // Method to approve reject leave
  approveRejectLeave: async (leaveRequestId,leaveData) => {
    try {
      const response = await httpClient.put(`${api}/ApproveRejectLeave/${leaveRequestId}`,leaveData); 
      return response.data;
    } catch (error) {
      console.error('Failed to approve or reject leave:', error);
      throw error;
    }
  },

  // Method to get all leave
  // getLeaveRecords: async () => {
  //   try {
  //     const response = await httpClient.get(`${api}/GetAll`); // Update 'GetAll' with actual endpoint if different
  //     return response.data;
  //   } catch (error) {
  //     console.error('Failed to fetch leave:', error);
  //     throw error;
  //   }
  // },

  // Method to get all departments
  // getByIdDesignation: async (designationId) => {
  //   try {
  //     const response = await httpClient.get(`${api}/${designationId}`);
  //     return response.data;
  //   } catch (error) {
  //     console.error('Failed to fetch designation:', error);
  //     throw error;
  //   }
  // },

  // updateDesignation: async (designationId,designationData) => {
  //   try {
  //     const response = await httpClient.put(`${api}/${designationId}`,designationData); 
  //     return response.data;
  //   } catch (error) {
  //     console.error('Failed to fetch designation:', error);
  //     throw error;
  //   }
  // },

  // deleteDesignation: async (designationId) => {
  //   try {
  //     const response = await httpClient.delete(`${api}/${designationId}`); // Update 'GetAll' with actual endpoint if different
  //     return response.data;
  //   } catch (error) {
  //     console.error('Failed to fetch designation:', error);
  //     throw error;
  //   }
  // },
  
};
