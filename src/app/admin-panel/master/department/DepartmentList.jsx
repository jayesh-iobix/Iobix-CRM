import React, { useEffect, useState } from "react";
import { FaEdit, FaPlus, FaTrash, FaTrashAlt } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { DepartmentService } from "../../../service/DepartmentService";
import { toast } from "react-toastify";
import { motion } from "framer-motion"; // Import framer-motion


const DepartmentList = () => {
  const [departments, setDepartments] = useState([]);
  const [isPopupOpen, setIsPopupOpen] = useState(false); // State for the popup
  const [deleteId, setDeleteId] = useState(null); // Store the eventTypeId to delete

  //#region Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(7); // Set to 7 items per page
  const [totalItems, setTotalItems] = useState(0);
  //#endregion

  //const navigate = useNavigate();

  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        const result = await DepartmentService.getDepartments();
        setDepartments(result.data); // Set the 'data' array to the state
        setTotalItems(result.data.length); // Set total items for pagination
        setCurrentPage(1); // Reset to the first page when a new filter is applied
      } catch (error) {
        console.error("Error fetching departments:", error);
        setDepartments([]); // Fallback to an empty array in case of an error
      }
    };
    fetchDepartments();
  }, []);

  const deleteDepartment = async () => {
    if (!deleteId) return; // If there's no ID to delete, do nothing
    try {
      const response = await DepartmentService.deleteDepartments(deleteId);
      if (response.status === 1) {
        setDepartments((prevDepartment) =>
            prevDepartment.filter((department) => department.departmentId !== deleteId)
        );
        toast.error("Department Deleted Successfully"); // Toast on success
        setIsPopupOpen(false); // Close popup after deletion
        setDeleteId(null); // Reset the ID
      }
    } catch (error) {
      console.error("Error deleting department:", error);
      alert("Failed to delete department");
    }
  };

  const handleDeleteClick = (departmentId) => {
    setDeleteId(departmentId);
    setIsPopupOpen(true); // Open popup
  };

  const handlePopupClose = () => {
    setIsPopupOpen(false); // Close popup without deleting
    setDeleteId(null); // Reset the ID
  };

  const handleCheckboxChange = async (checked, departmentId, item) => {
    // Optimistically update the UI by changing the `isActive` for the current row
    const updatedDepartments = departments.map((item) =>
      item.departmentId === departmentId ? { ...item, isActive: checked } : item
    );

    setDepartments(updatedDepartments); // Update the state immediately

    try {
      // Prepare the data for the API call
      const departmentData = {
        departmentName: item.departmentName,
        isActive: checked, // Only update the isActive field
      };

      //console.log(departmentData)
      // debugger;

      // Call the update API to update the `isActive` field on the server
      const updatedDepartment = await DepartmentService.updateDepartments(
        departmentId,
        departmentData
      );
      //console.log(updatedDepartment); // If successful, log the response

      // Check the response from the API and display a success message
      if (updatedDepartment) {
        toast.success("Department Updated Successfully.");
      } else {
        throw new Error("Failed to update inquiry source.");
      }
    } catch (error) {
      console.error(
        "Error updating department:",
        error.response?.data || error.message
      );
      toast.error("Error updating department.");
      // Revert UI change if needed
    }
  };

   //#region Pagination logic
   const indexOfLastItem = currentPage * itemsPerPage;
   const indexOfFirstItem = indexOfLastItem - itemsPerPage;
   const currentItems = departments.slice(indexOfFirstItem, indexOfLastItem);
 
   const totalPages = Math.ceil(totalItems / itemsPerPage);
 
   const handlePageChange = (pageNumber) => {
     setCurrentPage(pageNumber);
   };
   //#endregion

  return (
    <>
      <div className="flex justify-between items-center my-3">
        <h1 className="font-semibold text-2xl">Department List</h1>
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
        <Link
          to="/master/department-list/add-department"
          className="bg-blue-600 hover:bg-blue-700 flex gap-2 text-center text-white font-medium py-2 px-4 rounded hover:no-underline"
        >
          Add
          <FaPlus className="mt-[3px]" size={14} />
        </Link>
        </motion.button>
      </div>

      <div className="grid overflow-x-auto">
        <table className="min-w-full bg-white rounded-lg">
          <thead className="bg-gray-900 border-b">
            <tr>
              <th className="text-left w-full py-3 pl-7 uppercase font-semibold text-sm text-[#939393]">
                Department
              </th>
              <th className="text-left py-3 pl-7 uppercase font-semibold text-sm text-[#939393]">
                Active
              </th>
              <th className="text-right py-3 pr-8 uppercase font-semibold text-sm text-[#939393]">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {departments.map((item) => (
              <motion.tr
              key={item.departmentId}
              className="border-b hover:bg-gray-50"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: item * 0.1 }}
            >
              {/* <tr key={item.departmentId} className="border-b hover:bg-gray-50"> */}
                <td className="py-3 pl-8 text-gray-700">
                  {item.departmentName}
                </td>
                <td className="py-3 pl-8 text-gray-700">
                    <label className="inline-flex ms-3 items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={item.isActive} // Use item's active state
                        onChange={(e) =>
                          handleCheckboxChange(
                            e.target.checked,
                            item.departmentId ,
                            item
                          )
                        } // Handle checkbox change
                        className="sr-only peer"
                      />
                      <div className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                      <span className="ms-3 w-[86px] text-sm font-medium text-gray-900 dark:text-gray-300"></span>
                    </label>
                  </td>
                <td className="py-3 pr-8 text-right">
                  <div className="flex justify-end">
                  <button className="pr-2">
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <Link
                      to={`/master/department-list/edit-department/${item.departmentId}`}
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
                   onClick={() => handleDeleteClick(item.departmentId)}
                    // onClick={() => deleteDepartment(item.departmentId)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <FaTrash size={22} />
                  </button>
                  </motion.button>
                  </div>
                </td>
              {/* </tr> */}
              </motion.tr>
            ))}
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
                onClick={deleteDepartment}
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
};

export default DepartmentList;
