//#region Imports
import React, { useEffect, useState } from "react";
import { FaArrowDown, FaArrowRight } from "react-icons/fa";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { TaskService } from "../../../service/TaskService";
import { SubTaskService } from "../../../service/SubTaskService";
import { motion } from "framer-motion"; // Import framer-motion
import { ReportService } from "../../../service/ReportService";
//#endregion

//#region Component: UserTaskList
const UserTaskList = () => {

  //#region State Variables
  const { id } = useParams();
  const [tasks, setTasks] = useState([]);
  const [filteredTasks, setFilteredTasks] = useState([]);
  const [employeeFilter, setEmployeeFilter] = useState(""); // State for employee filter
  const [priorityFilter, setPriorityFilter] = useState(""); // State for priority filter
  const [statusFilter, setStatusFilter] = useState(""); // State for status filter
  const [subTasks, setSubTasks] = useState([]); // Stores the sub-tasks for each task
  const [expandedRows, setExpandedRows] = useState({}); // Tracks expanded rows
  const [departmentId, setDepartmentId] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [yearFilter, setYearFilter] = useState("");  // State for year filter
  const [monthFilter, setMonthFilter] = useState(""); // State for month filter

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(7); // Set to 7 items per page
  const [totalItems, setTotalItems] = useState(0);
  //#endregion

  //#region Filter Data
  // Get the list of unique years and months for the filter dropdowns
  const uniqueYears = [...new Set(tasks.map((task) => new Date(task.taskStartingDate).getFullYear()))];
  const uniqueMonths = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  useEffect(() => {
    // Automatically set current year and month
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear().toString();
    const currentMonth = (currentDate.getMonth() + 1).toString(); // Months are 0-indexed, so add 1

    setYearFilter(currentYear); // Set current year
    setMonthFilter(currentMonth); // Set current month

    fetchTasks(); // Fetch tasks on mount
  }, [id]); // Dependency array includes 'id' to ensure fetch happens when 'id' changes
  //#endregion

  //#region Tasks, Sub-Tasks, and Employee
  const fetchTasks = async () => {
    try {
      const result = await TaskService.getUserTaskByEmployeeId(id);
      setTasks(result.data);
      setFilteredTasks(result.data); // Initially show all tasks
      setTotalItems(result.data.length); // Set total items for pagination
      result.data.map((item) => {
        fetchsubtaskdata(item.taskAllocationId);
      });

    } catch (error) {
      console.error("Error fetching tasks:", error);
      setTasks([]);
      setFilteredTasks([]); // Fallback to an empty array in case of an error
    }
  };

  // Function to fetch sub-tasks by task allocation ID
  const getSubTasksByTaskAllocationId = async (taskAllocationId) => {
    try {
      const response = await SubTaskService.getUserSubTaskByEmployeeId(
        taskAllocationId,
        id
      );
      return response.data;
    } catch (error) {
      console.error("Failed to fetch sub-tasks:", error);
      throw error;
    }
  };

  const fetchsubtaskdata = async (taskAllocationId) => {
    // debugger;
    const subTaskData = await getSubTasksByTaskAllocationId(taskAllocationId); // make sure this function returns a promise
    setSubTasks((prevSubTasks) => ({
      ...prevSubTasks,
      [taskAllocationId]: subTaskData,
    }));
  };

  useEffect(() => {
    fetchTasks();
  }, [departmentId]);
  //#endregion
  
  //#region Toggle Row Expansion
  const toggleRow = async (taskAllocationId) => {
    const newExpandedRows = { ...expandedRows };
    const isExpanded = newExpandedRows[taskAllocationId];

    if (!isExpanded) {
      // If the row is not expanded, fetch sub-tasks
      try {
        const subTaskData = await getSubTasksByTaskAllocationId(
          taskAllocationId
        ); // make sure this function returns a promise
        if (subTaskData.length > 0) {
          newExpandedRows[taskAllocationId] = true;
        }
        setSubTasks((prevSubTasks) => ({
          ...prevSubTasks,
          [taskAllocationId]: subTaskData,
        }));
        // setSubTasks(subTaskData.data)
      } catch (error) {
        console.error("Error fetching sub-tasks:", error);
      }
    } else {
      // If the row is already expanded, collapse it
      newExpandedRows[taskAllocationId] = false;
    }
    setExpandedRows(newExpandedRows);
  };
  //#endregion

  //#region Handlers: Filtering
  useEffect(() => {
    let filtered = tasks;
  
    // Filter by employee
    if (employeeFilter) {
      filtered = filtered.filter((task) =>
        task.taskAssignToName.toLowerCase().includes(employeeFilter.toLowerCase())
      );
    }
  
    // Filter by priority
    if (priorityFilter) {
      filtered = filtered.filter((task) =>
        task.taskPriority.toLowerCase().includes(priorityFilter.toLowerCase())
      );
    }
  
    // Filter by status
    if (statusFilter) {
      filtered = filtered.filter((task) =>
        task.taskStatusName.toLowerCase().includes(statusFilter.toLowerCase())
      );
    }
  
    // Filter by year
    if (yearFilter) {
      filtered = filtered.filter(
        (task) => new Date(task.taskStartingDate).getFullYear().toString() === yearFilter
      );
    }
  
    // Filter by month
    if (monthFilter) {
      filtered = filtered.filter(
        (task) => new Date(task.taskStartingDate).getMonth() + 1 === parseInt(monthFilter)
      );
    }
  
    setFilteredTasks(filtered); // Update filtered tasks based on all filters
    setTotalItems(filtered.length); 
    setCurrentPage(1); // Reset to the first page when a new filter is applied
  }, [employeeFilter, priorityFilter, statusFilter, tasks, yearFilter, monthFilter]);
  
  // Function to filter tasks based on selected priority
  const handlePriorityFilterChange = (event) => {
    setPriorityFilter(event.target.value);
  };

  // Function to filter tasks based on selected status
  const handleStatusFilterChange = (event) => {
    setStatusFilter(event.target.value);
  };

  // Get the list of unique employees (task takers) and priorities for the filter dropdowns
  const uniqueEmployees = [
    ...new Set(tasks.map((task) => task.taskAssignToName)),
  ];
  const uniquePriorities = [...new Set(tasks.map((task) => task.taskPriority))];
  const uniqueStatuses = [...new Set(tasks.map((task) => task.taskStatusName))];
  //#endregion

  //#region Status Color Logic
  // Function to set the color based on the task status
  const getStatusColor = (taskStatusName) => {
    switch (taskStatusName) {
      case "Pending":
        return "text-red-500 bg-red-100"; // Red for Pending
      case "Completed":
        return "text-green-500 bg-green-100"; // Green for Completed
      case "InProgress":
        return "text-yellow-500 bg-yellow-100"; // Yellow for In Progress
      default:
        return "text-gray-500 bg-gray-100"; // Default color
    }
  };
  //#endregion

  //#region Task and Sub-task Date Handling
  // Function to format the date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString(); // You can customize the date format as needed
  };
  //#endregion
  
  //#region Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredTasks.slice(indexOfFirstItem, indexOfLastItem);

  const totalPages = Math.ceil(totalItems / itemsPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };
  //#endregion

  //#region Download Report
  const handleDownloadReport = async (year, month) => {
    setIsSubmitting(true);
    // debugger;
    try {
      // Wait for the report download to complete with the selected year and month
      await ReportService.downloadTaskReport(id, year, month);
      // Optionally, add a success message or additional logic after the download
      toast.success("Report downloaded successfully!");
    } catch (error) {
      console.error("Error downloading report:", error);
      toast.error("Failed to download report.");
    } finally {
      setIsSubmitting(false);
    }
  };
  //#endregion
  
  //#region Render
  return (
    <>
      {/* Header Section + Buttons */}
      <div className="flex flex-col sm:flex-row justify-between items-center my-3">
        <h1 className="font-semibold text-2xl">User Task List</h1>

        {/* Download Report Button */}
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          type="button" // Added this line to prevent form submission
          onClick={() => handleDownloadReport(yearFilter, monthFilter)} // Pass selected year and month here
          // onClick={handleDownloadReport}
          className ={`me-3 bg-purple-600 hover:bg-purple-700 flex gap-2 text-center text-white font-medium py-2 px-4 rounded hover:no-underline 
            ${isSubmitting ? "opacity-50 cursor-not-allowed" : "" }`}
          disabled={isSubmitting}
          >
            {isSubmitting ? "Downloading..." : "Download Task Report"}
        </motion.button>
      </div>

      {/* Filters Section */}
      <div className="flex flex-wrap gap-4 my-4">
        {/* Priority */}
        <select
          value={priorityFilter}
          onChange={handlePriorityFilterChange}
          className="p-2 outline-none rounded border border-active"
        >
          <option value="">All Priorities</option>
          {uniquePriorities.map((priority) => (
            <option key={priority} value={priority}>
              {priority}
            </option>
          ))}
        </select>

        {/* Status */}
        <select
          value={statusFilter}
          onChange={handleStatusFilterChange}
          className="p-2 outline-none rounded border border-active"
        >
          <option value="">All Statuses</option>
          {uniqueStatuses.map((status) => (
            <option key={status} value={status}>
              {status}
            </option>
          ))}
        </select>

        {/* Year Filter */}
        <select
          value={yearFilter}
          onChange={(e) => setYearFilter(e.target.value)}
          className="p-2 outline-none rounded border border-active"
        >
          <option value="">All Years</option>
          {uniqueYears.map((year) => (
            <option key={year} value={year}>
              {year}
            </option>
          ))}
        </select>

        {/* Month Filter */}
        <select
          value={monthFilter}
          onChange={(e) => setMonthFilter(e.target.value)}
          className="p-2 outline-none rounded border border-active"
        >
          <option value="">All Months</option>
          {uniqueMonths.map((month, index) => (
            <option key={month} value={index + 1}>
              {month}
            </option>
          ))}
        </select>
      </div>

      {/* Task List Section */}
      <div className="grid overflow-x-auto shadow-xl">
        <table className="min-w-full bg-white border border-gray-200">
          <thead className="bg-gray-900 border-b">
            <tr>
              {[
                "",
                "Task Name",
                "Assigned By",
                "Assigned To",
                "Priority",
                "Starting Date",
                "Expected Completion Date",
                "Task Type",
                "Status",
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
                  No tasks found.
                </td>
              </tr>
            ) : (
              currentItems.map((item, index) => {
                return (
                  <React.Fragment key={item.taskAllocationId}>
                    <motion.tr
                      key={item.employeeId}
                      className="border-b hover:bg-gray-50"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: item * 0.1 }}
                    >
                      <td className="py-3 px-4 text-gray-700">
                        <button
                          type="button"
                          onClick={() => toggleRow(item.taskAllocationId)}
                          className="text-gray-500 hover:text-gray-700"
                        >
                          {subTasks[item.taskAllocationId] &&
                          subTasks[item.taskAllocationId].length > 0 ? (
                            expandedRows[item.taskAllocationId] ? (
                              <FaArrowDown />
                            ) : (
                              <FaArrowRight />
                            )
                          ) : null}
                        </button>
                      </td>
                      <td className="py-3 px-4 text-gray-700">
                        {item.taskName}
                      </td>
                      <td className="py-3 px-4 text-gray-700">
                        {item.taskAssignByName}
                      </td>
                      <td className="py-3 px-4 text-gray-700">
                        {item.taskAssignToName}
                      </td>
                      <td className="py-3 px-4 text-gray-700">
                        {item.taskPriority}
                      </td>
                      <td className="py-3 px-4 text-gray-700">
                        {formatDate(item.taskStartingDate)}
                      </td>
                      <td className="py-3 px-4 text-gray-700">
                        {item.taskExpectedCompletionDate === null
                          ? item.taskExpectedCompletionDate
                          : formatDate(item.taskExpectedCompletionDate)}
                      </td>
                      <td className="py-3 px-4 text-gray-700">
                        {item.taskType}
                      </td>
                      <td className="py-3 px-4">
                        <span
                          className={`px-2 py-1 rounded-lg font-medium ${getStatusColor(
                            item.taskStatusName
                          )}`}
                        >
                          {item.taskStatusName}
                        </span>
                      </td>
                    </motion.tr>

                    {/* Expanded Sub-Task Row */}
                    {expandedRows[item.taskAllocationId] &&
                      subTasks[item.taskAllocationId] && (
                        <tr>
                          <td colSpan="12" className="py-3 px-4 bg-gray-100">
                            <h3 className="font-semibold">Sub-Tasks:</h3>
                            <table className="min-w-full mt-2 bg-white">
                              <thead className="bg-white border-b">
                                <tr>
                                  {[
                                    "Sub-Task Name",
                                    "Assigned By",
                                    "Assigned To",
                                    "Priority",
                                    "Starting Date",
                                    "Expected Completion Date",
                                    "Task Type",
                                    "Status",
                                  ].map((header) => (
                                    <th
                                      key={header}
                                      className="text-left py-3 px-4 uppercase font-semibold text-sm"
                                    >
                                      {header}
                                    </th>
                                  ))}
                                </tr>
                              </thead>
                              <tbody>
                                {subTasks[item.taskAllocationId].map(
                                  (subTask, index) => {
                                    return (
                                      <tr key={subTask.subTaskAllocationId}>
                                        <td className="py-2 px-4">
                                          {subTask.taskName}
                                        </td>
                                        <td className="py-2 px-4">
                                          {subTask.taskAssignByName}
                                        </td>
                                        <td className="py-2 px-4">
                                          {subTask.taskAssignToName}
                                        </td>
                                        <td className="py-2 px-4">
                                          {subTask.taskPriority}
                                        </td>
                                        <td className="py-2 px-4">
                                          {formatDate(subTask.taskStartingDate)}
                                        </td>
                                        <td className="py-2 px-4">
                                          {subTask.taskExpectedCompletionDate ===
                                          null
                                            ? subTask.taskExpectedCompletionDate
                                            : formatDate(
                                                subTask.taskExpectedCompletionDate
                                              )}
                                        </td>
                                        <td className="py-2 px-4">
                                          {subTask.taskType}
                                        </td>
                                        <td className="py-2 px-4">
                                          <span
                                            className={`px-2 py-1 rounded-lg font-medium ${getStatusColor(
                                              subTask.taskStatusName
                                            )}`}
                                          >
                                            {subTask.taskStatusName}
                                          </span>
                                        </td>
                                      </tr>
                                    );
                                  }
                                )}
                              </tbody>
                            </table>
                          </td>
                        </tr>
                      )}
                  </React.Fragment>
                );
              })
            )}
          </tbody>
        </table>
      </div>

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

export default UserTaskList;

