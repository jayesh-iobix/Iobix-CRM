import axios from 'axios';
import { environment } from '../../environment/environment';

// Define the base URL for your API
const countryapi = environment.country; 
const stateapi = environment.state; 
const cityapi = environment.city; 

export const CommonService = {

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
  getState: async (countryId,stateData) => {
    try {
      const response = await axios.get(`${stateapi}/GetByCountry/${countryId}`); // Update 'GetAll' with actual endpoint if different
      return response.data;
    } catch (error) {
      console.error('Failed to fetch State:', error);
      throw error;
    }
  },

  // Method to get all City by StateId
  getCity: async (stateId,cityData) => {
    try {
      const response = await axios.get(`${cityapi}/GetByState/${stateId}`); // Update 'GetAll' with actual endpoint if different
      return response.data;
    } catch (error) {
      console.error('Failed to fetch City:', error);
      throw error;
    }
  },

  
};