import React, { useEffect, useRef, useState } from "react";
import {FaArrowDown,FaArrowRight,FaBook,FaClock,FaEdit,FaEllipsisV,FaEye,FaFile,FaPagelines,FaPlus,FaRegCalendarTimes,FaRegClock,FaRegTimesCircle,FaRegTrashAlt,FaTrash, FaTrashAlt,} from "react-icons/fa";
import { FaCircleInfo, FaClockRotateLeft, FaDeleteLeft, FaRegFileLines } from "react-icons/fa6";
import { Link } from "react-router-dom";
import { SubTaskService } from "../../../service/SubTaskService";
import { TaskService } from "../../../service/TaskService";
import { DepartmentService } from "../../../service/DepartmentService";
import { EmployeeService } from "../../../service/EmployeeService";
import { TaskNoteService } from "../../../service/TaskNoteService";
import { IoCloseCircle, IoTime, IoTimer, IoTrash } from "react-icons/io5";
import { toast } from "react-toastify";
import { motion } from "framer-motion"; // Import framer-motion

const TaskList = () => {
  const [tasks, setTasks] = useState([]);
  const [taskAllocationId, setTaskAllocationId] = useState("");
  const [subTaskAllocationId, setSubTaskAllocationId] = useState("");
  const [filteredTasks, setFilteredTasks] = useState([]);
  const [employeeFilter, setEmployeeFilter] = useState(""); // State for employee filter
  const [priorityFilter, setPriorityFilter] = useState(""); // State for priority filter
  const [statusFilter, setStatusFilter] = useState(""); // State for status filter
  const [subTasks, setSubTasks] = useState([]); // Stores the sub-tasks for each task
  const [expandedRows, setExpandedRows] = useState({}); // Tracks expanded rows

  const [isPopupOpen, setIsPopupOpen] = useState(false); // State for the popup
  const [deleteId, setDeleteId] = useState(null); // Store the Id to delete
  const [deleteSubTaskId, setDeleteSubTaskId] = useState(null); // Store the Id to delete

  //#region Fields for Task Transfer
  const [departments, setDepartments] = useState([]);
  const [employeeList, setEmployeeList] = useState([]);
  const [departmentId, setDepartmentId] = useState("");
  const [taskAssignTo, setTaskAssignTo] = useState("");
  const [allocationId, setAllocationId] = useState("");
  const [taskTransferTo, setTaskTransferTo] = useState("");
  //#endregion

  //#region Task Start And End useState
  const [actualStartingDate, setActualStartingDate] = useState("");
  const [taskCompletionDate, setTaskCompletionDate] = useState("");
  //#endregion

  //#region  Popup useState
  const [activeMenu, setActiveMenu] = useState(null); // Tracks the active menu by taskAllocationId
  const [activeSubTaskMenu, setActiveSubTaskMenu] = useState(null); // Track the active sub-task menu

  const [isPopupVisible, setIsPopupVisible] = useState(false);
  const [startDateIsPopupVisible, setStartDateIsPopupVisible] = useState(false);
  const [subStartDateIsPopupVisible, setSubStartDateIsPopupVisible] = useState(false);
  const [completionDateIsPopupVisible, setCompletionDateIsPopupVisible] = useState(false);
  const [taskTransferIsPopupVisible, setTaskTransferIsPopupVisible] = useState(false);
  const [subTaskTransferIsPopupVisible, setSubTaskTransferIsPopupVisible] = useState(false);
  const [currentTask, setCurrentTask] = useState(null);
  //#endregion

  //#region Fields for the popup form useState
  const [taskDate, setTaskDate] = useState("");
  const [taskTimeIn, setTaskTimeIn] = useState("");
  const [taskTimeOut, setTaskTimeOut] = useState("");
  const [taskDuration, setTaskDuration] = useState("");
  const [taskUpdate, setTaskUpdate] = useState("");
  //#endregion

  //#region Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(7); // Set to 7 items per page
  const [totalItems, setTotalItems] = useState(0);
  //#endregion

  const [openDropdown, setOpenDropdown] = useState({}); // State to track which dropdown is open
  const [openSubDropdown, setOpenSubDropdown] = useState({}); // State to track which dropdown is open
  const buttonRefs = useRef({}); // To store references to dropdown buttons

  // Function to fetch sub-tasks by task allocation ID
  const getSubTasksByTaskAllocationId = async (taskAllocationId) => {
    try {
      const response = await SubTaskService.getSubTasksByTaskAllocationId(
        taskAllocationId
      );
      return response.data;
    } catch (error) {
      console.error("Failed to fetch sub-tasks:", error);
      throw error;
    }
  };

  const fetchsubtaskdata = async (taskAllocationId) => {
    const subTaskData = await getSubTasksByTaskAllocationId(taskAllocationId); // make sure this function returns a promise
    setSubTasks((prevSubTasks) => ({
      ...prevSubTasks,
      [taskAllocationId]: subTaskData,
    }));
  };

  const fetchTasks = async () => {
    try {
      const result = await TaskService.getTasks();
      setTasks(result.data);
      setFilteredTasks(result.data); // Initially show all tasks
      setTotalItems(result.data.length); // Set total items for pagination
      result.data.map((item) => {
        fetchsubtaskdata(item.taskAllocationId);
      });

      const departmentResult = await DepartmentService.getDepartments();
      setDepartments(departmentResult.data); // Set the 'data' array to the state\
      // console.log(departmentId);
      if (departmentId) {
        debugger;
        const employeeResult = await EmployeeService.getEmployeeByDepartment(
          departmentId
        );
        setEmployeeList(employeeResult.data);
      }
    } catch (error) {
      console.error("Error fetching tasks:", error);
      setTasks([]);
      setFilteredTasks([]); // Fallback to an empty array in case of an error
    }
  };

  useEffect(() => {
    fetchTasks();
  }, [departmentId]);

  // const deleteTask = async (taskId) => {
  //   try {
  //     const response = await TaskService.deleteTask(taskId);
  //     if (response.status === 1) {
  //       setFilteredTasks((prevTasks) =>
  //         prevTasks.filter((task) => task.taskAllocationId !== taskId)
  //       );
  //       toast.error(response.message); 
  //     }
  //   } catch (error) {
  //     console.error("Error deleting task:", error);
  //     alert("Failed to delete task");
  //   }
  // };

  // const deleteSubTask = async (subTaskId,taskAllocationId) => {
  //   try {
  //     const response = await SubTaskService.deleteSubTask(subTaskId);
  //     if (response.status === 1) {
  //       fetchsubtaskdata(taskAllocationId);
  //       alert(response.message);
  //     }
  //   } catch (error) {
  //     console.error("Error deleting subtask:", error);
  //     alert("Failed to delete subtask");
  //   }
  // };

  const handleDeleteClick = (taskAllocationId) => {
    // debugger;
    // event.preventDefault(); // Prevent the default action (page reload)
    setDeleteId(taskAllocationId);
    setIsPopupOpen(true); // Open popup
  };

  const handleSubTaskDeleteClick = (subTaskAllocationId,taskAllocationId) => {
    // debugger;
    // event.preventDefault(); // Prevent the default action (page reload)
    setDeleteSubTaskId(subTaskAllocationId);
    setIsPopupOpen(true); // Open popup
  };

  const deleteTask = async (event) => {
    event.preventDefault(); // Prevent the default action (page reload)
    // debugger;

    if(deleteId) {
      try {
        const response = await TaskService.deleteTask(
          deleteId
        );
        if (response.status === 1) {
          setFilteredTasks((prevTasks) =>
            prevTasks.filter(
              (task) => task.taskAllocationId !== deleteId
            )
          );
          toast.error("Task Deleted Successfully"); // Toast on success
          setIsPopupOpen(false); // Close popup after deletion
          setDeleteId(null); // Reset eventTypeIdToDelete
        }
      } catch (error) {
        console.error("Error deleting task", error);
        alert("Failed to delete task");
      }
    } 
    else if (deleteSubTaskId){
      try {
        const response = await SubTaskService.deleteSubTask(
          deleteSubTaskId
        );
        if (response.status === 1) {
          // fetchsubtaskdata(deleteSubTaskId)
          toast.error("Sub Task Deleted Successfully"); // Toast on success
          setIsPopupOpen(false); // Close popup after deletion
          setDeleteSubTaskId(null); // Reset eventTypeIdToDelete
        }
      } catch (error) {
        console.error("Error deleting sub task:", error);
        alert("Failed to delete sub task");
      }
    }
    else return;
  };

  const handlePopupClose = (event) => {
    event.preventDefault(); // Prevent the default action (page reload)
    setIsPopupOpen(false); // Close popup without deleting
    setDeleteId(null); // Reset the ID
  };

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

  useEffect(() => {
    // Apply filters to the tasks array
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
        task.taskStatusName.toLowerCase().includes(statusFilter.toLowerCase()),
        // subT.taskStatusName.toLowerCase().includes(statusFilter.toLowerCase()),
      );
    }

    setFilteredTasks(filtered); // Update filtered tasks based on all filters
    setTotalItems(filtered.length); 
    setCurrentPage(1); // Reset to the first page when a new filter is applied
  }, [employeeFilter, priorityFilter, statusFilter, tasks]);

  //#region Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredTasks.slice(indexOfFirstItem, indexOfLastItem);

  const totalPages = Math.ceil(totalItems / itemsPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };
  //#endregion

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

  // Function to format the date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString(); // You can customize the date format as needed
  };

  // Function to filter tasks based on selected employee
  const handleEmployeeFilterChange = (event) => {
    setEmployeeFilter(event.target.value);
  };

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
  const uniqueStatuses = [
    ...new Set(tasks.map((task) => task.taskStatusName)),
    ...new Set((Array.isArray(subTasks) ? subTasks : []).map((subTask) => subTask.taskStatusName)),
  ];
  
  // const uniqueStatuses = [...new Set(tasks.map((task) => task.taskStatusName))];

  // Function to handle opening the popup and setting the current task
  const handleEyeClick = (task) => {
    setCurrentTask(task); // Set the selected task data
    setTaskAllocationId(task.taskAllocationId); // Set the selected task data
    setSubTaskAllocationId(task.subTaskAllocationId); // Set the selected task data
    setTaskDate(formatDate(task.taskDate)); // Assuming taskDate is in a format we can directly display
    setTaskTimeIn(task.taskTimeIn);
    setTaskTimeOut(task.taskTimeOut);
    setTaskDuration(task.taskDuration);
    setTaskUpdate(task.taskUpdate);
    setIsPopupVisible(true); // Show the popup
    // setStartDateIsPopupVisible(true)
  };

  // Function to calculate task duration based on time in and time out
  const calculateDuration = () => {
    if (taskTimeIn && taskTimeOut) {
      const timeIn = new Date(`1970-01-01T${taskTimeIn}:00`);
      const timeOut = new Date(`1970-01-01T${taskTimeOut}:00`);

      let duration = (timeOut - timeIn) / 1000 / 60; // Duration in minutes
      if (duration < 0) {
        duration += 24 * 60; // If the duration is negative, it means timeOut is the next day
      }

      const hours = Math.floor(duration / 60);
      const minutes = duration % 60;
      setTaskDuration(`${hours}h ${minutes}m`);
    }
  };

  // Watch for changes in time fields and calculate duration
  useEffect(() => {
    calculateDuration();
  }, [taskTimeIn, taskTimeOut]);

  const formatTimeToBackendFormat = (time) => {
    if (!time) return ""; // If no time, return an empty string
    const [hours, minutes] = time.split(":");
    return `${hours}:${minutes}:00.0000000`; // Convert to HH:mm:ss.SSSSSSS
  };

  // Function to convert duration format (e.g., "4h 0m" -> "04:00:00")
  const convertToTimeSpanFormat = (duration) => {
    const match = duration.match(/(\d+)h (\d+)m/); // Matches "4h 0m" format
    if (match) {
      const hours = String(match[1]).padStart(2, "0"); // Pad to two digits
      const minutes = String(match[2]).padStart(2, "0"); // Pad to two digits
      return `${hours}:${minutes}:00`; // Assuming seconds are zero
    }
    return "00:00:00"; // Default fallback if the format is unexpected
  };

  const toggleDropdown = (taskAllocationId) => {
    // Toggle dropdown for the current task, close if it's already open
    setOpenDropdown((prev) =>
      prev === taskAllocationId ? null : taskAllocationId
    );
  };

  const toggleSubTaskDropdown = (subTaskAllocationId) => {
    // Toggle dropdown for the current task, close if it's already open
    setOpenSubDropdown((prev) =>
      prev === subTaskAllocationId ? null : subTaskAllocationId
    );
  };

  const closeMenu = () => {
    setOpenDropdown(null);
    setOpenSubDropdown(null);
    // setActiveSubTaskMenu(null);
  };

  // Function to get the dropdown position (top or bottom) based on available space
  const getDropdownPosition = (taskAllocationId, isLastRow) => {
    const button = buttonRefs.current[taskAllocationId];
    if (!button) return { top: 0, left: 0 };

    const buttonRect = button.getBoundingClientRect();
    const windowHeight = window.innerHeight;
    const spaceBelow = windowHeight - buttonRect.bottom;
    const spaceAbove = buttonRect.top;

    // If it's the last row or space below is too small, open the dropdown above
    if (isLastRow || spaceBelow < 400) {
      return { top: buttonRect.top - 120, left: buttonRect.left - 120 };
    }

    // Otherwise, open it below
    return { top: buttonRect.bottom - 5, left: buttonRect.left - 120 };
  };

  const getDropdownPositionForSubTask = (subTaskAllocationId, isLastRow) => {
    debugger;
    const button = buttonRefs.current[subTaskAllocationId]; // Get reference to the button
    if (!button) return { top: 0, left: 0 }; // Fallback if the button ref is not available

    const buttonRect = button.getBoundingClientRect(); // Get button's bounding box (position & size)
    const windowHeight = window.innerHeight; // Get the height of the window
    const spaceBelow = windowHeight - buttonRect.bottom; // Calculate space below the button
    const spaceAbove = buttonRect.top; // Calculate space above the button

    // If the row is the last one or if there's not enough space below, show the dropdown above
    if (isLastRow || spaceBelow < 130) {
      return { top: buttonRect.top - 120, left: buttonRect.right - 120 }; // Position above the button
    }

    // Otherwise, position the dropdown below the button
    return { top: buttonRect.bottom - 5, left: buttonRect.right - 120 }; // Position below the button
  };

  //#region Add Start And End Date of Task
  // Handle the start date change
  const handleStartDateChange = async (e) => {
    const newStartingDate = e.target.value; // Get the new date value
    setActualStartingDate(newStartingDate); // Set the date state
    const taskData = {
      actualStartingDate: newStartingDate,
    };
    try {
      const response = await TaskService.updateTaskActualStartingDate(
        taskAllocationId,
        taskData
      );
      if (response.status === 1) {
        toast.success(response.message); // Toast on success
        fetchTasks();
      }
    } catch (error) {
      console.error("Error updating ActualStaringDate:", error);
    }
  };

  // Handle the end date change
  const handleCompletionDateChange = async (e) => {
    const newStartingDate = e.target.value; // Get the new date value
    setTaskCompletionDate(newStartingDate); // Set the date state
    const taskData = {
      taskCompletionDate: newStartingDate,
    };
    try {
      const response = await TaskService.updateTaskCompletionDate(
        taskAllocationId,
        taskData
      );
      if (response.status === 1) {
        toast.success(response.message); // Toast on success
        fetchTasks();
      }
    } catch (error) {
      console.error("Error updating ActualStaringDate:", error);
    }
  };

  // Handle the start date change
  const handleSubStartDateChange = async (e) => {
    const newStartingDate = e.target.value; // Get the new date value
    setActualStartingDate(newStartingDate); // Set the date state
    const taskData = {
      actualStartingDate: newStartingDate,
    };
    try {
      const response = await SubTaskService.updateSubTaskActualStartingDate(
        subTaskAllocationId,
        taskData
      );
      if (response.status === 1) {
        toast.success(response.message); // Toast on success
        fetchTasks();
      }
    } catch (error) {
      console.error("Error updating ActualStaringDate:", error);
    }
  };

  // Handle the end date change
  const handleSubCompletionDateChange = async (e) => {
    const newStartingDate = e.target.value; // Get the new date value
    setTaskCompletionDate(newStartingDate); // Set the date state
    const taskData = {
      taskCompletionDate: newStartingDate,
    };
    try {
      const response = await SubTaskService.updateSubTaskCompletionDate(
        subTaskAllocationId,
        taskData
      );
      if (response.status === 1) {
        toast.success(response.message); // Toast on success
        fetchTasks();
      }
    } catch (error) {
      console.error("Error updating ActualStaringDate:", error);
    }
  };
  //#endregion

  // Function to handle opening the popup and setting the current task
  const handleTaskStartAndEndDate = (task) => {
    setTaskAllocationId(task.taskAllocationId); // Set the selected task data
    setStartDateIsPopupVisible(true); // Show the popup
  };

  const handleSubTaskStartAndEndDate = (subTask) => {
    setSubTaskAllocationId(subTask.subTaskAllocationId); // Set the selected task data
    setSubStartDateIsPopupVisible(true); // Show the popup
  };
  
  const handleTaskTransfer = (task) => {
    setAllocationId(task.taskAllocationId); // Set the selected task data
    setTaskTransferIsPopupVisible(true); // Show the popup
  };
 
  const handleSubTaskTransfer = (subTask) => {
    setAllocationId(subTask.subTaskAllocationId); // Set the selected task data
    setSubTaskTransferIsPopupVisible(true); // Show the popup
  };

  const handleTransferSubmit = async (event) => {
    event.preventDefault();

    const taskTransferData = {
      allocationId,
      taskTransferTo,
    };
    //console.log("Submitting task transfer data:", taskTransferData); // Log the data before submitting

    try {
      // Call the API to add the task note
      const response = await TaskService.transferTask(taskTransferData);
      if (response.status === 1) {
        toast.success(response.message); // Toast on success
        fetchTasks();
      }
      console.log("task transfer added successfully:", response);

      // Optionally, you can update the task state or show a success message here
      setTaskTransferIsPopupVisible(false); // Close the popup
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

  const handleSubTransferSubmit = async (event) => {
    event.preventDefault();

    const transferSubTask = {
      allocationId,
      taskTransferTo,
    };

    //console.log("Submitting task transfer data:", transferSubTask); // Log the data before submitting

    try {
      // Call the API to add the task note
      const response = await SubTaskService.transferSubTask(transferSubTask);
      if (response.status === 1) {
        toast.success(response.message); // Toast on success
        fetchTasks();
      }
      // console.log("Transfer Sub Task Successfully:", response);

      // Optionally, you can update the task state or show a success message here
      setSubStartDateIsPopupVisible(false); // Close the popup
    } catch (error) {
      toast.error(
        "Error tranfering sub task",
        error.response?.data || error.message
      );
      if (error.response?.data?.errors) {
        console.log("Validation Errors:", error.response.data.errors); // This will help pinpoint specific fields causing the issue
      }
    }

    // Close the popup after submission
    // setIsPopupVisible(false);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    // Format task time fields to the expected format
    const formattedTimeIn = formatTimeToBackendFormat(taskTimeIn);
    const formattedTimeOut = formatTimeToBackendFormat(taskTimeOut);

    const formattedDuration = convertToTimeSpanFormat(taskDuration);
    // Convert taskDuration to the required time span format (hh:mm:ss)

    const taskNoteData = {
      taskAllocationId: taskAllocationId === "" ? null : taskAllocationId, // Convert empty string to null
      subTaskAllocationId: subTaskAllocationId === "" ? null : subTaskAllocationId, // Convert empty string to null
      taskDate,
      taskTimeIn: formattedTimeIn,
      taskTimeOut: formattedTimeOut,
      taskDuration: formattedDuration,
      taskUpdate,
    };

    console.log("Submitting task note data:", taskNoteData); // Log the data before submitting

    try {
      // Call the API to add the task note
      const response = await TaskNoteService.addTaskNote(taskNoteData);
      if(response.status === 1){
        toast.success(response.message); // Toast on success
      }
      // console.log("Task note added successfully:", response);

      // Optionally, you can update the task state or show a success message here
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
        <h1 className="font-semibold text-2xl">Task List</h1>
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
        <Link
          to="/task/create-task"
          className="bg-blue-600 hover:bg-blue-700 flex gap-2 text-center text-white font-medium py-2 px-4 rounded hover:no-underline"
        >
          Add Task
          <FaPlus className="mt-[3px]" size={14} />
        </Link>
        </motion.button>
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
        <select
          value={priorityFilter}
          onChange={handlePriorityFilterChange}
          className="p-2 outline-none rounded border border-gray-300"
        >
          <option value="">All Priorities</option>
          {uniquePriorities.map((priority) => (
            <option key={priority} value={priority}>
              {priority}
            </option>
          ))}
        </select>
        <select
          value={statusFilter}
          onChange={handleStatusFilterChange}
          className="p-2 outline-none rounded border border-gray-300"
        >
          <option value="">All Statuses</option>
          {uniqueStatuses.map((status) => (
            <option key={status} value={status}>
              {status}
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
                  No tasks found.
                </td>
              </tr>
            ) : (
              currentItems.map((item, index) => {
                const isLastRow = index === filteredTasks.length - 1;
                return (
                  <React.Fragment key={item.taskAllocationId}>
                    <motion.tr
                      key={item.taskAllocationId}
                      className="border-b hover:bg-gray-50"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: item * 0.1 }}
                    >
                    {/* <tr className="border-b hover:bg-gray-50"> */}
                      <td className="py-3 px-4 text-gray-700">
                        <button
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
                      {item.taskExpectedCompletionDate === null ? item.taskExpectedCompletionDate : formatDate(item.taskExpectedCompletionDate)}                      </td>
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
                      <td className="py-3 px-4">
                        <div className="flex gap-2">
                          <button>
                          <motion.button
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                            >
                          <Link
                            to={`/task/edit-task/${item.taskAllocationId}`}
                            className="text-blue-500 hover:text-blue-700"
                          >
                            <FaEdit size={24} />
                          </Link>
                          </motion.button>
                          </button>
                          
                          <button>
                          <motion.button
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                            >
                          <Link
                            to={`/task/tasknote-list/${item.taskAllocationId}`}
                            className="text-yellow-500 hover:text-yellow-700"
                          >
                            {/* <FaRegFileLines size={24} /> */}
                            <IoTime size={24} />
                          </Link>
                          </motion.button>
                          </button>
                          
                          <button
                            onClick={() =>handleDeleteClick(item.taskAllocationId)}
                            // onClick={() => deleteTask(item.taskAllocationId)}
                            className="text-red-500 hover:text-red-700"
                          >
                            <motion.button
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                            >
                            <FaTrash size={22} />
                            </motion.button>
                          </button>
                          <button
                            onClick={() =>
                              toggleDropdown(item.taskAllocationId)
                            }
                            className="text-gray-500 hover:text-gray-700"
                            ref={(el) =>
                              (buttonRefs.current[item.taskAllocationId] = el)
                            }
                          >
                            <motion.button
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                            >
                            <FaEllipsisV size={24} />
                            </motion.button>
                          </button>
                          {/* Render dropdown above or below based on space */}
                          {openDropdown === item.taskAllocationId && (
                            <div
                              className="absolute z-10 bg-white divide-y divide-gray-100 rounded-lg shadow w-44 dark:bg-gray-700 dark:divide-gray-600"
                              style={getDropdownPosition(
                                item.taskAllocationId,
                                isLastRow
                              )}
                              onMouseLeave={closeMenu}
                            >
                              <ul className="py-2 text-sm text-gray-800 cursor-pointer dark:text-gray-200">
                                <li>
                                  <span
                                    onClick={() =>
                                      handleTaskStartAndEndDate(item)
                                    }
                                    className="block px-4 py-2 hover:bg-gray-100 hover:no-underline dark:hover:bg-gray-600 dark:hover:text-white"
                                  >
                                    Task Updates
                                  </span>
                                </li>
                                <li>
                                  <span
                                    onClick={() => handleEyeClick(item)}
                                    className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                                  >
                                    Daily Note
                                  </span>
                                </li>
                                <li>
                                  <span
                                    onClick={() => handleTaskTransfer(item)}
                                    className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                                  >
                                    Task Transfer
                                  </span>
                                </li>
                              </ul>
                              {startDateIsPopupVisible &&  
                            (
                            <div className="fixed inset-0 bg-gray-700 bg-opacity-50 flex justify-center items-center z-50">
                              <div className="bg-white p-6 rounded-lg shadow-lg md:w-1/3 xl:w-1/3">
                                <h2 className="text-xl font-semibold mb-4">
                                  Task Updates
                                </h2>
                                <form>
                                  <div className="mb-4">
                                    <label className="block text-sm font-medium text-gray-700">
                                      Task Actual Start Date
                                    </label>
                                    <input
                                      type="date"
                                      value={actualStartingDate}
                                      onChange={(e) =>
                                        handleStartDateChange(e)
                                      }
                                      className="w-full mt-1 px-3 py-2 border rounded-md border-active"
                                    />
                                  </div>

                                  <div className="mb-4">
                                    <label className="block text-sm font-medium text-gray-700">
                                      Task End Date
                                    </label>
                                    <input
                                      type="date"
                                      value={taskCompletionDate}
                                      onChange={(e) =>
                                        handleCompletionDateChange(e)
                                      }
                                      className="w-full mt-1 px-3 py-2 border rounded-md border-active"
                                    />
                                  </div>

                                  <div className="flex flex-col md:flex-row justify-end gap-4">
                                    <button
                                      type="button"
                                      onClick={() =>
                                        setStartDateIsPopupVisible(false)
                                      }
                                      className="px-7 py-2 bg-gray-300 text-black rounded border-active"
                                    >
                                      Cancel
                                    </button>
                                  </div>
                                </form>
                              </div>
                            </div>
                          )}
                            </div>
                          )}
                         

                          {taskTransferIsPopupVisible && (
                            <div className="fixed inset-0 bg-gray-700 bg-opacity-50 flex justify-center items-center z-50">
                              <div className="bg-white p-6 rounded-lg shadow-lg md:w-1/3 xl:w-1/3">
                                <h2 className="text-xl font-semibold mb-4">
                                  Task Updates
                                </h2>
                                <form>
                                  <div className="mb-4">
                                    <label className="block text-sm font-medium text-gray-700">
                                      Select Department
                                    </label>
                                    <select
                                      value={departmentId}
                                      onChange={(e) =>
                                        setDepartmentId(e.target.value)
                                      }
                                      className="w-full mt-1 px-3 py-2 rounded-md border border-active"
                                    >
                                      <option value="">
                                        --Select Department--
                                      </option>
                                      {departments.map((department) => (
                                        <option
                                          key={department.departmentId}
                                          value={department.departmentId}
                                        >
                                          {department.departmentName}
                                        </option>
                                      ))}
                                    </select>
                                  </div>
                                  <div className="mb-4">
                                    <label className="block text-sm font-medium text-gray-700">
                                      Task Transfer to:
                                    </label>
                                    <select
                                      value={taskTransferTo}
                                      onChange={(e) =>
                                        setTaskTransferTo(e.target.value)
                                      }
                                      className="w-full mt-1 px-3 py-2 rounded-md border border-active"
                                    >
                                      <option value="">
                                        --Select Employee--
                                      </option>
                                      {employeeList.map((employee) => (
                                        <option
                                          key={employee.employeeId}
                                          value={employee.employeeId}
                                        >
                                          {employee.firstName +
                                            " " +
                                            employee.lastName}
                                        </option>
                                      ))}
                                    </select>
                                  </div>

                                  <div className="flex flex-col md:flex-row justify-end gap-4">
                                    <button
                                      type="button"
                                      onClick={() =>
                                        setTaskTransferIsPopupVisible(false)
                                      }
                                      className="px-7 py-2 bg-gray-300 text-black rounded border-active"
                                    >
                                      Cancel
                                    </button>
                                    <button
                                      onClick={handleTransferSubmit}
                                      className="px-4 py-2 bg-blue-500 text-white rounded border-active"
                                    >
                                      Submit
                                    </button>
                                  </div>
                                </form>
                              </div>
                            </div>
                          )}

                        </div>
                      </td>
                    {/* </tr> */}
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
                                  "Actions",
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
                                    const isLastRow =
                                      index ===
                                      subTasks[item.taskAllocationId].length -
                                        1;
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
                                        {subTask.taskExpectedCompletionDate === null ? 
                                        subTask.taskExpectedCompletionDate : 
                                        formatDate(subTask.taskExpectedCompletionDate)}
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
                                        <td className="py-3 px-4">
                                          <div className="flex gap-2">
                                            <button>
                                            <motion.button
                                              whileHover={{ scale: 1.1 }}
                                              whileTap={{ scale: 0.9 }}
                                            >
                                            <Link
                                              to={`/task/edit-subtask/${subTask.subTaskAllocationId}`}
                                              className="relative text-blue-500 hover:text-blue-700 group"
                                            >
                                              <FaEdit size={24} />
                                            </Link>
                                            </motion.button>
                                            </button>
                                            
                                            <button>
                                            <motion.button
                                              whileHover={{ scale: 1.1 }}
                                              whileTap={{ scale: 0.9 }}
                                            >
                                            <Link
                                              to={`/task/tasknote-list/${subTask.subTaskAllocationId}`}
                                              className="text-yellow-500 hover:text-yellow-700"
                                            >
                                              {/* <FaRegFileLines size={24} /> */}
                                              <IoTime size={24} />
                                            </Link>
                                            </motion.button>
                                            </button>
                                            
                                            <button
                                            onClick={(e) =>handleSubTaskDeleteClick(subTask.subTaskAllocationId,subTask.taskAllocationId)}
                                            //  onClick={() => deleteSubTask(subTask.subTaskAllocationId,subTask.taskAllocationId)}
                                             className="text-red-500 hover:text-red-700"
                                            >
                                              <motion.button
                                              whileHover={{ scale: 1.1 }}
                                              whileTap={{ scale: 0.9 }}
                                            >
                                              <FaTrash size={22} />
                                              </motion.button>
                                            </button>
                                            <button
                                              onClick={() =>
                                                toggleSubTaskDropdown(
                                                subTask.subTaskAllocationId
                                                )
                                              }
                                              className="text-gray-500 hover:text-gray-700"
                                              ref={(el) =>
                                                (buttonRefs.current[
                                                  subTask.subTaskAllocationId
                                                ] = el)
                                              }
                                            >
                                              <motion.button
                                              whileHover={{ scale: 1.1 }}
                                              whileTap={{ scale: 0.9 }}
                                            >
                                              <FaEllipsisV size={24} />
                                              </motion.button>
                                            </button>
                                            {/* Render dropdown above or below based on space */}
                                            {openSubDropdown ===
                                              subTask.subTaskAllocationId && (
                                              <div
                                                className="absolute z-10 bg-white divide-y divide-gray-100 rounded-lg shadow w-44 dark:bg-gray-700 dark:divide-gray-600"
                                                style={getDropdownPositionForSubTask(
                                                  subTask.subTaskAllocationId,
                                                  isLastRow
                                                )}
                                                onMouseLeave={closeMenu}
                                              >
                                                <ul className="py-2 text-sm text-gray-800 cursor-pointer dark:text-gray-200">
                                                  <li>
                                                    <span
                                                      onClick={() =>
                                                        handleSubTaskStartAndEndDate(subTask)
                                                      }
                                                      className="block px-4 py-2 hover:bg-gray-100 hover:no-underline dark:hover:bg-gray-600 dark:hover:text-white"
                                                    >
                                                      Task Updates
                                                    </span>
                                                  </li>
                                                  <li>
                                                    <span
                                                      onClick={() =>
                                                        handleEyeClick(subTask)
                                                      }
                                                      className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                                                    >
                                                      Daily Note
                                                    </span>
                                                  </li>
                                                  <li>
                                                    <span
                                                      onClick={() =>
                                                        handleSubTaskTransfer(
                                                          subTask
                                                        )
                                                      }
                                                      className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                                                    >
                                                      Task Transfer
                                                    </span>
                                                  </li>
                                                </ul>
                                              </div>
                                            )}

                                            {subStartDateIsPopupVisible && (
                                              <div className="fixed inset-0 bg-gray-700 bg-opacity-50 flex justify-center items-center z-50">
                                                <div className="bg-white p-6 rounded-lg shadow-lg md:w-1/3 xl:w-1/3">
                                                  <h2 className="text-xl font-semibold mb-4">
                                                    Task Updates
                                                  </h2>
                                                  <form>
                                                    <div className="mb-4">
                                                      <label className="block text-sm font-medium text-gray-700">
                                                        Task Actual Start Date
                                                      </label>
                                                      <input
                                                        type="date"
                                                        value={
                                                          actualStartingDate
                                                        }
                                                        onChange={(e) =>
                                                          handleSubStartDateChange(e)
                                                        }
                                                        className="w-full mt-1 px-3 py-2 border rounded-md border-active"
                                                      />
                                                    </div>

                                                    <div className="mb-4">
                                                      <label className="block text-sm font-medium text-gray-700">
                                                        Task End Date
                                                      </label>
                                                      <input
                                                        type="date"
                                                        value={
                                                          taskCompletionDate
                                                        }
                                                        onChange={(e) =>
                                                          handleSubCompletionDateChange(e)
                                                        }
                                                        className="w-full mt-1 px-3 py-2 border rounded-md border-active"
                                                      />
                                                    </div>

                                                    <div className="flex flex-col md:flex-row justify-end gap-4">
                                                      <button
                                                        type="button"
                                                        onClick={() =>
                                                          setSubStartDateIsPopupVisible(
                                                            false
                                                          )
                                                        }
                                                        className="px-7 py-2 bg-gray-300 text-black rounded border-active"
                                                      >
                                                        Cancel
                                                      </button>
                                                    </div>
                                                  </form>
                                                </div>
                                              </div>
                                            )}

                                            {subTaskTransferIsPopupVisible && (
                                              <div className="fixed inset-0 bg-gray-700 bg-opacity-50 flex justify-center items-center z-50">
                                                <div className="bg-white p-6 rounded-lg shadow-lg md:w-1/3 xl:w-1/3">
                                                  <h2 className="text-xl font-semibold mb-4">
                                                    Task Updates
                                                  </h2>
                                                  <form>
                                                    <div className="mb-4">
                                                      <label className="block text-sm font-medium text-gray-700">
                                                        Select Department
                                                      </label>
                                                      <select
                                                        value={departmentId}
                                                        onChange={(e) =>
                                                          setDepartmentId(
                                                            e.target.value
                                                          )
                                                        }
                                                        className="w-full mt-1 px-3 py-2 rounded-md border border-active"
                                                      >
                                                        <option value="">
                                                          --Select Department--
                                                        </option>
                                                        {departments.map(
                                                          (department) => (
                                                            <option
                                                              key={
                                                                department.departmentId
                                                              }
                                                              value={
                                                                department.departmentId
                                                              }
                                                            >
                                                              {
                                                                department.departmentName
                                                              }
                                                            </option>
                                                          )
                                                        )}
                                                      </select>
                                                    </div>
                                                    <div className="mb-4">
                                                      <label className="block text-sm font-medium text-gray-700">
                                                        Task Transfer to:
                                                      </label>
                                                      <select
                                                        value={taskTransferTo}
                                                        onChange={(e) =>
                                                          setTaskTransferTo(
                                                            e.target.value
                                                          )
                                                        }
                                                        className="w-full mt-1 px-3 py-2 rounded-md border border-active"
                                                      >
                                                        <option value="">
                                                          --Select Employee--
                                                        </option>
                                                        {employeeList.map(
                                                          (employee) => (
                                                            <option
                                                              key={
                                                                employee.employeeId
                                                              }
                                                              value={
                                                                employee.employeeId
                                                              }
                                                            >
                                                              {employee.firstName +
                                                                " " +
                                                                employee.lastName}
                                                            </option>
                                                          )
                                                        )}
                                                      </select>
                                                    </div>

                                                    <div className="flex flex-col md:flex-row justify-end gap-4">
                                                      <button
                                                        type="button"
                                                        onClick={() =>
                                                          setSubTaskTransferIsPopupVisible(
                                                            false
                                                          )
                                                        }
                                                        className="px-7 py-2 bg-gray-300 text-black rounded border-active"
                                                      >
                                                        Cancel
                                                      </button>
                                                      <button
                                                        onClick={
                                                          handleSubTransferSubmit
                                                        }
                                                        className="px-4 py-2 bg-blue-500 text-white rounded border-active"
                                                      >
                                                        Submit
                                                      </button>
                                                    </div>
                                                  </form>
                                                </div>
                                              </div>
                                            )}
                                          </div>
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
            <div className="flex justify-end gap-4">
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={(event) => handlePopupClose(event)}
                className="flex items-center gap-2 bg-gray-400 px-8 py-3 rounded-lg text-white font-semibold hover:bg-gray-500 active:bg-gray-500 transition duration-200"
              >
                No
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={(event) => deleteTask(event)}
                className="flex items-center gap-2 bg-red-600 font-semibold text-white px-8 py-3 rounded-lg hover:bg-red-700 active:bg-red-800 transition duration-200"
              >
                Yes
              </motion.button>
            </div>
          </div>
        </div>
      )}

      {/* Popup for task details */}
      {isPopupVisible && (
        <div className="fixed inset-0 bg-gray-700 bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg md:w-1/3 xl:w-1/3">
            <h2 className="text-xl font-semibold mb-4">Task Details</h2>
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">
                  Task Date
                </label>
                <input
                  type="date"
                  value={taskDate}
                  onChange={(e) => setTaskDate(e.target.value)}
                  className="w-full mt-1 px-3 py-2 border rounded-md border-active"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">
                  Task Time In
                </label>
                <input
                  type="time"
                  value={taskTimeIn}
                  onChange={(e) => setTaskTimeIn(e.target.value)}
                  className="w-full mt-1 px-3 py-2 border rounded-md border-active"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">
                  Task Time Out
                </label>
                <input
                  type="time"
                  value={taskTimeOut}
                  onChange={(e) => setTaskTimeOut(e.target.value)}
                  className="w-full mt-1 px-3 py-2 border rounded-md border-active"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">
                  Task Duration
                </label>
                <input
                  type="text"
                  value={taskDuration}
                  onChange={(e) => setTaskDuration(e.target.value)}
                  className="w-full mt-1 px-3 py-2 border rounded-md border-active"
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
                  className="w-full mt-1 px-3 py-2 border rounded-md border-active"
                />
              </div>
              <div className="flex flex-col md:flex-row justify-end gap-4">
                <button
                  type="button"
                  onClick={() => setIsPopupVisible(false)}
                  className="px-4 py-2 bg-gray-300 text-black rounded border-active"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-500 text-white rounded border-active"
                >
                  Submit
                </button>
              </div>
            </form>
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
              <span className="font-semibold mx-1">{Math.min(indexOfLastItem, totalItems)}</span>
              of
              <span className="font-semibold mx-1">{totalItems}</span>
              results
            </p>
          </div>
          <div>
            <nav className="isolate inline-flex -space-x-px rounded-md shadow-sm" aria-label="Pagination">
              <motion.button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="relative inline-flex items-center rounded-l-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <span className="sr-only">Previous</span>
                <svg className="size-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                  <path fillRule="evenodd" d="M11.78 5.22a.75.75 0 0 1 0 1.06L8.06 10l3.72 3.72a.75.75 0 1 1-1.06 1.06l-4.25-4.25a.75.75 0 0 1 0-1.06l4.25-4.25a.75.75 0 0 1 1.06 0Z" clipRule="evenodd" />
                </svg>
              </motion.button>

              {/* Pagination Buttons */}
              {[...Array(totalPages)].map((_, index) => (
                <motion.button
                  key={index}
                  onClick={() => handlePageChange(index + 1)}
                  className={`relative z-10 inline-flex items-center px-4 py-2 text-sm font-semibold text-white focus:z-20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 ${
                    currentPage === index + 1 ? "bg-indigo-600" : "bg-gray-200 text-gray-700"
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
                <svg className="size-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                  <path fillRule="evenodd" d="M8.22 5.22a.75.75 0 0 1 1.06 0l4.25 4.25a.75.75 0 0 1 0 1.06l-4.25 4.25a.75.75 0 0 1-1.06-1.06L11.94 10 8.22 6.28a.75.75 0 0 1 0-1.06Z" clipRule="evenodd" />
                </svg>
              </motion.button>
            </nav>
          </div>
        </div>
     </div>
    </>
  );
};

export default TaskList;







//#region Commented Code
// import React, { useEffect, useState } from "react";
// import { IoSwapHorizontalOutline } from "react-icons/io5";
// import {
//   FaArrowDown,
//   FaArrowRight,
//   FaCalendarDay,
//   FaEdit,
//   FaEllipsisV,
//   FaPlus,
//   FaRegFileAlt,
//   FaTrash,
// } from "react-icons/fa";
// import { TaskService } from "../../../service/TaskService"; // Make sure this is correctly imported
// import { Link } from "react-router-dom";
// import { SubTaskService } from "../../../service/SubTaskService";
// import { FaCircleInfo, FaRegFileLines } from "react-icons/fa6";
// import DatePicker from "react-datepicker";
// import { DepartmentService } from "../../../service/DepartmentService";
// import { EmployeeService } from "../../../service/EmployeeService";

// const TaskList = () => {
//   const [tasks, setTasks] = useState([]);
//   const [filteredTasks, setFilteredTasks] = useState([]);
//   const [employeeFilter, setEmployeeFilter] = useState(""); // State for employee filter
//   const [priorityFilter, setPriorityFilter] = useState(""); // State for priority filter
//   const [statusFilter, setStatusFilter] = useState(""); // State for status filter
//   const [expandedRows, setExpandedRows] = useState({}); // Tracks expanded rows
//   const [subTasks, setSubTasks] = useState([]); // Stores the sub-tasks for each task
//   const [activeMenu, setActiveMenu] = useState(null); // Tracks the active menu by taskAllocationId
//   const [activeSubTaskMenu, setActiveSubTaskMenu] = useState(null); // Track the active sub-task menu

//   // Popup state
//   const [isPopupVisible, setIsPopupVisible] = useState(false);

//   const [actualStartingDate, setActualStartingDate] = useState("");
//   const [taskCompletionDate, setTaskCompletionDate] = useState("");
//   const [departments, setDepartments] = useState([]);
//   const [departmentId, setDepartmentId] = useState("");
//   const [employeeList, setEmployeeList] = useState([]);
//   const [allocationId, setAllocationId] = useState("");
//   const [taskTransferTo, setTaskTransferTo] = useState("");

//   const toggleMenu = (taskAllocationId) => {
//     setActiveMenu(activeMenu === taskAllocationId ? null : taskAllocationId);
//   };

//   const toggleSubMenu = (subTaskAllocationId) => {
//     setActiveSubTaskMenu(
//       activeSubTaskMenu === subTaskAllocationId ? null : subTaskAllocationId
//     );
//   };

//   const closeMenu = () => {
//     setActiveMenu(null);
//     setActiveSubTaskMenu(null);
//   };

//   const fetchsubtaskdata = async (taskAllocationId) => {
//     const subTaskData = await getSubTasksByTaskAllocationId(taskAllocationId); // make sure this function returns a promise
//     setSubTasks((prevSubTasks) => ({
//       ...prevSubTasks,
//       [taskAllocationId]: subTaskData,
//     }));
//   };

//   useEffect(() => {
//     const fetchTasks = async () => {
//       try {
//         const result = await TaskService.getTasks();
//         setTasks(result.data); // Set the 'data' array to the state
//         setFilteredTasks(result.data); // Initially show all tasks
//         result.data.map((item) => {
//           fetchsubtaskdata(item.taskAllocationId);
//         });

//         const departmentResult = await DepartmentService.getDepartments();
//         setDepartments(departmentResult.data); // Set the 'data' array to the state\
//         // console.log(departmentId);
//         if (departmentId) {
//           debugger;
//           const employeeResult = await EmployeeService.getEmployeeByDepartment(
//             departmentId
//           );
//           setEmployeeList(employeeResult.data);
//         }
//       } catch (error) {
//         console.error("Error fetching tasks:", error);
//         setTasks([]);
//         setFilteredTasks([]); // Fallback to an empty array in case of an error
//       }
//     };
//     fetchTasks();
//   }, [departmentId]);

//   // Function to set the color based on the task status
//   const getStatusColor = (taskStatusName) => {
//     switch (taskStatusName) {
//       case "Pending":
//         return "text-red-500 bg-red-100"; // Red for Pending
//       case "InProgress":
//         return "text-yellow-500 bg-yellow-100"; // Yellow for In Progress
//       case "Completed":
//           return "text-green-500 bg-green-100"; // Green for Completed
//       default:
//         return "text-gray-500 bg-gray-100"; // Default color
//     }
//   };

//   // Function to format the date
//   const formatDate = (dateString) => {
//     const date = new Date(dateString);
//     return date.toLocaleDateString(); // You can customize the date format as needed
//   };

//   // Function to filter tasks based on selected employee
//   const handleEmployeeFilterChange = (event) => {
//     setEmployeeFilter(event.target.value);
//   };

//   // Function to filter tasks based on selected priority
//   const handlePriorityFilterChange = (event) => {
//     setPriorityFilter(event.target.value);
//   };

//   // Function to filter tasks based on selected status
//   const handleStatusFilterChange = (event) => {
//     setStatusFilter(event.target.value);
//   };

//   useEffect(() => {
//     // Apply filters to the tasks array
//     let filtered = tasks;

//     // Filter by employee
//     if (employeeFilter) {
//       filtered = filtered.filter((task) =>
//         task.taskAssignToName
//           .toLowerCase()
//           .includes(employeeFilter.toLowerCase())
//       );
//     }

//     // Filter by priority
//     if (priorityFilter) {
//       filtered = filtered.filter((task) =>
//         task.taskPriority.toLowerCase().includes(priorityFilter.toLowerCase())
//       );
//     }

//     // Filter by status
//     if (statusFilter) {
//       filtered = filtered.filter((task) =>
//         task.taskStatusName.toLowerCase().includes(statusFilter.toLowerCase())
//       );
//     }

//     setFilteredTasks(filtered); // Update filtered tasks based on all filters
//   }, [employeeFilter, priorityFilter, statusFilter, tasks]);

//   const deleteTask = async (taskId) => {
//     try {
//       const response = await TaskService.deleteTask(taskId);
//       if (response.status === 1) {
//         setTasks((prevTasks) =>
//           prevTasks.filter((task) => task.taskAllocationId !== taskId)
//         );
//         alert(response.message);
//       }
//     } catch (error) {
//       console.error("Error deleting task:", error);
//       alert("Failed to delete task");
//     }
//   };

//   // Get the list of unique employees (task takers) and priorities for the filter dropdowns
//   const uniqueEmployees = [
//     ...new Set(tasks.map((task) => task.taskAssignToName)),
//   ];
//   const uniquePriorities = [...new Set(tasks.map((task) => task.taskPriority))];
//   const uniqueStatuses = [...new Set(tasks.map((task) => task.taskStatusName))];

//   // Function to fetch sub-tasks by task allocation ID
//   const getSubTasksByTaskAllocationId = async (taskAllocationId) => {
//     try {
//       const response = await SubTaskService.getSubTasksByTaskAllocationId(
//         taskAllocationId
//       );
//       return response.data;
//     } catch (error) {
//       console.error("Failed to fetch sub-tasks:", error);
//       throw error;
//     }
//   };

//   const toggleRow = async (taskAllocationId) => {
//     const newExpandedRows = { ...expandedRows };
//     const isExpanded = newExpandedRows[taskAllocationId];

//     if (!isExpanded) {
//       // If the row is not expanded, fetch sub-tasks
//       try {
//         const subTaskData = await getSubTasksByTaskAllocationId(
//           taskAllocationId
//         ); // make sure this function returns a promise
//         if (subTaskData.length > 0) {
//           newExpandedRows[taskAllocationId] = true;
//         }
//         setSubTasks((prevSubTasks) => ({
//           ...prevSubTasks,
//           [taskAllocationId]: subTaskData,
//         }));
//         // setSubTasks(subTaskData.data)
//       } catch (error) {
//         console.error("Error fetching sub-tasks:", error);
//       }
//     } else {
//       // If the row is already expanded, collapse it
//       newExpandedRows[taskAllocationId] = false;
//     }

//     setExpandedRows(newExpandedRows);
//   };

//   // Handle the start date change
//   const handleStartDateChange = async (e, taskAllocationId) => {
//     const newStartingDate = e.target.value; // Get the new date value
//     setActualStartingDate(newStartingDate); // Set the date state
//     const taskData = {
//       actualStartingDate: newStartingDate,
//     };
//     try {
//       const response = await TaskService.updateTaskActualStartingDate(
//         taskAllocationId,
//         taskData
//       );
//       if (response.status === 1) {
//         alert(response.message);
//       }
//     } catch (error) {
//       console.error("Error updating ActualStaringDate:", error);
//     }
//   };

//   // Handle the end date change
//   const handleCompletionDateChange = async (e, taskAllocationId) => {
//     const newStartingDate = e.target.value; // Get the new date value
//     setTaskCompletionDate(newStartingDate); // Set the date state
//     const taskData = {
//       taskCompletionDate: newStartingDate,
//     };
//     try {
//       const response = await TaskService.updateTaskCompletionDate(
//         taskAllocationId,
//         taskData
//       );
//       if (response.status === 1) {
//         alert(response.message);
//       }
//     } catch (error) {
//       console.error("Error updating ActualStaringDate:", error);
//     }
//   };

//   // Handle the start date change
//   const handleSubStartDateChange = async (e, subTaskAllocationId) => {
//     const newStartingDate = e.target.value; // Get the new date value
//     setActualStartingDate(newStartingDate); // Set the date state
//     const taskData = {
//       actualStartingDate: newStartingDate,
//     };
//     try {
//       const response = await SubTaskService.updateSubTaskActualStartingDate(
//         subTaskAllocationId,
//         taskData
//       );
//       if (response.status === 1) {
//         alert(response.message);
//       }
//     } catch (error) {
//       console.error("Error updating ActualStaringDate:", error);
//     }
//   };

//   // Handle the end date change
//   const handleSubCompletionDateChange = async (e, subTaskAllocationId) => {
//     const newStartingDate = e.target.value; // Get the new date value
//     setTaskCompletionDate(newStartingDate); // Set the date state
//     const taskData = {
//       taskCompletionDate: newStartingDate,
//     };
//     try {
//       const response = await SubTaskService.updateSubTaskCompletionDate(
//         subTaskAllocationId,
//         taskData
//       );
//       if (response.status === 1) {
//         alert(response.message);
//       }
//     } catch (error) {
//       console.error("Error updating ActualStaringDate:", error);
//     }
//   };

//     // Function to handle opening the popup and setting the current task
//     const handleTransferTask = (task) => {
//       setAllocationId(task.taskAllocationId); // Set the selected task data
//       setIsPopupVisible(true); // Show the popup
//     };

//       // Function to handle form submission
//   const handleSubmit = async (event) => {
//     event.preventDefault();

//     const transferTaskData = {
//       allocationId,
//       taskTransferTo
//     }

//     console.log("Submitting task transfer data:", transferTaskData); // Log the data before submitting

//     try {

//       // Call the API to add the task note
//       const response = await TaskService.transferTask(transferTaskData);
//       console.log("Task transfer successfully:", response);
//       setIsPopupVisible(false); // Close the popup
//     }catch (error) {
//       console.error("Error transfer task note:", error.response?.data || error.message);
//       if (error.response?.data?.errors) {
//         console.log("Validation Errors:", error.response.data.errors);  // This will help pinpoint specific fields causing the issue
//       }
//     }

//   }

//   return (
//     <>
//       {/* Header Section */}
//       <div className="flex justify-between items-center my-3 ">
//         <h1 className="font-semibold text-2xl">Task List</h1>
//         <Link
//           to="/task/create-task"
//           className="bg-[#0296D6] hover:bg-[#0074BD] flex gap-2 text-center text-white font-medium py-2 px-4 rounded hover:no-underline"
//         >
//           Add Task
//           <FaPlus className="mt-[3px]" size={14} />
//         </Link>
//       </div>

//       {/* Filters Section */}
//       <div className="flex gap-4 my-4">
//         <input
//           type="text"
//           value={employeeFilter}
//           onChange={handleEmployeeFilterChange}
//           placeholder="Search Employee"
//           className="p-2 outline-none rounded border border-gray-300"
//         />
//         <select
//           value={priorityFilter}
//           onChange={handlePriorityFilterChange}
//           className="p-2 outline-none rounded border border-gray-300"
//         >
//           <option value="">All Priorities</option>
//           {uniquePriorities.map((priority) => (
//             <option key={priority} value={priority}>
//               {priority}
//             </option>
//           ))}
//         </select>
//         <select
//           value={statusFilter}
//           onChange={handleStatusFilterChange}
//           className="p-2 outline-none rounded border border-gray-300"
//         >
//           <option value="">All Statuses</option>
//           {uniqueStatuses.map((status) => (
//             <option key={status} value={status}>
//               {status}
//             </option>
//           ))}
//         </select>
//       </div>

//       {/* Task List Section */}
//       <div className="grid overflow-x-auto shadow-xl">
//         <table className="min-w-full bg-white border border-gray-200 ">
//           <thead className="bg-gray-900 border-b">
//             <tr>
//               {[
//                 "",
//                 "Task Name",
//                 "Assigned To",
//                 "Priority",
//                 "Starting Date",
//                 "Expected Completion Date",
//                 "Task Type",
//                 "Status",
//                 "Actions",
//               ].map((header) => (
//                 <th
//                   key={header}
//                   className="text-left py-3 px-4 uppercase font-semibold text-sm text-[#939393]"
//                 >
//                   {header}
//                 </th>
//               ))}
//             </tr>
//           </thead>
//           <tbody>
//             {filteredTasks.length === 0 ? (
//               <tr>
//                 <td colSpan="6" className="text-center py-3 px-4 text-gray-700">
//                   No tasks found.
//                 </td>
//               </tr>
//             ) : (
//               filteredTasks.map((item) => (
//                 <React.Fragment key={item.taskAllocationId}>
//                   <tr className="border-b relative hover:bg-gray-50">
//                     <td className="py-3 px-4 text-gray-700">
//                       <button
//                         onClick={() => {
//                           toggleRow(item.taskAllocationId);
//                         }}
//                         className="text-gray-500 hover:text-gray-700"
//                       >
//                         {
//                           subTasks[item.taskAllocationId] &&
//                           subTasks[item.taskAllocationId].length > 0 ? (
//                             expandedRows[item.taskAllocationId] ? (
//                               <FaArrowDown />
//                             ) : (
//                               <FaArrowRight />
//                             )
//                           ) : null // Only show arrows if subTask data exists
//                         }
//                       </button>
//                     </td>
//                     <td className="py-3 px-4 text-gray-700">{item.taskName}</td>
//                     <td className="py-3 px-4 text-gray-700">
//                       {item.taskAssignToName}
//                     </td>
//                     <td className="py-3 px-4 text-gray-700">
//                       {item.taskPriority}
//                     </td>
//                     <td className="py-3 px-4 text-gray-700">
//                       {formatDate(item.taskStartingDate)}
//                     </td>
//                     <td className="py-3 px-4 text-gray-700">
//                       {formatDate(item.taskExpectedCompletionDate)}
//                     </td>
//                     <td className="py-3 px-4 text-gray-700">{item.taskType}</td>
//                     <td className="py-3 px-4">
//                       <span
//                         className={`px-2 py-1 rounded-lg font-medium ${getStatusColor(
//                           item.taskStatusName
//                         )}`}
//                       >
//                         {item.taskStatusName}
//                       </span>
//                     </td>
//                     <td className="py-3 px-4">
//                       <div className="flex gap-2">
//                         <Link
//                           to={`/task/edit-task/${item.taskAllocationId}`}
//                           className="text-blue-500 hover:text-blue-700"
//                         >
//                           <FaEdit size={24} />
//                         </Link>

//                         <button
//                           className="text-red-500 hover:text-red-700"
//                           onClick={() => deleteTask(item.taskAllocationId)}
//                         >
//                           <FaTrash size={20} />
//                         </button>
//                         <Link
//                           to={`/task/tasknote-list/${item.taskAllocationId}`}
//                           className="text-yellow-500 hover:text-yellow-700"
//                         >
//                           <FaRegFileLines size={24} />
//                         </Link>
//                         <button
//                           onClick={(e) => {
//                             e.stopPropagation(); // Prevent the row toggle action
//                             toggleMenu(item.taskAllocationId);
//                             handleTransferTask(item)
//                           }}
//                           // onClick={toggleMenu}
//                           className="text-gray-500 hover:text-gray-700"
//                         >
//                           <FaEllipsisV size={24} />
//                         </button>
//                       </div>
//                       {activeMenu === item.taskAllocationId &&
//                         isPopupVisible && (
//                           // <div
//                           //   className="absolute bottom-4 right-2 mt-2 w-45 bg-white shadow-lg rounded-md z-10"
//                           //   onMouseLeave={closeMenu}
//                           // >
//                           //   <ul className="flex flex-col p-2">
//                           //     {/* <li className="flex items-center gap-2 p-2 hover:bg-gray-100">
//                           //       <Link to={`/task/edit-task/${item.taskAllocationId}`} className="text-blue-500 hover:text-blue-700">
//                           //         <FaEdit size={24} />
//                           //       </Link>
//                           //       <span className="ml-2">Edit</span>
//                           //     </li> */}
//                           //     <li className="flex flex-col items-center gap-2 p-2 bg-gray-200 hover:cursor-pointer">
//                           //       {/* <FaCalendarDay size={20} /> */}
//                           //       <div className="flex flex-col">
//                           //         <label className="text-base font-medium">
//                           //           Start Date
//                           //         </label>
//                           //         <input
//                           //           className="w-25 mt-2 rounded-md py-[8px] pl-3 pr-3 text-dark-6 outline-none"
//                           //           type="date"
//                           //           value={actualStartingDate}
//                           //           onChange={(e) =>handleStartDateChange(e,item.taskAllocationId)
//                           //           }
//                           //         />
//                           //       </div>
//                           //       <div className="flex flex-col">
//                           //         <label className="text-base font-medium">
//                           //           End Date
//                           //         </label>
//                           //         <input
//                           //           className="w-30 mt-2 rounded-md py-[8px] pl-3 pr-3 text-dark-6 outline-none"
//                           //           type="date"
//                           //           value={taskCompletionDate}
//                           //           onChange={(e) => handleCompletionDateChange(e,item.taskAllocationId)
//                           //           }
//                           //         />
//                           //       </div>
//                           //     </li>
//                           //     {/* <li className="flex items-center gap-2 p-2 hover:bg-gray-200 hover:cursor-pointer">
//                           //         <FaPlus size={20} />
//                           //         <span className="ml-2">Add Sub Task</span>
//                           //       </li>
//                           //       <li className="flex items-center gap-2 p-2 hover:bg-gray-100 hover:cursor-pointer">
//                           //         <FaRegFileAlt size={20} />
//                           //         <span className="ml-2">Add Notes</span>
//                           //       </li>
//                           //       <li className="flex items-center gap-2 p-2 hover:bg-gray-100 hover:cursor-pointer">
//                           //         <FaTrash size={20} />
//                           //         <span className="ml-2">Task Finish</span>
//                           //       </li>
//                           //       <li className="flex items-center gap-2 p-2 hover:bg-gray-100 hover:cursor-pointer">
//                           //         <IoSwapHorizontalOutline size={20} />
//                           //         <span className="ml-2">Task Transfer</span>
//                           //       </li> */}
//                           //   </ul>
//                           // </div>
//                           <div className="fixed inset-0 bg-gray-700 bg-opacity-50 flex justify-center items-center z-50">
//                             <div className="bg-white p-6 rounded-lg shadow-lg md:w-1/3 xl:w-1/3">
//                               <h2 className="text-xl font-semibold mb-4">
//                                 Task Updates
//                               </h2>
//                               <form>
//                                 <div className="mb-4">
//                                   <label className="block text-sm font-medium text-gray-700">
//                                     Task Start Date
//                                   </label>
//                                   <input
//                                     type="date"
//                                     value={actualStartingDate}
//                                     onChange={(e) =>
//                                       handleStartDateChange(
//                                         e,
//                                         item.taskAllocationId
//                                       )
//                                     }
//                                     className="w-full mt-1 px-3 py-2 border rounded-md border-active"
//                                   />
//                                 </div>
//                                 <div className="mb-4">
//                                   <label className="block text-sm font-medium text-gray-700">
//                                     Task End Date
//                                   </label>
//                                   <input
//                                     type="date"
//                                     value={taskCompletionDate}
//                                     onChange={(e) =>
//                                       handleCompletionDateChange(
//                                         e,
//                                         item.taskAllocationId
//                                       )
//                                     }
//                                     className="w-full mt-1 px-3 py-2 border rounded-md border-active"
//                                   />
//                                 </div>
//                                 <div className="mb-4">
//                                   <label className="block text-sm font-medium text-gray-700">
//                                     Select Department
//                                   </label>
//                                   <select
//                                     value={departmentId}
//                                     onChange={(e) =>
//                                       setDepartmentId(e.target.value)
//                                     }
//                                     className="w-full mt-1 px-3 py-2 rounded-md border border-active"
//                                   >
//                                     <option value="">
//                                       --Select Department--
//                                     </option>
//                                     {departments.map((department) => (
//                                       <option
//                                         key={department.departmentId}
//                                         value={department.departmentId}
//                                       >
//                                         {department.departmentName}
//                                       </option>
//                                     ))}
//                                   </select>
//                                 </div>
//                                 <div className="mb-4">
//                                   <label className="block text-sm font-medium text-gray-700">
//                                     Task Transfer to:
//                                   </label>
//                                   <select
//                                     value={taskTransferTo}
//                                     onChange={(e) =>
//                                       setTaskTransferTo(e.target.value)
//                                     }
//                                     className="w-full mt-1 px-3 py-2 rounded-md border border-active"
//                                   >
//                                     <option value="">
//                                       --Select Employee--
//                                     </option>
//                                     {employeeList.map((employee) => (
//                                       <option
//                                         key={employee.employeeId}
//                                         value={employee.employeeId}
//                                       >
//                                         {employee.firstName +
//                                           " " +
//                                           employee.lastName}
//                                       </option>
//                                     ))}
//                                   </select>
//                                 </div>
//                                 <div className="flex flex-col md:flex-row justify-end gap-4">
//                                   <button
//                                     type="button"
//                                     onClick={() => setIsPopupVisible(false)}
//                                     className="px-7 py-2 bg-gray-300 text-black rounded border-active"
//                                   >
//                                     Cancel
//                                   </button>
//                                   <button
//                                     onClick={handleSubmit}
//                                     className="px-4 py-2 bg-blue-500 text-white rounded border-active"
//                                   >
//                                     Submit
//                                   </button>
//                                 </div>
//                               </form>
//                             </div>
//                           </div>
//                         )}
//                     </td>
//                   </tr>

//                   {/* Expanded Sub-Task Row */}
//                   {expandedRows[item.taskAllocationId] &&
//                     subTasks[item.taskAllocationId] && (
//                       <tr className="relative">
//                         <td colSpan="12" className="py-3 px-4 bg-gray-100">
//                           <h3 className="font-semibold">Sub-Tasks:</h3>
//                           <table className="min-w-full mt-2 bg-white">
//                             <thead className="bg-white border-b">
//                               <tr>
//                                 <th className="py-2 px-4 text-left">
//                                   Sub-Task Name
//                                 </th>
//                                 <th className="py-2 px-4 text-left">
//                                   Assigned To
//                                 </th>
//                                 <th className="py-2 px-4 text-left">
//                                   Starting Date
//                                 </th>
//                                 <th className="py-2 px-4 text-left">
//                                   Expected Completion Date
//                                 </th>
//                                 <th className="py-2 px-4 text-left">
//                                   Task Type
//                                 </th>
//                                 <th className="py-2 px-4 text-left">Status</th>
//                                 <th className="py-2 px-4 text-left">
//                                   Priority
//                                 </th>
//                                 <th className="py-2 px-4 text-left">Action</th>
//                               </tr>
//                             </thead>
//                             <tbody>
//                               {subTasks[item.taskAllocationId].map(
//                                 (subTask) => (
//                                   <tr
//                                     className="relative"
//                                     key={subTask.subTaskAllocationId}
//                                   >
//                                     <td className="py-2 px-4">
//                                       {subTask.taskName}
//                                     </td>
//                                     <td className="py-2 px-4">
//                                       {subTask.taskAssignToName}
//                                     </td>
//                                     <td className="py-2 px-4">
//                                       {formatDate(subTask.taskStartingDate)}
//                                     </td>
//                                     <td className="py-2 px-4">
//                                       {formatDate(
//                                         subTask.taskExpectedCompletionDate
//                                       )}
//                                     </td>
//                                     <td className="py-2 px-4">
//                                       {subTask.taskType}
//                                     </td>
//                                     <td className="py-2 px-4">
//                                       <span
//                                         className={`px-2 py-1 rounded-lg font-medium ${getStatusColor(
//                                           subTask.taskStatusName
//                                         )}`}
//                                       >
//                                         {subTask.taskStatusName}
//                                       </span>
//                                     </td>
//                                     <td className="py-2 px-4">
//                                       {subTask.taskPriority}
//                                     </td>
//                                     <td className="py-3 px-4">
//                                       <div className="flex gap-2">
//                                         <Link
//                                           to={`/task/edit-subtask/${subTask.subTaskAllocationId}`}
//                                           className="text-blue-500 hover:text-blue-700"
//                                         >
//                                           <FaEdit size={24} />
//                                         </Link>
//                                         <button
//                                           className="text-red-500 hover:text-red-700"
//                                           onClick={() =>
//                                             deleteTask(subTask.taskAllocationId)
//                                           }
//                                         >
//                                           <FaTrash size={20} />
//                                         </button>
//                                         <Link
//                                           to={`/task/tasknote-list/:id${subTask.taskAllocationId}`}
//                                           className="text-yellow-500 hover:text-yellow-700"
//                                         >
//                                           <FaRegFileLines size={24} />
//                                         </Link>
//                                         <button
//                                           onClick={(e) => {
//                                             e.stopPropagation(); // Prevent the row toggle action
//                                             toggleSubMenu(
//                                               subTask.subTaskAllocationId
//                                             );
//                                           }}
//                                           // onClick={toggleMenu}
//                                           className="text-gray-500 hover:text-gray-700"
//                                         >
//                                           <FaEllipsisV size={24} />
//                                         </button>
//                                       </div>
//                                       {activeSubTaskMenu ===
//                                         subTask.subTaskAllocationId && (
//                                         <div
//                                           className="absolute bottom-4 right-2 mt-2 w-35 bg-white shadow-lg rounded-md z-10"
//                                           onMouseLeave={closeMenu}
//                                         >
//                                           <ul className="flex flex-col p-2">
//                                             <li className="flex flex-col items-center gap-2 p-2 bg-gray-200 hover:cursor-pointer">
//                                               {/* <FaCalendarDay size={20} /> */}
//                                               <div className="flex flex-col">
//                                                 <label className="text-base font-medium">
//                                                   Start Date
//                                                 </label>
//                                                 <input
//                                                   className="w-30 mt-2 rounded-md py-[8px] pl-3 pr-3 text-dark-6 outline-none"
//                                                   type="date"
//                                                   value={actualStartingDate}
//                                                   onChange={(e) =>
//                                                     handleSubStartDateChange(
//                                                       e,
//                                                       subTask.subTaskAllocationId
//                                                     )
//                                                   }
//                                                 />
//                                               </div>
//                                               <div className="flex flex-col">
//                                                 <label className="text-base font-medium">
//                                                   End Date
//                                                 </label>
//                                                 <input
//                                                   className="w-30 mt-2 rounded-md py-[8px] pl-3 pr-3 text-dark-6 outline-none"
//                                                   type="date"
//                                                   value={taskCompletionDate}
//                                                   onChange={(e) =>
//                                                     handleSubCompletionDateChange(
//                                                       e,
//                                                       subTask.subTaskAllocationId
//                                                     )
//                                                   }
//                                                 />
//                                               </div>
//                                             </li>
//                                             {/* <li className="flex items-center gap-2 p-2 hover:bg-gray-100">
//                                           <Link
//                                             to={`/task/edit-subtask/${subTask.subTaskAllocationId}`}
//                                             className="text-blue-500 hover:text-blue-700"
//                                           >
//                                             <FaEdit size={24} />
//                                           </Link>
//                                           <span className="ml-2">Edit</span>
//                                         </li>
//                                         <li className="flex items-center gap-2 p-2 hover:bg-gray-100">
//                                           <FaRegFileAlt size={20} />
//                                           <span className="ml-2">Notes</span>
//                                         </li> */}
//                                           </ul>
//                                         </div>
//                                       )}
//                                     </td>
//                                   </tr>
//                                 )
//                               )}
//                             </tbody>
//                           </table>
//                         </td>
//                       </tr>
//                     )}
//                 </React.Fragment>
//               ))
//             )}
//           </tbody>
//         </table>
//       </div>
//     </>
//   );
// };

// export default TaskList;

// import React, { useEffect, useState } from "react";
// import { FaEdit, FaEye, FaPlus, FaTrash } from "react-icons/fa";
// import { TaskService } from "../../service/TaskService"; // Make sure this is correctly imported
// import { Link } from "react-router-dom";

// const TaskList = () => {
//   const [tasks, setTasks] = useState([]);
//   const [filteredTasks, setFilteredTasks] = useState([]);
//   const [employeeFilter, setEmployeeFilter] = useState("all"); // State for employee filter

//   // Fetch tasks from the service
//   useEffect(() => {
//     const fetchTasks = async () => {
//       try {
//         const result = await TaskService.getTasks();
//         setTasks(result.data); // Set the 'data' array to the state
//         setFilteredTasks(result.data); // Initially show all tasks
//       } catch (error) {
//         console.error("Error fetching tasks:", error);
//         setTasks([]);
//         setFilteredTasks([]); // Fallback to an empty array in case of an error
//       }
//     };
//     fetchTasks();
//   }, []);

//   // Function to set the color based on the task status
//   const getStatusColor = (taskStatusName) => {
//     switch (taskStatusName) {
//       case "Pending":
//         return "bg-red-100 text-red-500"; // Red for Pending
//       case "Completed":
//         return "bg-green-100 text-green-500"; // Green for Completed
//       case "In Progress":
//         return "bg-yellow-100 text-yellow-500"; // Yellow for In Progress
//       default:
//         return "bg-gray-100 text-gray-500"; // Default color
//     }
//   };

//   // Function to format the date
//   const formatDate = (dateString) => {
//     const date = new Date(dateString);
//     return date.toLocaleDateString(); // You can customize the date format as needed
//   };

//   // Function to filter tasks based on selected employee
//   const handleFilterChange = (event) => {
//     const selectedEmployee = event.target.value;
//     setEmployeeFilter(selectedEmployee);

//     if (selectedEmployee === "all") {
//       setFilteredTasks(tasks); // If "all" is selected, show all tasks
//     } else {
//       const filtered = tasks.filter((task) => task.taskTaker === selectedEmployee);
//       setFilteredTasks(filtered); // Filter tasks based on employee
//     }
//   };

//   // Function to delete a task
//   const deleteTask = async (taskId) => {
//     try {
//       const response = await TaskService.deleteTask(taskId);
//       if (response.status === 1) {
//         setTasks((prevTasks) =>
//           prevTasks.filter((task) => task.taskAllocationId !== taskId)
//         );
//         setFilteredTasks((prevFilteredTasks) =>
//           prevFilteredTasks.filter((task) => task.taskAllocationId !== taskId)
//         );
//         alert(response.message);
//       }
//     } catch (error) {
//       console.error("Error deleting task:", error);
//       alert("Failed to delete task");
//     }
//   };

//   // Get the list of unique employees (task takers) for the filter dropdown
//   const uniqueEmployees = [...new Set(tasks.map((task) => task.taskTaker))];

//   return (
//     <div className="px-6">
//       <div className="flex justify-between items-center my-4">
//         <h1 className="font-semibold text-2xl text-gray-800">Task List</h1>

//         {/* Filter Dropdown */}
//         <div>
//           <label className="mr-2 text-gray-600">Filter by Employee:</label>
//           <select
//             value={employeeFilter}
//             onChange={handleFilterChange}
//             className="px-4 py-2 border rounded-lg text-gray-700"
//           >
//             <option value="all">All</option>
//             {uniqueEmployees.map((employee) => (
//               <option key={employee} value={employee}>
//                 {employee}
//               </option>
//             ))}
//           </select>
//         </div>

//         <Link
//           to="/task/create-task"
//           className="flex gap-2 items-center bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg shadow-md transition-all duration-300"
//         >
//           Add Task
//           <FaPlus className="mt-[2px]" size={14} />
//         </Link>
//       </div>

//       {/* Task Cards Grid */}
//       <div className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//         {filteredTasks.map((item) => (
//           <div
//             key={item.taskAllocationId}
//             className="bg-white border border-gray-200 rounded-lg shadow-xl p-6 hover:shadow-xl transition-all duration-300"
//           >
//             {/* Task Name */}
//             <h3 className="text-xl font-semibold text-blue-700">{item.taskName}</h3>

//             {/* Task Info */}
//             <div className="mt-3 text-gray-600">
//               <p>
//                 <strong>Assigned To:</strong> {item.taskTaker}
//               </p>
//               <p className="my-2">
//                 <strong>Priority:</strong> {item.taskPriority}
//               </p>
//               <p>
//                 <strong>Start Date:</strong> {formatDate(item.taskStartingDate)}
//               </p>
//               <p className="my-2">
//                 <strong>Completion Date:</strong> {formatDate(item.taskExpectedCompletionDate)}
//               </p>
//               <p>
//                 <strong>Type:</strong> {item.taskType}
//               </p>
//             </div>

//             {/* Task Status */}
//             <div
//               className={`mt-4 inline-block px-4 py-2 rounded-lg text-sm font-medium ${getStatusColor(item.taskStatusName)}`}
//             >
//               {item.taskStatusName}
//             </div>

//             {/* Actions: View, Edit, and Delete */}
//             <div className="flex gap-4 mt-4">
//               {/* View Button */}
//               <Link
//                 to={`/task/view-task/${item.taskAllocationId}`} // Link to the View Task page
//                 className="text-green-500 hover:text-green-700 transition duration-300"
//               >
//                 <FaEye size={22} />
//               </Link>

//               {/* Edit Button */}
//               <Link
//                 to={`/task/edit-task/${item.taskAllocationId}`} // Link to the Edit Task page
//                 className="text-blue-500 hover:text-blue-700 transition duration-300"
//               >
//                 <FaEdit size={22} />
//               </Link>

//               {/* Delete Button */}
//               <button
//                 className="text-red-500 hover:text-red-700 transition duration-300"
//                 onClick={() => deleteTask(item.taskAllocationId)}
//               >
//                 <FaTrash size={20} />
//               </button>
//             </div>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// };

// export default TaskList;
//#endregion
