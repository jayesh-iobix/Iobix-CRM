import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { DesignationService } from "../../../service/DesignationService";
import { FaEdit, FaPlus, FaTrash, FaTrashAlt } from "react-icons/fa";
import { toast } from "react-toastify";
import { motion } from "framer-motion"; // Import framer-motion


const DesignationList = () => {
  const [designation, setDesignation] = useState([]);
  const [filteredDesignation, setFilteredDesignation] = useState([]);
  const [departmentFilter, setDepartmentFilter] = useState("");
  const [isPopupOpen, setIsPopupOpen] = useState(false); // State for the popup
  const [deleteId, setDeleteId] = useState(null); // Store the eventTypeId to delete

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(7); // Set to 7 items per page
  const [totalItems, setTotalItems] = useState(0);

  useEffect(() => {
    const fetchDesignations = async () => {
      try {
        const result = await DesignationService.getDesignation();
        setDesignation(result.data);
        setFilteredDesignation(result.data); // Set initial data without filtering
        setTotalItems(result.data.length); // Set total items for pagination
      } catch (error) {
        console.error("Error fetching designations:", error);
      }
    };
    fetchDesignations();
  }, []);

  // const deleteDesignation = async (designationId) => {
  //   try {
  //     const response = await DesignationService.deleteDesignation(designationId);
  //     if (response.status === 1) {
  //       setFilteredDesignation((prevDesignation) =>
  //         prevDesignation.filter(
  //           (designation) => designation.designationId !== designationId
  //         )
  //       );
  //       toast.error(response.message); // Toast on success
  //     }
  //   } catch (error) {
  //     console.error("Error deleting designation:", error);
  //     alert("Failed to delete designation");
  //   }
  // };

  const deleteDesignation = async () => {
    if (!deleteId) return; // If there's no ID to delete, do nothing
    try {
      const response = await DesignationService.deleteDesignation(deleteId);
      if (response.status === 1) {
        setFilteredDesignation((prevDesignation) =>
          prevDesignation.filter(
            (designation) => designation.designationId !== deleteId
          )
        );
        toast.error("Designation Deleted Successfully"); // Toast on success
        setIsPopupOpen(false); // Close popup after deletion
        setDeleteId(null); // Reset the ID after deletion
      }
    } catch (error) {
      console.error("Error deleting designation:", error);
      alert("Failed to delete designation");
    }
  };

  const handleDeleteClick = (designationId) => {
    setDeleteId(designationId);
    setIsPopupOpen(true); // Open popup
  };

  const handlePopupClose = () => {
    setIsPopupOpen(false); // Close popup without deleting
    setDeleteId(null); // Reset the ID
  };

  // Handle department filter change
  const handleDepartmentChange = (event) => {
    const selectedDepartment = event.target.value;
    setDepartmentFilter(selectedDepartment);

    // Filter designations based on the selected department
    if (selectedDepartment) {
      const filteredData = designation.filter(
        (item) => item.departmentName === selectedDepartment
      );
      setFilteredDesignation(filteredData);
      setTotalItems(filteredData.length); // Update the total items after filter
    } else {
      setFilteredDesignation(designation); // Reset filter
      setTotalItems(designation.length); // Reset the total items count
    }

    // Reset to the first page when a new filter is applied
    setCurrentPage(1);
  };

  // Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredDesignation.slice(indexOfFirstItem, indexOfLastItem);

  const totalPages = Math.ceil(totalItems / itemsPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  return (
    <>
      <div className="flex justify-between items-center my-3">
        <h1 className="font-semibold text-2xl">Designation List</h1>
        <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
          <Link
            to="/master/designation-list/add-designation"
            className="bg-blue-600 hover:bg-blue-700 flex gap-2 text-center text-white font-medium py-2 px-4 rounded hover:no-underline"
          >
            Add
            <FaPlus className="mt-[3px]" size={14} />
          </Link>
        </motion.button>
      </div>

      {/* Department Filter Dropdown */}
      <div className="my-3">
        <select
          value={departmentFilter}
          onChange={handleDepartmentChange}
          className="border border-gray-300 rounded p-2"
        >
          <option value="">All Departments</option>
          <option value="IT">IT</option>
          <option value="BD">BD</option>
          {/* Add more departments as needed */}
        </select>
      </div>

      <div className="grid overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-200">
          <thead className="bg-gray-900 border-b">
            <tr>
              <th className="text-left py-3 pl-7 uppercase font-semibold text-sm text-[#939393]">
                Designation Name
              </th>
              <th className="text-left py-3 pl-7 uppercase font-semibold text-sm text-[#939393]">
                Department Name
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
                  No designation found.
                </td>
              </tr>
            ) : (
              currentItems.map((item) => (
                <motion.tr
                  key={item.employeeId}
                  className="border-b hover:bg-gray-50"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: item * 0.1 }}
                >
                  {/* <tr
                    key={item.designationId}
                    className="border-b hover:bg-gray-50"
                  > */}
                  <td className="py-3 pl-8 text-gray-700">
                    {item.designationName}
                  </td>
                  <td className="py-3 pl-8 text-gray-700">
                    {item.departmentName}
                  </td>
                  <td className="py-3 pr-8 text-right">
                    <div className="flex justify-end">
                      {item.isActive ? (
                        ""
                      ) : (
                        <span className="px-2 py-1 mr-4 rounded-lg font-medium text-red-500 bg-red-100">
                          Not Active
                        </span>
                      )}
                      <button className="text-blue-500 hover:text-blue-700 pr-3">
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                        >
                          <Link
                            to={`/master/designation-list/edit-designation/${item.designationId}`}
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
                          onClick={() => handleDeleteClick(item.designationId)}
                          // onClick={() => deleteDesignation(item.designationId)}
                          className="text-red-500 hover:text-red-700"
                        >
                          <FaTrash size={22} />
                        </button>
                      </motion.button>
                    </div>
                    {/* <button className="text-blue-500 hover:text-blue-700 pr-3">
                        <Link
                          to={`/master/designation-list/edit-designation/${item.designationId}`}
                        >
                          <FaEdit size={24} />
                        </Link>
                      </button>
                      <button
                        className="text-red-500 hover:text-red-700"
                        onClick={() => deleteDesignation(item.designationId)}
                      >
                        <FaTrash size={24} />
                      </button> */}
                  </td>
                  {/* </tr> */}
                </motion.tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Confirmation Popup */}
      {isPopupOpen && (
        <div className="fixed inset-0 flex justify-center items-center bg-gray-600 bg-opacity-50">
          <div className="bg-white p-5 rounded-lg shadow-lg max-w-lg">
            <div className="flex justify-center mb-4">
              <div className="bg-red-100 p-5 rounded-full">
                <FaTrashAlt className="text-red-600 text-4xl" />
              </div>
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-4 text-center">
              Are you sure you want to delete ?
            </h3>
            <div className="flex justify-center gap-4">
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={handlePopupClose}
                className="flex items-center gap-2 bg-gray-400 px-8 py-3 rounded-lg text-white font-semibold hover:bg-gray-500 active:bg-gray-500 transition duration-200"
              >
                No
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={deleteDesignation}
                className="flex items-center gap-2 bg-red-600 font-semibold text-white px-8 py-3 rounded-lg hover:bg-red-700 active:bg-red-800 transition duration-200"
              >
                Yes
              </motion.button>
            </div>
          </div>
        </div>
      )}

      {/* Pagination Section */}
      <div className="flex mt-4 items-center justify-between border-t border-gray-200 bg-white px-4 py-3 sm:px-6 shadow-lg">
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
};

export default DesignationList;

