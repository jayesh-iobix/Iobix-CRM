import { environment } from "../../environment/environment";
import httpClient from "./HttpClient";

// Define the base URL for your API
const api = environment.announcement;

export const AnnouncementService = {
  // Method to add a announcement
  addAnnouncement: async (announcementData) => {
    try {
      const response = await httpClient.post(`${api}/Add`, announcementData);
      return response.data;
    } catch (error) {
      console.error("Failed to add Announcement:", error);
      throw error;
    }
  },

  // Method to get all Announcement
  getAnnouncement: async () => {
    try {
      const response = await httpClient.get(`${api}/GetAll`); // Update 'GetAll' with actual endpoint if different
      return response.data;
    } catch (error) {
      console.error("Failed to fetch Announcement:", error);
      throw error;
    }
  },

  // Methos to update Announcement
  updateAnnouncement: async (announcementId, announcementData) => {
    try {
      const response = await httpClient.put(
        `${api}/${announcementId}`,
        announcementData
      );
      return response.data;
    } catch (error) {
      console.error("Failed to Update Announcement:", error);
      throw error;
    }
  },

  // Methos to delete Announcement
  deleteAnnouncement: async (announcementId) => {
    try {
      const response = await httpClient.delete(`${api}/${announcementId}`);
      return response.data;
    } catch (error) {
      console.error("Failed to Delete Announcement:", error);
      throw error;
    }
  },

  // Method to get Announcement by id
  getAnnouncementById: async (announcementId) => {
    try {
      const response = await httpClient.get(`${api}/${announcementId}`);
      return response.data;
    } catch (error) {
      console.error("Failed to fetch Announcement:", error);
      throw error;
    }
  },
};
