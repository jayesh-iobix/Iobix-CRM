import React, { useState, useEffect } from "react";
import { motion } from "framer-motion"; // Import framer-motion
import { FaPlus, FaTimes } from "react-icons/fa";
import { LeaveService } from "../../service/LeaveService";
import { toast } from "react-toastify";
import { LeaveTypeService } from "../../service/LeaveTypeService";

const LeaveModule = () => {

  const currentYear = new Date().getFullYear();
  const currentMonth = new Date().getMonth(); // Get the current month (0-based index)

  const [leaveData, setLeaveData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [year, setYear] = useState(currentYear); // Set the year to current year
  const [selectedMonth, setSelectedMonth] = useState(currentMonth); // Set the selected month to current month
  const [showModal, setShowModal] = useState(false); // Modal visibility
  const [fromDate, setFromDate] = useState(""); // From Date
  const [toDate, setToDate] = useState(""); // To Date
  const [totalDays, setTotalDays] = useState(0); // Total Days between fromDate and toDate
  const [reason, setReason] = useState(""); // Reason for leave
  const [leaveType, setLeaveType] = useState(""); // Leave Type (Full-Day / Half-Day)
  const [leaveTypeId, setLeaveTypeId] = useState("");
  const [leaveTypeList, setLeaveTypeList] = useState([]);
  const [status, setStatus] = useState("0"); // Leave Type (Full-Day / Half-Day)

  const employeeId = sessionStorage.getItem("LoginUserId");

const fetchLeaveRecords = async () => {
  try {
    const response = await LeaveService.getLeaveRecords(employeeId);
    setLeaveData(response.data);
    setFilteredData(response.data);
  } catch (error) {
    console.error("Error fetching leave data:", error);
    alert("Error fetching leave data, please try again.");
  }
};

const fetchLeaveType = async () => {
  try {
    const response = await LeaveTypeService.getLeaveTypes();
    setLeaveTypeList(response.data);
  } catch (error) {
    console.error("Error fetching leave type:", error);
    alert("Error fetching leave type, please try again.");
  }
};

  useEffect(() => {
    fetchLeaveRecords();
    fetchLeaveType();
  }, []);

  // Function to get all months for the year
  const months = [
    "January", "February", "March", "April", "May", "June", 
    "July", "August", "September", "October", "November", "December"
  ];

  // Function to calculate total days between fromDate and toDate
  const calculateTotalDays = (from, to) => {
    const fromDateObj = new Date(from);
    const toDateObj = new Date(to);

    const timeDiff = toDateObj - fromDateObj;
    const dayDiff = timeDiff / (1000 * 3600 * 24);

    setTotalDays(dayDiff + 1); // Including both start and end date
  };

  // Function to filter leaves by selected month and year
  const filterDataByMonthAndYear = (month, year) => {
    setSelectedMonth(month); // Set the selected month
    const filtered = leaveData.filter((leave) => {
      const leaveDate = new Date(leave.fromDate);
      return leaveDate.getFullYear() === year && leaveDate.getMonth() === month;
    });
    setFilteredData(filtered);
  };

  // Open and close modal
  const openModal = () => setShowModal(true);
  const closeModal = () => {
    setShowModal(false);
    setFromDate("");
    setToDate("");
    setTotalDays(0);
    setReason("");
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

  // Handle leave application submission
  const handleApplyLeave = async (e) => {
    e.preventDefault();

    // Convert fromDate and toDate to Date objects to check the day of the week
    const fromDateObj = new Date(fromDate);
    const toDateObj = new Date(toDate);

    // Check if fromDate or toDate is Sunday (0 represents Sunday)
    if (fromDateObj.getDay() === 0 || toDateObj.getDay() === 0) {
      toast.error("You cannot apply for leave on a Sunday, as it's already a holiday.");
      return; // Exit the function if it's a Sunday
    }

    const leaveData = {
      fromDate,
      toDate,
      totalDays,
      reason,
      leaveType,
      status,
      leaveTypeId,
    };

    // debugger;

    try {
      const response = await LeaveService.applyLeave(leaveData);
      // debugger;
      if (response.status === 1) {
        toast.success(response.message); // Toast on success
        fetchLeaveRecords();
      }
      if (response.status === 2) {
        toast.error(response.message); // Toast on success
        // toast.success("You already applied leave for that date."); // Toast on success
        fetchLeaveRecords();
      }
    } catch (error) {
      console.error("Error applying leave:", error);
      toast.error("Failed to apply for leave.");
    }
    closeModal();
  };

  const formatDate = (dateString) => {
    const dateObj = new Date(dateString);
    const day = String(dateObj.getDate()).padStart(2, "0"); // Add leading zero for single digit days
    const month = String(dateObj.getMonth() + 1).padStart(2, "0"); // Get month (0-based, so add 1)
    const year = dateObj.getFullYear();
  
    return `${day}-${month}-${year}`;
  };
  
  // Handle to cancle leave
  const handelCancleLeave = async (leave, statusValue, e) => {
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
      status: statusValue, // 1 for Approve, 2 for Reject, 3 for Cancle
    };

      // debugger;

      try {
        const response = await LeaveService.cancleLeave(
          leave.leaveRequestId,
          leaveData
        );
        if (response.status === 1) {
          toast.success("Leave Cancle Succesfully"); // Toast on success
          fetchLeaveRecords();
        }
      } catch (error) {
        console.error("Error cancle leave:", error);
        toast.error("Failed to cancle leave.");
      }
      closeModal();
  };


  return (
    <div className="mt-4">
      <div className="flex justify-between items-center my-3">
        <h1 className="font-semibold text-2xl sm:text-3xl">
          Leave Records of {year}
        </h1>

        {/* Apply Leave Button */}
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={openModal}
          className="bg-blue-600 hover:bg-blue-700 flex gap-2 text-center text-white font-medium py-2 px-4 rounded hover:no-underline text-sm sm:text-base"
        >
          Apply Leave
          <FaPlus className="mt-[3px]" size={14} />
        </motion.button>
      </div>

      {/* Card for Year and Month Dropdown */}
      <div className="bg-white shadow-lg rounded-lg p-4">
        <div className="-mx-4 px-10 flex flex-wrap">
          {/* Year Dropdown */}
          <div className="w-full mb-2 px-3 md:w-1/4 lg:w-1/5">
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
                ); // Re-filter data when year changes
              }}
              className="w-full sm:w-1/2 border p-2 rounded border-active"
            >
              {/* Dropdown for years */}
              {new Array(10).fill(0).map((_, idx) => (
                <option key={idx} value={currentYear - 5 + idx}>
                  {currentYear - 5 + idx}
                </option>
              ))}
            </select>
          </div>

          {/* Month Dropdown */}
          <div className="w-full mb-2 px-3 md:w-1/3 lg:w-1/4">
            <label htmlFor="month" className="mr-2">
              Month:
            </label>
            <select
              id="month"
              value={selectedMonth !== null ? selectedMonth : ""}
              onChange={(e) => {
                const selectedMonthIndex = parseInt(e.target.value);
                setSelectedMonth(selectedMonthIndex);
                filterDataByMonthAndYear(selectedMonthIndex, year); // Re-filter data when month changes
              }}
              className="w-full sm:w-1/2 border p-2 rounded border-active"
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
      </div>

      {/* Display Leave Records for the Selected Month */}
      {selectedMonth !== null && (
        // <section className="bg-white rounded-lg shadow-lg m-1 p-4 sm:p-8">
        <div className="grid mt-4 overflow-x-auto shadow-xl">
          <table className="min-w-full table-auto bg-white border border-gray-200">
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
                  {/* <td className="px-4 py-2 border-b">{leave.fromDate}</td> */}
                  <td className="px-4 py-2 border-b">
                    {leave.toDate ? formatDate(leave.toDate) : ""}
                  </td>
                  {/* <td className="px-4 py-2 border-b">{leave.toDate}</td> */}
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
                    {leave.status !== 2 && leave.status !== 3 ? (
                      <div className="flex gap-2">
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={(e) => {
                            handelCancleLeave(leave, 3, e);
                          }}
                          className="bg-red-600 text-white py-2 px-4 flex gap-2 rounded-md"
                        >
                          Cancle
                          <FaTimes size={18} />
                        </motion.button>
                      </div>
                    ) : leave.status === 2 ? (
                      <p className="text-red-500">Leave is rejected</p>
                    ) : leave.status === 3 ? (
                      <p className="text-gray-500">Leave is cancle by you.</p>
                    ) : null}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        // {/* </section> */}
      )}

      {/* Modal for Apply Leave */}
      {showModal && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex justify-center items-center z-50 overflow-x-auto">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-full sm:max-w-md md:max-w-lg lg:max-w-2xl w-full">
            <h2 className="text-xl font-semibold mb-4 text-center sm:text-left">
              Apply Leave
            </h2>

            {/* From Date */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">
                From Date
              </label>
              <input
                type="date"
                value={fromDate}
                onChange={(e) => {
                  setFromDate(e.target.value);
                  if (toDate) {
                    calculateTotalDays(e.target.value, toDate);
                  }
                }}
                className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
              />
            </div>

            {/* To Date */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">
                To Date
              </label>
              <input
                type="date"
                value={toDate}
                onChange={(e) => {
                  setToDate(e.target.value);
                  if (fromDate) {
                    calculateTotalDays(fromDate, e.target.value);
                  }
                }}
                className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
              />
            </div>

            {/* Total Days */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">
                Total Days
              </label>
              <input
                type="text"
                value={totalDays}
                disabled
                className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
              />
            </div>

            {/* Reason */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">
                Reason
              </label>
              <textarea
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                rows="4"
              />
            </div>

            {/* Leave Type */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">
                Leave Type
              </label>
              <select
                value={leaveTypeId}
                onChange={(e) => setLeaveTypeId(e.target.value)}
                name="leaveTypeId"
                className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
              >
                <option value="" className="text-gray-400">
                  --Select Leave Type--
                </option>
                {leaveTypeList.length > 0 ? (
                  leaveTypeList.map((leaveType) => (
                    <option
                      key={leaveType.leaveTypeId}
                      value={leaveType.leaveTypeId}
                    >
                      {leaveType.leaveTypeName}
                    </option>
                  ))
                ) : (
                  <option value="" disabled>
                    No leave type available
                  </option>
                )}
              </select>
            </div>

            {/* Day */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">
                Day
              </label>
              <select
                value={leaveType}
                onChange={(e) => setLeaveType(e.target.value)}
                className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
              >
                <option value="" className="text-gray-400">
                  --Select Day Type--
                </option>
                <option value="Full-Day">Full-Day</option>
                <option value="Half-Day">Half-Day</option>
              </select>
            </div>

            {/* Buttons */}
            <div className="flex justify-end gap-2 flex-col sm:flex-row">
              <button
                onClick={closeModal}
                className="bg-gray-500 text-white py-2 px-4 rounded-md w-full sm:w-auto"
              >
                Close
              </button>
              <button
                onClick={handleApplyLeave}
                className="bg-blue-600 text-white py-2 px-4 rounded-md w-full sm:w-auto"
              >
                Apply Leave
              </button>
            </div>
          </div>
        </div>

        // <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex justify-center items-center z-50 overflow-x-auto">
        //   <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
        //     <h2 className="text-xl font-semibold mb-4">Apply Leave</h2>

        //     {/* From Date */}
        //     <div className="mb-4">
        //       <label className="block text-sm font-medium text-gray-700">From Date</label>
        //       <input
        //         type="date"
        //         value={fromDate}
        //         onChange={(e) => {
        //           setFromDate(e.target.value);
        //           if (toDate) {
        //             calculateTotalDays(e.target.value, toDate);
        //           }
        //         }}
        //         className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
        //       />
        //     </div>

        //     {/* To Date */}
        //     <div className="mb-4">
        //       <label className="block text-sm font-medium text-gray-700">To Date</label>
        //       <input
        //         type="date"
        //         value={toDate}
        //         onChange={(e) => {
        //           setToDate(e.target.value);
        //           if (fromDate) {
        //             calculateTotalDays(fromDate, e.target.value);
        //           }
        //         }}
        //         className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
        //       />
        //     </div>

        //     {/* Total Days */}
        //     <div className="mb-4">
        //       <label className="block text-sm font-medium text-gray-700">Total Days</label>
        //       <input
        //         type="text"
        //         value={totalDays}
        //         disabled
        //         className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
        //       />
        //     </div>

        //     {/* Reason */}
        //     <div className="mb-4">
        //       <label className="block text-sm font-medium text-gray-700">Reason</label>
        //       <textarea
        //         value={reason}
        //         onChange={(e) => setReason(e.target.value)}
        //         className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
        //         rows="4"
        //       />
        //     </div>

        //     {/* Leave Type */}
        //     <div className="mb-4">
        //     <label className="block text-sm font-medium text-gray-700">Leave Type</label>
        //       <select
        //         value={leaveTypeId}
        //         onChange={(e) => setLeaveTypeId(e.target.value)}
        //         name="leaveTypeId"
        //         className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
        //       >
        //         <option value="" className="text-gray-400">
        //           --Select Leave Type--
        //         </option>
        //         {leaveTypeList.length > 0 ? (
        //           leaveTypeList.map((leaveType) => (
        //             <option key={leaveType.leaveTypeId} value={leaveType.leaveTypeId}>
        //               {leaveType.leaveTypeName}
        //             </option>
        //           ))
        //         ) : (
        //           <option value="" disabled>
        //             No leave type available
        //           </option>
        //         )}
        //       </select>
        //     </div>

        //     {/* Day */}
        //     <div className="mb-4">
        //       <label className="block text-sm font-medium text-gray-700">Day</label>
        //       <select
        //         value={leaveType}
        //         onChange={(e) => setLeaveType(e.target.value)}
        //         className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
        //       >
        //         <option value="" className="text-gray-400">
        //           --Select Day Type--
        //         </option>
        //         <option value="Full-Day">Full-Day</option>
        //         <option value="Half-Day">Half-Day</option>
        //       </select>
        //     </div>

        //     {/* Buttons */}
        //     <div className="flex justify-end gap-2">
        //       <button onClick={closeModal} className="bg-gray-500 text-white py-2 px-4 rounded-md">
        //         Close
        //       </button>
        //       <button onClick={handleApplyLeave} className="bg-blue-600 text-white py-2 px-4 rounded-md">
        //         Apply Leave
        //       </button>
        //     </div>
        //   </div>
        // </div>
      )}

    </div>
  );
};

export default LeaveModule;