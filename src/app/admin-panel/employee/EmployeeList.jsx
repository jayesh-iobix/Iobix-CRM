import React, { useEffect, useState } from "react";
import { FaEdit, FaPlus, FaTrash } from "react-icons/fa";
import { Link } from "react-router-dom";
import { EmployeeService } from "../../service/EmployeeService";

const EmployeeList = () => {
  const [employees, setEmployees] = useState([]);
  const [filteredEmployees, setFilteredEmployees] = useState([]);
  const [employeeFilter, setEmployeeFilter] = useState(""); // State for employee filter
  const [departmentFilter, setDepartmentFilter] = useState(""); // State for department filter

  //#region Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(7); // Set to 7 items per page
  const [totalItems, setTotalItems] = useState(0);
  //#endregion

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const result = await EmployeeService.getEmployees();
        setEmployees(result.data); // Set the 'data' array to the state
        setFilteredEmployees(result.data); // Initially show all employees
        setTotalItems(result.data.length); // Set total items for pagination
      } catch (error) {
        console.error("Error fetching employees:", error);
        setEmployees([]); // Fallback to an empty array in case of an error
        setFilteredEmployees([]); // Fallback to an empty array in case of an error
      }
    };
    fetchEmployees();
  }, []);

  // Function to filter tasks based on selected employee name
  const handleEmployeeFilterChange = (event) => {
    setEmployeeFilter(event.target.value);
  };

  // Handle department filter change
  const handleDepartmentChange = (event) => {
    setDepartmentFilter(event.target.value);
  };

  useEffect(() => {
    // Apply filters to the employees array
    let filtered = employees;

    // Filter by employee name
    if (employeeFilter) {
      filtered = filtered.filter((employee) =>
        employee.name.toLowerCase().includes(employeeFilter.toLowerCase())
      );
    }

    // Filter by department
    if (departmentFilter) {
      filtered = filtered.filter(
        (employee) => employee.departmentName === departmentFilter
      );
    }

    setFilteredEmployees(filtered); // Update filtered employees based on all filters
    setTotalItems(filtered.length); 
    setCurrentPage(1); // Reset to the first page when a new filter is applied
  }, [employeeFilter, departmentFilter, employees]);

  const deleteEmployee = async (employeeId) => {
    try {
      const response = await EmployeeService.deleteEmployee(employeeId);
      if (response.status === 1) {
        setFilteredEmployees((prevEmployees) =>
          prevEmployees.filter((employee) => employee.employeeId !== employeeId)
        );
        alert(response.message);
      }
    } catch (error) {
      alert("Failed to delete employee");
    }
  };

  //#region Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredEmployees.slice(indexOfFirstItem, indexOfLastItem);

  const totalPages = Math.ceil(totalItems / itemsPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };
  //#endregion

  return (
    <>
      <div className="flex justify-between items-center my-3">
        <h1 className="font-semibold text-2xl">Employee List</h1>
        <Link
          to="/employee-list/add-employee"
          className="bg-blue-600 hover:bg-[#0074BD] flex gap-2 text-center text-white font-medium py-2 px-4 rounded hover:no-underline"
        >
          Add
          <FaPlus className="mt-[3px]" size={14} />
        </Link>
      </div>

      {/* Filters Section */}
      <div className="flex gap-4 my-4">
        <input
          type="text"
          value={employeeFilter}
          onChange={handleEmployeeFilterChange}
          placeholder="Search Employee"
          className="p-2 outline-none rounded border border-gray-300"
        />

        {/* Department Filter Dropdown */}
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
        <table className="min-w-full bg-white border border-gray-200 rounded-lg">
          <thead className="bg-gray-900 border-b">
            <tr>
              {[
                "Full Name",
                "Email",
                "Mobile Number",
                "Department",
                "Designation",
                "Actions",
              ].map((header) => (
                <th
                  key={header}
                  className="text-left py-3 px-4 uppercase font-semibold text-sm text-[#939393]"
                >
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {currentItems.length === 0 ? (
              <tr>
                <td colSpan="6" className="text-center py-3 px-4 text-gray-700">
                  No employees found.
                </td>
              </tr>
            ) : (
              currentItems.map((item) => (
                <tr key={item.employeeId} className="border-b hover:bg-gray-50">
                  <td className="py-3 px-4 text-gray-700">{item.name}</td>
                  <td className="py-3 px-4 text-gray-700">{item.email}</td>
                  <td className="py-3 px-4 text-gray-700">{item.mobileNumber}</td>
                  <td className="py-3 px-4 text-gray-700">{item.departmentName}</td>
                  <td className="py-3 px-4 text-gray-700">{item.designationName}</td>
                  <td className="py-3 px-4">
                    <div className="flex gap-2">
                      <Link
                        className="text-blue-500 hover:text-blue-700"
                        to={`/employee-list/edit-employee/${item.employeeId}`}
                      >
                        <FaEdit size={24} />
                      </Link>
                      <button
                        onClick={() => deleteEmployee(item.employeeId)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <FaTrash size={24} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
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

export default EmployeeList;

