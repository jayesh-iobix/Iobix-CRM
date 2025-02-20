import { environment } from '../../environment/environment';
import httpClient from './HttpClient';

// Define the base URL for your API
const api = environment.report;

export const ReportService = {
  // Method to download employee report
  downloadEmployeeReport: async () => {
    try {
      const response = await httpClient.get(`${api}/DownloadEmployeeReport`, {
        responseType: 'blob', // Important
      });

      // Create a link element, use it to download the blob, and then remove it
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'EmployeeReport.pdf'); // Specify the file name
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error('Error downloading the report:', error);
    }
  },

  // Method to download task report
  downloadTaskReport: async (employeeId) => {
    try {
      const response = await httpClient.get(`${api}/DownloadTaskAssignReport/${employeeId}`, {
        responseType: 'blob', // Important
      });

      // Create a link element, use it to download the blob, and then remove it
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'TaskReport.pdf'); // Specify the file name
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error('Error downloading the report:', error);
    }
  },
  

  // Method to get all attendance
//   getAttendance: async () => {
//     try {
//       const response = await httpClient.get(`${api}/GetAll`); // Update 'GetAll' with actual endpoint if different
//       return response.data;
//     } catch (error) {
//       console.error('Failed to fetch attendance:', error);
//       throw error;
//     }
//   },

  // Method to update attendance
//   updateAttendance: async (attendanceData) => {
//     debugger;
//     try {
//       const response = await httpClient.put(`${api}/TimeOut`, attendanceData); 
//       return response.data;
//     } catch (error) {
//       console.error('Failed to fetch attendanceData:', error);
//       throw error;
//     }
//   },

  //Method to get attendance by employeeId 
//   getAttendanceByEmployeeId: async (employeeId) => {
//     try {
//       // const {departmentId} = employeeData
//       const response = await httpClient.get(`${api}/GetAll/${employeeId}`);
//       return response.data;
//     } catch (error) {
//       console.error('Failed to fetch attendance:', error);
//       throw error;
//     }
//   },

  //Method to get attendance by employeeId at admin
//   getAttendanceByEmployeeIdatAdmin: async (employeeId) => {
//     try {
//       // const {departmentId} = employeeData
//       const response = await httpClient.get(`${api}/GetForAdmin/${employeeId}`);
//       return response.data;
//     } catch (error) {
//       console.error('Failed to fetch attendance:', error);
//       throw error;
//     }
//   },

};
