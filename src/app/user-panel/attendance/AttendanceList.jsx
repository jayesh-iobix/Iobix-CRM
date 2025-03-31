import React, { useState, useEffect } from "react";
import { motion } from "framer-motion"; // Import framer-motion
import { FaPlus } from "react-icons/fa";
import { AttendanceService } from "../../service/AttendanceService";
import { toast } from "react-toastify";

const AttendanceList = () => {
  const currentYear = new Date().getFullYear();
  const currentMonth = new Date().getMonth(); // Get the current month (0-based index)

  const [attendanceData, setAttendanceData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [year, setYear] = useState(currentYear); // Set the year to current year
  const [selectedMonth, setSelectedMonth] = useState(currentMonth); // Set the selected month to current month
  const [showModal, setShowModal] = useState(false); // Modal visibility
  const [inDateTime, setInDateTime] = useState("");  // In DateTime
  const [outDateTime, setOutDateTime] = useState(""); // Out DateTime
  const [totalTime, setTotalTime] = useState("");    // Total Time
  const [status, setStatus] = useState("Present");   // New state for Status
  const [remarks, setRemarks] = useState("On Time"); // New state for Remarks

  const employeeId = sessionStorage.getItem("LoginUserId");

  useEffect(() => {
    const fetchAttendance = async () => {
      try {
        const response = await AttendanceService.getAttendanceByEmployeeId(employeeId);
        setAttendanceData(response.data);
        setFilteredData(response.data);
        // console.log(response.data);
      } catch (error) {
        console.error("Error fetching attendance data:", error);
        alert("Error fetching attendance data, please try again.");
      }
    };

    fetchAttendance();
  }, []);

  // Function to get all dates of a specific month and year
  const getDaysInMonth = (month, year) => {
    const daysInMonth = [];
    const date = new Date(year, month, 1);
    while (date.getMonth() === month) {
      daysInMonth.push({
        date: new Date(date),
        day: date.toLocaleString('en-US', { weekday: 'long' }),
      });
      date.setDate(date.getDate() + 1);
    }
    return daysInMonth;
  };

  // Filter function based on selected month and year
  const filterDataByMonthAndYear = (month, year) => {
    setSelectedMonth(month); // Set the selected month
    const filtered = attendanceData.filter((attendance) => {
      const attendanceDate = new Date(attendance.attendanceDate);
      return attendanceDate.getFullYear() === year && attendanceDate.getMonth() === month;
    });
    setFilteredData(filtered);
  };

  // Function to get all years range for the dropdown
  const getYears = () => {
    const currentYear = new Date().getFullYear();
    const years = [];
    for (let i = currentYear - 5; i <= currentYear + 5; i++) {
      years.push(i);
    }
    return years;
  };

  // const openModal = () => {
  //   setShowModal(true);
  // };

  // const closeModal = () => {
  //   setShowModal(false);
  //   setInDateTime("");
  //   setOutDateTime("");
  //   setTotalTime("");
  // };

  // const handleSubmitAttendance = async (e) => {
  //   e.preventDefault();
  //   const totalTimeFormatted = calculateTotalTime(inDateTime, outDateTime);

  //   const attendanceData = {
  //     inDateTime,
  //     outDateTime,
  //     totalTime: totalTimeFormatted,
  //     status,
  //     remarks,
  //   };

  //   try {
  //     const response = await AttendanceService.addAttendance(attendanceData);
  //     if (response.status === 1) {
  //       toast.success(response.message); // Toast on success
  //     }
  //   } catch (error) {
  //     console.error("Error adding attendance:", error);
  //     toast.error("Failed to add attendance.");
  //   }
  //   closeModal();
  // };

  // const calculateTotalTime = (inDateTime, outDateTime) => {
  //   const inDate = new Date(inDateTime);
  //   const outDate = new Date(outDateTime);

  //   const diffInMs = outDate - inDate;

  //   const hours = Math.floor(diffInMs / (1000 * 60 * 60));
  //   const minutes = Math.floor((diffInMs % (1000 * 60 * 60)) / (1000 * 60));
  //   const seconds = Math.floor((diffInMs % (1000 * 60)) / 1000);

  //   const formattedTime = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;

  //   return formattedTime;
  // };

  // Create an array of months for the year
  const months = [
    "January", "February", "March", "April", "May", "June", 
    "July", "August", "September", "October", "November", "December"
  ];

  const formatTime = (dateTime) => {
    const date = new Date(dateTime);
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    return `${hours}:${minutes}`;
  };

  const formatTotalTime = (totalTime) => {
    if (!totalTime) return '00:00'; // Handle empty or null case
  
    // Split the totalTime string to get hours, minutes, and seconds
    const timeParts = totalTime.split(':');
  
    // Ensure there are at least hours and minutes
    const hours = timeParts[0] || '00';
    const minutes = timeParts[1] || '00';
  
    return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
  };

  // Function to set the color based on the attendnce status
  const getStatusColor = (statusName) => {
    switch (statusName) {
      case "Present":
        return "text-gray-500 bg-gray-100"; // Red for Rejected
      case "LeaveApproved":
        return "text-green-500 bg-green-100"; // Green for Approved
      case "LeaveRequest":
        return "text-red-500 bg-red-100"; // Red for Rejected
      case "Absent":
        return "text-red-500 bg-red-100"; // Red for Rejected
      default:
        return ""; // Default color
    }
  };

  // // Function to set the color based on the attendnce status
  // const getStatusColor = (statusName) => {
  //   switch (statusName) {
  //     case "Present":
  //       return "text-green-500 bg-green-100"; // Green for Approved
  //     case "Absent":
  //       return "text-red-500 bg-red-100"; // Red for Rejected
  //     case "OnLeave":
  //       return "text-red-500 bg-red-100"; // Red for Rejected
  //     default:
  //       return ""; // Default color
  //   }
  // };
  

  useEffect(() => {
    // Filter the data based on the current month and year when the component loads
    filterDataByMonthAndYear(currentMonth, currentYear);
  }, [currentMonth, currentYear]);

  return (
    <div className="mt-4">
      <div className="flex flex-col md:flex-row justify-between items-center my-3">
        <h1 className="font-semibold text-2xl">Attendance List for {year}</h1>
  
        {/* Add Attendance Button */}
        {/* <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={openModal}
          className="bg-blue-600 hover:bg-blue-700 flex gap-2 text-center text-white font-medium py-2 px-4 rounded hover:no-underline"
        >
          Add Attendance
          <FaPlus className="mt-[3px]" size={14} />
        </motion.button> */}
      </div>
  
      {/* Card for Year and Month Dropdown */}
      <div className="bg-white shadow-lg rounded-lg p-4">
        <div className="-mx-4 px-10 flex flex-wrap">
          {/* Year Dropdown */}
          <div className="w-full mb-2 px-3 md:w-1/4 lg:w-1/5">
            <label htmlFor="year" className="mr-2">Year:</label>
            <select 
              id="year" 
              value={year} 
              onChange={(e) => {
                setYear(parseInt(e.target.value));
                filterDataByMonthAndYear(selectedMonth, parseInt(e.target.value)); // Re-filter data when year changes
              }}
              className="w-full sm:w-1/2 border p-2 rounded border-active"
            >
              {/* Dropdown for years */}
              {getYears().map((yearOption) => (
                <option key={yearOption} value={yearOption}>
                  {yearOption}
                </option>
              ))}
            </select>
          </div>

          {/* Month Dropdown */}
          <div className="w-full mb-2 px-3 md:w-1/3 lg:w-1/4">
            <label htmlFor="month" className="mr-2">Month:</label>
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
  
      {/* Display Days and Dates of Selected Month */}
      {/* <section className="bg-white rounded-lg shadow-lg m-1 p-4 sm:p-8"> */}
        {selectedMonth !== null && (
          <div className="grid mt-4 overflow-x-auto shadow-xl">
            <table className="min-w-full table-auto bg-white border border-gray-200">
              <thead className="bg-gray-900 border-b">
                <tr>
                  <th className="px-4 py-2 border-b text-left uppercase font-semibold text-sm text-[#939393]">Day</th>
                  <th className="px-4 py-2 border-b text-left uppercase font-semibold text-sm text-[#939393]">Date</th>
                  <th className="px-4 py-2 border-b text-left uppercase font-semibold text-sm text-[#939393]">In Time</th>
                  <th className="px-4 py-2 border-b text-left uppercase font-semibold text-sm text-[#939393]">Out Time</th>
                  <th className="px-4 py-2 border-b text-left uppercase font-semibold text-sm text-[#939393]">Working Hours</th>
                  <th className="px-4 py-2 border-b text-left uppercase font-semibold text-sm text-[#939393]">Status</th>
                  <th className="px-4 py-2 border-b text-left uppercase font-semibold text-sm text-[#939393]">Work Note</th>
                </tr>
              </thead>
              <tbody>
                {getDaysInMonth(selectedMonth, year).map((dayData, index) => {
                  // Find the attendance record for this day
                  const attendance = filteredData.find((attendance) => {
                    const attendanceDate = new Date(attendance.attendanceDate);
                    return attendanceDate.toLocaleDateString() === dayData.date.toLocaleDateString();
                  });

                   // Determine if today is Sunday
                   const isSunday = dayData.day === "Sunday";
  
                  return (
                    <tr key={index} className={`hover:bg-gray-100 ${dayData.day === "Sunday" || dayData.day === "Saturday" ? "bg-yellow-200" : ""}`}>
                      <td className="px-4 py-2 border-b">{dayData.day}</td>
                      <td className="px-4 py-2 border-b">
                        {`${dayData.date.getDate()}/${dayData.date.getMonth() + 1}/${dayData.date.getFullYear()}`}
                      </td>
                      <td className="px-4 py-2 border-b">{attendance && attendance.inDateTime ? formatTime(attendance.inDateTime) : '-'}</td>
                      <td className="px-4 py-2 border-b">{attendance && attendance.outDateTime ? formatTime(attendance.outDateTime) : '-'}</td>
                      <td className="px-4 py-2 border-b">{attendance && attendance.totalTime ? formatTotalTime(attendance.totalTime) : '00:00'}</td>
                      {/* <td className="px-4 py-2 border-b">{attendance && attendance.workingHours ? formatTotalTime(attendance.workingHours) : '00:00'}</td> */}
                      {/* <td className="px-4 py-2 border-b">{attendance && attendance.workingHours ? formatTotalTime(attendance.workingHours) : '00:00'}</td> */}
                      <td className="py-3 px-4">
                      {/* <span
                       className={`px-2 py-1 rounded-lg font-medium ${getStatusColor(isSunday ? (attendance ? attendance.statusName : '-') : (attendance ? attendance.statusName : '-'))}`}
                      >
                        {isSunday ? (attendance ? attendance.statusName : '-') : (attendance ? attendance.statusName : '-')}
                      </span> */}
                        <span
                          className={`px-2 py-1 rounded-lg font-medium ${getStatusColor(attendance ? attendance.statusName : '-')}`}
                        >
                          {attendance ? attendance.statusName : '-'}
                        </span>
                      </td>
                      <td className="px-4 py-2 border-b">{attendance ? attendance.workNote : '-'}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      {/* </section> */}
    </div>
  );  

};

export default AttendanceList;