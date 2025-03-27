import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { FaArrowLeft, FaEdit, FaPlus } from "react-icons/fa";
import { motion } from "framer-motion"; // Import framer-motion
import { InquiryTaskService } from "../../service/InquiryTaskService";
import { InquirySubTaskService } from "../../service/InquirySubTaskService";
import { SubTaskNoteService } from "../../service/SubTaskNoteService";


const ViewInquiryTask = () => {
  const userId = sessionStorage.getItem("LoginUserId");
  const role = sessionStorage.getItem("role");
  // const navigateTo = role === "admin" ? `/partnerinquiry-list/edit-inquiry-task/${id}` : `/user/partnerinquiry-list/edit-inquiry-task/${id}`;

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
        const taskResult = await InquiryTaskService.getInquiryTasksById(id);
        if (taskResult?.data) {
          // console.log(taskResult.data)
          // If task is found, store in taskDetails
          setTaskDetails(taskResult.data);
        } else {
          // If no task found, attempt to fetch from SubTaskService
          const subTaskResult = await InquirySubTaskService.getInquirySubTasksById(id);
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
        <div className="bg-white px-4 md:px-10 p-6 md:p-8 rounded-lg shadow-lg space-y-6">
          <div className="flex flex-col md:flex-row justify-between items-center border-b pb-4">
            <h1 className="font-semibold text-2xl md:text-3xl">Inquiry Task Details</h1>
            <div className="flex space-x-2 mt-4 md:mt-0">
              {(taskDetails.taskAssignBy === userId || role === 'admin') && (
                <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                  <Link
                    to={role === "admin" 
                      ? `/edit-inquiry-task/${id}` 
                      : `/user/edit-inquiry-task/${id}`}
                    // to={`/inquiry-task-list/edit-inquiry-task/${id}`}
                    className="bg-blue-600 hover:bg-blue-700 text-white flex gap-2 py-2 px-4 rounded hover:no-underline"
                  >
                    Edit Inquiry Task <span className="mt-[2px]"><FaEdit size={14} /></span>
                  </Link>
                </motion.button>
              )}
              {(role === 'admin' || taskDetails.taskAssignTo === userId || taskDetails.taskAssignBy === userId) && !(role === 'client' || role === 'partner') && (
                <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                  <Link
                    to={role === "admin" 
                     ? `/create-inquiry-subtask/${id}` 
                     : `/user/create-inquiry-subtask/${id}`}
                    // to={`/partnerinquiry-list/create-inquiry-sub-task/${id}`}
                    className="bg-blue-600 hover:bg-blue-700 text-white flex gap-2 py-2 px-4 rounded hover:no-underline"
                  >
                    Add Inquiry Sub Task <span className="mt-[2px]"><FaPlus size={14} /></span>
                  </Link>
                </motion.button>
              )}
              <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              { label: 'Task Name', value: taskDetails.taskName },
            //   { label: 'Designation', value: taskDetails.designationName },
              { label: 'Assign By', value: taskDetails.taskAssignByName },
              { label: 'Assign To', value: taskDetails.taskAssignToName },
              { label: 'Priority', value: taskDetails.taskPriority },
              { label: 'Task Type', value: taskDetails.taskType },
              { label: 'Start Date', value: formatDate(taskDetails.taskStartingDate) },
              { label: 'Expected Completion', value: formatDate(taskDetails.taskExpectedCompletionDate) },
              { label: 'Status', value: <span className={`px-3 py-1 rounded-lg font-semibold ${getStatusColor(taskDetails.taskStatusName)}`}>{taskDetails.taskStatusName}</span> },
              { label: 'Actual Starting Date', value: taskDetails.actualStartingDate ? formatDate(taskDetails.actualStartingDate) : '' },
              { label: 'Task Completion Date', value: taskDetails.taskCompletionDate ? formatDate(taskDetails.taskCompletionDate) : '' },
              { label: 'Task Description', value: taskDetails.taskDescription },
              { label: 'Task Document', value: taskDetails.taskDocument ? <a href={taskDetails.taskDocument} target="_blank" rel="noopener noreferrer" className="text-blue-500 underline">Open Task Document</a> : 'No document available'},
            ].map((item, index) => (
              <div key={index} className="flex justify-between">
                <p><strong className="mr-1">{item.label}:</strong> {item.value}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
  
  
};

export default ViewInquiryTask;
