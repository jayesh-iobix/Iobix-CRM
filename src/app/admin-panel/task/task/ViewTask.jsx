import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { FaArrowLeft, FaEdit, FaPlus } from "react-icons/fa";
import { TaskService } from "../../../service/TaskService";
import { motion } from "framer-motion"; // Import framer-motion
import { TaskReminderService } from "../../../service/TaskReminderService";
// import ChatComponent from "../../employee-chat/ChatComponent";


const ViewTask = () => {

  const { id } = useParams();
  const navigate = useNavigate();
  const [taskDetails, setTaskDetails] = useState({});
  const [taskReminderDetails, setTaskReminderDetails] = useState({});

    useEffect(() => {
      const fetchData = async () => {
        try {
          const taskResult = await TaskService.getTaskById(id);
            setTaskDetails(taskResult.data);

          const taskReminderResult = await TaskReminderService.getTaskReminder(id);
            setTaskReminderDetails(taskReminderResult.data);
            // console.log(taskReminderResult.data);
            
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


  return (
    <>
      <div className="container mx-auto mb-10">
        <div className="bg-white px-4 sm:px-6 md:px-10 p-6 md:p-8 rounded-lg shadow-lg space-y-8">
          <div className="flex flex-col sm:flex-row justify-between items-center border-b pb-4">
            <h1 className="font-semibold text-3xl sm:text-4xl">Task Details</h1>
            <div className="flex flex-wrap justify-center sm:justify-end gap-2 mt-4 sm:mt-0">
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <Link
                  to={`/task/create-subtask/${id}`}
                  className="bg-blue-600 hover:bg-blue-700 text-white flex gap-2 mx-2 py-2 px-4 rounded hover:no-underline"
                >
                  Add Sub Task <span className="mt-[2px]"> <FaPlus size={14} /></span>
                </Link>
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <Link
                  to={`/task/edit-task/${id}`}
                  className="bg-blue-600 hover:bg-blue-700 flex items-center gap-2 text-center text-white font-medium py-2 px-4 rounded hover:no-underline"
                >
                   Edit Task
                  <FaEdit size={20} />
                </Link>
              </motion.button>

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
              <div className="flex flex-wrap justify-between gap-4">
                <p className="w-full sm:w-auto">
                  <strong className="mr-1">Task Name:</strong> {taskDetails.taskName}
                </p>
                <p className="w-full sm:w-auto">
                  <strong className="mr-1">Designation:</strong> {taskDetails.designationName}
                </p>
              </div>

              <div className="flex flex-wrap justify-between gap-4">
                <p className="w-full sm:w-auto">
                  <strong className="mr-1">Assign By:</strong> {taskDetails.taskAssignByName}
                </p>
                <p className="w-full sm:w-auto">
                  <strong className="mr-1">Assign To:</strong> {taskDetails.taskAssignToName}
                </p>
              </div>

              <div className="flex flex-wrap justify-between gap-4">
                <p className="w-full sm:w-auto">
                  <strong className="mr-1">Start Date:</strong> {formatDate(taskDetails.taskStartingDate)}
                </p>
                <p className="w-full sm:w-auto">
                  <strong className="mr-1">Expected Completion:</strong> {formatDate(taskDetails.taskExpectedCompletionDate)}
                </p>
              </div>

              <div className="flex flex-wrap justify-between gap-4">
                <p className="w-full sm:w-auto">
                  <strong className="mr-1">Priority:</strong> {taskDetails.taskPriority}
                </p>
                <p className="w-full sm:w-auto">
                  <strong className="mr-1">Task Type:</strong> {taskDetails.taskType}
                </p>
              </div>

              <div className="flex flex-wrap justify-between gap-4">
                <p className="w-full sm:w-auto">
                  <strong className="mr-1">Actual Starting Date:</strong> {formatDate(taskDetails.actualStartingDate)}
                </p>
                <p className="w-full sm:w-auto">
                  <strong className="mr-1">Task Completion Date:</strong> {formatDate(taskDetails.taskCompletionDate)}
                </p>
              </div>

              <div className="flex flex-wrap justify-between gap-4">
                <p className="w-full sm:w-auto">
                  <strong className="mr-1">Status:</strong>
                  <span className={`px-3 py-1 rounded-lg font-semibold ${getStatusColor(taskDetails.taskStatusName)}`}>
                    {taskDetails.taskStatusName}
                  </span>
                </p>
              </div>

              <div className="flex flex-wrap justify-between gap-4">
                <p className="w-full sm:w-auto">
                  <strong className="mr-1">Task Description:</strong> {taskDetails.taskDescription}
                </p>
              </div>
            </div>
        </div>

        {/* Chat Component */}
        {/* <ChatComponent taskAssignToName={taskDetails.taskAssignToName} /> */}

      </div>
    </>
  );
};

export default ViewTask;
