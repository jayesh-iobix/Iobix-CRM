import React from 'react';
import axios from 'axios';
import { motion } from "framer-motion"; // Import framer-motion

const DownloadReport = () => {
  const downloadReport = async () => {
    try {
      const response = await axios.get('https://localhost:7292/api/Report/DownloadCustomerReport', {
        responseType: 'blob', // Important
      });

      // Create a link element, use it to download the blob, and then remove it
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'CustomerReport.pdf'); // Specify the file name
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error('Error downloading the report:', error);
    }
  };

  return (
    <div>
      {/* <button onClick={downloadReport}>Download Report</button> */}
      <motion.button 
        whileHover={{ scale: 1.1 }} 
        whileTap={{ scale: 0.9 }}
        onClick={downloadReport}
        className="bg-blue-600 hover:bg-blue-700 flex gap-2 text-center text-white font-medium py-2 px-4 rounded hover:no-underline" 
      >
         Download Report
      </motion.button>
    </div>
  );
};

export default DownloadReport;
