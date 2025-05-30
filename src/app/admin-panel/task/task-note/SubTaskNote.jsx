//#region Imports
import React, { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom';
import { FaEdit, FaTrash } from 'react-icons/fa';
import { TaskNoteService } from '../../../service/TaskNoteService';
import { toast } from 'react-toastify';
import { motion } from "framer-motion"; // Import framer-motion
//#endregion

//#region Component: SubTaskNoteList
export const SubTaskNoteList = () => {
  
  //#region State Variables
  const { id } = useParams();
  const [taskNotes, setTaskNotes] = useState([]);
  const navigate = useNavigate("")
  //#endregion

  //#region Fetch Sub-Task Note
  useEffect(() => {
      const fetchTaskNotes = async () => {
        try {
          const result = await TaskNoteService.getTaskNoteByTaskId(id);
          setTaskNotes(result.data);
  
        } catch (error) {
          console.error("Error fetching tasks:", error);
          setTaskNotes([]);
        }
      };
      fetchTaskNotes();
  }, [id]);
  //#endregion

  //#region Format Date 
  // Function to format the date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString(); // You can customize the date format as needed
  };
  //#endregion

  //#region Delete Sub-Task Note Logic
  const deleteNote = async (taskNoteId) => {
    // console.log(taskNoteId);
    debugger;
    try {
      const response = await TaskNoteService.deleteTaskNote(taskNoteId);
      if (response.status === 1) {
        setTaskNotes((prevTaskNote) =>
          prevTaskNote.filter((taskNote) => taskNote.taskNoteId !== taskNoteId)
        );
        toast.error(response.message);
      }
    } catch (error) {
      console.error("Error deleting task:", error);
      alert("Failed to delete task");
    }
  };
  //#endregion

  //#region Render
  return (
    <>
    {/* Header Section */}
    <div className="flex justify-between items-center my-3 ">
      <h1 className="font-semibold text-2xl">Task Note List</h1>
      <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
      <button
          onClick={() => navigate(-1)} // Navigate back to previous page
          className="px-6 py-2 bg-gray-300 text-black rounded-md font-semibold hover:bg-gray-400 transition duration-200"
        >
          Back
        </button>
        </motion.button>
    </div>

    {/* Task Note List Table */}
    <div className="grid overflow-x-auto shadow-xl">
      <table className="min-w-full bg-white border border-gray-200">
        <thead className="bg-gray-900 border-b">
          <tr>
            <th className="text-left py-3 px-4 uppercase font-semibold text-sm text-[#939393]">
              Task Name
            </th>
            <th className="text-left py-3 px-4 uppercase font-semibold text-sm text-[#939393]">
              Assigned By
            </th>
            <th className="text-left py-3 px-4 uppercase font-semibold text-sm text-[#939393]">
              Task Date
            </th>
            <th className="text-left py-3 px-4 uppercase font-semibold text-sm text-[#939393]">
              Task Time In
            </th>
            <th className="text-left py-3 px-4 uppercase font-semibold text-sm text-[#939393]">
              Task Time Out
            </th>
            <th className="text-left py-3 px-4 uppercase font-semibold text-sm text-[#939393]">
              Task Duration
            </th>
            {/* <th className="text-left py-3 px-4 uppercase font-semibold text-sm text-[#939393]">
              Task Updates
            </th> */}
            {/* <th className="text-left py-3 px-4 uppercase font-semibold text-sm text-[#939393]">
              Status
            </th> */}
            <th className="text-left py-3 px-4 uppercase font-semibold text-sm text-[#939393]">
              Actions
            </th>
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
                {item.taskAssignToName}
              </td>
              <td className="py-3 px-4 text-gray-700">{formatDate(item.taskDate)}</td>
              <td className="py-3 px-4 text-gray-700">
                {item.taskTimeIn}
              </td>
              <td className="py-3 px-4 text-gray-700">
                {item.taskTimeOut}
              </td>
              <td className="py-3 px-4 text-gray-700">{item.taskDuration}</td>
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
              <td className="py-3 px-4">

              <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <button
                onClick={() => deleteNote(item.taskNoteId)}
                className="text-red-500 hover:text-red-700"
              >
                <FaTrash size={22} />
              </button>
                </motion.button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </>
  )
  //#endregion
}
//#endregion
