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