// #region Imports
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion"; // Import framer-motion
import { FaCheck, FaCross, FaPlus, FaTimes } from "react-icons/fa";
import { LeaveService } from "../../service/LeaveService";
import { toast } from "react-toastify";
import { use } from "react";
import { useParams } from "react-router-dom";
import { FaX } from "react-icons/fa6";
import { ReportService } from "../../service/ReportService";
//#endregion

//#region Component: LeaveList
const LeaveList = () => {

  //#region State Variables
  // Get the current year and month
  const currentYear = new Date().getFullYear();
  const currentMonth = new Date().getMonth(); // Get the current month (0-based index)

  const [leaveData, setLeaveData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [year, setYear] = useState(currentYear); // Set the year to current year
  const [selectedMonth, setSelectedMonth] = useState(currentMonth); // Set the selected month to current month
  const [showModal, setShowModal] = useState(false); // Modal visibility
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [totalBalance, setTotalBalance] = useState(''); // Total balance of different leave types
  const [leaveBalance, setLeaveBalance] = useState([]); // Leave types from backend

  const {id} = useParams();
  //#endregion

  //#region Functions
  // Function to fetch leave records from the backend
  const fetchLeaveRecords = async () => {
    try {
      const response = await LeaveService.getLeaveRecords(id);
      setLeaveData(response.data);
      setFilteredData(response.data);
  
      const responseCount = await LeaveService.getTotalLeaveCount(id);
      setTotalBalance(responseCount.data);
      // console.log(responseCount)
  
      const responseBalance = await LeaveService.getTotalLeaveBalance(id);
      setLeaveBalance(responseBalance.data);
      // console.log(responseBalance.data)
  
    } catch (error) {
      console.error("Error fetching leave data:", error);
      alert("Error fetching leave data, please try again.");
    }
  };
  //#endregion

  //#region useEffect
  // Fetch leave records when the component mounts
  useEffect(() => {
    fetchLeaveRecords();
  }, []);
  //#endregion

  //#region Filter Data
  // Function to get all months for the year
  const months = [
    "January", "February", "March", "April", "May", "June", 
    "July", "August", "September", "October", "November", "December"
  ];
  
  // Function to filter leave data by selected month and year
  const filterDataByMonthAndYear = (month, year) => {
    setSelectedMonth(month); // Set the selected month
    const filtered = leaveData.filter((leave) => {
      const leaveDate = new Date(leave.fromDate);
      return leaveDate.getFullYear() === year && leaveDate.getMonth() === month;
    });
    setFilteredData(filtered);
  };
  //#endregion

  //#region Approve/Reject Leave
  // Handle leave approval or rejection
  const handelApproveRejectLeave = async (leave, statusValue, e) => {
    e.preventDefault();

    // console.log(leave);
    const leaveData = {
      employeeId: leave.employeeId,
      leaveTypeId: leave.leaveTypeId,
      fromDate: leave.fromDate,
      toDate: leave.toDate,
      totalDays: leave.totalDays,
      reason: leave.reason,
      leaveType: leave.leaveType,
      status: statusValue  // 1 for Approve, 2 for Reject
    };

    // debugger;

    try {
      const response = await LeaveService.approveRejectLeave(leave.leaveRequestId,leaveData);
      if (response.status === 1) {
        toast.success("Leave Approved Succesfully"); // Toast on success
        fetchLeaveRecords();
      }
      if (response.status === 2) {
        toast.error("Leave Rejected Succesfully"); // Toast on success
        fetchLeaveRecords();
      }
    } catch (error) {
      console.error("Error applying leave:", error);
      toast.error("Failed to apply for leave.");
    }
  };
  //#endregion

  //#region Format Date and Get Status Color
  // Function to format date in dd-mm-yyyy format
  const formatDate = (dateString) => {
    const dateObj = new Date(dateString);
    const day = String(dateObj.getDate()).padStart(2, "0"); // Add leading zero for single digit days
    const month = String(dateObj.getMonth() + 1).padStart(2, "0"); // Get month (0-based, so add 1)
    const year = dateObj.getFullYear();
  
    return `${day}-${month}-${year}`;
  };
  // Function to set the color based on the leave status
  const getStatusColor = (statusName) => {
    switch (statusName) {
      case "Pending":
        return "text-yellow-500 bg-yellow-100"; // Yellow for Pending
      case "Approved":
        return "text-green-500 bg-green-100"; // Green for Approved
      case "Rejected":
        return "text-red-500 bg-red-100"; // Red for Rejected
      default:
        return "text-gray-500 bg-gray-100"; // Default color
    }
  };
  //#endregion
  
  //#region Download Report
  // Function to handle report download
  const handleDownloadReport = async () => {
      const month = months[selectedMonth]; // Get the month name using the selected index
      setIsSubmitting(true);
  
      try {
        // Wait for the report download to complete with the selected year and month
        const response = await ReportService.downloadApplyLeaveReport(id, month, year);
        if(response) {
          toast.success("Report downloaded successfully!");
        }
      } catch (error) {
        console.error("Error downloading report:", error);
        toast.error("Failed to download report.");
      } finally {
        setIsSubmitting(false);
      }
  };
  //#endregion

  //#region Render
  return (
    <div className="mt-4">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row justify-between items-center my-3">
        <h1 className="font-semibold text-2xl sm:text-3xl">
          Leave Records for {year}
        </h1>

        {/* Download Report Button */}
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          type="button" // Added this line to prevent form submission
          onClick={handleDownloadReport}
          className={`me-3 bg-purple-600 hover:bg-purple-700 flex gap-2 text-center text-white font-medium py-2 px-4 rounded hover:no-underline 
            ${isSubmitting ? "opacity-50 cursor-not-allowed" : ""}`}
          disabled={isSubmitting}
        >
          {isSubmitting ? "Downloading..." : "Download Report"}
        </motion.button>
      </div>

      {/* Card for Year and Month Dropdown */}
      <div className="px-4 md:px-10">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 flex-wrap">
          {/* Year and Month Dropdowns Grouped on the Left */}
          <div className="flex flex-col md:flex-row gap-4 w-full md:w-auto">
            {/* Year Dropdown */}
            <div className="flex items-center">
              <label htmlFor="year" className="mr-2">
                Year:
              </label>
              <select
                id="year"
                value={year}
                onChange={(e) => {
                  setYear(parseInt(e.target.value));
                  filterDataByMonthAndYear(
                    selectedMonth,
                    parseInt(e.target.value)
                  );
                }}
                className="border p-2 rounded border-active"
              >
                {new Array(10).fill(0).map((_, idx) => (
                  <option key={idx} value={currentYear - 5 + idx}>
                    {currentYear - 5 + idx}
                  </option>
                ))}
              </select>
            </div>

            {/* Month Dropdown */}
            <div className="flex items-center">
              <label htmlFor="month" className="mr-2">
                Month:
              </label>
              <select
                id="month"
                value={selectedMonth !== null ? selectedMonth : ""}
                onChange={(e) => {
                  const selectedMonthIndex = parseInt(e.target.value);
                  setSelectedMonth(selectedMonthIndex);
                  filterDataByMonthAndYear(selectedMonthIndex, year);
                }}
                className="border p-2 rounded border-active"
              >
                <option value="">Select Month</option>
                {months.map((month, index) => (
                  <option key={index} value={index}>
                    {month}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Total Balance Button on Right (from md and above) */}
          <motion.button
            type="button"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setShowModal(true)}
            className="bg-orange-600 hover:bg-orange-700 text-white py-2 px-4 rounded self-start md:self-auto"
          >
            Total Balance: {totalBalance} days
          </motion.button>
        </div>

        {/* Leave Breakdown Modal */}
        {showModal && (
          <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
              <h2 className="text-xl font-semibold mb-4">
                Leave Balance Breakdown
              </h2>

              <div className="mb-4">
                <h3 className="text-lg font-semibold">Leave Types</h3>
                <ul className="space-y-2 mt-2">
                  {leaveBalance.map((leave, index) => (
                    <li key={index} className="flex justify-between">
                      <span>{leave.leaveTypeName}</span>
                      <span>{leave.totalLeaveBalance} days</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="flex justify-end gap-2">
                <button
                  onClick={() => setShowModal(false)}
                  className="bg-gray-500 text-white py-2 px-4 rounded-md"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Display Leave Records for the Selected Month */}
      {selectedMonth !== null && (
        <section className="m-1 p-4 sm:p-8">
          <div className="grid overflow-x-auto">
            <table className="min-w-full table-auto border-collapse">
              <thead className="bg-gray-900 border-b">
                <tr>
                  <th className="px-4 py-2 border-b text-left uppercase font-semibold text-sm text-[#939393]">
                    From Date
                  </th>
                  <th className="px-4 py-2 border-b text-left uppercase font-semibold text-sm text-[#939393]">
                    To Date
                  </th>
                  <th className="px-4 py-2 border-b text-left uppercase font-semibold text-sm text-[#939393]">
                    Status
                  </th>
                  <th className="px-4 py-2 border-b text-left uppercase font-semibold text-sm text-[#939393]">
                    Reason
                  </th>
                  <th className="px-4 py-2 border-b text-left uppercase font-semibold text-sm text-[#939393]">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredData.map((leave, index) => (
                  <tr key={index} className="hover:bg-gray-100">
                    <td className="px-4 py-2 border-b">
                      {leave.fromDate ? formatDate(leave.fromDate) : ""}
                    </td>
                    <td className="px-4 py-2 border-b">
                      {leave.toDate ? formatDate(leave.toDate) : ""}
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={`px-2 py-1 rounded-lg font-medium ${getStatusColor(
                          leave.statusName
                        )}`}
                      >
                        {leave.statusName}
                      </span>
                    </td>
                    {/* <td className="px-4 py-2 border-b">{leave.statusName}</td> */}
                    <td className="px-4 py-2 border-b">{leave.reason}</td>
                    <td className="px-4 py-2 border-b">
                      {leave.status === 0 ? (
                        <div className="flex gap-2">
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={(e) => {
                              handelApproveRejectLeave(leave, 1, e);
                            }}
                            className="bg-green-600 hover:bg-green-700 flex gap-2 text-center text-white font-medium py-2 px-4 mr-3 rounded hover:no-underline"
                          >
                            Approve
                            <FaCheck size={18} />
                          </motion.button>
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={(e) => {
                              handelApproveRejectLeave(leave, 2, e);
                            }}
                            className="bg-red-600 text-white py-2 px-4 flex gap-2 rounded-md"
                          >
                            Reject
                            <FaTimes size={18} />
                          </motion.button>
                        </div>
                      ) : leave.status === 1 ? (
                        <p className="text-green-500">
                          Leave is already approved
                        </p>
                      ) : leave.status === 2 ? (
                        <p className="text-red-500">
                          Leave is already rejected
                        </p>
                      ) : leave.status === 3 ? (
                        <p className="text-gray-500">
                          Leave is cancled by employee
                        </p>
                      ) : null}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}
    </div>
  );
  //#endregion
};

export default LeaveList;
//#endregion