import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import { InvoiceService } from "../../service/InvoiceService"; // Create this service file to fetch invoices
import { Link, useParams } from "react-router-dom";
import { FaEye, FaPlus } from "react-icons/fa";
import { GtmClientService } from "../../service/GtmClientService";
import { InvoicePaymentService } from "../../service/InvoicePaymentService";

const InvoicePayment = () => {
  const [clients, setClients] = useState([]);
  const [invoicePayment, setInvoicePayment] = useState([]);
  const [loading, setLoading] = useState(false);

  const { id } = useParams(); // invoice number or ID from route
//   const months = [
//     "January", "February", "March", "April", "May", "June",
//     "July", "August", "September", "October", "November", "December"
//   ];

//   useEffect(() => {
//     const fetchClients = async () => {
//       try {
//         const response = await GtmClientService.getGtmClient(); // replace with your actual method
//         setClients(response.data);
//       } catch (err) {
//         toast.error("Failed to load clients.");
//         console.error(err);
//       }
//     };

//     fetchClients();
//   }, []);

//   const getYears = () => {
//     const current = new Date().getFullYear();
//     return Array.from({ length: 11 }, (_, i) => current - 5 + i);
//   };

  const fetchInvoices = async () => {
    if (!id) return;

    setLoading(true);
    try {
      // debugger;
      const response = await InvoicePaymentService.getInvoicePaymentByInvoiceId(id);
      setInvoicePayment(response.data || []);
    } catch (error) {
      toast.error("Failed to fetch invoices.");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) fetchInvoices();
  }, [id]);

  //#region Status Color Logic
  // Function to set the color based on the leave status
  const getStatusColor = (amountStatusName) => {
    switch (amountStatusName) {
      case "Partial":
        return "text-yellow-500 bg-yellow-100"; // Yellow for Pending
      case "Paid":
        return "text-green-500 bg-green-100"; // Blue for FinalApproval
      case "Pending":
        return "text-red-500 bg-red-100"; // Red for Rejected
      default:
        return "text-gray-500 bg-gray-100"; // Default color
    }
  };
  //#endregion

  //#region Format Date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    
    // Ensure the date is valid
    if (isNaN(date)) {
      return 'Invalid Date'; // Handle invalid date
    }
  
    const day = String(date.getDate()).padStart(2, '0'); // Ensure 2 digits for day
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Ensure 2 digits for month
    const year = String(date.getFullYear()).slice(-2); // Get last 2 digits of the year
  
    return `${day}/${month}/${year}`;
  };
  //#endregion

  return (
    <div className="mt-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-center mb-4">
        <h1 className="text-xl font-semibold">Invoice Payment History</h1>
        <div className="flex">
          <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
            <Link
              to={`/invoice/add-invoice-payment/${id}`}
              className="bg-blue-600 hover:bg-blue-700 flex gap-2 text-center text-white font-medium py-2 px-4 rounded hover:no-underline"
            >
              Add
              <FaPlus className="mt-[3px]" size={14} />
            </Link>
          </motion.button>
        </div>
      </div>

      {/* Filters */}
      {/* <div className="-mx-4 px-2 flex flex-wrap gap-4 mb-4">
        <div className="w-full md:w-1/4 px-2">
          <label htmlFor="client" className="block mb-1">Client:</label>
          <select
            id="client"
            className="w-full border p-2 rounded border-gray-300"
            value={selectedClientId}
            onChange={(e) => setSelectedClientId(e.target.value)}
          >
            <option value="">Select Client</option>
            {clients.map((client) => (
              <option key={client.gtmClientServiceId} value={client.gtmClientServiceId}>
                {client.companyName}
              </option>
            ))}
          </select>
        </div>

        <div className="w-full md:w-1/4 px-2">
          <label htmlFor="year" className="block mb-1">Year:</label>
          <select
            id="year"
            className="w-full border p-2 rounded border-gray-300"
            value={year}
            onChange={(e) => setYear(parseInt(e.target.value))}
          >
            {getYears().map((y) => (
              <option key={y} value={y}>{y}</option>
            ))}
          </select>
        </div>

        <div className="w-full md:w-1/4 px-2">
          <label htmlFor="month" className="block mb-1">Month:</label>
          <select
            id="month"
            className="w-full border p-2 rounded border-gray-300"
            value={month}
            onChange={(e) => setMonth(parseInt(e.target.value))}
          >
            {months.map((m, index) => (
              <option key={index} value={index}>{m}</option>
            ))}
          </select>
        </div>
      </div> */}

      {/* Table */}
      <div className="grid overflow-x-auto">
        <table className="min-w-full bg-white rounded-lg border border-gray-200">
          <thead className="bg-gray-900 border-b">
            <tr>
              {["Paid Date", "Paid Amount", "Remaining Amount", "Status", 
              //"Actions"
              ].map((header) => (
                <th key={header} className="text-left py-3 px-4 uppercase font-semibold text-sm text-[#939393]">
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="7" className="text-center py-5">Loading...</td>
              </tr>
            ) : invoicePayment.length === 0 ? (
              <tr>
                <td colSpan="7" className="text-center py-5 text-gray-500">
                  No payment history found.
                </td>
              </tr>
            ) : (
              invoicePayment.map((invoice, index) => (
                <motion.tr
                  key={invoice.gtmClientPaymentId}
                  className="border-b hover:bg-gray-50"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.05 }}
                >
                  {/* <td className="py-3 px-4">{invoice.paidDate}</td> */}
                  <td className="py-3 px-4">
                    {invoice.paidDate ? formatDate(invoice.paidDate) : "N/A"}
                  </td>
                  <td className="py-3 px-4">₹{invoice.paidAmount || "N/A"}</td>
                  <td className="py-3 px-4">₹{invoice.remainingAmount || "N/A"}</td>
                  <td className="py-3 px-4">
                    <span
                      className={`px-2 py-1 rounded-lg font-medium ${getStatusColor(
                        invoice.amountStatusName
                      )}`}
                    >
                      {invoice.amountStatusName || "N/A"}
                    </span>
                    </td>
                  {/* <td className="py-3 px-4">
                    <div className="flex gap-2">
                      <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                        <Link
                          className="text-green-500 hover:text-green-700"
                          to={`/invoice/invoice-history/${invoice.invoiceMasterId}`}
                        >
                          <FaEye size={24} />
                        </Link>
                      </motion.button>
                    </div>
                  </td> */}
                </motion.tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default InvoicePayment;




// //#region Imports
// import React, { useState, useEffect } from "react";
// import { motion } from "framer-motion"; // Import framer-motion
// import { AttendanceService } from "../../service/AttendanceService";
// import { toast } from "react-toastify";
// import { useParams } from "react-router-dom";
// import { ReportService } from "../../service/ReportService";
// import { GtmClientService } from "../../service/GtmClientService";
// //#endregion

// //#region Component: AttendanceList
// const InvoicePayment = () => {
//   //#region State Variables
//   // Get the current year and month
//   const currentYear = new Date().getFullYear();
//   const currentMonth = new Date().getMonth(); // Get the current month (0-based index)

//   const [paymentData, setPaymentData] = useState([]);
//   const [gtmDataList, setGtmDataList] = useState([]);
//   const [gtmClientServiceId, setGtmClientServiceId] = useState("");
//   const [filteredData, setFilteredData] = useState([]);
//   const [year, setYear] = useState(currentYear); // Set the year to current year
//   const [selectedMonth, setSelectedMonth] = useState(currentMonth); // Set the selected month to current month
//   const [isSubmitting, setIsSubmitting] = useState(false);
  
//   const { id } = useParams();
//   //#endregion

//   //#region useEffect: Fetch Attendance Data
//   // Fetch attendance data when the component mounts
//   useEffect(() => {
//     const fetchAttendance = async () => {
//       try {
//         const response = await GtmClientService.getGtmClient();
//         console.log(response.data);
//         setGtmDataList(response.data);
//         setPaymentData(response.data);
//         setFilteredData(response.data);
//       } catch (error) {
//         console.error("Error fetching attendance data:", error);
//         alert("Error fetching attendance data, please try again.");
//       }
//     };

//     fetchAttendance();
//   }, []);
//   //#endregion

//   //#region Filter Function
//   // Create an array of months for the year
//   const months = [
//     "January", "February", "March", "April", "May", "June",
//     "July", "August", "September", "October", "November", "December"
//   ];

//   // Filter function to filter payement data based on selected month and year
//   const filterDataByMonthAndYear = (month, year) => {
//     setSelectedMonth(month); // Set the selected month
//     const filtered = paymentData.filter((payement) => {
//       const payementDate = new Date(payement.payementDate);
//       return payementDate.getFullYear() === year && payementDate.getMonth() === month;
//     });
//     setFilteredData(filtered);
//   };

//   useEffect(() => {
//     // Filter the data based on the current month and year when the component loads
//     filterDataByMonthAndYear(currentMonth, currentYear);
//   }, [currentMonth, currentYear]);
//   //#endregion

//   //#region Helper Functions
//   // Function to get all dates of a specific month and year
//   const getDaysInMonth = (month, year) => {
//     const daysInMonth = [];
//     const date = new Date(year, month, 1);
//     while (date.getMonth() === month) {
//       daysInMonth.push({
//         date: new Date(date),
//         day: date.toLocaleString('en-US', { weekday: 'long' }),
//       });
//       date.setDate(date.getDate() + 1);
//     }
//     return daysInMonth;
//   };

//   // Function to get all years range for the dropdown
//   const getYears = () => {
//     const currentYear = new Date().getFullYear();
//     const years = [];
//     for (let i = currentYear - 5; i <= currentYear + 5; i++) {
//       years.push(i);
//     }
//     return years;
//   };

//   // Function to format time in HH:MM format
//   const formatTime = (dateTime) => {
//     const date = new Date(dateTime);
//     const hours = String(date.getHours()).padStart(2, '0');
//     const minutes = String(date.getMinutes()).padStart(2, '0');
//     return ${hours}:${minutes};
//   };

//   // Function to format total time in HH:MM format
//   const formatTotalTime = (totalTime) => {
//     if (!totalTime) return '00:00'; // Handle empty or null case
  
//     // Split the totalTime string to get hours, minutes, and seconds
//     const timeParts = totalTime.split(':');
  
//     // Ensure there are at least hours and minutes
//     const hours = timeParts[0] || '00';
//     const minutes = timeParts[1] || '00';
  
//     return ${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')};
//   };

//   // Function to set the color based on the attendance status
//   const getStatusColor = (statusName) => {
//     switch (statusName) {
//       case "Present":
//         return "text-gray-500 bg-gray-100"; // Present color
//       case "LeaveApproved":
//         return "text-green-500 bg-green-100"; // Green for Approved
//       case "LeaveRequest":
//         return "text-red-500 bg-red-100"; // Red for Rejected
//       case "OnLeave":
//         return "text-red-500 bg-red-100"; // Red for On Leave
//       case "Absent":
//         return "text-red-500 bg-red-100"; // Red for Absent
//       default:
//         return ""; // Default color
//     }
//   };
//   //#endregion

//   //#region Download Report Function
//   const handleDownloadReport = async () => {
//     const month = months[selectedMonth]; // Get the month name using the selected index
//     setIsSubmitting(true);

//     try {
//       // Wait for the report download to complete with the selected year and month
//     //   const response = await ReportService.downloadAttendanceReport(id, month, year);
//     //   if(response) {
//         toast.success("Report downloaded successfully!");
//     //   }
//     } catch (error) {
//       console.error("Error downloading report:", error);
//       toast.error("Failed to download report.");
//     } finally {
//       setIsSubmitting(false);
//     }
//   };
//   //#endregion

//   //#region Render
//   return (
//     <div className="mt-4 ">
//       {/* Header Section */}
//       <div className="flex flex-col sm:flex-row justify-between items-center my-3">
//         <h1 className="font-semibold text-2xl ">Payment List for {year}</h1>

//         {/* Download Report Button */}
//         <motion.button
//           whileHover={{ scale: 1.1 }}
//           whileTap={{ scale: 0.9 }}
//           type="button" // Added this line to prevent form submission
//           onClick={handleDownloadReport}
//           className ={`me-3 bg-purple-600 hover:bg-purple-700 flex gap-2 text-center text-white font-medium py-2 px-4 rounded hover:no-underline 
//             ${isSubmitting ? "opacity-50 cursor-not-allowed" : "" }`}
//           disabled={isSubmitting}
//         >
//           {isSubmitting ? "Downloading..." : "Download Report"}
//         </motion.button>
//       </div>

//       {/* Card for Year and Month Dropdown */}
//       <div className="-mx-4 px-10 flex flex-wrap gap-4">

//         <div className="w-full mb-2 px-3 md:w-1/3">
//           <label htmlFor="gtmClient" className="mr-2">GTM Clients:</label>
//           <select
//             value={gtmClientServiceId}
//             onChange= {(e) => { setGtmClientServiceId(e.target.value); }}
//             name="gtmClientServiceId"
//             className="w-28 sm:w-1/2 md:w-1/2 lg:w-1/2 border p-2 rounded border-active"
//           >
//             <option value="" className="text-gray-400">
//               --Select GtmClient--
//             </option>
//             {gtmDataList.length > 0 ? (
//               gtmDataList.map((gtmClient) => (
//                 <option
//                   key={gtmClient.gtmClientServiceId}
//                   value={gtmClient.gtmClientServiceId}
//                 >
//                   {gtmClient.clientCompanyName}
//                 </option>
//               ))
//             ) : (
//               <option value="" disabled>
//                 No GtmClient available
//               </option>
//             )}
//           </select>
//         </div>
        
//         <div className="w-full mb-2 px-3 md:w-1/3">
//           <label htmlFor="year" className="mr-2">Year:</label>
//           <select
//             id="year"
//             value={year}
//             onChange={(e) => {
//               setYear(parseInt(e.target.value));
//               filterDataByMonthAndYear(selectedMonth, parseInt(e.target.value)); // Re-filter data when year changes
//             }}
//             className="w-24 sm:w-1/2 md:w-1/2 lg:w-1/2 border p-2 rounded border-active"
//           >
//             {getYears().map((yearOption) => (
//               <option key={yearOption} value={yearOption}>
//                 {yearOption}
//               </option>
//             ))}
//           </select>
//         </div>

//         <div className="w-full mb-2 px-3 md:w-1/3">
//           <label htmlFor="month" className="mr-2">Month:</label>
//           <select
//             id="month"
//             value={selectedMonth !== null ? selectedMonth : ""}
//             onChange={(e) => {
//               const selectedMonthIndex = parseInt(e.target.value);
//               setSelectedMonth(selectedMonthIndex);
//               filterDataByMonthAndYear(selectedMonthIndex, year); // Re-filter data when month changes
//             }}
//             className="w-30 sm:w-1/2 md:w-1/2 lg:w-1/2 border p-2 rounded border-active"
//           >
//             <option value="">Select Month</option>
//             {months.map((month, index) => (
//               <option key={index} value={index}>
//                 {month}
//               </option>
//             ))}
//           </select>
//         </div>
//       </div>

//       {/* Display Days and Dates of Selected Month */}
//       {/* <section className="bg-white rounded-lg shadow-lg m-1 p-4 sm:p-8">
//         {selectedMonth !== null && (
//           <div className="grid overflow-x-auto">
//             <table className="min-w-full table-auto border-collapse">
//               <thead className="bg-gray-900 border-b">
//                 <tr>
//                   <th className="px-4 py-2 border-b text-left uppercase font-semibold text-sm text-[#939393]">Date</th>
//                   <th className="px-4 py-2 border-b text-left uppercase font-semibold text-sm text-[#939393]">Day</th>
//                   <th className="px-4 py-2 border-b text-left uppercase font-semibold text-sm text-[#939393]">In Time</th>
//                   <th className="px-4 py-2 border-b text-left uppercase font-semibold text-sm text-[#939393]">Out Time</th>
//                   <th className="px-4 py-2 border-b text-left uppercase font-semibold text-sm text-[#939393]">Working Hours</th>
//                   <th className="px-4 py-2 border-b text-left uppercase font-semibold text-sm text-[#939393]">Status</th>
//                   <th className="px-4 py-2 border-b text-left uppercase font-semibold text-sm text-[#939393]">Work Note</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {getDaysInMonth(selectedMonth, year).map((dayData, index) => {
//                   const attendance = filteredData.find((attendance) => {
//                     const attendanceDate = new Date(attendance.attendanceDate);
//                     return attendanceDate.toLocaleDateString() === dayData.date.toLocaleDateString();
//                   });

//                   return (
//                     <tr key={index} className={hover:bg-gray-100 ${dayData.day === "Sunday" || dayData.day === "Saturday" ? "bg-yellow-200" : ""}}>
//                       <td className="px-4 py-2 border-b">
//                         {`${dayData.date.getDate()}/${
//                           dayData.date.getMonth() + 1
//                         }/${dayData.date.getFullYear()}`}
//                       </td>
//                       <td className="px-4 py-2 border-b">{dayData.day}</td>
//                       <td className="px-4 py-2 border-b">{attendance && attendance.inDateTime ? formatTime(attendance.inDateTime) : '-'}</td>
//                       <td className="px-4 py-2 border-b">{attendance && attendance.outDateTime ? formatTime(attendance.outDateTime) : '-'}</td>
//                       <td className="px-4 py-2 border-b">
//                         {attendance && attendance.outDateTime ? formatTotalTime(attendance.totalTime) : '00:00'}
//                       </td>
//                       <td className="py-3 px-4">
//                         <span
//                           className={`px-2 py-1 rounded-lg font-medium ${getStatusColor(
//                             attendance ? attendance.statusName : '-'
//                           )}`}
//                         >
//                           {attendance ? attendance.statusName : '-'}
//                         </span>
//                       </td>
//                       <td className="px-4 py-2 border-b">{attendance ? attendance.workNote : "-"}</td>
//                     </tr>
//                   );
//                 })}
//               </tbody>
//             </table>
//           </div>
//         )}
//       </section> */}
//     </div>
//   );
//   //#endregion
// };

// export default InvoicePayment;
// //#endregion
