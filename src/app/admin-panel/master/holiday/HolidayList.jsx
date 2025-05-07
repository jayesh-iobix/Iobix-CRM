//#region Imports
import React, { useEffect, useState } from "react";
import { FaEdit, FaPlus, FaTrash, FaTrashAlt } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { motion } from "framer-motion"; // Import framer-motion
import { HolidayService } from "../../../service/HolidayService";
//#endregion

//#region Component: HolidayList
const HolidayList = () => {

  //#region State Variables
  const [holidays, setHolidays] = useState([]);
  const [isPopupOpen, setIsPopupOpen] = useState(false); // State for the popup
  const [deleteId, setDeleteId] = useState(null); // Store the eventTypeId to delete

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(7); // Set to 7 items per page
  const [totalItems, setTotalItems] = useState(0);
  //#endregion

  //#region useEffect: Fetch Holiday Data
  useEffect(() => {
    const fetchHolidays = async () => {
      try {
        const result = await HolidayService.getHolidays();
        setHolidays(result.data); // Set the 'data' array to the state
        setTotalItems(result.data.length); // Set total items for pagination
        setCurrentPage(1); // Reset to the first page when a new filter is applied
      } catch (error) {
        console.error("Error fetching holidays:", error);
        setHolidays([]); // Fallback to an empty array in case of an error
      }
    };
    fetchHolidays();
  }, []);
  //#endregion

  //#region Delete Logic
  const deleteHoliday = async () => {
    if (!deleteId) return; // If there's no ID to delete, do nothing
    try {
      const response = await HolidayService.deleteHoliday(deleteId);
      if (response.status === 1) {
        setHolidays((prevHoliday) =>
            prevHoliday.filter((holiday) => holiday.holidayId !== deleteId)
        );
        toast.error("Holiday Deleted Successfully"); // Toast on success
        setIsPopupOpen(false); // Close popup after deletion
        setDeleteId(null); // Reset the ID
      }
    } catch (error) {
      console.error("Error deleting holiday:", error);
      alert("Failed to delete holiday");
    }
  };

  const handleDeleteClick = (holidayId) => {
    setDeleteId(holidayId);
    setIsPopupOpen(true); // Open popup
  };

  const handlePopupClose = () => {
    setIsPopupOpen(false); // Close popup without deleting
    setDeleteId(null); // Reset the ID
  };
  //#endregion

  //#region Format Date Logic
  const formatDate = (dateString) => {
    const dateObj = new Date(dateString);
    const day = String(dateObj.getDate()).padStart(2, "0"); // Add leading zero for single digit days
    const month = String(dateObj.getMonth() + 1).padStart(2, "0"); // Get month (0-based, so add 1)
    const year = dateObj.getFullYear();
  
    return `${day}-${month}-${year}`;
  };
  //#endregion

  //#region Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = holidays.slice(indexOfFirstItem, indexOfLastItem);

  const totalPages = Math.ceil(totalItems / itemsPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };
  //#endregion

  //#region Render
  return (
    <>
      {/* Header Section */}
      <div className="flex justify-between items-center my-3">
        <h1 className="font-semibold text-2xl">Holiday List</h1>
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
        <Link
          to="/master/holiday-list/add-holiday"
          className="bg-blue-600 hover:bg-blue-700 flex gap-2 text-center text-white font-medium py-2 px-4 rounded hover:no-underline"
        >
          Add
          <FaPlus className="mt-[3px]" size={14} />
        </Link>
        </motion.button>
      </div>

      {/* Holiday Table */}
      <div className="grid overflow-x-auto">
        <table className="min-w-full bg-white">
          <thead className="bg-gray-900 border-b">
            <tr>
              <th className="text-left py-3 pl-7 uppercase font-semibold text-sm text-[#939393]">
                Holiday Name
              </th>
              <th className="text-left py-3 pl-7 uppercase font-semibold text-sm text-[#939393]">
                Holiday StartDate
              </th>
              <th className="text-left py-3 pl-7 uppercase font-semibold text-sm text-[#939393]">
                Holiday EndDate
              </th>
              <th className="text-left py-3 pl-7 uppercase font-semibold text-sm text-[#939393]">
                Total Holiday Days
              </th>
              <th className="text-right py-3 pr-8 uppercase font-semibold text-sm text-[#939393]">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
          {currentItems.length === 0 ? (
              <tr>
                <td colSpan="6" className="text-center py-3 px-4 text-gray-700">
                  No holidays found.
                </td>
              </tr>
            ) : (
              currentItems.map((item) => (
              <motion.tr
              key={item.holidayId}
              className="border-b hover:bg-gray-50"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: item * 0.1 }}
            >
                <td className="py-3 pl-8 text-gray-700">
                  {item.holidayName}
                </td>
                <td className="py-3 pl-8 text-gray-700">
                  {formatDate(item.holidayStartDate)}
                </td>
                <td className="py-3 pl-8 text-gray-700">
                  {formatDate(item.holidayEndDate)}
                </td>
                <td className="py-3 pl-8 text-gray-700">
                  {item.totalHolidayDays}
                </td>
                <td className="py-3 pr-8 text-right">
                  <div className="flex justify-end">
                    {item.isActive?"":<span className="px-2 py-1 mr-4 rounded-lg font-medium text-red-500 bg-red-100">Not Active</span>}
                  <button className="pr-2">
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <Link
                      to={`/master/holiday-list/edit-holiday/${item.holidayId}`}
                      className="text-blue-500 hover:text-blue-700"
                    >
                      <FaEdit size={24} />
                    </Link>
                    </motion.button>

                  </button>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                  <button
                   onClick={() => handleDeleteClick(item.holidayId)}
                   className="text-red-500 hover:text-red-700"
                  >
                    <FaTrash size={22} />
                  </button>
                  </motion.button>
                  </div>
                </td>
              </motion.tr>
            ))
            )}
          </tbody>
        </table>
      </div>

      {/* Confirmation Popup */}
      {isPopupOpen && (
        <div className="fixed inset-0 flex justify-center items-center bg-gray-600 bg-opacity-50 z-50">
          <div className="bg-white p-5 rounded-lg shadow-lg max-w-full sm:max-w-lg md:max-w-lg lg:max-w-md xl:max-w-lg w-11/12">
            <div className="flex justify-center mb-4">
              <div className="bg-red-100 p-5 rounded-full">
                <FaTrashAlt className="text-red-600 text-4xl" />
              </div>
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-4 text-center">
              Are you sure you want to delete ?
            </h3>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={handlePopupClose}
                className="flex items-center gap-2 bg-gray-400 px-8 py-3 rounded-lg text-white font-semibold hover:bg-gray-500 active:bg-gray-500 transition duration-200 w-full sm:w-auto"
              >
                No
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={deleteHoliday}
                className="flex items-center gap-2 bg-red-600 font-semibold text-white px-8 py-3 rounded-lg hover:bg-red-700 active:bg-red-800 transition duration-200 w-full sm:w-auto"
              >
                Yes
              </motion.button>
            </div>
          </div>
        </div>
      )}

      {/* Pagination Section */}
      <div
        className={`flex mt-4 items-center justify-between border-t border-gray-200 bg-white px-4 py-3 sm:px-6 shadow-lg ${
          isPopupOpen ? "hidden" : ""
        }`}
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

export default HolidayList;
//#endregion