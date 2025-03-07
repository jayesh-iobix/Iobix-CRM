import axios from 'axios';
import { environment } from '../../environment/environment';
import httpClient from './HttpClient';

// Define the base URL for your API
const adminapi = environment.admin; 
const countryapi = environment.country; 
const stateapi = environment.state; 
const cityapi = environment.city; 
const clientCompRegi = environment.clientCompRegi; 

export const CommonService = {

  // Method to get all AdminMaster 
  getAdmin: async () => {
    try {
        const response = await httpClient.get(`${adminapi}/GetAll`); // Update 'GetAll' with actual endpoint if different
        return response.data;
      } catch (error) {
        console.error('Failed to fetch Admin:', error);
        throw error;
      }
  },

  // Method to get all Country 
  getCountry: async () => {
    try {
        const response = await axios.get(`${countryapi}/GetAll`); // Update 'GetAll' with actual endpoint if different
        return response.data;
      } catch (error) {
        console.error('Failed to fetch Country:', error);
        throw error;
      }
  },

  // Method to get all State by CountryId
  getState: async (countryId) => {
    try {
      const response = await axios.get(`${stateapi}/GetByCountry/${countryId}`); // Update 'GetAll' with actual endpoint if different
      return response.data;
    } catch (error) {
      console.error('Failed to fetch State:', error);
      throw error;
    }
  },
  
  // Method to get all City by StateId
  getCity: async (stateId) => {
    try {
      const response = await axios.get(`${cityapi}/GetByState/${stateId}`); // Update 'GetAll' with actual endpoint if different
      return response.data;
    } catch (error) {
      console.error('Failed to fetch City:', error);
      throw error;
    }
  },

  // Method to get all State by multiple CountryId
  getMultipleState: async (countryIds) => {
    debugger;
    // const countryId = ids.map((item) => item.countryId);
  
    const queryParams = new URLSearchParams();
    countryIds.forEach((id) => queryParams.append('ids', id));
      
    try {
      const response = await axios.get(`${stateapi}/GetByMultipleCountry?${queryParams.toString()}`); 
      return response.data;
    } catch (error) {
      console.error('Failed to fetch State:', error);
      throw error;
    }
  },

  // Method to get all City by multiple StateId
  getMultipleCity: async (stateIds) => {
    try {
      const queryParams = new URLSearchParams();
      stateIds.forEach((id) => queryParams.append('ids', id));

      const response = await axios.get(`${cityapi}/GetByMultipleState?${queryParams.toString()}`); 
      return response.data;
    } catch (error) {
      console.error('Failed to fetch City:', error);
      throw error;
    }
  },

  
};