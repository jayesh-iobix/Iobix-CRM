import axios from 'axios';
import { environment } from '../../environment/environment';
import httpClient from './HttpClient';

// Define the base URL for your API
const api = environment.employee;

export const EmployeeService = {

  // Method to add a Employee
  addEmployee: async (employeeData) => {
    try {
      const response = await httpClient.post(`${api}/Add`, employeeData);
      return response.data;
    } catch (error) {
      console.error('Failed to add employee:', error);
      throw error;
    }
  },

  // Method to get all Employee
  getEmployees: async () => {
   try {
     const response = await httpClient.get(`${api}/GetAll`); // Update 'GetAll' with actual endpoint if different
     return response.data;
   } catch (error) {
     console.error('Failed to fetch employees:', error);
     throw error;
   }
  },

  // Method to get BD Employee
  getBDEmployees: async () => {
   try {
     const response = await httpClient.get(`${api}/GetBDEmployee`); // Update 'GetAll' with actual endpoint if different
     return response.data;
   } catch (error) {
     console.error('Failed to fetch employees:', error);
     throw error;
   }
  },
    
  // Method to getRecentEmployee
  getRecentEmployee: async () => {
   try {
     const response = await httpClient.get(`${api}/GetRecentEmployee`);
     return response.data;
   } catch (error) {
     console.error('Failed to fetch employees:', error);
     throw error;
   }
  },

   // Method to get Inquiry Transfer Employee
   getInquiryTransferEmployees: async (inquiryRegistrationId) => {
    try {
      const response = await httpClient.get(`${api}/GetByInquiryTransferEmployee/${inquiryRegistrationId}`); // Update 'GetAll' with actual endpoint if different
      return response.data;
    } catch (error) {
      console.error('Failed to fetch departments:', error);
      throw error;
    }
  },

   // Methos to update Employee
   updateEmployee: async (employeeId, updatedEmployeeData) => {
    try {
      const response = await httpClient.put(`${api}/${employeeId}`,updatedEmployeeData); 
      return response.data;
    } catch (error) {
      console.error('Failed to fetch employee:', error);
      throw error;
    }
  },

  // Methos to delete Employee
  deleteEmployee: async (employeeId) => {
    try {
      const response = await httpClient.delete(`${api}/${employeeId}`); 
      return response.data;
    } catch (error) {
      console.error('Failed to fetch employee:', error);
      throw error;
    }
  },
  
  // Method to get single Employee
  getByIdEmployee: async (employeeId) => {
    try {
      const response = await httpClient.get(`${api}/${employeeId}`); // Update 'GetAll' with actual endpoint if different
      return response.data;
    } catch (error) {
      console.error('Failed to fetch employee:', error);
      throw error;
    }
  },

  // Method to get EmployeeCode
  getEmployeeCode: async (dateOfJoining) => {
    try {
      const response = await httpClient.get(`${api}/GenerateEmployeeCode/${dateOfJoining}`);
      return response.data;
    } catch (error) {
      console.error('Failed to fetch employee code:', error);
      throw error;
    }
  },

  // Method to get Employee Based on Department
  getEmployeeByDepartment: async (departmentId) => {
    try {
      const response = await httpClient.get(`${api}/GetByDepartment/${departmentId}`);
      return response.data;
    } catch (error) {
      console.error('Failed to fetch employees:', error);
      throw error;
    }
  },

  // Method to get Employee Based on multiple Department
  getEmployeeByMultiDepartment: async (departmentIds) => {
    try {
      const queryParams = new URLSearchParams();
      departmentIds.forEach(id => queryParams.append('DepartmentIds', id));

      const response = await httpClient.get(`${api}/GetByMultiDepartment?${queryParams.toString()}`);
      return response.data;
    } catch (error) {
      console.error('Failed to fetch employees:', error);
      throw error;
    }
  },

  // Method to get all Employee
  getEmployeesProfileDetail: async () => {
    try {
      const response = await httpClient.get(`${api}/GetProfileDetail`); // Update 'GetAll' with actual endpoint if different
      return response.data;
    } catch (error) {
      console.error('Failed to fetch departments:', error);
      throw error;
    }
  },
  
};
