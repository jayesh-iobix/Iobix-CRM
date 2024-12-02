import React, { useEffect, useState } from "react";
import { FaEdit, FaPlus, FaTrash } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { DepartmentService } from "../../../service/DepartmentService";
import { toast } from "react-toastify";

const DepartmentList = () => {
  const [departments, setDepartments] = useState([]);

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

  const deleteDepartment = async (departmentId) => {
    try {
      const response = await DepartmentService.deleteDepartments(departmentId);
      if (response.status === 1) {
        setDepartments((prevDepartments) =>
          prevDepartments.filter(
            (department) => department.departmentId !== departmentId
          )
        );
        toast.error(response.message); // Toast on success
      }
    } catch (error) {
      console.error("Error deleting department:", error);
      alert("Failed to delete department");
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
        <Link
          to="/master/department-list/add-department"
          className="bg-blue-600 hover:bg-[#0074BD] flex gap-2 text-center text-white font-medium py-2 px-4 rounded hover:no-underline"
        >
          Add
          <FaPlus className="mt-[3px]" size={14} />
        </Link>
      </div>

      <div className="grid overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-200 rounded-lg">
          <thead className="bg-gray-900 border-b">
            <tr>
              <th className="text-left py-3 pl-7 uppercase font-semibold text-sm text-[#939393]">
                Department
              </th>
              <th className="text-right py-3 pr-8 uppercase font-semibold text-sm text-[#939393]">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {departments.map((item) => (
              <tr key={item.departmentId} className="border-b hover:bg-gray-50">
                <td className="py-3 pl-8 text-gray-700">
                  {item.departmentName}
                </td>
                <td className="py-3 pr-8 text-right">
                  <div className="flex justify-end">
                    {item.isActive?"":<span className="px-2 py-1 mr-4 rounded-lg font-medium text-red-500 bg-red-100">Not Active</span>}
                  <button className="text-blue-500 hover:text-blue-700 pr-3">
                    <Link
                      to={`/master/department-list/edit-department/${item.departmentId}`}
                      className="text-blue-500 hover:text-blue-700"
                    >
                      <FaEdit size={24} />
                    </Link>
                  </button>
                  <button
                    onClick={() => deleteDepartment(item.departmentId)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <FaTrash size={24} />
                  </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination Section */}
     <div className="flex mt-4 items-center justify-between border-t border-gray-200 bg-white px-4 py-3 sm:px-6 shadow-lg">
        <div className="flex flex-1 justify-between sm:hidden">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="relative inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            Previous
          </button>
          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="relative ml-3 inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            Next
          </button>
        </div>
        <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
          <div>
            <p className="text-sm text-gray-700">
              Showing
              <span className="font-semibold mx-1">{indexOfFirstItem + 1}</span>
              to
              <span className="font-semibold mx-1">{Math.min(indexOfLastItem, totalItems)}</span>
              of
              <span className="font-semibold mx-1">{totalItems}</span>
              results
            </p>
          </div>
          <div>
            <nav className="isolate inline-flex -space-x-px rounded-md shadow-sm" aria-label="Pagination">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="relative inline-flex items-center rounded-l-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
              >
                <span className="sr-only">Previous</span>
                <svg className="size-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true" data-slot="icon">
                  <path fillRule="evenodd" d="M11.78 5.22a.75.75 0 0 1 0 1.06L8.06 10l3.72 3.72a.75.75 0 1 1-1.06 1.06l-4.25-4.25a.75.75 0 0 1 0-1.06l4.25-4.25a.75.75 0 0 1 1.06 0Z" clipRule="evenodd" />
                </svg>
              </button>

              {/* Pagination Buttons */}
              {[...Array(totalPages)].map((_, index) => (
                <button
                  key={index}
                  onClick={() => handlePageChange(index + 1)}
                  className={`relative z-10 inline-flex items-center px-4 py-2 text-sm font-semibold text-white focus:z-20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 ${
                    currentPage === index + 1 ? "bg-indigo-600" : "bg-gray-200 text-gray-700"
                  }`}
                >
                  {index + 1}
                </button>
              ))}

              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="relative inline-flex items-center rounded-r-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
              >
                <span className="sr-only">Next</span>
                <svg className="size-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true" data-slot="icon">
                  <path fillRule="evenodd" d="M8.22 5.22a.75.75 0 0 1 1.06 0l4.25 4.25a.75.75 0 0 1 0 1.06l-4.25 4.25a.75.75 0 0 1-1.06-1.06L11.94 10 8.22 6.28a.75.75 0 0 1 0-1.06Z" clipRule="evenodd" />
                </svg>
              </button>
            </nav>
          </div>
        </div>
     </div>
      
    </>
  );
};

export default DepartmentList;
