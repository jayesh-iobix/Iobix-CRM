import axios from 'axios';
import { environment } from '../../environment/environment';
import httpClient from './HttpClient';

// Define the base URL for your API
const api = environment.designation;

export const DesignationService = {
  // Method to add a department
  addDesignation: async (designationData) => {
    try {
      const response = await httpClient.post(`${api}/Add`, designationData);
      return response.data;
    } catch (error) {
      console.error('Failed to add department:', error);
      throw error;
    }
  },

  // Method to get all departments
  getDesignation: async () => {
    try {
      const response = await httpClient.get(`${api}/GetAll`); // Update 'GetAll' with actual endpoint if different
      return response.data;
    } catch (error) {
      console.error('Failed to fetch departments:', error);
      throw error;
    }
  },

  // Method to get all departments
  getDesignationByDepartment: async (departmentId) => {
    try {
      // const {departmentId} = employeeData
      const response = await httpClient.get(`${api}/GetByDepartment/${departmentId}`);
      return response.data;
    } catch (error) {
      console.error('Failed to fetch designation:', error);
      throw error;
    }
  },

  // Method to get all departments
  getByIdDesignation: async (designationId) => {
    try {
      const response = await httpClient.get(`${api}/${designationId}`);
      return response.data;
    } catch (error) {
      console.error('Failed to fetch designation:', error);
      throw error;
    }
  },

  updateDesignation: async (designationId,designationData) => {
    try {
      const response = await httpClient.put(`${api}/${designationId}`,designationData); 
      return response.data;
    } catch (error) {
      console.error('Failed to fetch designation:', error);
      throw error;
    }
  },

  deleteDesignation: async (designationId) => {
    try {
      const response = await httpClient.delete(`${api}/${designationId}`); // Update 'GetAll' with actual endpoint if different
      return response.data;
    } catch (error) {
      console.error('Failed to fetch designation:', error);
      throw error;
    }
  },
  
};
