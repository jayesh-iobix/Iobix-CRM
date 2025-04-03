import React, { useEffect, useState } from "react";
import { FaArrowLeft } from "react-icons/fa";
import { Link, useNavigate, useParams } from "react-router-dom";
import { FaPlus } from "react-icons/fa";
import { toast } from "react-toastify";
import { TaskService } from "../../../service/TaskService";
import { DepartmentService } from "../../../service/DepartmentService";
import { EmployeeService } from "../../../service/EmployeeService";
import { motion } from "framer-motion"; // Import framer-motion


const EditAssignTask = () => {
  const [taskName, setTaskName] = useState("");
  const [taskAssignTo, setTaskAssignTo] = useState("");
  const [taskPriority, setTaskPriority] = useState("");
  const [taskStatus, setTaskStatus] = useState("");
  const [taskType, setTaskType] = useState("");
  const [departmentId, setDepartmentId] = useState("");
  const [departments, setDepartments] = useState([]);
  const [taskStartingDate, setTaskStartingDate] = useState("");
  const [taskExpectedCompletionDate, setTaskExpectedCompletionDate] = useState("");
  const [taskDescription, setTaskDescription] = useState("");
  const [employeeList, setEmployeeList] = useState([]);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  const { id } = useParams(); // Get task ID from URL

  useEffect(() => {

    const fetchTask = async () => {
      try {
        const taskResult = await TaskService.getTaskById(id); // Assuming TaskService has a method to fetch a single task by ID
        // const task = taskResult.data;
        const task = {
          ...taskResult.data,
          taskStartingDate: taskResult.data.taskStartingDate
            ? taskResult.data.taskStartingDate.split("T")[0]
            : "",
          taskExpectedCompletionDate: taskResult.data.taskExpectedCompletionDate
            ? taskResult.data.taskExpectedCompletionDate.split("T")[0]
            : "",
        };
        //console.log(task);
        setTaskName(task.taskName);
        setTaskAssignTo(task.taskAssignTo);
        setTaskPriority(task.taskPriority);
        // setTaskStatusName(task.taskStatusName);
        setTaskStatus(task.taskStatus);
        setTaskType(task.taskType);
        setDepartmentId(task.departmentId);
        setTaskStartingDate(task.taskStartingDate);
        setTaskExpectedCompletionDate(task.taskExpectedCompletionDate);
        setTaskDescription(task.taskDescription);
      } catch (error) {
        console.error("Error fetching task:", error);
        alert("Failed to fetch task details.");
      }
    };

    fetchTask(); // Fetch the task details when the component mounts
  }, [id]);

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const departmentResult = await DepartmentService.getDepartments();
        setDepartments(departmentResult.data); // Set the 'data' array to the state\

        if(departmentId){
          const employeeResult = await EmployeeService.getEmployeeByDepartment(departmentId);
          setEmployeeList(employeeResult.data);
        }
      } catch (error) {
        console.error("Error fetching employee list:", error);
      }
    };
    
    fetchEmployees();
  }, [departmentId]);

  const validateForm = () => {
    const newErrors = {};
    if (!taskName) newErrors.taskName = "Task name is required";
    if (!taskPriority) newErrors.taskPriority = "Priority is required";
    if (!taskAssignTo) newErrors.taskAssignTo = "Assign To is required";
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
      taskStatus,
      taskType,
      departmentId,
      taskStartingDate,
      taskExpectedCompletionDate,
      taskDescription,
    };

    setIsSubmitting(true);
    try {
      const response = await TaskService.updateTask(id, taskData);
      if (response.status === 1) {
        toast.success(response.message); // Toast on success
        navigate("/user/assign-task-list");
      }
    } catch (error) {
      //console.error("Error updating task:", error);
      if (error.response) {
        //console.error("Error Response:", error.response);
        alert(
          `Failed to update task. Error: ${
            error.response.data.message || error.message
          }`
        );
      } else {
        toast.error("Failed to update task due to network error.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <div className="flex justify-between items-center my-3">
        <h1 className="font-semibold text-2xl">Edit Task</h1>
        <div className="flex">
          {/* <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <Link
            to={`/user/task/create-subtask/${id}`}
            className="bg-blue-600 hover:bg-blue-700 text-white flex gap-2 mx-2 py-2 px-4 rounded hover:no-underline"
          >
            Add Sub Task <span className="mt-[2px]"> <FaPlus size={14} /></span>
          </Link>
          </motion.button> */}

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
      </div>

      <section className="bg-white rounded-lg shadow-lg m-1 py-8 mb-10">
        <form onSubmit={handleSubmit} className="container">
          <div className="-mx-4 px-10 mt- flex flex-wrap">
            {/* Task Name */}
            <div className="w-full mb-2 px-3 md:w-1/2">
              <label className="block text-base font-medium">Task Name</label>
              <input
                name="taskName"
                type="text"
                placeholder="Task Name"
                value={taskName}
                onChange={(e) => setTaskName(e.target.value)}
                className="w-full mb-2 bg-transparent rounded-md border py-[10px] px-4 text-dark border-active"
                autoFocus
              />
              {errors.taskName && (
                <p className="text-red-500 text-xs">{errors.taskName}</p>
              )}
            </div>

            {/* Select Department */}
            <div className="w-full mb-2 px-3 md:w-1/2">
              <label className="block text-base font-medium">Select Department</label>
              <select
                value={departmentId}
                onChange={(e) => setDepartmentId(e.target.value)}
                className="w-full mb-2 rounded-md border py-[10px] px-4 border-active"
              >
                <option value="">--Select Department--</option>
                {departments.map((department) => (
                  <option key={department.departmentId} value={department.departmentId}>
                    {department.departmentName}
                  </option>
                ))}
              </select>
              {errors.taskAssignTo && <p className="text-red-500 text-xs">{errors.taskAssignTo}</p>}
            </div>

            {/* Assign To */}
            <div className="w-full mb-2 px-3 md:w-1/2">
              <label className="block text-base font-medium">Assign To</label>
              <select
                value={taskAssignTo}
                onChange={(e) => setTaskAssignTo(e.target.value)}
                className="w-full mb-2 rounded-md border py-[10px] px-4 border-active"
              >
                <option value="">--Select Employee--</option>
                {employeeList.map((employee) => (
                  <option key={employee.employeeId} value={employee.employeeId}>
                    {employee.firstName + " " + employee.lastName}
                  </option>
                ))}
              </select>
              {errors.taskAssignTo && (
                <p className="text-red-500 text-xs">{errors.taskAssignTo}</p>
              )}
            </div>

            {/* Task Type */}
            <div className="w-full mb-2 px-3 md:w-1/2">
              <label className="block text-base font-medium">Task Type</label>
              <select
                value={taskType}
                onChange={(e) => setTaskType(e.target.value)}
                className="w-full mb-2 rounded-md border py-[10px] px-4 border-active"
              >
                <option value="" className="text-gray-400">
                  --Select Task Type--
                </option>
                <option value="Temporary">Temporary</option>
                <option value="Recurring">Recurring</option>
              </select>
            </div>

            {/* Priority */}
            <div className="w-full mb-2 px-3 md:w-1/2">
              <label className="block text-base font-medium">Priority</label>
              <select
                value={taskPriority}
                onChange={(e) => setTaskPriority(e.target.value)}
                className="w-full mb-2 rounded-md border py-[10px] px-4 border-active"
              >
                <option value="" className="text-gray-400">
                  --Select Task Priority--
                </option>
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
              </select>
              {errors.taskPriority && (
                <p className="text-red-500 text-xs">{errors.taskPriority}</p>
              )}
            </div>

            {/* Starting Date */}
            <div className="w-full mb-2 px-3 md:w-1/2">
              <label className="block text-base font-medium">
                Starting Date
              </label>
              <input
                type="date"
                value={taskStartingDate}
                onChange={(e) => setTaskStartingDate(e.target.value)}
                className="w-full mb-2 rounded-md border py-[10px] px-4 border-active"
              />
            </div>

            {/* Expected Completion Date */}
            <div className="w-full mb-2 px-3 md:w-1/2">
              <label className="block text-base font-medium">
                Expected Completion Date
              </label>
              <input
                type="date"
                value={taskExpectedCompletionDate}
                onChange={(e) => setTaskExpectedCompletionDate(e.target.value)}
                className="w-full mb-2 rounded-md border py-[10px] px-4 border-active"
              />
            </div>

            {/* Status */}
              <div className="w-full mb-2 px-3 md:w-1/2">
              <label className="block text-base font-medium">Status</label>
              <select
                value={taskStatus}
                onChange={(e) => setTaskStatus(e.target.value)}
                className="w-full mb-2 rounded-md border py-[10px] px-4 border-active"
              >
                <option value="" className="text-gray-400">
                  --Select Task Status--
                </option>
                <option value="0">Pending</option>
                <option value="1">InProgress</option>
                <option value="2">Completed</option>
              </select>
            </div>

            {/* Task Description */}
            <div className="w-full mb-2 px-3">
              <label className="block text-base font-medium">
                Task Description
              </label>
              <textarea
                value={taskDescription}
                onChange={(e) => setTaskDescription(e.target.value)}
                rows="3"
                className="w-full mb-2 rounded-md border py-[10px] px-4 border-active"
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
                {isSubmitting ? "Submitting..." : "Update Task"}
              </motion.button>
            </div>
          </div>
        </form>
      </section>
    </>
  );
};

export default EditAssignTask;
