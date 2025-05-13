//#region Imports
import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";
import { toast } from "react-toastify";
import { motion } from "framer-motion"; // Import framer-motion
import { TaskNoteService } from "../../service/TaskNoteService";
import { InquiryTaskNoteService } from "../../service/InquiryTaskNoteService";
//#endregion

//#region  Component: InquiryTaskNoteList
export const InquiryTaskNoteList = () => {
  //#region State Initialization
  const { id } = useParams();
  const [taskNotes, setTaskNotes] = useState([]);
  const navigate = useNavigate("");

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(7); // Set to 7 items per page
  const [totalItems, setTotalItems] = useState(0);
  //#endregion

  //#region Fetch Task Note Data
  useEffect(() => {
    const fetchTaskNotes = async () => {
      try {
        const result = await InquiryTaskNoteService.getInquiryTaskNoteByTaskId(
          id
        );
        setTaskNotes(result.data);
        // console.log(result.data);
      } catch (error) {
        console.error("Error fetching inquiry task notes:", error);
        setTaskNotes([]);
      }
    };
    fetchTaskNotes();
  }, [id]);
  //#endregion

  //#region Formate Task Note
  // Function to format the date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString(); // You can customize the date format as needed
  };
  //#endregion

  //#region Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = taskNotes.slice(indexOfFirstItem, indexOfLastItem);

  const totalPages = Math.ceil(totalItems / itemsPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };
  //#endregion

  //#region Render
  return (
    <>
      {/* Header Section */}
      <div className="flex justify-between items-center my-3 ">
        <h1 className="font-semibold text-2xl">Inquiry Task Note List</h1>
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

      {/* Task Note List Table Section*/}
      <div className="grid overflow-x-auto shadow-xl">
        <table className="min-w-full bg-white border border-gray-200">
          <thead className="bg-gray-900 border-b">
            <tr>
              <th className="text-left py-3 px-4 uppercase font-semibold text-sm text-[#939393]">
                Task Date
              </th>
              <th className="text-left py-3 px-4 uppercase font-semibold text-sm text-[#939393]">
                Task Name
              </th>
              <th className="text-left py-3 px-4 uppercase font-semibold text-sm text-[#939393]">
                Created By
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
              {/* <th className="text-left py-3 px-4 uppercase font-semibold text-sm text-[#939393]">
              Actions
            </th> */}
            </tr>
          </thead>
          <tbody>
            {currentItems.length === 0 ? (
              <tr>
                <td colSpan="6" className="text-center py-3 px-4 text-gray-700">
                  No task note found.
                </td>
              </tr>
            ) : (
              currentItems.map((item) => (
                <tr key={item.taskNoteId} className="border-b hover:bg-gray-50">
                  <td className="py-3 px-4 text-gray-700">
                    {formatDate(item.taskDate)}
                  </td>
                  <td className="py-3 px-4 text-gray-700">{item.taskName}</td>
                  <td className="py-3 px-4 text-gray-700">
                    {item.taskCreatedByName}
                  </td>
                  {/* <td className="py-3 px-4 text-gray-700">
                  {item.taskAssignToName}
                  </td> */}
                  <td className="py-3 px-4 text-gray-700">{item.taskTimeIn}</td>
                  <td className="py-3 px-4 text-gray-700">
                    {item.taskTimeOut}
                  </td>
                  <td className="py-3 px-4 text-gray-700">
                    {item.taskDuration}
                  </td>
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
                  {/* <td className="py-3 px-4"> */}

                  {/* <button
                onClick={() => deleteNote(item.taskNoteId)}
                className="text-red-500 hover:text-red-700"
              >
                <FaTrash size={22} />
              </button> */}
                  {/* <FaTrash/> */}
                  {/* <div className="flex gap-3">
                  <Link
                    to={/user/task-list/${item.taskAllocationId}}
                    className="text-blue-500 hover:text-blue-700"
                  >
                    <FaEdit size={24} />
                  </Link>
                  <FaEye
                    size={24}
                    className="text-green-500 hover:text-green-700"
                    onClick={() => handleEyeClick(item)}
                  /> */}
                  {/* </div> */}
                  {/* </td> */}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Section */}
      <div
        className={`flex mt-4 items-center justify-between border-t border-gray-200 bg-white px-4 py-3 sm:px-6 shadow-lg`}
      >
        <div className="flex flex-1 justify-between sm:hidden">
          <motion.button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="relative inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            Previous
          </motion.button>
          <motion.button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="relative ml-3 inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            Next
          </motion.button>
        </div>
        <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
          <div>
            <p className="text-sm text-gray-700">
              Showing
              <span className="font-semibold mx-1">{indexOfFirstItem + 1}</span>
              to
              <span className="font-semibold mx-1">
                {Math.min(indexOfLastItem, totalItems)}
              </span>
              of
              <span className="font-semibold mx-1">{totalItems}</span>
              results
            </p>
          </div>
          <div>
            <nav
              className="isolate inline-flex -space-x-px rounded-md shadow-sm"
              aria-label="Pagination"
            >
              <motion.button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="relative inline-flex items-center rounded-l-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <span className="sr-only">Previous</span>
                <svg
                  className="size-5"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path
                    fillRule="evenodd"
                    d="M11.78 5.22a.75.75 0 0 1 0 1.06L8.06 10l3.72 3.72a.75.75 0 1 1-1.06 1.06l-4.25-4.25a.75.75 0 0 1 0-1.06l4.25-4.25a.75.75 0 0 1 1.06 0Z"
                    clipRule="evenodd"
                  />
                </svg>
              </motion.button>
              {/* Pagination Buttons */}
              {[...Array(totalPages)].map((_, index) => (
                <motion.button
                  key={index}
                  onClick={() => handlePageChange(index + 1)}
                  className={`relative z-10 inline-flex items-center px-4 py-2 text-sm font-semibold text-white focus:z-20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 ${
                    currentPage === index + 1
                      ? "bg-indigo-600"
                      : "bg-gray-200 text-gray-700"
                  }`}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  {index + 1}
                </motion.button>
              ))}
              <motion.button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="relative inline-flex items-center rounded-r-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <span className="sr-only">Next</span>
                <svg
                  className="size-5"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path
                    fillRule="evenodd"
                    d="M8.22 5.22a.75.75 0 0 1 1.06 0l4.25 4.25a.75.75 0 0 1 0 1.06l-4.25 4.25a.75.75 0 0 1-1.06-1.06L11.94 10 8.22 6.28a.75.75 0 0 1 0-1.06Z"
                    clipRule="evenodd"
                  />
                </svg>
              </motion.button>
            </nav>
          </div>
        </div>
      </div>
    </>
  );
  //#endregion
};
//#endregion
