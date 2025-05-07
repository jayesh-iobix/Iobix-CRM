//#region Imports
import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { FaArrowLeft, FaEdit, FaPlus } from "react-icons/fa";
import { motion } from "framer-motion"; // Import framer-motion
import { InquiryTaskService } from "../../service/InquiryTaskService";
import { InquirySubTaskService } from "../../service/InquirySubTaskService";
import { SubTaskNoteService } from "../../service/SubTaskNoteService";
//#endregion 

//#region  Component: PartnerViewInquiryTask
const PartnerViewInquiryTask = () => {
  //#region State Initialization
  const userId = sessionStorage.getItem("LoginUserId");
  const role = sessionStorage.getItem("role");

  const { id } = useParams();
  const navigate = useNavigate();
  const [taskDetails, setTaskDetails] = useState({});
  //#endregion

  //#region Fetch Task Data
  useEffect(() => {
    const fetchData = async () => {
      try {
        // First try to fetch task data from TaskService
        const taskResult = await InquiryTaskService.getInquiryTasksById(id);
        if (taskResult?.data) {
          // console.log(taskResult.data)
          // If task is found, store in taskDetails
          // console.log(taskResult.data)
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
  //#endregion

  //#region Utility Functions
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
 //#endregion

  //#region Render
  return (
    <>
      <div className="container mx-auto mb-10">
        <div className="bg-white px-4 md:px-10 p-6 md:p-8 rounded-lg shadow-lg space-y-6">
          {/* Header Section and Buttons */}
          <div className="flex flex-col md:flex-row justify-between items-center border-b pb-4">
            <h1 className="font-semibold text-2xl md:text-3xl">Inquiry Task Details</h1>
            <div className="flex space-x-2 mt-4 md:mt-0">
              {taskDetails.taskAssignBy === userId && (
                <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                  <Link
                    to={`/partner/partnerinquiry-task-list/edit-inquiry-task/${id}`}
                    className="bg-blue-600 hover:bg-blue-700 text-white flex gap-2 py-2 px-4 rounded hover:no-underline"
                  >
                    Edit Inquiry Task <span className="mt-[2px]"><FaEdit size={14} /></span>
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

          {/* Inquiry Task Details Section */}
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
  //#endregion
};

export default PartnerViewInquiryTask;
//#endregion
