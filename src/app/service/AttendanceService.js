import { environment } from '../../environment/environment';
import httpClient from './HttpClient';

// Define the base URL for your API
const api = environment.attendance;

export const AttendanceService = {
  // Method to add a attendance
  addAttendance: async () => {
    // debugger;
    try {
      const response = await httpClient.post(`${api}/TimeIn`);
      return response.data;
    } catch (error) {
      console.error('Failed to add attendanceData:', error);
      throw error;
    }
  },

  // Method to get all attendance
  getAttendance: async () => {
    try {
      const response = await httpClient.get(`${api}/GetAll`); // Update 'GetAll' with actual endpoint if different
      return response.data;
    } catch (error) {
      console.error('Failed to fetch attendance:', error);
      throw error;
    }
  },

  // Method to update attendance
  updateAttendance: async (attendanceData) => {
    debugger;
    try {
      const response = await httpClient.put(`${api}/TimeOut`, attendanceData); 
      return response.data;
    } catch (error) {
      console.error('Failed to fetch attendanceData:', error);
      throw error;
    }
  },

  //Method to get attendance by employeeId 
  getAttendanceByEmployeeId: async (employeeId) => {
    try {
      // const {departmentId} = employeeData
      const response = await httpClient.get(`${api}/GetAll/${employeeId}`);
      return response.data;
    } catch (error) {
      console.error('Failed to fetch attendance:', error);
      throw error;
    }
  },

  //Method to get attendance by employeeId at admin
  getAttendanceByEmployeeIdatAdmin: async (employeeId) => {
    try {
      // const {departmentId} = employeeData
      const response = await httpClient.get(`${api}/GetForAdmin/${employeeId}`);
      return response.data;
    } catch (error) {
      console.error('Failed to fetch attendance:', error);
      throw error;
    }
  },

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
