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
                    <tr key={index} className="hover:bg-gray-100">
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




// return (
//   <div className="mt-4">
//     <div className="flex justify-between items-center my-3">
//       <h1 className="font-semibold text-2xl">Attendance List for {year}</h1>

//       {/* Add Attendance Button */}
//       {/* <motion.button
//         whileHover={{ scale: 1.1 }}
//         whileTap={{ scale: 0.9 }}
//         onClick={openModal}
//         className="bg-blue-600 hover:bg-blue-700 flex gap-2 text-center text-white font-medium py-2 px-4 rounded hover:no-underline"
//       >
//         Add Attendance
//         <FaPlus className="mt-[3px]" size={14} />
//       </motion.button> */}
//     </div>

//       {/* Card for Year and Month Dropdown */}
//       <div className="bg-white shadow-lg rounded-lg p-4">
//       <div className="-mx-4 px-10 flex flex-wrap">
//         <div className="w-full mb-2 px-3 md:w-1/4">
//           <label htmlFor="year" className="mr-2">Year:</label>
//           <select 
//             id="year" 
//             value={year} 
//             onChange={(e) => {
//               setYear(parseInt(e.target.value));
//               filterDataByMonthAndYear(selectedMonth, parseInt(e.target.value)); // Re-filter data when year changes
//             }}
//             className="w-1/2 border p-2 rounded border-active"
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
//             className="w-1/2 border p-2 rounded border-active"
//           >
//             <option value="">Select Month</option>
//             {months.map((month, index) => (
//               <option key={index} value={index}>
//                 {month}
//               </option>
//             ))}
//           </select>
//         </div>
//         </div>
//       </div>

//       {/* Display Days and Dates of Selected Month */}
//       <section className="bg-white rounded-lg shadow-lg m-1 p-4 sm:p-8">
//       {selectedMonth !== null && (
//         <div className="overflow-x-auto">
//           <table className="min-w-full table-auto border-collapse">
//             <thead className="bg-gray-900 border-b">
//               <tr>
//                 <th className="px-4 py-2 border-b text-left uppercase font-semibold text-sm text-[#939393]">Day</th>
//                 <th className="px-4 py-2 border-b text-left uppercase font-semibold text-sm text-[#939393]">Date</th>
//                 <th className="px-4 py-2 border-b text-left uppercase font-semibold text-sm text-[#939393]">In Time</th>
//                 <th className="px-4 py-2 border-b text-left uppercase font-semibold text-sm text-[#939393]">Out Time</th>
//                 <th className="px-4 py-2 border-b text-left uppercase font-semibold text-sm text-[#939393]">Working Hours</th>
//                 <th className="px-4 py-2 border-b text-left uppercase font-semibold text-sm text-[#939393]">Status</th>
//                 <th className="px-4 py-2 border-b text-left uppercase font-semibold text-sm text-[#939393]">Work Note</th>
//                 {/* <th className="px-4 py-2 border-b text-left uppercase font-semibold text-sm text-[#939393]">Remarks</th> */}
//               </tr>
//             </thead>
//             <tbody>
//               {getDaysInMonth(selectedMonth, year).map((dayData, index) => {
//                 // Find the attendance record for this day
//                 const attendance = filteredData.find((attendance) => {
//                   const attendanceDate = new Date(attendance.attendanceDate);
//                   return attendanceDate.toLocaleDateString() === dayData.date.toLocaleDateString();
//                 });

//                 return (
//                   <tr key={index} className="hover:bg-gray-100">
//                     <td className="px-4 py-2 border-b">{dayData.day}</td>
//                     <td className="px-4 py-2 border-b">
//                       {`${dayData.date.getDate()}/${dayData.date.getMonth() + 1}/${dayData.date.getFullYear()}`}
//                     </td>
//                     <td className="px-4 py-2 border-b">{attendance && attendance.inDateTime ? formatTime(attendance.inDateTime) : '-'}</td>
//                     <td className="px-4 py-2 border-b">{attendance && attendance.outDateTime ? formatTime(attendance.outDateTime) : '-'}</td>
//                     <td className="px-4 py-2 border-b">{attendance && attendance.totalTime ? attendance.totalTime : '00:00'}</td>
//                     <td className="py-3 px-4">
//                       <span
//                         className={`px-2 py-1 rounded-lg font-medium ${getStatusColor(
//                           attendance ? attendance.statusName : '-'
//                         )}`}
//                       >
//                         {attendance ? attendance.statusName : '-'}
//                       </span>
//                     </td>
//                     {/* <td className="px-4 py-2 border-b">{attendance ? attendance.statusName : '-'}</td> */}
//                     <td className="px-4 py-2 border-b">{attendance ? attendance.workNote : '-'}</td>
//                     {/* <td className="px-4 py-2 border-b">{attendance ? attendance.remarks : '-'}</td> */}
//                   </tr>
//                 );
//               })}
//             </tbody>

//           </table>
//         </div>
//       )}
//       </section>

   
//   </div>
// );




//  {/* Modal for Add Attendance */}
//  {showModal && (
//   <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex justify-center items-center z-50">
//     <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
//       <h2 className="text-xl font-semibold mb-4">Add Attendance</h2>
//       <div className="mb-4">
//         <label className="block text-sm font-medium text-gray-700">In DateTime</label>
//         <input
//           type="datetime-local"
//           value={inDateTime}
//           onChange={(e) => {
//             setInDateTime(e.target.value);
//             setTotalTime(calculateTotalTime(e.target.value, outDateTime)); // Calculate total time as user types
//           }}
//           className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
//         />
//       </div>
//       <div className="mb-4">
//         <label className="block text-sm font-medium text-gray-700">Out DateTime</label>
//         <input
//           type="datetime-local"
//           value={outDateTime}
//           onChange={(e) => {
//             setOutDateTime(e.target.value);
//             setTotalTime(calculateTotalTime(inDateTime, e.target.value)); // Calculate total time as user types
//           }}
//           className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
//         />
//       </div>
//       <div className="mb-4">
//         <label className="block text-sm font-medium text-gray-700">Total Time</label>
//         <input
//           type="text"
//           value={totalTime}
//           disabled
//           className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
//         />
//       </div>
//       {/* Status Dropdown */}
//       <div className="mb-4">
//         <label className="block text-sm font-medium text-gray-700">Status</label>
//         <select
//           value={status}
//           onChange={(e) => setStatus(e.target.value)}
//           className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
//         >
//           <option value="Present">Present</option>
//           <option value="Absent">Absent</option>
//         </select>
//       </div>
//       {/* Remarks Dropdown */}
//       <div className="mb-4">
//         <label className="block text-sm font-medium text-gray-700">Remarks</label>
//         <select
//           value={remarks}
//           onChange={(e) => setRemarks(e.target.value)}
//           className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
//         >
//           <option value="On Time">On Time</option>
//           <option value="Late">Late</option>
//           <option value="On Leave">On Leave</option>
//         </select>
//       </div>
//       <div className="flex justify-end gap-2">
//         <button onClick={closeModal} className="bg-gray-500 text-white py-2 px-4 rounded-md">
//           Close
//         </button>
//         <button onClick={handleSubmitAttendance} className="bg-blue-600 text-white py-2 px-4 rounded-md">
//           Save
//         </button>
//       </div>
//     </div>
//   </div>
// )}




// import React, { useState, useEffect } from "react";
// import { motion } from "framer-motion"; // Import framer-motion
// import { FaPlus } from "react-icons/fa";
// import { AttendanceService } from "../../service/AttendanceService";
// import { toast } from "react-toastify";

// const AttendanceList = () => {
//   const currentYear = new Date().getFullYear();
//   const currentMonth = new Date().getMonth(); // Get the current month (0-based index)

//   const [attendanceData, setAttendanceData] = useState([]);
//   const [filteredData, setFilteredData] = useState([]);
//   const [year, setYear] = useState(currentYear); // Set the year to current year
//   const [selectedMonth, setSelectedMonth] = useState(currentMonth); // Set the selected month to current month
//   const [showModal, setShowModal] = useState(false); // Modal visibility
//   const [inDateTime, setInDateTime] = useState("");  // In DateTime
//   const [outDateTime, setOutDateTime] = useState(""); // Out DateTime
//   const [totalTime, setTotalTime] = useState("");    // Total Time
//   const [status, setStatus] = useState("Present");   // New state for Status
//   const [remarks, setRemarks] = useState("On Time"); // New state for Remarks

//   useEffect(() => {
//     const fetchAttendance = async () => {
//       try {
//         const response = await AttendanceService.getAttendance();
//         setAttendanceData(response.data);
//         setFilteredData(response.data);
//       } catch (error) {
//         console.error("Error fetching attendance data:", error);
//         alert("Error fetching attendance data, please try again.");
//       }
//     };

//     fetchAttendance();
//   }, []);

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

//   // Filter function based on selected month and year
//   const filterDataByMonthAndYear = (month, year) => {
//     setSelectedMonth(month); // Set the selected month
//     const filtered = attendanceData.filter((attendance) => {
//       const attendanceDate = new Date(attendance.inDateTime);
//       return attendanceDate.getFullYear() === year && attendanceDate.getMonth() === month;
//     });
//     setFilteredData(filtered);
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

//   const openModal = () => {
//     setShowModal(true);
//   };

//   const closeModal = () => {
//     setShowModal(false);
//     setInDateTime("");
//     setOutDateTime("");
//     setTotalTime("");
//   };

//   const handleSubmitAttendance = async (e) => {
//     e.preventDefault();
//     const totalTimeFormatted = calculateTotalTime(inDateTime, outDateTime);

//     const attendanceData = {
//       inDateTime,
//       outDateTime,
//       totalTime: totalTimeFormatted,
//       status,
//       remarks,
//     };

//     try {
//       const response = await AttendanceService.addAttendance(attendanceData);
//       if (response.status === 1) {
//         toast.success(response.message); // Toast on success
//       }
//     } catch (error) {
//       console.error("Error adding attendance:", error);
//       toast.error("Failed to add attendance.");
//     }
//     closeModal();
//   };

//   const calculateTotalTime = (inDateTime, outDateTime) => {
//     const inDate = new Date(inDateTime);
//     const outDate = new Date(outDateTime);

//     const diffInMs = outDate - inDate;

//     const hours = Math.floor(diffInMs / (1000 * 60 * 60));
//     const minutes = Math.floor((diffInMs % (1000 * 60 * 60)) / (1000 * 60));
//     const seconds = Math.floor((diffInMs % (1000 * 60)) / 1000);

//     const formattedTime = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;

//     return formattedTime;
//   };

//   // Create an array of months for the year
//   const months = [
//     "January", "February", "March", "April", "May", "June", 
//     "July", "August", "September", "October", "November", "December"
//   ];

//   useEffect(() => {
//     // Filter the data based on the current month and year when the component loads
//     filterDataByMonthAndYear(currentMonth, currentYear);
//   }, [currentMonth, currentYear]);

//   return (
//     <div className="mt-4">
//       <div className="flex justify-between items-center my-3">
//         <h1 className="font-semibold text-2xl">Attendance List for {year}</h1>

//         {/* Year Dropdown */}
//         <div className="flex items-center mr-4">
//           <label htmlFor="year" className="mr-2">Year:</label>
//           <select 
//             id="year" 
//             value={year} 
//             onChange={(e) => {
//               setYear(parseInt(e.target.value));
//               filterDataByMonthAndYear(selectedMonth, parseInt(e.target.value)); // Re-filter data when year changes
//             }}
//             className="border p-2 rounded"
//           >
//             {getYears().map((yearOption) => (
//               <option key={yearOption} value={yearOption}>
//                 {yearOption}
//               </option>
//             ))}
//           </select>
//         </div>

//         {/* Month Dropdown */}
//         <div className="flex items-center">
//           <label htmlFor="month" className="mr-2">Month:</label>
//           <select 
//             id="month" 
//             value={selectedMonth !== null ? selectedMonth : ""}
//             onChange={(e) => {
//               const selectedMonthIndex = parseInt(e.target.value);
//               setSelectedMonth(selectedMonthIndex);
//               filterDataByMonthAndYear(selectedMonthIndex, year); // Re-filter data when month changes
//             }}
//             className="border p-2 rounded"
//           >
//             <option value="">Select Month</option>
//             {months.map((month, index) => (
//               <option key={index} value={index}>
//                 {month}
//               </option>
//             ))}
//           </select>
//         </div>

//         {/* Add Attendance Button */}
//         <motion.button
//           whileHover={{ scale: 1.1 }}
//           whileTap={{ scale: 0.9 }}
//           onClick={openModal}
//           className="bg-blue-600 hover:bg-blue-700 flex gap-2 text-center text-white font-medium py-2 px-4 rounded hover:no-underline"
//         >
//           Add Attendance
//           <FaPlus className="mt-[3px]" size={14} />
//         </motion.button>
//       </div>

//       {/* Display Days and Dates of Selected Month */}
//       {selectedMonth !== null && (
//         <section className="bg-white rounded-lg shadow-lg m-1 p-4 sm:p-8">
//           <div className="overflow-x-auto">
//             <table className="min-w-full table-auto border-collapse">
//               <thead className="bg-gray-900 border-b">
//                 <tr>
//                   <th className="px-4 py-2 border-b text-left uppercase font-semibold text-sm text-[#939393]">Day</th>
//                   <th className="px-4 py-2 border-b text-left uppercase font-semibold text-sm text-[#939393]">Date</th>
//                   <th className="px-4 py-2 border-b text-left uppercase font-semibold text-sm text-[#939393]">In Time</th>
//                   <th className="px-4 py-2 border-b text-left uppercase font-semibold text-sm text-[#939393]">Out Time</th>
//                   <th className="px-4 py-2 border-b text-left uppercase font-semibold text-sm text-[#939393]">Working Hours</th>
//                   <th className="px-4 py-2 border-b text-left uppercase font-semibold text-sm text-[#939393]">Status</th>
//                   <th className="px-4 py-2 border-b text-left uppercase font-semibold text-sm text-[#939393]">Remarks</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {getDaysInMonth(selectedMonth, year).map((dayData, index) => {
//                   // Find the attendance record for this day
//                   const attendance = filteredData.find((attendance) => {
//                     const attendanceDate = new Date(attendance.inDateTime);
//                     return attendanceDate.toLocaleDateString() === dayData.date.toLocaleDateString();
//                   });

//                   return (
//                     <tr key={index} className="hover:bg-gray-100">
//                       <td className="px-4 py-2 border-b">{dayData.day}</td>
//                       <td className="px-4 py-2 border-b">{dayData.date.toLocaleDateString()}</td>
//                       <td className="px-4 py-2 border-b">{attendance ? attendance.inDateTime : '-'}</td>
//                       <td className="px-4 py-2 border-b">{attendance ? attendance.outDateTime : '-'}</td>
//                       <td className="px-4 py-2 border-b">{attendance ? attendance.totalTime : '00:00'}</td>
//                       <td className="px-4 py-2 border-b">{attendance ? attendance.status : '-'}</td>
//                       <td className="px-4 py-2 border-b">{attendance ? attendance.remarks : '-'}</td>
//                     </tr>
//                   );
//                 })}
//               </tbody>
//             </table>
//           </div>
//         </section>
//       )}

//       {/* Modal for Add Attendance */}
//       {showModal && (
//         <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex justify-center items-center z-50">
//           <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
//             <h2 className="text-xl font-semibold mb-4">Add Attendance</h2>
//             <div className="mb-4">
//               <label className="block text-sm font-medium text-gray-700">In DateTime</label>
//               <input
//                 type="datetime-local"
//                 value={inDateTime}
//                 onChange={(e) => {
//                   setInDateTime(e.target.value);
//                   setTotalTime(calculateTotalTime(e.target.value, outDateTime)); // Calculate total time as user types
//                 }}
//                 className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
//               />
//             </div>
//             <div className="mb-4">
//               <label className="block text-sm font-medium text-gray-700">Out DateTime</label>
//               <input
//                 type="datetime-local"
//                 value={outDateTime}
//                 onChange={(e) => {
//                   setOutDateTime(e.target.value);
//                   setTotalTime(calculateTotalTime(inDateTime, e.target.value)); // Calculate total time as user types
//                 }}
//                 className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
//               />
//             </div>
//             <div className="mb-4">
//               <label className="block text-sm font-medium text-gray-700">Total Time</label>
//               <input
//                 type="text"
//                 value={totalTime}
//                 disabled
//                 className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
//               />
//             </div>
//             {/* Status Dropdown */}
//             <div className="mb-4">
//               <label className="block text-sm font-medium text-gray-700">Status</label>
//               <select
//                 value={status}
//                 onChange={(e) => setStatus(e.target.value)}
//                 className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
//               >
//                 <option value="Present">Present</option>
//                 <option value="Absent">Absent</option>
//               </select>
//             </div>
//             {/* Remarks Dropdown */}
//             <div className="mb-4">
//               <label className="block text-sm font-medium text-gray-700">Remarks</label>
//               <select
//                 value={remarks}
//                 onChange={(e) => setRemarks(e.target.value)}
//                 className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
//               >
//                 <option value="On Time">On Time</option>
//                 <option value="Late">Late</option>
//                 <option value="On Leave">On Leave</option>
//               </select>
//             </div>
//             <div className="flex justify-end gap-2">
//               <button onClick={closeModal} className="bg-gray-500 text-white py-2 px-4 rounded-md">
//                 Close
//               </button>
//               <button onClick={handleSubmitAttendance} className="bg-blue-600 text-white py-2 px-4 rounded-md">
//                 Save
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default AttendanceList;









// import React, { useState, useEffect } from "react";
// import { motion } from "framer-motion"; // Import framer-motion
// import { FaPlus } from "react-icons/fa";
// import { AttendanceService } from "../../service/AttendanceService";
// import { toast } from "react-toastify";

// const AttendanceList = () => {
//   const [attendanceData, setAttendanceData] = useState([]);
//   const [filteredData, setFilteredData] = useState([]);
//   const [startDate, setStartDate] = useState("");  // State for Start Date
//   const [endDate, setEndDate] = useState("");      // State for End Date
//   const [isFiltered, setIsFiltered] = useState(false); // Track if filter is applied

//   // Modal state and input fields
//   const [showModal, setShowModal] = useState(false); // Modal visibility
//   const [inDateTime, setInDateTime] = useState("");  // In DateTime
//   const [outDateTime, setOutDateTime] = useState(""); // Out DateTime
//   const [totalTime, setTotalTime] = useState("");    // Total Time
//   const [status, setStatus] = useState("Present");   // New state for Status
//   const [remarks, setRemarks] = useState("On Time");   // New state for Remarks

//   const fetchAttendance = async () => {
//     try {
//       const response = await AttendanceService.getAttendance();
//       setAttendanceData(response.data);
//       setFilteredData(response.data);
//     } catch (error) {
//       console.error("Error fetching attendance data:", error);
//       alert("Error fetching attendance data, please try again.");
//     }
//   };

//   useEffect(() => {
//     fetchAttendance();
//   }, []);

//   // Function to format the date
//   const formatDate = (dateString) => {
//     const date = new Date(dateString);
//     if (isNaN(date)) return "Invalid Date";
//     return date.toLocaleDateString(); // You can customize the date format as needed
//   };

//   // Helper function to get the day of the week from a date string
//   const getDayOfWeek = (dateString) => {
//     const date = new Date(dateString);
//     if (isNaN(date)) return "Invalid Day";
//     const options = { weekday: "long" };
//     return date.toLocaleDateString("en-US", options); // This will return the day of the week (e.g., "Monday")
//   };

//   const calculateTotalTime = (inDateTime, outDateTime) => {
//     const inDate = new Date(inDateTime);
//     const outDate = new Date(outDateTime);
    
//     // Get the difference in milliseconds
//     const diffInMs = outDate - inDate;
  
//     // Convert to hours, minutes, and seconds
//     const hours = Math.floor(diffInMs / (1000 * 60 * 60));
//     const minutes = Math.floor((diffInMs % (1000 * 60 * 60)) / (1000 * 60));
//     const seconds = Math.floor((diffInMs % (1000 * 60)) / 1000);
  
//     // Format as HH:MM:SS
//     const formattedTime = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  
//     return formattedTime;
//   };

//   // Open the modal to add attendance
//   const openModal = () => {
//     setShowModal(true);
//   };

//   // Close the modal
//   const closeModal = () => {
//     setShowModal(false);
//     setInDateTime("");  // Reset the inDateTime field
//     setOutDateTime(""); // Reset the outDateTime field
//     setTotalTime(""); // Reset the totalTime field
//   };

//   // Filter function based on date range
//   const handleDateChange = (e) => {
//     e.preventDefault();
//     if (startDate && endDate) {
//       const start = new Date(startDate);
//       const end = new Date(endDate);
//       const filtered = attendanceData.filter((attendance) => {
//         const attendanceDate = new Date(attendance.date);
//         return attendanceDate >= start && attendanceDate <= end;
//       });

//       setFilteredData(filtered);
//       setIsFiltered(true);
//     }
//   };

//   // Remove Filter function to reset the filter
//   const handleRemoveFilter = (e) => {
//     e.preventDefault();
//     setStartDate("");
//     setEndDate("");
//     setFilteredData(attendanceData);
//     setIsFiltered(false);
//   };

//   // Group attendance by year and month
//   const groupByYearAndMonth = (data) => {
//     const groupedData = {};

//     data.forEach((item) => {
//       const date = new Date(item.date);
//       const year = date.getFullYear();
//       const month = date.getMonth(); // 0 is January, 11 is December

//       if (!groupedData[year]) {
//         groupedData[year] = {};
//       }
//       if (!groupedData[year][month]) {
//         groupedData[year][month] = [];
//       }

//       groupedData[year][month].push(item);
//     });

//     return groupedData;
//   }

//   const groupedData = groupByYearAndMonth(filteredData);

//   // Handle submitting the attendance form
//   const handleSubmitAttendance = async (e) => {
//     e.preventDefault();

//     const totalTimeFormatted = calculateTotalTime(inDateTime, outDateTime);

//     const attendanceData = {
//       inDateTime,
//       outDateTime,
//       totalTime: totalTimeFormatted,  // Formatted as HH:MM:SS
//       status,
//       remarks,
//     };

//     try {
//       const response = await AttendanceService.addAttendance(attendanceData);
//       if (response.status === 1) {
//         toast.success(response.message); // Toast on success
//         fetchAttendance();
//       }
//     } catch (error) {
//       console.error("Error adding attendance:", error);
//       toast.error("Failed to add attendance.");
//     }
//     closeModal();
//   };

//   return (
//     <div className="mt-4">
//       {/* Header Section */}
//       <div className="flex justify-between items-center my-3">
//         <h1 className="font-semibold text-2xl">Attendance List</h1>
//         <motion.button
//           whileHover={{ scale: 1.1 }}
//           whileTap={{ scale: 0.9 }}
//           onClick={openModal}
//           className="bg-blue-600 hover:bg-blue-700 flex gap-2 text-center text-white font-medium py-2 px-4 rounded hover:no-underline"
//         >
//           Add Attendance
//           <FaPlus className="mt-[3px]" size={14} />
//         </motion.button>
//       </div>

//       <section className="bg-white rounded-lg shadow-lg m-1 p-4 sm:p-8">
//         {/* Date Range Filter */}
//         <div className="flex gap-4 mb-4">
//           <div>
//             <label className="block text-sm font-medium text-gray-700">Start Date</label>
//             <input
//               type="date"
//               value={startDate}
//               onChange={(e) => setStartDate(e.target.value)}
//               className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
//             />
//           </div>
//           <div>
//             <label className="block text-sm font-medium text-gray-700">End Date</label>
//             <input
//               type="date"
//               value={endDate}
//               onChange={(e) => setEndDate(e.target.value)}
//               className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
//             />
//           </div>
//           <div className="flex items-end">
//             {isFiltered ? (
//               <button
//                 onClick={(e) => handleRemoveFilter(e)}
//                 className="bg-red-600 text-white font-semibold py-2 px-4 rounded-md hover:bg-red-700"
//               >
//                 Remove Filter
//               </button>
//             ) : (
//               <button
//                 onClick={(e) => handleDateChange(e)}
//                 className="bg-blue-600 text-white font-semibold py-2 px-4 rounded-md hover:bg-blue-700"
//               >
//                 Apply Filter
//               </button>
//             )}
//           </div>
//         </div>

//         {/* Attendance List Grouped by Year and Month */}
//         <div>
//           {Object.keys(groupedData).map((year) => (
//             <div key={year}>
//               <div className="font-semibold text-lg py-2 cursor-pointer">
//                 <span>{year}</span>
//               </div>
//               <div className="pl-4">
//                 {Object.keys(groupedData[year]).map((monthIndex) => {
//                   const monthName = new Date(0, monthIndex).toLocaleString("en-US", { month: "long" });
//                   return (
//                     <div key={monthIndex}>
//                       <div className="font-semibold text-md py-2 cursor-pointer">
//                         <span>{monthName}</span>
//                       </div>
//                       <div className="pl-4">
//                         <table className="min-w-full table-auto border-collapse">
//                           <thead className="bg-gray-900 border-b">
//                             <tr>
//                               <th className="px-4 py-2 border-b text-left uppercase font-semibold text-sm text-[#939393]">Date</th>
//                               <th className="px-4 py-2 border-b text-left uppercase font-semibold text-sm text-[#939393]">Day</th>
//                               <th className="px-4 py-2 border-b text-left uppercase font-semibold text-sm text-[#939393]">Working Hours</th>
//                               <th className="px-4 py-2 border-b text-left uppercase font-semibold text-sm text-[#939393]">Status</th>
//                               <th className="px-4 py-2 border-b text-left uppercase font-semibold text-sm text-[#939393]">Remarks</th>
//                             </tr>
//                           </thead>
//                           <tbody>
//                             {groupedData[year][monthIndex].map((attendance, index) => (
//                               <tr key={index} className="hover:bg-gray-100">
//                                 <td className="px-4 py-2 border-b">{formatDate(attendance.inDateTime)}</td>
//                                 <td className="px-4 py-2 border-b">{getDayOfWeek(attendance.inDateTime)}</td>
//                                 <td className="px-4 py-2 border-b">{attendance.totalTime || "N/A"}</td>
//                                 <td className="px-4 py-2 border-b">{attendance.status}</td>
//                                 <td className="px-4 py-2 border-b">{attendance.remarks || "N/A"}</td>
//                               </tr>
//                             ))}
//                           </tbody>
//                         </table>
//                       </div>
//                     </div>
//                   );
//                 })}
//               </div>
//             </div>
//           ))}
//         </div>
//       </section>

//       {/* Modal for Add Attendance */}
//       {showModal && (
//         <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex justify-center items-center z-50">
//           <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
//             <h2 className="text-xl font-semibold mb-4">Add Attendance</h2>
//             <div className="mb-4">
//               <label className="block text-sm font-medium text-gray-700">In DateTime</label>
//               <input
//                 type="datetime-local"
//                 value={inDateTime}
//                 onChange={(e) => {
//                   setInDateTime(e.target.value);
//                   setTotalTime(calculateTotalTime(e.target.value, outDateTime)); // Calculate total time as user types
//                 }}
//                 className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
//               />
//             </div>
//             <div className="mb-4">
//               <label className="block text-sm font-medium text-gray-700">Out DateTime</label>
//               <input
//                 type="datetime-local"
//                 value={outDateTime}
//                 onChange={(e) => {
//                   setOutDateTime(e.target.value);
//                   setTotalTime(calculateTotalTime(inDateTime, e.target.value)); // Calculate total time as user types
//                 }}
//                 className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
//               />
//             </div>
//             <div className="mb-4">
//               <label className="block text-sm font-medium text-gray-700">Total Time</label>
//               <input
//                 type="text"
//                 value={totalTime}
//                 disabled
//                 className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
//               />
//             </div>
//             {/* Status Dropdown */}
//             <div className="mb-4">
//               <label className="block text-sm font-medium text-gray-700">Status</label>
//               <select
//                 value={status}
//                 onChange={(e) => setStatus(e.target.value)}
//                 className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
//               >
//                 <option value="Present">Present</option>
//                 <option value="Absent">Absent</option>
//               </select>
//             </div>
//             {/* Remarks Dropdown */}
//             <div className="mb-4">
//               <label className="block text-sm font-medium text-gray-700">Remarks</label>
//               <select
//                 value={remarks}
//                 onChange={(e) => setRemarks(e.target.value)}
//                 className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
//               >
//                 <option value="On Time">On Time</option>
//                 <option value="Late">Late</option>
//                 <option value="On Leave">On Leave</option>
//               </select>
//             </div>
//             <div className="flex justify-end gap-2">
//               <button onClick={closeModal} className="bg-gray-500 text-white py-2 px-4 rounded-md">
//                 Close
//               </button>
//               <button onClick={handleSubmitAttendance} className="bg-blue-600 text-white py-2 px-4 rounded-md">
//                 Save
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default AttendanceList;













// import React, { useState, useEffect } from "react";
// import { motion } from "framer-motion"; // Import framer-motion
// import { FaPlus } from "react-icons/fa";
// import { AttendanceService } from "../../service/AttendanceService";
// import { toast } from "react-toastify";

// const AttendanceList = () => {
//   const [attendanceData, setAttendanceData] = useState([]);
//   const [filteredData, setFilteredData] = useState([]);
//   const [startDate, setStartDate] = useState("");  // State for Start Date
//   const [endDate, setEndDate] = useState("");      // State for End Date
//   const [isFiltered, setIsFiltered] = useState(false); // Track if filter is applied

//   // Modal state and input fields
//   const [showModal, setShowModal] = useState(false); // Modal visibility
//   const [inDateTime, setInDateTime] = useState("");  // In DateTime
//   const [outDateTime, setOutDateTime] = useState(""); // Out DateTime
//   const [totalTime, setTotalTime] = useState("");    // Total Time
//   const [status, setStatus] = useState("Present");   // New state for Status
//   const [remarks, setRemarks] = useState("On Time");   // New state for Status

//   // Example static data
//   const Data = [
//     {
//       date: "2025-01-01",
//       workingHours: "8:00",
//       status: "Present",
//       remarks: "On time",
//     },
//     {
//       date: "2025-01-02",
//       workingHours: "N/A",
//       status: "Absent",
//       remarks: "Sick leave",
//     },
//     {
//       date: "2025-01-03",
//       workingHours: "8:30",
//       status: "Present",
//       remarks: "On time",
//     },
//   ];

//   const fetchAttendance = async () => {
//     try {
//       const response = await AttendanceService.getAttendance();
//       // setAttendanceData(Data);
//       // setFilteredData(Data);
//       setAttendanceData(response.data);
//       setFilteredData(response.data);
//     } catch (error) {
//       console.error("Error fetching attendance data:", error);
//       alert("Error fetching attendance data, please try again.");
//     }
//   };


//   useEffect(() => {
//     fetchAttendance();
//   }, []);

//   // Function to format the date
//   const formatDate = (dateString) => {
//     const date = new Date(dateString);
//     return date.toLocaleDateString(); // You can customize the date format as needed
//   };

//   // Helper function to get the day of the week from a date string
//   const getDayOfWeek = (dateString) => {
//     const date = new Date(dateString);
//     const options = { weekday: "long" };
//     return date.toLocaleDateString("en-US", options); // This will return the day of the week (e.g., "Monday")
//   };


//   const calculateTotalTime = (inDateTime, outDateTime) => {
//     const inDate = new Date(inDateTime);
//     const outDate = new Date(outDateTime);
    
//     // Get the difference in milliseconds
//     const diffInMs = outDate - inDate;
  
//     // Convert to hours, minutes, and seconds
//     const hours = Math.floor(diffInMs / (1000 * 60 * 60));
//     const minutes = Math.floor((diffInMs % (1000 * 60 * 60)) / (1000 * 60));
//     const seconds = Math.floor((diffInMs % (1000 * 60)) / 1000);
  
//     // Format as HH:MM:SS
//     const formattedTime = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  
//     return formattedTime;
//   };
   

//   // Open the modal to add attendance
//   const openModal = () => {
//     setShowModal(true);
//   };

//   // Close the modal
//   const closeModal = () => {
//     setShowModal(false);
//     setInDateTime("");  // Reset the inDateTime field
//     setOutDateTime(""); // Reset the outDateTime field
//     setTotalTime(""); // Reset the totalTime field
//   };

//   // Filter function based on date range
//   const handleDateChange = (e) => {
//     e.preventDefault();
//     if (startDate && endDate) {
//       const start = new Date(startDate);
//       const end = new Date(endDate);
//       const filtered = attendanceData.filter((attendance) => {
//         const attendanceDate = new Date(attendance.date);
//         return attendanceDate >= start && attendanceDate <= end;
//       });

//       setFilteredData(filtered);
//       setIsFiltered(true);
//     }
//   };

//   // Remove Filter function to reset the filter
//   const handleRemoveFilter = (e) => {
//     e.preventDefault();
//     setStartDate("");
//     setEndDate("");
//     setFilteredData(attendanceData);
//     setIsFiltered(false);
//   };

//   // if (attendanceData.length === 0) {
//   //   return <div>No attendance data available.</div>;
//   // }

//   // Handle submitting the attendance form
//   const handleSubmitAttendance = async (e) => {
//     e.preventDefault();

//     const totalTimeFormatted = calculateTotalTime(inDateTime, outDateTime);

//     const attendanceData = {
//       inDateTime,
//       outDateTime,
//       totalTime: totalTimeFormatted,  // Formatted as HH:MM:SS
//       status,
//       remarks,
//     };

//     console.log(attendanceData);
//     try {
//       debugger;
//       const response = await AttendanceService.addAttendance(attendanceData);
//       if (response.status === 1) {
//         toast.success(response.message); // Toast on success
//         // navigate("/task/task-list");
//         console.log("Attendance Submitted: ", { inDateTime, outDateTime, totalTime });
//         fetchAttendance();

//       }
//     } catch (error) {
//       console.error("Error adding attendance:", error);
//       toast.error("Failed to add attendance.");
//     }
//     // Here you can push the new attendance data to your state or send to API
//     closeModal();
//   };

//   return (
//     <div className="mt-4">
//       {/* Header Section */}
//       <div className="flex justify-between items-center my-3">
//         <h1 className="font-semibold text-2xl">Attendance List</h1>
//         <motion.button
//           whileHover={{ scale: 1.1 }}
//           whileTap={{ scale: 0.9 }}
//           onClick={openModal}
//           className="bg-blue-600 hover:bg-blue-700 flex gap-2 text-center text-white font-medium py-2 px-4 rounded hover:no-underline"
//         >
//           Add Attendance
//           <FaPlus className="mt-[3px]" size={14} />
//         </motion.button>
//       </div>

//       <section className="bg-white rounded-lg shadow-lg m-1 p-4 sm:p-8">
//       {/* Date Range Filter */}
//       <div className="flex gap-4 mb-4">
//         <div>
//           <label className="block text-sm font-medium text-gray-700">Start Date</label>
//           <input
//             type="date"
//             value={startDate}
//             onChange={(e) => setStartDate(e.target.value)}
//             className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
//           />
//         </div>
//         <div>
//           <label className="block text-sm font-medium text-gray-700">End Date</label>
//           <input
//             type="date"
//             value={endDate}
//             onChange={(e) => setEndDate(e.target.value)}
//             className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
//           />
//         </div>
//         <div className="flex items-end">
//           {isFiltered ? (
//             <button
//               onClick={(e) => handleRemoveFilter(e)}
//               className="bg-red-600 text-white font-semibold py-2 px-4 rounded-md hover:bg-red-700"
//             >
//               Remove Filter
//             </button>
//           ) : (
//             <button
//               onClick={(e) => handleDateChange(e)}
//               className="bg-blue-600 text-white font-semibold py-2 px-4 rounded-md hover:bg-blue-700"
//             >
//               Apply Filter
//             </button>
//           )}
//         </div>
//       </div>

//       {/* Attendance Table */}
//       <div className="overflow-x-auto">
//         <table className="min-w-full table-auto border-collapse">
//           <thead className="bg-gray-900 border-b">
//             <tr>
//               <th className="px-4 py-2 border-b text-left uppercase font-semibold text-sm text-[#939393]">Date</th>
//               <th className="px-4 py-2 border-b text-left uppercase font-semibold text-sm text-[#939393]">Day</th>
//               <th className="px-4 py-2 border-b text-left uppercase font-semibold text-sm text-[#939393]">Working Hours</th>
//               <th className="px-4 py-2 border-b text-left uppercase font-semibold text-sm text-[#939393]">Status</th>
//               <th className="px-4 py-2 border-b text-left uppercase font-semibold text-sm text-[#939393]">Remarks</th>
//             </tr>
//           </thead>
//           <tbody>
//             {filteredData.length > 0 ? (
//               filteredData.map((attendance, index) => (
//                 <tr key={index} className="hover:bg-gray-100">
//                   <td className="px-4 py-2 border-b">{formatDate(attendance.inDateTime)}</td>
//                   <td className="px-4 py-2 border-b">{getDayOfWeek(attendance.inDateTime)}</td>
//                   <td className="px-4 py-2 border-b">{attendance.totalTime || "N/A"}</td>
//                   <td className="px-4 py-2 border-b">{attendance.status}</td>
//                   <td className="px-4 py-2 border-b">{attendance.remarks || "N/A"}</td>
//                 </tr>
//               ))
//             ) : (
//               <tr>
//                 <td colSpan="5" className="px-4 py-2 text-center border-b">
//                   No attendance records available.
//                 </td>
//               </tr>
//             )}
//           </tbody>
//         </table>
//       </div>
//       </section>

//       {/* Modal for Add Attendance */}
//       {showModal && (
//         <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex justify-center items-center z-50">
//           <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
//             <h2 className="text-xl font-semibold mb-4">Add Attendance</h2>
//             <div className="mb-4">
//               <label className="block text-sm font-medium text-gray-700">In DateTime</label>
//               <input
//                 type="datetime-local"
//                 value={inDateTime}
//                 onChange={(e) => {
//                   setInDateTime(e.target.value);
//                   setTotalTime(calculateTotalTime(e.target.value, outDateTime)); // Calculate total time as user types
//                 }}
//                 className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
//               />
//             </div>
//             <div className="mb-4">
//               <label className="block text-sm font-medium text-gray-700">Out DateTime</label>
//               <input
//                 type="datetime-local"
//                 value={outDateTime}
//                 onChange={(e) => {
//                   setOutDateTime(e.target.value);
//                   setTotalTime(calculateTotalTime(inDateTime, e.target.value)); // Calculate total time as user types
//                 }}
//                 className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
//               />
//             </div>
//             <div className="mb-4">
//               <label className="block text-sm font-medium text-gray-700">Total Time</label>
//               <input
//                 type="text"
//                 value={totalTime}
//                 disabled
//                 className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
//               />
//             </div>
//             {/* Status Dropdown */}
//             <div className="mb-4">
//               <label className="block text-sm font-medium text-gray-700">Status</label>
//               <select
//                 value={status}
//                 onChange={(e) => setStatus(e.target.value)}
//                 className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
//               >
//                 <option value="Present">Present</option>
//                 <option value="Absent">Absent</option>
//               </select>
//             </div>
//             {/* Remarks Dropdown */}
//             <div className="mb-4">
//               <label className="block text-sm font-medium text-gray-700">Remarks</label>
//               <select
//                 value={remarks}
//                 onChange={(e) => setRemarks(e.target.value)}
//                 className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
//               >
//                 <option value="On Time">On Time</option>
//                 <option value="Late">Late</option>
//                 <option value="On Leave">On Leave</option>
//               </select>
//             </div>
//             <div className="flex justify-end gap-2">
//               <button onClick={closeModal} className="bg-gray-500 text-white py-2 px-4 rounded-md">
//                 Close
//               </button>
//               <button onClick={handleSubmitAttendance} className="bg-blue-600 text-white py-2 px-4 rounded-md">
//                 Save
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default AttendanceList;








// import React, { useEffect, useState } from "react";
// import { EmployeeService } from "../../service/EmployeeService"; // Assuming you have a service for fetching data
// import { motion } from "framer-motion"; // Import framer-motion
// import { Link } from "react-router-dom";
// import { FaPlus } from "react-icons/fa";

// const AttendanceList = () => {
//   const [attendanceData, setAttendanceData] = useState([]);
//   const [filteredData, setFilteredData] = useState([]);
//   const [startDate, setStartDate] = useState("");  // State for Start Date
//   const [endDate, setEndDate] = useState("");      // State for End Date
//   const [isFiltered, setIsFiltered] = useState(false); // Track if filter is applied

//   // Modal state and input fields
//   const [showModal, setShowModal] = useState(false); // Modal visibility
//   const [inTime, setInTime] = useState("");         // In Time
//   const [outTime, setOutTime] = useState("");       // Out Time
//   const [totalTime, setTotalTime] = useState("");   // Total Time

//   // Example static data
//   const Data = [
//     {
//       date: "2025-01-01",
//       workingHours: "8:00",
//       status: "Present",
//       remarks: "On time",
//     },
//     {
//       date: "2025-01-02",
//       workingHours: "N/A",
//       status: "Absent",
//       remarks: "Sick leave",
//     },
//     {
//       date: "2025-01-03",
//       workingHours: "8:30",
//       status: "Present",
//       remarks: "On time",
//     },
//   ];

//   useEffect(() => {
//     const fetchAttendance = async () => {
//       try {
//         // Assuming EmployeeService has a method to fetch attendance by employee ID
//         // const data = await EmployeeService.getAttendanceByEmployeeId(); // You might want to pass the employee ID here
//         setAttendanceData(Data); // Format your response as per your API structure
//         setFilteredData(Data); // Format your response as per your API structure
//       } catch (error) {
//         console.error("Error fetching attendance data:", error);
//         alert("Error fetching attendance data, please try again.");
//       }
//     };

//     fetchAttendance();
//   }, []);

//   // Helper function to get the day of the week from a date string
//   const getDayOfWeek = (dateString) => {
//     const date = new Date(dateString);
//     const options = { weekday: "long" };
//     return date.toLocaleDateString("en-US", options); // This will return the day of the week (e.g., "Monday")
//   };

//    // Handle the calculation of Total Time based on In Time and Out Time
//    const calculateTotalTime = (inTime, outTime) => {
//     const inDate = new Date("1970-01-01T" + inTime);
//     const outDate = new Date("1970-01-01T" + outTime);
//     const diff = (outDate - inDate) / 1000 / 60 / 60; // Difference in hours
//     const hours = Math.floor(diff);
//     const minutes = Math.round((diff - hours) * 60);
//     return `${hours}:${minutes < 10 ? "0" + minutes : minutes}`;
//   };

//   // Open the modal to add attendance
//   const openModal = () => {
//     setShowModal(true);
//   };

//   // Close the modal
//   const closeModal = () => {
//     setShowModal(false);
//     setInTime("");  // Reset the inTime field
//     setOutTime(""); // Reset the outTime field
//     setTotalTime(""); // Reset the totalTime field
//   };

//   // Handle submitting the attendance form
//   const handleSubmitAttendance = () => {
//     // Here you can push the new attendance data to your state or send to API
//     console.log("Attendance Submitted: ", { inTime, outTime, totalTime });
//     closeModal();
//   };

//   // Filter function based on date range
//   const handleDateChange = (e) => {
//     e.preventDefault();
//     if (startDate && endDate) {
//       // Convert the selected start and end dates into Date objects for comparison
//       const start = new Date(startDate);
//       const end = new Date(endDate);

//       // Filter the attendance data by the selected date range
//       const filtered = attendanceData.filter((attendance) => {
//         const attendanceDate = new Date(attendance.date);
//         return attendanceDate >= start && attendanceDate <= end;
//       });

//       setFilteredData(filtered); // Update the filtered data
//       setIsFiltered(true); // Set filter applied flag
//     }
//   };

//   // Remove Filter function to reset the filter
//   const handleRemoveFilter = (e) => {
//     e.preventDefault();
//     setStartDate(""); // Clear start date
//     setEndDate("");   // Clear end date
//     setFilteredData(attendanceData); // Reset to original data
//     setIsFiltered(false); // Reset filter applied flag
//   };

//   // If no attendance data is available
//   if (attendanceData.length === 0) {
//     return <div>No attendance data available.</div>;
//   }

//   return (
//     <div className="mt-4">
//       {/* <h2 className="text-2xl font-semibold mb-4">Attendance List</h2> */}

//       {/* Header Section */}
//       <div className="flex justify-between items-center my-3 ">
//         <h1 className="font-semibold text-2xl">Attendance List</h1>
//         <motion.button 
//          whileHover={{ scale: 1.1 }} 
//          whileTap={{ scale: 0.9 }}
//          onClick={openModal}
//          className="bg-blue-600 hover:bg-blue-700 flex gap-2 text-center text-white font-medium py-2 px-4 rounded hover:no-underline"
//          >
//           Add Attendance
//           <FaPlus className="mt-[3px]" size={14} />
//         </motion.button>
//       </div>

//       <section className="bg-white rounded-lg shadow-lg m-1 p-4 sm:p-8">
//         {/* Date Range Filter */}
//       <div className="flex gap-4 mb-4">
//         {/* Start Date Picker */}
//         <div>
//           <label className="block text-sm font-medium text-gray-700">Start Date</label>
//           <input
//             type="date"
//             value={startDate}
//             onChange={(e) => setStartDate(e.target.value)}
//             className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
//           />
//         </div>

//         {/* End Date Picker */}
//         <div>
//           <label className="block text-sm font-medium text-gray-700">End Date</label>
//           <input
//             type="date"
//             value={endDate}
//             onChange={(e) => setEndDate(e.target.value)}
//             className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
//           />
//         </div>

//         {/* Filter Button or Remove Filter Button */}
//         <div className="flex items-end">
//           {isFiltered ? (
//             <button
//               onClick={(e) => handleRemoveFilter(e)}
//               className="bg-red-600 text-white font-semibold py-2 px-4 rounded-md hover:bg-red-700"
//             >
//               Remove Filter
//             </button>
//           ) : (
//             <button
//               onClick={(e) => handleDateChange(e)}
//               className="bg-blue-600 text-white font-semibold py-2 px-4 rounded-md hover:bg-blue-700"
//             >
//               Apply Filter
//             </button>
//           )}
//         </div>
//       </div>

//       {/* Attendance Table */}
//       <div className="overflow-x-auto">
//         <table className="min-w-full table-auto border-collapse">
//           <thead className="bg-gray-900 border-b">
//             <tr>
//               <th className="px-4 py-2 border-b text-left uppercase font-semibold text-sm text-[#939393]">Date</th>
//               <th className="px-4 py-2 border-b text-left uppercase font-semibold text-sm text-[#939393]">Day</th>
//               <th className="px-4 py-2 border-b text-left uppercase font-semibold text-sm text-[#939393]">Working Hours</th>
//               <th className="px-4 py-2 border-b text-left uppercase font-semibold text-sm text-[#939393]">Status</th>
//               <th className="px-4 py-2 border-b text-left uppercase font-semibold text-sm text-[#939393]">Remarks</th>
//             </tr>
//           </thead>
//           <tbody>
//             {filteredData.length > 0 ? (
//               filteredData.map((attendance, index) => (
//                 <tr key={index} className="hover:bg-gray-100">
//                   <td className="px-4 py-2 border-b">{attendance.date}</td>
//                   <td className="px-4 py-2 border-b">{getDayOfWeek(attendance.date)}</td>
//                   <td className="px-4 py-2 border-b">{attendance.workingHours || "N/A"}</td>
//                   <td className="px-4 py-2 border-b">{attendance.status}</td>
//                   <td className="px-4 py-2 border-b">{attendance.remarks || "N/A"}</td>
//                 </tr>
//               ))
//             ) : (
//               <tr>
//                 <td colSpan="5" className="px-4 py-2 text-center border-b">
//                   No attendance records available.
//                 </td>
//               </tr>
//             )}
//           </tbody>
//         </table>
//       </div>
//       </section>

//       {/* Modal for Add Attendance */}
//       {showModal && (
//         <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex justify-center items-center z-50">
//           <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
//             <h2 className="text-xl font-semibold mb-4">Add Attendance</h2>
//             <div className="mb-4">
//               <label className="block text-sm font-medium text-gray-700">In Time</label>
//               <input
//                 type="time"
//                 value={inTime}
//                 onChange={(e) => {
//                   setInTime(e.target.value);
//                   setTotalTime(calculateTotalTime(e.target.value, outTime)); // Calculate total time as user types
//                 }}
//                 className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
//               />
//             </div>
//             <div className="mb-4">
//               <label className="block text-sm font-medium text-gray-700">Out Time</label>
//               <input
//                 type="time"
//                 value={outTime}
//                 onChange={(e) => {
//                   setOutTime(e.target.value);
//                   setTotalTime(calculateTotalTime(inTime, e.target.value)); // Calculate total time as user types
//                 }}
//                 className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
//               />
//             </div>
//             <div className="mb-4">
//               <label className="block text-sm font-medium text-gray-700">Total Time</label>
//               <input
//                 type="text"
//                 value={totalTime}
//                 disabled
//                 className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
//               />
//             </div>
//             <div className="flex justify-end gap-2">
//               <button onClick={closeModal} className="bg-gray-500 text-white py-2 px-4 rounded-md">
//                 Close
//               </button>
//               <button onClick={handleSubmitAttendance} className="bg-blue-600 text-white py-2 px-4 rounded-md">
//                 Save
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
      
//     </div>
//   );
// };

// export default AttendanceList;








          {/* <thead>
            <tr>
              <th className="px-4 py-2 border-b text-left">Date</th>
              <th className="px-4 py-2 border-b text-left">Day</th>
              <th className="px-4 py-2 border-b text-left">Working Hours</th>
              <th className="px-4 py-2 border-b text-left">Status</th>
              <th className="px-4 py-2 border-b text-left">Remarks</th>
            </tr>
          </thead> */}