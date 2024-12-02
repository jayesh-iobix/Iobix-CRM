import { environment } from '../../environment/environment';
import httpClient from './HttpClient';

// Define the base URL for your API
const api = environment.employeePermission;

export const EmployeePermissionService = {

  // Method to add a Employee
  addEmployeePermission: async (employeePermissionData) => {
    try {
      const response = await httpClient.post(`${api}/Add`, employeePermissionData);
      return response.data;
    } catch (error) {
      console.error('Failed to add Employee Permission:', error);
      throw error;
    }
  },

   // Method to get all Employee
   getEmployeesPermission: async () => {
    try {
      const response = await httpClient.get(`${api}/GetAll`); // Update 'GetAll' with actual endpoint if different
      return response.data;
    } catch (error) {
      console.error('Failed to fetch Employee Permission:', error);
      throw error;
    }
  },

   // Methos to update Employee
   updateEmployeePermission: async (employeePermissionId, employeePermissionData) => {
    try {
      const response = await httpClient.put(`${api}/${employeePermissionId}`,employeePermissionData); 
      return response.data;
    } catch (error) {
      console.error('Failed to Update Employee Permission:', error);
      throw error;
    }
  },

  // Methos to delete Employee
  deleteEmployeePermission: async (employeePermissionId) => {
    try {
      const response = await httpClient.delete(`${api}/${employeePermissionId}`); 
      return response.data;
    } catch (error) {
      console.error('Failed to Delete Employee Permission:', error);
      throw error;
    }
  },
  
  // Method to get single Employee
    getByIdEmployeePermission: async (employeePermissionId) => {
      try {
        const response = await httpClient.get(`${api}/${employeePermissionId}`); // Update 'GetAll' with actual endpoint if different
        return response.data;
      } catch (error) {
        console.error('Failed to fetch Employee Permission:', error);
        throw error;
      }
    },
 
};