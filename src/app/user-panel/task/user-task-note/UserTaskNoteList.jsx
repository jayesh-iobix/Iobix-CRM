import React, { useEffect, useState } from "react";
import { FaArrowLeft, FaEdit, FaEye } from "react-icons/fa";
import { Link, useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { TaskNoteService } from "../../../service/TaskNoteService";

const UserTaskNoteList = () => {
  const { id } = useParams();
  const [taskNotes, setTaskNotes] = useState([]);
  const [taskAllocationId, setTaskAllocationId] = useState("");
  const [taskNoteId, setTaskNoteId] = useState("");

  // Popup state
  const [isPopupVisible, setIsPopupVisible] = useState(false);
  const [currentTask, setCurrentTask] = useState(null);

  // Fields for the popup form
  const [taskDate, setTaskDate] = useState("");
  const [taskTimeIn, setTaskTimeIn] = useState("");
  const [taskTimeOut, setTaskTimeOut] = useState("");
  const [taskDuration, setTaskDuration] = useState("");
  const [taskUpdate, setTaskUpdate] = useState("");
  const navigate = useNavigate("");

  useEffect(() => {
    const fetchTaskNotes = async () => {
      try {
        const result = await TaskNoteService.getTaskNoteByTaskId(id);
        setTaskNotes(result.data);
        console.log(result.data)

      } catch (error) {
        console.error("Error fetching tasks:", error);
        setTaskNotes([]);
      }
    };
    fetchTaskNotes();
  }, [id]);

  // Function to format the date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString(); // You can customize the date format as needed
  };

  // Function to handle opening the popup and setting the current task
  const handleEyeClick = (task) => {
    setTaskNoteId(task.taskNoteId)
    setCurrentTask(task); // Set the selected task data
    setTaskAllocationId(task.taskAllocationId); // Set the selected task data
    setTaskDate(task.taskDate ? task.taskDate.split("T")[0] : ""); // Assuming taskDate is in a format we can directly display
    setTaskTimeIn(task.taskTimeIn);
    setTaskTimeOut(task.taskTimeOut);
    setTaskDuration(task.taskDuration);
    setTaskUpdate(task.taskUpdate);
    setIsPopupVisible(true); // Show the popup
  };

    // Function to calculate the task duration based on taskTimeIn and taskTimeOut
    const calculateTaskDuration = () => {
      if (taskTimeIn && taskTimeOut) {
        const timeIn = taskTimeIn.split(":").map(Number);
        const timeOut = taskTimeOut.split(":").map(Number);
  
        const timeInDate = new Date(0, 0, 0, timeIn[0], timeIn[1]);
        const timeOutDate = new Date(0, 0, 0, timeOut[0], timeOut[1]);
  
        const durationInMilliseconds = timeOutDate - timeInDate;
        if (durationInMilliseconds < 0) {
          // If the result is negative, we assume it's a next-day duration
          timeOutDate.setDate(timeOutDate.getDate() + 1);
        }
  
        const durationInMinutes = (timeOutDate - timeInDate) / (1000 * 60);
        const hours = Math.floor(durationInMinutes / 60);
        const minutes = Math.floor(durationInMinutes % 60);
  
        // Set the calculated duration
        setTaskDuration(`${hours}:${minutes < 10 ? "0" : ""}${minutes}`);
      }
    };
  
    // Update task duration when taskTimeIn or taskTimeOut changes
    useEffect(() => {
      calculateTaskDuration();
    }, [taskTimeIn, taskTimeOut]);

    const formatTimeToBackendFormat = (time) => {
      if (!time) return ""; // If no time, return an empty string
      const [hours, minutes] = time.split(":");
      return `${hours}:${minutes}:00.0000000`; // Convert to HH:mm:ss.SSSSSSS
    };
  

  //Function to handle form submission
  const handleSubmit = async (event) => {
    event.preventDefault();

    const formattedTimeIn = formatTimeToBackendFormat(taskTimeIn);
    const formattedTimeOut = formatTimeToBackendFormat(taskTimeOut);
    const formattedDuration = formatTimeToBackendFormat(taskDuration);


    // const taskDurationFormatted = `${taskDuration}:00`;  // Ensure taskDuration is in HH:mm:ss format
    const taskNoteData = {
        taskAllocationId,
        taskDate, 
        taskTimeIn: formattedTimeIn,
        taskTimeOut: formattedTimeOut,  
        taskDuration: formattedDuration, 
        taskUpdate,
    };

    try {
      // Call the API to add the task note
      const response = await TaskNoteService.updateTaskNote(taskNoteId,taskNoteData);
      if(response.status === 1){
        toast.success(response.message); // Toast on success
      }
      // console.log("Task note added successfully:", result);
      setIsPopupVisible(false); // Close the popup
    } catch (error) {
      console.error(
        "Error adding task note:",
        error.response?.data || error.message
      );
      if (error.response?.data?.errors) {
        console.log("Validation Errors:", error.response.data.errors); // This will help pinpoint specific fields causing the issue
      }
    }

    // Close the popup after submission
    // setIsPopupVisible(false);
  };

  return (
    <>
      <div className="flex justify-between items-center my-3 ">
        <h1 className="font-semibold text-2xl">Task Note List</h1>
        {/* <button
            onClick={() => navigate(-1)} // Navigate back to previous page
            className="px-6 py-2 bg-gray-300 text-black rounded-md font-semibold hover:bg-gray-400 transition duration-200"
          >
            Back
          </button> */}
          <Link
          onClick={() => navigate(-1)} // Navigate back to previous page
          className="bg-gray-500 hover:bg-gray-400 text-white font-bold py-2 px-4 rounded flex items-center gap-2 hover:no-underline"
        >
          <FaArrowLeft size={16} />
          Back
        </Link>
      </div>

      <div className="grid overflow-x-auto shadow-xl">
        <table className="min-w-full bg-white border border-gray-200">
          <thead className="bg-gray-900 border-b">
            <tr>
              <th className="text-left py-3 px-4 uppercase font-semibold text-sm text-[#939393]">
                Task Name
              </th>
              {/* <th className="text-left py-3 px-4 uppercase font-semibold text-sm text-[#939393]">
                Assigned By
              </th> */}
              <th className="text-left py-3 px-4 uppercase font-semibold text-sm text-[#939393]">
                Created By
              </th>
              <th className="text-left py-3 px-4 uppercase font-semibold text-sm text-[#939393]">
                Task Date
              </th>
              {/* <th className="text-left py-3 px-4 uppercase font-semibold text-sm text-[#939393]">
                Task Time In
              </th>
              <th className="text-left py-3 px-4 uppercase font-semibold text-sm text-[#939393]">
                Task Time Out
              </th> */}
              <th className="text-left py-3 px-4 uppercase font-semibold text-sm text-[#939393]">
                Task Duration
              </th>
              <th className="text-left py-3 px-4 uppercase font-semibold text-sm text-[#939393]">
                Task Updates
              </th>
              {/* <th className="text-left py-3 px-4 uppercase font-semibold text-sm text-[#939393]">
                Task Updates
              </th> */}
              {/* <th className="text-left py-3 px-4 uppercase font-semibold text-sm text-[#939393]">
                Status
              </th> */}
              {/* <th className="text-left py-3 px-4 uppercase font-semibold text-sm text-[#939393]">
                Actions
              </th> */}
            </tr>
          </thead>
          <tbody>
            {taskNotes.map((item) => (
              <tr
                key={item.taskNoteId}
                className="border-b hover:bg-gray-50"
              >
                <td className="py-3 px-4 text-gray-700">{item.taskName}</td>
                <td className="py-3 px-4 text-gray-700">
                  {item.taskCreatedByName}
                </td>
                {/* <td className="py-3 px-4 text-gray-700">
                  {item.taskAssignByName}
                </td> */}
                <td className="py-3 px-4 text-gray-700">{formatDate(item.taskDate)}</td>
                {/* <td className="py-3 px-4 text-gray-700">
                  {item.taskTimeIn}
                </td>
                <td className="py-3 px-4 text-gray-700">
                  {item.taskTimeOut}
                </td> */}
                <td className="py-3 px-4 text-gray-700">{item.taskDuration}</td>
                <td className="py-3 px-4 text-gray-700">{item.taskUpdate}</td>

                {/* <td className="py-3 px-4 text-gray-700">{item.taskUpdate}</td> */}
                {/* <td className="py-3 px-4">
                  <span
                    className={`px-2 py-1 rounded-lg font-medium ${getStatusColor(
                      item.taskStatusName
                    )}`}
                  >
                    {item.taskStatusName}
                  </span>
                </td> */}
                {/* <td className="py-3 px-4">
                  <div className="flex gap-3">
                    <Link
                      to={`/user/task-list/${item.taskAllocationId}`}
                      className="text-blue-500 hover:text-blue-700"
                    >
                      <FaEdit size={24} />
                    </Link>
                    <FaEye
                      size={24}
                      className="text-green-500 hover:text-green-700"
                      onClick={() => handleEyeClick(item)}
                    />
                  </div>
                </td> */}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Popup for task details */}
      {/* {isPopupVisible && (
        <div className="fixed inset-0 bg-gray-700 bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg md:w-1/2 xl:w-1/2">
            <h2 className="text-xl font-semibold mb-4">Task Details</h2>
            <form >
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">
                  Task Date
                </label>
                <input
                  type="date"
                  value={taskDate}
                  onChange={(e) => setTaskDate(e.target.value)}
                  className="w-full mt-1 px-3 py-2 border rounded-md"
                />
              </div>
              <div className="md:flex xl:flex gap-3">
              <div className="mb-4 md:w-1/2 xl:w-1/2">
                <label className="block text-sm font-medium text-gray-700">
                  Task Time In
                </label>
                <input
                  type="time"
                  value={taskTimeIn}
                  onChange={(e) => setTaskTimeIn(e.target.value)}
                  className="w-full mt-1 px-3 py-2 border rounded-md"
                />
              </div>
              <div className="mb-4 md:w-1/2 xl:w-1/2">
                <label className="block text-sm font-medium text-gray-700">
                  Task Time Out
                </label>
                <input
                  type="time"
                  value={taskTimeOut}
                  onChange={(e) => setTaskTimeOut(e.target.value)}
                  className="w-full mt-1 px-3 py-2 border rounded-md"
                />
              </div>
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">
                  Task Duration
                </label>
                <input
                  type="text"
                  value={taskDuration}
                  onChange={(e) => setTaskDuration(e.target.value)}
                  className="w-full mt-1 px-3 py-2 border rounded-md"
                  disabled
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">
                  Task Update
                </label>
                <textarea
                  value={taskUpdate}
                  onChange={(e) => setTaskUpdate(e.target.value)}
                  className="w-full mt-1 px-3 py-2 border rounded-md"
                />
              </div>
              <div className="flex flex-col md:flex-row justify-end gap-4">
                <button
                  type="button"
                  onClick={() => setIsPopupVisible(false)}
                  className="px-4 py-2 bg-gray-300 text-black rounded"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSubmit}
                  className="px-4 py-2 bg-blue-500 text-white rounded"
                >
                  Submit
                </button>
              </div>
            </form>
          </div>
        </div>
      )} */}
    </>
  );
};

export default UserTaskNoteList;











// import React, { useEffect, useState } from "react";
// import { FaEdit, FaEye } from "react-icons/fa";
// import { Link, useNavigate, useParams } from "react-router-dom";
// import { TaskNoteService } from "../../service/TaskNoteService";

// const TaskNoteList = () => {
//   const { id } = useParams();
//   const [tasks, setTasks] = useState([]);
//   const [taskAllocationId, setTaskAllocationId] = useState("");
//   const [filteredTasks, setFilteredTasks] = useState([]);
//   const [employeeFilter, setEmployeeFilter] = useState(""); // State for employee filter
//   const [priorityFilter, setPriorityFilter] = useState(""); // State for priority filter
//   const [statusFilter, setStatusFilter] = useState(""); // State for status filter

//   // Popup state
//   const [isPopupVisible, setIsPopupVisible] = useState(false);
//   const [currentTask, setCurrentTask] = useState(null);

//   // Fields for the popup form
//   const [taskDate, setTaskDate] = useState("");
//   const [taskTimeIn, setTaskTimeIn] = useState("");
//   const [taskTimeOut, setTaskTimeOut] = useState("");
//   const [taskDuration, setTaskDuration] = useState("");
//   const [taskUpdate, setTaskUpdate] = useState("");
//   const navigate = useNavigate("");

//   useEffect(() => {
//     const fetchTaskNotes = async () => {
//       try {
//         const result = await TaskNoteService.getTaskNoteByTaskId(id);
//         setTasks(result.data);
//         setFilteredTasks(result.data); // Initially show all tasks
//           tasks.map((item) => (
//                 // setTaskAllocationId(item.taskAllocationId), // Set the selected task data
//                 // setTaskDate(item.taskDate ? item.taskDate.split("T")[0] : ""), // Assuming taskDate is in a format we can directly display
//                 setTaskTimeIn(item.taskTimeIn),
//                 setTaskTimeOut(item.taskTimeOut),
//                 // setTaskDuration(item.taskDuration),
//                 // setTaskUpdate(item.taskUpdate),
//                 calculateDuration()
//           // setCurrentTask(item), // Set the selected task data
//         ) );
//       } catch (error) {
//         console.error("Error fetching tasks:", error);
//         setTasks([]);
//         setFilteredTasks([]); // Fallback to an empty array in case of an error
//       }
//     };
//     fetchTaskNotes();
//   }, [id]);

//   useEffect(() => {
//     // Apply filters to the tasks array
//     let filtered = tasks;

//     // Filter by employee
//     if (employeeFilter) {
//       filtered = filtered.filter((task) =>
//         task.taskTaker.toLowerCase().includes(employeeFilter.toLowerCase())
//       );
//     }

//     // Filter by priority
//     if (priorityFilter) {
//       filtered = filtered.filter((task) =>
//         task.taskPriority.toLowerCase().includes(priorityFilter.toLowerCase())
//       );
//     }

//     // Filter by status
//     if (statusFilter) {
//       filtered = filtered.filter((task) =>
//         task.taskStatusName.toLowerCase().includes(statusFilter.toLowerCase())
//       );
//     }

//     setFilteredTasks(filtered); // Update filtered tasks based on all filters
//   }, [employeeFilter, priorityFilter, statusFilter, tasks]);

//   // Function to set the color based on the task status
//   const getStatusColor = (taskStatusName) => {
//     switch (taskStatusName) {
//       case "Pending":
//         return "text-red-500 bg-red-100"; // Red for Pending
//       case "Completed":
//         return "text-green-500 bg-green-100"; // Green for Completed
//       case "In Progress":
//         return "text-yellow-500 bg-yellow-100"; // Yellow for In Progress
//       default:
//         return "text-gray-500 bg-gray-100"; // Default color
//     }
//   };

//   // Function to format the date
//   const formatDate = (dateString) => {
//     const date = new Date(dateString);
//     return date.toLocaleDateString(); // You can customize the date format as needed
//   };


//   // Function to handle opening the popup and setting the current task
//   const handleEyeClick = async (taskNoteId) => {
//     try {
//       const result = await TaskNoteService.getTaskNoteById(taskNoteId);
//       // setTasks(result.data);
//       // console.log(result.data)

//       const task = result.data;
//       setCurrentTask(task); // Set the selected task data
//       setTaskAllocationId(task.taskAllocationId); // Set the selected task data
//       setTaskDate(task.taskDate ? task.taskDate.split("T")[0] : ""); // Assuming taskDate is in a format we can directly display
//       setTaskTimeIn(task.taskTimeIn);
//       setTaskTimeOut(task.taskTimeOut);
//       setTaskDuration(task.taskDuration);
//       setTaskUpdate(task.taskUpdate);
//       setIsPopupVisible(true); // Show the popup
//       // setFilteredTasks(result.data); // Initially show all tasks
//     } catch (error) {
//       console.error("Error fetching tasks:", error);
//       setTasks([]);
//       setFilteredTasks([]); // Fallback to an empty array in case of an error
//     }
//     // console.log(task)
//   };

//   // Function to calculate task duration based on time in and time out
//   const calculateDuration = () => {
//     if (taskTimeIn && taskTimeOut) {
//       const timeIn = new Date(`1970-01-01T${taskTimeIn}:00`);
//       const timeOut = new Date(`1970-01-01T${taskTimeOut}:00`);

//       let duration = (timeOut - timeIn) / 1000 / 60; // Duration in minutes
//       if (duration < 0) {
//         duration += 24 * 60; // If the duration is negative, it means timeOut is the next day
//       }

//       const hours = Math.floor(duration / 60);
//       const minutes = duration % 60;
//       setTaskDuration(`${hours}h ${minutes}m`);
//     }
//   };

//   // Watch for changes in time fields and calculate duration
//   useEffect(() => {
//     calculateDuration();
//   }, [taskTimeIn, taskTimeOut]);

//   const formatTimeToBackendFormat = (time) => {
//     if (!time) return ""; // If no time, return an empty string
//     const [hours, minutes] = time.split(":");
//     return `${hours}:${minutes}:00.0000000`; // Convert to HH:mm:ss.SSSSSSS
//   };

//   // Function to convert duration format (e.g., "4h 0m" -> "04:00:00")
//   const convertToTimeSpanFormat = (duration) => {
//     const match = duration.match(/(\d+)h (\d+)m/); // Matches "4h 0m" format
//     if (match) {
//       const hours = String(match[1]).padStart(2, "0"); // Pad to two digits
//       const minutes = String(match[2]).padStart(2, "0"); // Pad to two digits
//       return `${hours}:${minutes}:001`; // Assuming seconds are zero
//     }
//     return "00:00:00"; // Default fallback if the format is unexpected
//   };

//   // Function to handle form submission
//   const handleSubmit = async (event) => {
//     event.preventDefault();

//     // Format task time fields to the expected format
//     const formattedTimeIn = formatTimeToBackendFormat(taskTimeIn);
//     const formattedTimeOut = formatTimeToBackendFormat(taskTimeOut);

//     const formattedDuration = convertToTimeSpanFormat(taskDuration);
//     // Convert taskDuration to the required time span format (hh:mm:ss)

//     const taskNoteData = {
//       taskAllocationId,
//       taskDate,
//       taskTimeIn: formattedTimeIn,
//       taskTimeOut: formattedTimeOut,
//       taskDuration: formattedDuration,
//       taskUpdate,
//     };

//     console.log("Submitting task note data:", taskNoteData); // Log the data before submitting

//     try {
//       // Call the API to add the task note
//       const result = await TaskNoteService.addTaskNote(taskNoteData);
//       console.log("Task note added successfully:", result);
//       // Optionally, you can update the task state or show a success message here
//       setIsPopupVisible(false); // Close the popup
//     } catch (error) {
//       console.error(
//         "Error adding task note:",
//         error.response?.data || error.message
//       );
//       if (error.response?.data?.errors) {
//         console.log("Validation Errors:", error.response.data.errors); // This will help pinpoint specific fields causing the issue
//       }
//     }

//     // Close the popup after submission
//     // setIsPopupVisible(false);
//   };

//   return (
//     <>
//       <div className="flex justify-between items-center my-3 ">
//         <h1 className="font-semibold text-2xl">Task Note List</h1>
//         <button
//             onClick={() => navigate(-1)} // Navigate back to previous page
//             className="px-6 py-2 bg-gray-300 text-black rounded-md font-semibold hover:bg-gray-400 transition duration-200"
//           >
//             Back
//           </button>
//       </div>

//       <div className="grid overflow-x-auto shadow-xl">
//         <table className="min-w-full bg-white border border-gray-200">
//           <thead className="bg-gray-900 border-b">
//             <tr>
//               <th className="text-left py-3 px-4 uppercase font-semibold text-sm text-[#939393]">
//                 Task Name
//               </th>
//               <th className="text-left py-3 px-4 uppercase font-semibold text-sm text-[#939393]">
//                 Assigned By
//               </th>
//               <th className="text-left py-3 px-4 uppercase font-semibold text-sm text-[#939393]">
//                 Task Date
//               </th>
//               <th className="text-left py-3 px-4 uppercase font-semibold text-sm text-[#939393]">
//                 Task Time In
//               </th>
//               <th className="text-left py-3 px-4 uppercase font-semibold text-sm text-[#939393]">
//                 Task Time Out
//               </th>
//               <th className="text-left py-3 px-4 uppercase font-semibold text-sm text-[#939393]">
//                 Task Duration
//               </th>
//               {/* <th className="text-left py-3 px-4 uppercase font-semibold text-sm text-[#939393]">
//                 Task Updates
//               </th> */}
//               {/* <th className="text-left py-3 px-4 uppercase font-semibold text-sm text-[#939393]">
//                 Status
//               </th> */}
//               <th className="text-left py-3 px-4 uppercase font-semibold text-sm text-[#939393]">
//                 Actions
//               </th>
//             </tr>
//           </thead>
//           <tbody>
//             {filteredTasks.map((item) => (
//               <tr
//                 key={item.taskNoteId}
//                 className="border-b hover:bg-gray-50"
//               >
//                 <td className="py-3 px-4 text-gray-700">{item.taskName}</td>
//                 <td className="py-3 px-4 text-gray-700">
//                   {item.taskAssignToName}
//                 </td>
//                 <td className="py-3 px-4 text-gray-700">{formatDate(item.taskDate)}</td>
//                 <td className="py-3 px-4 text-gray-700">
//                   {item.taskTimeIn}
//                 </td>
//                 <td className="py-3 px-4 text-gray-700">
//                   {item.taskTimeOut}
//                 </td>
//                 <td className="py-3 px-4 text-gray-700">{item.taskDuration}</td>
//                 {/* <td className="py-3 px-4 text-gray-700">{item.taskUpdate}</td> */}
//                 {/* <td className="py-3 px-4">
//                   <span
//                     className={`px-2 py-1 rounded-lg font-medium ${getStatusColor(
//                       item.taskStatusName
//                     )}`}
//                   >
//                     {item.taskStatusName}
//                   </span>
//                 </td> */}
//                 <td className="py-3 px-4">
//                   <div className="flex gap-3">
//                     <Link
//                       to={`/user/task-list/${item.taskAllocationId}`}
//                       className="text-blue-500 hover:text-blue-700"
//                     >
//                       <FaEdit size={24} />
//                     </Link>
//                     <FaEye
//                       size={24}
//                       className="text-green-500 hover:text-green-700"
//                       onClick={() => handleEyeClick(item.taskNoteId)}
//                     />
//                     {/* <Link className="text-yellow-500 hover:text-yellow-700">
//                     <FaRegFileLines size={24} />
//                     </Link> */}
//                   </div>
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>

//       {/* Popup for task details */}
//       {isPopupVisible && (
//         <div className="fixed inset-0 bg-gray-700 bg-opacity-50 flex justify-center items-center z-50">
//           <div className="bg-white p-6 rounded-lg shadow-lg md:w-1/3 xl:w-1/3">
//             <h2 className="text-xl font-semibold mb-4">Task Details</h2>
//             <form onSubmit={handleSubmit}>
//               <div className="mb-4">
//                 <label className="block text-sm font-medium text-gray-700">
//                   Task Date
//                 </label>
//                 <input
//                   type="date"
//                   value={taskDate}
//                   onChange={(e) => setTaskDate(e.target.value)}
//                   className="w-full mt-1 px-3 py-2 border rounded-md"
//                 />
//               </div>
//               <div className="mb-4">
//                 <label className="block text-sm font-medium text-gray-700">
//                   Task Time In
//                 </label>
//                 <input
//                   type="time"
//                   value={taskTimeIn}
//                   onChange={(e) => setTaskTimeIn(e.target.value)}
//                   className="w-full mt-1 px-3 py-2 border rounded-md"
//                 />
//               </div>
//               <div className="mb-4">
//                 <label className="block text-sm font-medium text-gray-700">
//                   Task Time Out
//                 </label>
//                 <input
//                   type="time"
//                   value={taskTimeOut}
//                   onChange={(e) => setTaskTimeOut(e.target.value)}
//                   className="w-full mt-1 px-3 py-2 border rounded-md"
//                 />
//               </div>
//               <div className="mb-4">
//                 <label className="block text-sm font-medium text-gray-700">
//                   Task Duration
//                 </label>
//                 <input
//                   type="text"
//                   value={taskDuration}
//                   onChange={(e) => setTaskDuration(e.target.value)}
//                   className="w-full mt-1 px-3 py-2 border rounded-md"
//                   disabled
//                 />
//               </div>
//               <div className="mb-4">
//                 <label className="block text-sm font-medium text-gray-700">
//                   Task Update
//                 </label>
//                 <textarea
//                   value={taskUpdate}
//                   onChange={(e) => setTaskUpdate(e.target.value)}
//                   className="w-full mt-1 px-3 py-2 border rounded-md"
//                 />
//               </div>
//               <div className="flex flex-col md:flex-row justify-end gap-4">
//                 <button
//                   type="button"
//                   onClick={() => setIsPopupVisible(false)}
//                   className="px-4 py-2 bg-gray-300 text-black rounded"
//                 >
//                   Cancel
//                 </button>
//                 <button
//                   type="submit"
//                   className="px-4 py-2 bg-blue-500 text-white rounded"
//                 >
//                   Submit
//                 </button>
//               </div>
//             </form>
//           </div>
//         </div>
//       )}
//     </>
//   );
// };

// export default TaskNoteList;