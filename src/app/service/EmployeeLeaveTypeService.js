import { environment } from '../../environment/environment';
import httpClient from './HttpClient';

// Define the base URL for your API
const api = environment.employeeLeaveType;

export const EmployeeLeaveTypeService = {
  // Method to add a employeeLeaveType
  addEmployeeLeaveType: async (employeeLeaveTypeData) => {
    try {
      const response = await httpClient.post(`${api}/Add`, employeeLeaveTypeData);
      return response.data;
    } catch (error) {
      console.error('Failed to add employe leaveType:', error);
      throw error;
    }
  },

  // Method to get all employeeLeaveType
  getLeaveEmployeeTypes: async () => {
    try {
      const response = await httpClient.get(`${api}/GetAll`); // Update 'GetAll' with actual endpoint if different
      return response.data;
    } catch (error) {
      console.error('Failed to fetch employe leaveTypes:', error);
      throw error;
    }
  },

  // Method to get by Id employeeLeaveType
  getByIdEmployeeLeaveTypes: async (employeeLeaveTypeId ) => {
    try {
      const response = await httpClient.get(`${api}/${employeeLeaveTypeId}`); 
      return response.data;
    } catch (error) {
      console.error('Failed to fetch employe leaveTypes:', error);
      throw error;
    }
  },

  // Method to update employeeLeaveType
  updateEmployeeLeaveTypes: async (employeeLeaveTypeId,employeeLeaveTypeData) => {
    try {
      const response = await httpClient.put(`${api}/${employeeLeaveTypeId}`,employeeLeaveTypeData); 
      return response.data;
    } catch (error) {
      console.error('Failed to fetch employe leaveTypes:', error);
      throw error;
    }
  },

  // Method to update isActive in employeeLeaveType
  updateIsActive: async (employeeLeaveTypeId,employeeLeaveTypeData) => {
    try {
      const response = await httpClient.put(`${api}/UpdateActiveStatus/${employeeLeaveTypeId}`,employeeLeaveTypeData); 
      return response.data;
    } catch (error) {
      console.error('Failed to fetch employe leaveTypes:', error);
      throw error;
    }
  },

  // Method to delete employeeLeaveType
  deleteEmployeeLeaveTypes: async (employeeLeaveTypeId ) => {
    try {
      const response = await httpClient.delete(`${api}/${employeeLeaveTypeId}`); 
      return response.data;
    } catch (error) {
      console.error('Failed to fetch employe leaveTypes:', error);
      throw error;
    }
  },
  
};
