import axios from 'axios';
import { environment } from '../../environment/environment';
import httpClient from './HttpClient';

// Define the base URL for your API
const api = environment.profile;

export const ProfileService = {

// Method to get Employee details
getEmployeesProfileDetail: async () => {
  try {
    const response = await httpClient.get(`${api}/GetEmployeeProfileDetail`); // Update 'GetAll' with actual endpoint if different
    return response.data;
  } catch (error) {
    console.error('Failed to fetch departments:', error);
    throw error;
  }
},

// Method to get Partner details
getPartnerProfileDetail: async () => {
  try {
    const response = await httpClient.get(`${api}/GetPartnerProfileDetail`); // Update 'GetAll' with actual endpoint if different
    return response.data;
  } catch (error) {
    console.error('Failed to fetch Partner:', error);
    throw error;
  }
},

// Method to get Client Company details
getClientProfileDetail: async () => {
  try {
    const response = await httpClient.get(`${api}/GetClientProfileDetail`); // Update 'GetAll' with actual endpoint if different
    return response.data;
  } catch (error) {
    console.error('Failed to fetch Client Company:', error);
    throw error;
  }
},

// Method to get Vendor details
getVendorProfileDetail: async () => {
  try {
    const response = await httpClient.get(`${api}/GetVendorProfileDetail`); // Update 'GetAll' with actual endpoint if different
    return response.data;
  } catch (error) {
    console.error('Failed to fetch Vendor:', error);
    throw error;
  }
},
  
};