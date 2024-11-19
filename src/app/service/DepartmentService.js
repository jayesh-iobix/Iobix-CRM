import axios from 'axios';
import { environment } from '../../environment/environment';
import httpClient from './HttpClient';

// Define the base URL for your API
const api = environment.department;

export const DepartmentService = {
  // Method to add a department
  addDepartment: async (departmentData) => {
    try {
      const response = await httpClient.post(`${api}/Add`, departmentData);
      return response.data;
    } catch (error) {
      console.error('Failed to add department:', error);
      throw error;
    }
  },

  // Method to get all departments
  getDepartments: async () => {
    try {
      const response = await httpClient.get(`${api}/GetAll`); // Update 'GetAll' with actual endpoint if different
      return response.data;
    } catch (error) {
      console.error('Failed to fetch departments:', error);
      throw error;
    }
  },

  // Method to get all departments
  getByIdDepartments: async (departmentId) => {
    try {
      const response = await httpClient.get(`${api}/${departmentId}`); // Update 'GetAll' with actual endpoint if different
      return response.data;
    } catch (error) {
      console.error('Failed to fetch departments:', error);
      throw error;
    }
  },

  // Method to get all departments
  updateDepartments: async (departmentId,departmentData) => {
    try {
      const response = await httpClient.put(`${api}/${departmentId}`,departmentData); // Update 'GetAll' with actual endpoint if different
      return response.data;
    } catch (error) {
      console.error('Failed to fetch departments:', error);
      throw error;
    }
  },

  deleteDepartments: async (departmentId) => {
    try {
      const response = await httpClient.delete(`${api}/${departmentId}`); // Update 'GetAll' with actual endpoint if different
      return response.data;
    } catch (error) {
      console.error('Failed to fetch departments:', error);
      throw error;
    }
  },
  
};
