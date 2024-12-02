import { environment } from "../../environment/environment";
import httpClient from "./HttpClient";

// Define the base URL for your API
// const api = environment.task;
const userApi = environment.userSubTask;
const api = environment.subTask;

export const SubTaskNoteService = {
  // Method to add a task note
  addSubTaskNote: async (subTaskNoteData) => {
    try {
      const response = await httpClient.post(`${userApi}/AddSubTaskNote`,subTaskNoteData);
      return response.data;
    } catch (error) {
      console.error("Failed to add task:", error);
      throw error;
    }
  },

  // Method to get note tasks by Id
  getSubTaskNoteBySubTaskAllocationId: async (subTaskAllocationId) => {
    try {
      const response = await httpClient.get(`${api}/GetSubTaskNoteBySubTaskAllocationId/${subTaskAllocationId}`);
      return response.data;
    } catch (error) {
      console.error("Failed to fetch tasks:", error);
      throw error;
    }
  },

  // Method to get note tasks by Id
  getSubTaskNoteById: async (subTaskNoteId) => {
    try {
      const response = await httpClient.get(`${userApi}/GetByIdSubTaskNote/${subTaskNoteId}`);
      return response.data;
    } catch (error) {
      console.error("Failed to fetch tasks:", error);
      throw error;
    }
  },

  // Method to get tasks note By Id
  deleteSubTaskNote: async (subTaskNoteId) => {
    try {
      const response = await httpClient.delete(`${userApi}/DeleteSubTaskNote/${subTaskNoteId}`);
      return response.data;
    } catch (error) {
      console.error("Failed to fetch tasks:", error);
      throw error;
    }
  },

    // Method to update task note by id
    updateSubTaskNote: async (subTaskNoteId, subTaskNoteData) => {
      try {
        //debugger;
        const response = await httpClient.put(`${userApi}/UpdateSubTaskNote/${subTaskNoteId}`, subTaskNoteData);
        return response.data;
      } catch (error) {
        console.error('Failed to fetch taskNotes:', error);
        throw error;
      }
    },

  //   // Method to get all tasks
  //   getTasks: async () => {
  //     try {
  //       const response = await httpClient.get(${api}/GetAll); // Update 'GetAll' with actual endpoint if different
  //       return response.data;
  //     } catch (error) {
  //       console.error('Failed to fetch tasks:', error);
  //       throw error;
  //     }
  //   },

  //      // Method to update task by id
  //   updateTask: async (taskId, taskData) => {
  //     try {
  //       debugger;
  //       const response = await httpClient.put(${api}/${taskId}, taskData);
  //       return response.data;
  //     } catch (error) {
  //       console.error('Failed to fetch tasks:', error);
  //       throw error;
  //     }
  //   },

  //    // Method to detete task
  //    deleteTask: async (taskId) => {
  //     try {
  //       const response = await httpClient.delete(${api}/${taskId});
  //       return response.data;
  //     } catch (error) {
  //       console.error('Failed to fetch tasks:', error);
  //       throw error;
  //     }
  //   },
};