//#region Imports
import React, { useEffect, useState } from "react";
import { FaArrowLeft } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { DepartmentService } from "../../../service/DepartmentService";
import { EmployeeService } from "../../../service/EmployeeService";
import { TaskService } from "../../../service/TaskService";
import { toast } from "react-toastify";
import { motion } from "framer-motion"; // Import framer-motion
//#endregion

//#region Component: UserCreateTask
const UserCreateTask = () => {

  //#region State Variables
  const [taskName, setTaskName] = useState("");
  const [taskAssignTo, setTaskAssignTo] = useState("");
  const [taskPriority, setTaskPriority] = useState("");
  const [taskType, setTaskType] = useState("");
  const [taskStartingDate, setTaskStartingDate] = useState("");
  const [taskExpectedCompletionDate, setTaskExpectedCompletionDate] = useState("");
  const [taskCompletionDate, settaskCompletionDate] = useState("");
  const [taskDescription, setTaskDescription] = useState("");
  const [departmentId, setDepartmentId] = useState("");
  const [employeeList, setEmployeeList] = useState([]);
  const [departmentList, setDepartmentList] = useState([]);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  //#endregion

  //#region Fetch Department and Employee Data
  useEffect(() => {
    const fetchEmployees = async () => {
      try {

        const departmentResult = await DepartmentService.getDepartments();
        const activeDepartments = departmentResult.data.filter(department => department.isActive === true);
        setDepartmentList(activeDepartments);

        if(departmentId)
          {
               // Fetch Employee from department
               const employeeResult = await EmployeeService.getEmployeeByDepartment(departmentId);
               setEmployeeList(employeeResult.data);
          }

      } catch (error) {
        console.error("Error fetching employee list:", error);
      }
    };

    fetchEmployees();
  }, [departmentId]);
  //#endregion

  //#region Form Validation & Form Submission
  const validateForm = () => {
    const newErrors = {};
    if (!taskName) newErrors.taskName = "Task name is required";
    if (!taskPriority) newErrors.taskPriority = "Priority is required";
    if (!taskAssignTo) newErrors.taskAssignTo = "Assign To is required";
    if (!taskType) newErrors.taskType = "Task Type is required";
    if (!taskStartingDate) newErrors.taskStartingDate = "Task Starting Date is required";
    // if (!taskExpectedCompletionDate) newErrors.taskExpectedCompletionDate = "Task ExpectedCompletion Date is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    const taskData = {
      taskName,
      taskAssignTo,
      taskPriority,
      taskType,
      taskStartingDate,
      taskExpectedCompletionDate,
      taskDescription,
      departmentId,
      taskCompletionDate: taskCompletionDate === "" ? null : taskCompletionDate, // Convert empty string to null
    };

    setIsSubmitting(true);
    try {
      const response = await TaskService.addTask(taskData);
      if (response.status === 1) {
        toast.success(response.message); // Toast on success
        navigate("/user/task-list");
      }
    } catch (error) {
      console.error("Error adding task:", error);
      toast.error("Failed to add task.");
    } finally {
      setIsSubmitting(false);
    }
  };
  //#endregion

  //#region Render
  return (
    <>
      {/* Header Section */}
      <div className="flex justify-between items-center my-3">
        <h1 className="font-semibold text-2xl">Add Task</h1>
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
        <Link
          onClick={() => navigate(-1)} // Navigate back to previous page
          className="bg-gray-500 hover:bg-gray-400 text-white font-bold py-2 px-4 rounded flex items-center gap-2 hover:no-underline"
        >
          <FaArrowLeft size={16} />
          Back
        </Link>
        </motion.button>
      </div>

      {/* Form Section */}
      <section className="bg-white rounded-lg shadow-lg m-1 py-8">
        <form onSubmit={handleSubmit} className="container">
          <div className="-mx-4 px-10 mt- flex flex-wrap">
            {/* Task Name */}
            <div className="w-full mb-2 px-3 md:w-1/3">
              <label className="block text-base font-medium">Task Name</label>
              <input
                name="taskName"
                type="text"
                placeholder="Task Name"
                value={taskName}
                onChange={(e) => setTaskName(e.target.value)}
                className="w-full mb-2 bg-transparent rounded-md border py-[10px] px-4 text-dark outline-none"
              />
              {errors.taskName && <p className="text-red-500 text-xs">{errors.taskName}</p>}
            </div>

             {/* Department Select */}
             <div className="w-full mb-2 px-3 md:w-1/3">
              <label className="block text-base font-medium">
                Department
              </label>
              <div className="relative z-20">
                <select
                  value={departmentId}
                  onChange={(e) => setDepartmentId(e.target.value)}
                  name="departmentId"
                  className="relative z-20 w-full mb-2 appearance-none rounded-lg border border-stroke bg-transparent py-[10px] px-4 text-dark-6 outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-gray-2"
                >
                  <option value="" className="text-gray-400">
                    --Select Department--
                  </option>
                  {departmentList.length > 0 ? (
                    departmentList.map((departmentItem) => (
                      <option
                        key={departmentItem.departmentId}
                        value={departmentItem.departmentId}
                      >
                        {departmentItem.departmentName}
                      </option>
                    ))
                  ) : (
                    <option value="" disabled>
                      No Department available
                    </option>
                  )}
                </select>
              </div>
              {errors.department && (
                <p className="text-red-500 text-xs">{errors.department}</p>
              )}
            </div>

            {/* Assign To */}
            <div className="w-full mb-2 px-3 md:w-1/3">
              <label className="block text-base font-medium">Assign To</label>
              <select
                value={taskAssignTo}
                onChange={(e) => setTaskAssignTo(e.target.value)}
                className="w-full mb-2 rounded-md border py-[10px] px-4"
              >
                <option value="">--Select Employee--</option>
                {employeeList.map((employee) => (
                  <option key={employee.employeeId} value={employee.employeeId}>
                    {employee.firstName + ' ' + employee.lastName }
                  </option>
                ))}
              </select>
              {errors.taskAssignTo && <p className="text-red-500 text-xs">{errors.taskAssignTo}</p>}
            </div>

            {/* Task Type */}
            <div className="w-full mb-2 px-3 md:w-1/2">
              <label className="block text-base font-medium">Task Type</label>
              <select
                value={taskType}
                onChange={(e) => setTaskType(e.target.value)}
                className="w-full mb-2 rounded-md border py-[10px] px-4"
              >
                <option value="" className="text-gray-400">
                  --Select Task Type--
                </option>
                <option value="Temporary">Temporary</option>
                <option value="Recurring">Recurring</option>
              </select>
              {errors.taskType && <p className="text-red-500 text-xs">{errors.taskType}</p>}
            </div>

            {/* Priority */}
            <div className="w-full mb-2 px-3 md:w-1/2">
              <label className="block text-base font-medium">Priority</label>
              <select
                value={taskPriority}
                onChange={(e) => setTaskPriority(e.target.value)}
                className="w-full mb-2 rounded-md border py-[10px] px-4"
              >
                <option value="" className="text-gray-400">
                  --Select Task Priority--
                </option>
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
              </select>
              {errors.taskPriority && <p className="text-red-500 text-xs">{errors.taskPriority}</p>}
            </div>

            {/* Starting Date */}
            <div className="w-full mb-2 px-3 md:w-1/2">
              <label className="block text-base font-medium">Starting Date</label>
              <input
                type="date"
                value={taskStartingDate}
                onChange={(e) => setTaskStartingDate(e.target.value)}
                className="w-full mb-2 rounded-md border py-[10px] px-4"
              />
             {errors.taskStartingDate && <p className="text-red-500 text-xs">{errors.taskStartingDate}</p>}
            </div>

            {/* Expected Completion Date */}
            <div className="w-full mb-2 px-3 md:w-1/2">
              <label className="block text-base font-medium">Expected Completion Date</label>
              <input
                type="date"
                value={taskExpectedCompletionDate}
                onChange={(e) => setTaskExpectedCompletionDate(e.target.value)}
                className="w-full mb-2 rounded-md border py-[10px] px-4"
              />
              {errors.taskExpectedCompletionDate && <p className="text-red-500 text-xs">{errors.taskExpectedCompletionDate}</p>}
            </div>

            {/* Task Description */}
            <div className="w-full mb-2 px-3">
              <label className="block text-base font-medium">Task Description</label>
              <textarea
                value={taskDescription}
                onChange={(e) => setTaskDescription(e.target.value)}
                rows="3"
                className="w-full mb-2 rounded-md border py-[10px] px-4"
              ></textarea>
            </div>

            <div className="w-full px-3">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              type="submit"
                className={`px-5 py-3 bg-blue-600 text-white font-medium rounded-md hover:bg-[#2564ebdb] active:border-[#a8adf4] outline-none active:border-2 focus:ring-2 ring-blue-300 ${
                  isSubmitting ? "opacity-50 cursor-not-allowed" : ""
                }`}
                disabled={isSubmitting}
            >
                {isSubmitting ? "Submitting..." : "Add Task"}
            </motion.button>
            </div>
          </div>
        </form>
      </section>
    </>
  );
  //#endregion
};

export default UserCreateTask;
//#endregion