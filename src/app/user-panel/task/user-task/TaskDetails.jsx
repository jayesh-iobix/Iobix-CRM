import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { FaArrowLeft, FaPlus } from "react-icons/fa";
import { TaskService } from "../../../service/TaskService";
import { SubTaskNoteService } from "../../../service/SubTaskNoteService";
import { SubTaskService } from "../../../service/SubTaskService";
import { motion } from "framer-motion"; // Import framer-motion


const TaskDetails = () => {
  const userId = sessionStorage.getItem("LoginUserId");

  const { id } = useParams();
  const navigate = useNavigate();
  const [taskDetails, setTaskDetails] = useState({});
  const [subTasks, setSubTasks] = useState([]);
  const [subTaskAllocationId, setSubTaskAllocationId] = useState("");
  const [isPopupVisible, setIsPopupVisible] = useState(false);

    // Popup state
    const [currentTask, setCurrentTask] = useState(null);
  
    // Fields for the popup form
    const [taskDate, setTaskDate] = useState("");
    const [taskTimeIn, setTaskTimeIn] = useState("");
    const [taskTimeOut, setTaskTimeOut] = useState("");
    const [taskDuration, setTaskDuration] = useState("");
    const [taskUpdate, setTaskUpdate] = useState("");

    useEffect(() => {
      const fetchData = async () => {
        try {
          // First try to fetch task data from TaskService
          const taskResult = await TaskService.getTaskById(id);
          if (taskResult?.data) {
            // If task is found, store in taskDetails
            setTaskDetails(taskResult.data);
          } else {
            // If no task found, attempt to fetch from SubTaskService
            const subTaskResult = await SubTaskService.getSubTaskById(id);
            if (subTaskResult?.data) {
              // If subtask is found, store in taskDetails
              setTaskDetails(subTaskResult.data);
            }
          }
        } catch (error) {
          console.error("Error fetching data:", error);
        }
      };
  
      fetchData();
    }, [id]);

  const getStatusColor = (status) => {
    const statusColors = {
      Pending: "text-red-500 bg-red-100",
      Completed: "text-green-500 bg-green-100",
      InProgress: "text-yellow-500 bg-yellow-100",
    };
    return statusColors[status] || "text-gray-500 bg-gray-100";
  };

  // Function to format the date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString(); // You can customize the date format as needed
  };

  // Function to handle opening the popup and setting the current task
  const handleEyeClick = (task) => {
    setCurrentTask(task); // Set the selected task data
    setSubTaskAllocationId(task.subTaskAllocationId); // Set the selected task data
    setTaskDate(formatDate(task.taskDate)); // Assuming taskDate is in a format we can directly display
    setTaskTimeIn(task.taskTimeIn);
    setTaskTimeOut(task.taskTimeOut);
    setTaskDuration(task.taskDuration);
    setTaskUpdate(task.taskUpdate);
    setIsPopupVisible(true); // Show the popup
  };

  // Function to calculate task duration based on time in and time out
  const calculateDuration = () => {
    if (taskTimeIn && taskTimeOut) {
      const timeIn = new Date(`1970-01-01T${taskTimeIn}:00`);
      const timeOut = new Date(`1970-01-01T${taskTimeOut}:00`);

      let duration = (timeOut - timeIn) / 1000 / 60; // Duration in minutes
      if (duration < 0) {
        duration += 24 * 60; // If the duration is negative, it means timeOut is the next day
      }

      const hours = Math.floor(duration / 60);
      const minutes = duration % 60;
      setTaskDuration(`${hours}h ${minutes}m`);
    }
  };

  // Watch for changes in time fields and calculate duration
  useEffect(() => {
    calculateDuration();
  }, [taskTimeIn, taskTimeOut]);

  const formatTimeToBackendFormat = (time) => {
    if (!time) return '';  // If no time, return an empty string
    const [hours, minutes] = time.split(':');
    return `${hours}:${minutes}:00.0000000`;  // Convert to HH:mm:ss.SSSSSSS
  };
  
   // Function to convert duration format (e.g., "4h 0m" -> "04:00:00")
   const convertToTimeSpanFormat = (duration) => {
    const match = duration.match(/(\d+)h (\d+)m/); // Matches "4h 0m" format
    if (match) {
      const hours = String(match[1]).padStart(2, '0'); // Pad to two digits
      const minutes = String(match[2]).padStart(2, '0'); // Pad to two digits
      return `${hours}:${minutes}:00`; // Assuming seconds are zero
    }
    return "00:00:00"; // Default fallback if the format is unexpected
  };


  // Function to handle form submission
  const handleSubmit = async (event) => {
    event.preventDefault();

  // Format task time fields to the expected format
  const formattedTimeIn = formatTimeToBackendFormat(taskTimeIn);
  const formattedTimeOut = formatTimeToBackendFormat(taskTimeOut);

  const formattedDuration = convertToTimeSpanFormat(taskDuration);
  // Convert taskDuration to the required time span format (hh:mm:ss)

    const taskNoteData = {
      subTaskAllocationId,
      taskDate,
      taskTimeIn: formattedTimeIn,
      taskTimeOut: formattedTimeOut,
      taskDuration: formattedDuration,
      taskUpdate,
    };

    console.log("Submitting task note data:", taskNoteData); // Log the data before submitting


    try {
      
      // Call the API to add the task note
      const result = await SubTaskNoteService.addSubTaskNote(taskNoteData);
      console.log("Task note added successfully:", result);
      
      // Optionally, you can update the task state or show a success message here
      setIsPopupVisible(false); // Close the popup
    }catch (error) {
      console.error("Error adding task note:", error.response?.data || error.message);
      if (error.response?.data?.errors) {
        console.log("Validation Errors:", error.response.data.errors);  // This will help pinpoint specific fields causing the issue
      }
    }
    
    // Close the popup after submission
    // setIsPopupVisible(false);
  };

  return (
    <>
      <div className="container mx-auto mb-10">
        <div className="bg-white px-10 p-8 rounded-lg shadow-lg space-y-8">
          <div className="flex justify-between items-center border-b pb-4">
            <h1 className="font-semibold text-3xl">Task Details</h1>
            <div className="flex">
            {taskDetails.taskAssignTo === userId && taskDetails.subTaskAllocationId !== id &&(
              <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
            <Link
            to={`/user/task/create-subtask/${id}`}
            className="bg-blue-600 hover:bg-blue-700 text-white flex gap-2 mx-2 py-2 px-4 rounded hover:no-underline"
            >
            Add Sub Task <span className="mt-[2px]"> <FaPlus size={14} /></span>
            </Link>
            </motion.button>
            )}
            <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <Link
            onClick={() => navigate(-1)} // Navigate back to previous page
            className="bg-gray-500 hover:bg-gray-400 text-white font-bold py-2 px-4 rounded flex items-center gap-2 hover:no-underline"
          >
            <FaArrowLeft size={16} />
            Back
          </Link>
          </motion.button>
        </div>
          </div>
          <div className="space-y-5">
            <div className="flex justify-between">
              <p><strong className="mr-1">Task Name:</strong> {taskDetails.taskName}</p>
              <p><strong className="mr-1">Designation:</strong> {taskDetails.designationName}</p>
            </div>
            <div className="flex justify-between">
              <p><strong className="mr-1">Assign By:</strong> {taskDetails.taskAssignByName}</p>
              <p><strong className="mr-1">Assign To:</strong> {taskDetails.taskAssignToName}</p>
            </div>
            <div className="flex justify-between">
              <p><strong className="mr-1">Priority:</strong> {taskDetails.taskPriority}</p>
              <p><strong className="mr-1">Task Type:</strong> {taskDetails.taskType}</p>
            </div>
            <div className="flex justify-between">
              <p><strong className="mr-1">Start Date:</strong> {formatDate(taskDetails.taskStartingDate)}</p>
              <p><strong className="mr-1">Expected Completion:</strong> {formatDate(taskDetails.taskExpectedCompletionDate)}</p>
            </div>
            <div className="flex justify-between">
              <p><strong className="mr-1">Status:</strong> <span className={`px-3 py-1 rounded-lg font-semibold ${getStatusColor(taskDetails.taskStatusName)}`}>{taskDetails.taskStatusName}</span></p>
            </div>
            <div className="flex justify-between">
              <p><strong className="mr-1">Task Description:</strong> {taskDetails.taskDescription}</p>
            </div>
          </div>
        </div>
      </div>

      {/* <div className="flex justify-between items-center my-3">
        <h1 className="font-semibold text-2xl">Sub Task List</h1>
        <Link to={`/user/task-list/create-subtask/${id}`} className="bg-[#0296D6] text-white flex gap-2 py-2 px-4 rounded hover:no-underline hover:bg-[#0296d6e1]">
          Add Sub Task <FaPlus size={14} />
        </Link>
      </div>

      <div className="grid overflow-x-auto shadow-xl">
        <table className="min-w-full bg-white border border-gray-200">
          <thead className="bg-gray-900">
            <tr>
              {["Task Name", "Assigned To", "Priority", "Starting Date", "Expected Completion Date", "Task Type", "Status", "Actions"].map((header) => (
                <th className="py-3 px-4 text-sm text-[#939393]" key={header}>{header}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {subTasks.map((task) => (
              <tr key={task.taskAllocationId} className="border-b hover:bg-gray-50">
                {["taskName", "taskAssignToName", "taskPriority", "taskStartingDate", "taskExpectedCompletionDate", "taskType"].map((field) => (
                  <td className="py-3 px-4" key={field}>{field === "taskStartingDate" || field === "taskExpectedCompletionDate" ? formatDate(task[field]) : task[field]}</td>
                ))}
                <td className="py-3 px-4">
                  <span className={`px-2 py-1 rounded-lg ${getStatusColor(task.taskStatusName)}`}>{task.taskStatusName}</span>
                </td>
                <td className="py-3 px-4">
                  <div className="flex gap-3">
                    <Link to={`/user/task-list/${task.taskAllocationId}`} className="text-blue-500 hover:text-blue-700"><FaEdit size={24} /></Link>
                    <FaEye size={24} onClick={() => handleEyeClick(task)} />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {isPopupVisible && (
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

export default TaskDetails;
