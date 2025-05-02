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
  downloadTaskReport: async (employeeId, year, month) => {
    try {
      const response = await httpClient.get(`${api}/DownloadTaskAssignReport/${employeeId}/${year}/${month}`, {
        responseType: 'blob', // Important
      });
      // const response = await httpClient.get(`${api}/DownloadTaskAssignReport/${employeeId}/${year}/${month}`, {
      //   responseType: 'blob', // Important
      // });

      // Create a link element, use it to download the blob, and then remove it
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `Task_Report${month}_${year}.pdf`); // Specify the file name
      // link.setAttribute('download', 'TaskReport.pdf'); // Specify the file name
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error('Error downloading the report:', error);
    }
  },

  // Method to attendance task report
  downloadAttendanceReport: async (employeeId, month, year ) => {
    // debugger;
    try {
      const response = await httpClient.get(`${api}/DownloadAttendanceReport/${employeeId}/${month}/${year}`, {
        responseType: 'blob', // Important
      });

      // Create a link element, use it to download the blob, and then remove it
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `Attendance_Report_${month}_${year}.pdf`); // Specify the file name
      // link.setAttribute('download', 'AttendanceReport.pdf'); // Specify the file name
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error('Error downloading the report:', error);
    }
  },

  // Method to attendance task report
  downloadApplyLeaveReport: async (employeeId, month, year) => {
    // debugger;
    try {
      const response = await httpClient.get(`${api}/DownloadApplyLeaveReport/${employeeId}/${month}/${year}`, {
        responseType: 'blob', // Important
      });

      // Create a link element, use it to download the blob, and then remove it
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `ApplyLeave_Report${month}_${year}.pdf`); // Specify the file name
      // link.setAttribute('download', 'AttendanceReport.pdf'); // Specify the file name
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error('Error downloading the report:', error);
    }
  },

};



 // downloadTaskReport: async (employeeId) => {
  //   try {
  //     const response = await httpClient.get(`${api}/DownloadTaskAssignReport/${employeeId}`, {
  //       responseType: 'blob', // Important
  //     });

  //     // Create a link element, use it to download the blob, and then remove it
  //     const url = window.URL.createObjectURL(new Blob([response.data]));
  //     const link = document.createElement('a');
  //     link.href = url;
  //     link.setAttribute('download', 'TaskReport.pdf'); // Specify the file name
  //     document.body.appendChild(link);
  //     link.click();
  //     link.remove();
  //   } catch (error) {
  //     console.error('Error downloading the report:', error);
  //   }
  // },
