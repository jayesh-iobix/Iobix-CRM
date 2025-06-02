//#region Imports
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion"; // Import framer-motion
import { AttendanceService } from "../../service/AttendanceService";
import { toast } from "react-toastify";
import { useParams } from "react-router-dom";
import { ReportService } from "../../service/ReportService";
//#endregion

//#region Component: AttendanceList
const AttendanceList = () => {
  //#region State Variables
  // Get the current year and month
  const currentYear = new Date().getFullYear();
  const currentMonth = new Date().getMonth(); // Get the current month (0-based index)

  const [attendanceData, setAttendanceData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [year, setYear] = useState(currentYear); // Set the year to current year
  const [selectedMonth, setSelectedMonth] = useState(currentMonth); // Set the selected month to current month
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { id } = useParams();
  //#endregion

  //#region useEffect: Fetch Attendance Data
  // Fetch attendance data when the component mounts
  useEffect(() => {
    const fetchAttendance = async () => {
      try {
        const response = await AttendanceService.getAttendanceByEmployeeId(id);
        setAttendanceData(response.data);
        setFilteredData(response.data);
      } catch (error) {
        console.error("Error fetching attendance data:", error);
        alert("Error fetching attendance data, please try again.");
      }
    };

    fetchAttendance();
  }, []);
  //#endregion

  //#region Filter Function
  // Create an array of months for the year
  const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  // Filter function to filter attendance data based on selected month and year
  const filterDataByMonthAndYear = (month, year) => {
    setSelectedMonth(month); // Set the selected month
    const filtered = attendanceData.filter((attendance) => {
      const attendanceDate = new Date(attendance.attendanceDate);
      return attendanceDate.getFullYear() === year && attendanceDate.getMonth() === month;
    });
    setFilteredData(filtered);
  };

  useEffect(() => {
    // Filter the data based on the current month and year when the component loads
    filterDataByMonthAndYear(currentMonth, currentYear);
  }, [currentMonth, currentYear]);
  //#endregion

  //#region Helper Functions
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

  // Function to get all years range for the dropdown
  const getYears = () => {
    const currentYear = new Date().getFullYear();
    const years = [];
    for (let i = currentYear - 5; i <= currentYear + 5; i++) {
      years.push(i);
    }
    return years;
  };

  // Function to format time in HH:MM format
  const formatTime = (dateTime) => {
    const date = new Date(dateTime);
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    return `${hours}:${minutes}`;
  };

  // Function to format total time in HH:MM format
  const formatTotalTime = (totalTime) => {
    if (!totalTime) return '00:00'; // Handle empty or null case
  
    // Split the totalTime string to get hours, minutes, and seconds
    const timeParts = totalTime.split(':');
  
    // Ensure there are at least hours and minutes
    const hours = timeParts[0] || '00';
    const minutes = timeParts[1] || '00';
  
    return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
  };

  // Function to set the color based on the attendance status
  const getStatusColor = (statusName) => {
    switch (statusName) {
      case "Present":
        return "text-gray-500 bg-gray-100"; // Present color
      case "LeaveApproved":
        return "text-green-500 bg-green-100"; // Green for Approved
      case "LeaveRequest":
        return "text-red-500 bg-red-100"; // Red for Rejected
      case "OnLeave":
        return "text-red-500 bg-red-100"; // Red for On Leave
      case "Absent":
        return "text-red-500 bg-red-100"; // Red for Absent
      default:
        return ""; // Default color
    }
  };
  //#endregion

  //#region Download Report Function
  const handleDownloadReport = async () => {
    const month = months[selectedMonth]; // Get the month name using the selected index
    setIsSubmitting(true);

    try {
      // Wait for the report download to complete with the selected year and month
      const response = await ReportService.downloadAttendanceReport(id, month, year);
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
    <div className="mt-4 ">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row justify-between items-center my-3">
        <h1 className="font-semibold text-2xl ">Attendance List for {year}</h1>

        {/* Download Report Button */}
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          type="button" // Added this line to prevent form submission
          onClick={handleDownloadReport}
          className ={`me-3 bg-purple-600 hover:bg-purple-700 flex gap-2 text-center text-white font-medium py-2 px-4 rounded border-active hover:no-underline 
            ${isSubmitting ? "opacity-50 cursor-not-allowed" : "" }`}
          disabled={isSubmitting}
        >
          {isSubmitting ? "Downloading..." : "Download Report"}
        </motion.button>
      </div>

      {/* Card for Year and Month Dropdown */}
      <div className="-mx-4 px-10 flex flex-wrap gap-4">
        <div className="w-full mb-2 px-3 md:w-1/3">
          <label htmlFor="year" className="mr-2">Year:</label>
          <select
            id="year"
            value={year}
            onChange={(e) => {
              setYear(parseInt(e.target.value));
              filterDataByMonthAndYear(selectedMonth, parseInt(e.target.value)); // Re-filter data when year changes
            }}
            className="w-24 sm:w-1/2 md:w-1/2 lg:w-1/2 border p-2 rounded border-active"
            // className="w-full sm:w-1/2 border p-2 rounded border-active"
          >
            {getYears().map((yearOption) => (
              <option key={yearOption} value={yearOption}>
                {yearOption}
              </option>
            ))}
          </select>
        </div>

        <div className="w-full mb-2 px-3 md:w-1/3">
          <label htmlFor="month" className="mr-2">Month:</label>
          <select
            id="month"
            value={selectedMonth !== null ? selectedMonth : ""}
            onChange={(e) => {
              const selectedMonthIndex = parseInt(e.target.value);
              setSelectedMonth(selectedMonthIndex);
              filterDataByMonthAndYear(selectedMonthIndex, year); // Re-filter data when month changes
            }}
            className="w-30 sm:w-1/2 md:w-1/2 lg:w-1/2 border p-2 rounded border-active"
            // className="w-full sm:w-1/2 border p-2 rounded border-active"
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

      {/* Display Days and Dates of Selected Month */}
      <section className="bg-white rounded-lg shadow-lg m-1 p-4 sm:p-8">
        {selectedMonth !== null && (
          <div className="grid overflow-x-auto">
            <table className="min-w-full table-auto border-collapse">
              <thead className="bg-gray-900 border-b">
                <tr>
                  <th className="px-4 py-2 border-b text-left uppercase font-semibold text-sm text-[#939393]">Date</th>
                  <th className="px-4 py-2 border-b text-left uppercase font-semibold text-sm text-[#939393]">Day</th>
                  <th className="px-4 py-2 border-b text-left uppercase font-semibold text-sm text-[#939393]">In Time</th>
                  <th className="px-4 py-2 border-b text-left uppercase font-semibold text-sm text-[#939393]">Out Time</th>
                  <th className="px-4 py-2 border-b text-left uppercase font-semibold text-sm text-[#939393]">Working Hours</th>
                  <th className="px-4 py-2 border-b text-left uppercase font-semibold text-sm text-[#939393]">Status</th>
                  <th className="px-4 py-2 border-b text-left uppercase font-semibold text-sm text-[#939393]">Work Note</th>
                </tr>
              </thead>
              <tbody>
                {getDaysInMonth(selectedMonth, year).map((dayData, index) => {
                  const attendance = filteredData.find((attendance) => {
                    const attendanceDate = new Date(attendance.attendanceDate);
                    return attendanceDate.toLocaleDateString() === dayData.date.toLocaleDateString();
                  });

                  return (
                    <tr key={index} className={`hover:bg-gray-100 ${dayData.day === "Sunday" || dayData.day === "Saturday" ? "bg-yellow-200" : ""}`}>
                      <td className="px-4 py-2 border-b">
                        {`${dayData.date.getDate()}/${
                          dayData.date.getMonth() + 1
                        }/${dayData.date.getFullYear()}`}
                      </td>
                      <td className="px-4 py-2 border-b">{dayData.day}</td>
                      <td className="px-4 py-2 border-b">{attendance && attendance.inDateTime ? formatTime(attendance.inDateTime) : '-'}</td>
                      <td className="px-4 py-2 border-b">{attendance && attendance.outDateTime ? formatTime(attendance.outDateTime) : '-'}</td>
                      <td className="px-4 py-2 border-b">
                        {attendance && attendance.outDateTime ? formatTotalTime(attendance.totalTime) : '00:00'}
                      </td>
                      <td className="py-3 px-4">
                        <span
                          className={`px-2 py-1 rounded-lg font-medium ${getStatusColor(
                            attendance ? attendance.statusName : '-'
                          )}`}
                        >
                          {attendance ? attendance.statusName : '-'}
                        </span>
                      </td>
                      <td className="px-4 py-2 border-b">{attendance ? attendance.workNote : "-"}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
  //#endregion
};

export default AttendanceList;
//#endregion
