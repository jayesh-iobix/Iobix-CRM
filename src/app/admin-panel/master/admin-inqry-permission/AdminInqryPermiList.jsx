//#region Imports
import React, { useEffect, useState } from "react";
import { FaEdit, FaPlus, FaTrash, FaTrashAlt } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { EmployeePermissionService } from "../../../service/EmployeePermissionService";
import { motion } from "framer-motion"; // Import framer-motion
import { toast } from "react-toastify";
import { InquiryPermissionService } from "../../../service/InquiryPermissionService";
//#endregion

//#region Component: AdminInqryPermiList
const AdminInqryPermiList = () => {
  
  //#region State Variables
  const [inquiryPermissionList, setInquiryPermissionList] = useState([]);
  const [isPopupOpen, setIsPopupOpen] = useState(false); // State for the popup
  const [deleteId, setDeleteId] = useState(null); // Store the eventTypeId to delete

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(7); // Set to 7 items per page
  const [totalItems, setTotalItems] = useState(0);
  //#endregion

  //#region useEffect: Fetch InquiryPermission Data
  useEffect(() => {
    const fetchInquiryPermission = async () => {
      try {
        const result = await InquiryPermissionService.getInquiryPermissionForAdmin();
        setInquiryPermissionList(result.data); // Set the 'data' array to the state
        // console.log(result.data); // Set the 'data' array to the state
        setTotalItems(result.data.length); // Set total items for pagination
        setCurrentPage(1); // Reset to the first page when a new filter is applied
      } catch (error) {
        console.error("Error fetching inquiry permission:", error);
        setInquiryPermissionList([]); // Fallback to an empty array in case of an error
      }
    };
    fetchInquiryPermission();
  }, []);
  //#endregion

  //#region Delete Logic
  const deleteInquiryPermission = async () => {
    if (!deleteId) return; // If there's no ID to delete, do nothing
    try {
      const response = await InquiryPermissionService.deleteInquiryPermission(
        deleteId
      );
      if (response.status === 1) {
        setInquiryPermissionList((pervInquiryPermission) =>
          pervInquiryPermission.filter(
            (inquiryPermission) => inquiryPermission.userId !== deleteId
          )
        );
        toast.error("Inquiry Permission Deleted Successfully"); // Toast on success
        setIsPopupOpen(false); // Close popup after deletion
        setDeleteId(null); // Reset the ID
      }
    } catch (error) {
      console.error("Error deleting inquiry origin:", error);
      alert("Failed to delete inquiry origin");
    }
  };

  const handleDeleteClick = (userId) => {
    setDeleteId(userId);
    setIsPopupOpen(true); // Open popup
  };

  const handlePopupClose = () => {
    setIsPopupOpen(false); // Close popup without deleting
    setDeleteId(null); // Reset the ID
  };
  //#endregion

  //#region IsActive Logic
  const handleCheckboxChange = async (checked, inquiryPermissionId, item) => {
    // Optimistically update the UI by changing the `isActive` for the current row
    const updatedInquiryPermission = inquiryPermissionList.map((item) =>
      item.inquiryPermissionId === inquiryPermissionId
        ? { ...item, isActive: checked }
        : item
    );

    console.log(item);

    setInquiryPermissionList(updatedInquiryPermission); // Update the state immediately
    try {
      // Prepare the data for the API call
      const inquiryPermissionData = {
        userId: item.userId,
        userName: item.userName,
        inquiryTypeId: item.inquiryTypeId,
        inquiryTypeIds: item.inquiryTypeIds, // Send inquiryTypeIds as well
        isActive: checked, // Only update the isActive field
      };

      //console.log(inquiryPermissionData)
      debugger;
      // Call the update API to update the `isActive` field on the server
      const updatedInquiryPermission =
        await InquiryPermissionService.updateInquiryPermission(
          inquiryPermissionId,
          inquiryPermissionData
        );
      //console.log(updatedInquiryPermission); // If successful, log the response

      // Check the response from the API and display a success message
      if (updatedInquiryPermission) {
        toast.success("Inquiry Permission updated successfully.");
      } else {
        throw new Error("Failed to update inquiry permission.");
      }
    } catch (error) {
      console.error(
        "Error updating inquiry permission:",
        error.response?.data || error.message
      );
      toast.error("Error updating inquiry permission.");
      // Revert UI change if needed
    }
  };
  //#endregion

  //#region Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = inquiryPermissionList.slice(indexOfFirstItem, indexOfLastItem);

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
        <h1 className="font-semibold text-2xl">Admin Inquiry Permission List</h1>
        <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
          <Link
            to="/master/inquirypermission-list/add-inquirypermission"
            className="bg-blue-600 hover:bg-blue-700 flex gap-2 text-center text-white font-medium py-2 px-4 rounded hover:no-underline"
          >
            Add
            <FaPlus className="mt-[3px]" size={14} />
          </Link>
        </motion.button>
      </div>

      {/* Admin Inquiry Permission Table */}
      <div className="grid overflow-x-auto">
        <table className="min-w-full bg-white">
          <thead className="bg-gray-900 border-b">
            <tr>
              <th className="text-left py-3 pl-7 uppercase font-semibold text-sm text-[#939393]">
                Admin Name
              </th>
              <th className="text-left py-3 pl-7 uppercase font-semibold text-sm text-[#939393]">
                Inquiry Type Name
              </th>
              {/* <th className="text-left py-3 pl-7 uppercase font-semibold text-sm text-[#939393]">
                Active
              </th> */}
              <th className="text-right py-3 pr-8 uppercase font-semibold text-sm text-[#939393]">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
          {currentItems.length === 0 ? (
              <tr>
                <td colSpan="6" className="text-center py-3 px-4 text-gray-700">
                  No inquiry permission found.
                </td>
              </tr>
            ) : (
              currentItems.map((item) => (
                <motion.tr
                  key={item.inquiryPermissionId }
                  className="border-b hover:bg-gray-50"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: item * 0.1 }}
                >
                  <td className="py-3 pl-8 text-gray-700">
                    {item.userName}
                  </td>
                  <td className="py-3 pl-8 text-gray-700">
                    {item.inquiryTypeName}
                  </td>
                  {/* <td className="py-3 pl-8 text-gray-700">
                    <label className="inline-flex ms-3 items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={item.isActive} // Use item's active state
                        onChange={(e) =>
                          handleCheckboxChange(
                            e.target.checked,
                            item.inquiryPermissionId ,
                            item
                          )
                        } // Handle checkbox change
                        className="sr-only peer"
                      />
                      <div className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                      <span className="ms-3 w-[86px] text-sm font-medium text-gray-900 dark:text-gray-300"></span>
                    </label>
                  </td> */}
                  <td className="py-3 pr-8 text-right">
                    <div className="flex justify-end">
                      {/* {item.isActive ? ("") : ( <span className="px-2 py-1 mr-4 rounded-lg font-medium text-red-500 bg-red-100">Not Active</span> )} */}
                      <button className="text-blue-500 hover:text-blue-700 pr-3">
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                        >
                          <Link
                            to={`/master/inquirypermission-list/edit-inquirypermission/${item.userId}`}
                            className="text-blue-500 hover:text-blue-700"
                          >
                            <FaEdit size={24} />
                          </Link>
                        </motion.button>
                      </button>
                      <button
                        onClick={() =>
                          handleDeleteClick(item.userId )
                        }
                        className="text-red-500 hover:text-red-700"
                      >
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                        >
                          <FaTrash size={22} />
                        </motion.button>
                      </button>
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
                onClick={deleteInquiryPermission}
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
    //#endregion
  );
}

export default AdminInqryPermiList
//#endregion