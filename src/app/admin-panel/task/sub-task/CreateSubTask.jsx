import React, { useEffect, useState } from "react";
import { FaArrowLeft, FaTimes } from "react-icons/fa";
import { Link, useNavigate, useParams } from "react-router-dom";
import { EmployeeService } from "../../../service/EmployeeService";
import { DepartmentService } from "../../../service/DepartmentService";
import { SubTaskService } from "../../../service/SubTaskService";
import { toast } from "react-toastify";
import { motion } from "framer-motion"; // Import framer-motion


const CreateSubTask = () => {
  // const [subTaskAllocationId, setSubTaskAllocationId] = useState("");
  const [taskAllocationId, setTaskAllocationId] = useState("");
  const [taskName, setTaskName] = useState("");
  const [taskAssignTo, setTaskAssignTo] = useState("");
  const [taskPriority, setTaskPriority] = useState("");
  const [taskType, setTaskType] = useState("");
  const [taskStartingDate, setTaskStartingDate] = useState("");
  const [taskExpectedCompletionDate, setTaskExpectedCompletionDate] = useState("");
  const [taskCompletionDate, settaskCompletionDate] = useState("");
  const [taskDescription, setTaskDescription] = useState("");
  const [departments, setDepartments] = useState([]);
  const [departmentId, setDepartmentId] = useState("");
  const [employeeList, setEmployeeList] = useState([]);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [manualNotification, setManualNotification] = useState(false);
  const [notifications, setNotifications] = useState([{ reminderDateTime: ""}]);
  const navigate = useNavigate();
  const {id} = useParams();
  

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const departmentResult = await DepartmentService.getDepartments();
        setDepartments(departmentResult.data); // Set the 'data' array to the state\
        setTaskAllocationId(id);
        // console.log(departmentId)
        if(departmentId){
          //debugger
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
    if (!taskType) newErrors.taskType = "Task Type is required";
    if (!taskStartingDate) newErrors.taskStartingDate = "Task Starting Date is required";
    if (!taskExpectedCompletionDate) newErrors.taskExpectedCompletionDate = "Task ExpectedCompletion Date is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;
    setTaskAllocationId(id);
    const subTaskData = {
      taskAllocationId,
      departmentId,
      taskName,
      taskAssignTo,
      taskPriority,
      taskType,
      taskStartingDate,
      taskExpectedCompletionDate,
      taskDescription,
      taskCompletionDate: taskCompletionDate === "" ? null : taskCompletionDate, // Convert empty string to null
      manualNotification,
      taskReminderVM: manualNotification ? {
        reminderDateTimes: notifications.map(notification => ({
          reminderDateTime: notification.reminderDateTime, // Ensure it's a string (ISO8601 or other formats)
        }))
      } : {},
    };
    // console.log(subTaskData)

    setIsSubmitting(true);
    try {
      const response = await SubTaskService.addSubTask(subTaskData);
      if (response.status === 1) {
        navigate(-1); // Navigate back to previous page
        toast.success(response.message); // Toast on success
        setTaskName('');
        setTaskAssignTo('');
        setTaskPriority('');
        setTaskType('');
        setTaskStartingDate('');
        setTaskExpectedCompletionDate('');
        setTaskDescription('');
        setDepartmentId('');
        setNotifications([{ reminderDateTime: "" }]); // Clear notifications
        // navigate("/task/task-list");
      }
    } catch (error) {
      console.error("Error adding sub task:", error);
      toast.error("Failed to add sub task.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAddNotification = () => {
    setNotifications([...notifications, { reminderDateTime: "" }]);
  };

  // Handle change in notification input fields
  const handleNotificationChange = (index, field, value) => {
    const updatedNotifications = notifications.map((notification, i) => 
      i === index ? { ...notification, [field]: value } : notification
    );
    setNotifications(updatedNotifications);
  };

  // Handle removing a notification row
  const handleRemoveNotification = (index) => {
    const updatedNotifications = notifications.filter((_, i) => i !== index);
    setNotifications(updatedNotifications);
  };

  return (
    <>
      <div className="flex justify-between items-center my-3">
        <h1 className="font-semibold text-2xl">Add Sub Task</h1>
        <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
          <Link
            onClick={() => navigate(-1)} // Navigate back to previous page
            className="bg-gray-500 hover:bg-gray-400 text-white font-bold py-2 px-4 rounded flex items-center gap-2 hover:no-underline"
          >
            <FaArrowLeft size={16} />
            Back
          </Link>
        </motion.button>
      </div>

      <section className="bg-white rounded-lg shadow-lg m-1 py-8">
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
              <label className="block text-base font-medium">
                Select Department
              </label>
              <select
                value={departmentId}
                onChange={(e) => setDepartmentId(e.target.value)}
                className="w-full mb-2 rounded-md border py-[10px] px-4 border-active"
              >
                <option value="">--Select Department--</option>
                {departments.map((department) => (
                  <option
                    key={department.departmentId}
                    value={department.departmentId}
                  >
                    {department.departmentName}
                  </option>
                ))}
              </select>
              {errors.taskAssignTo && (
                <p className="text-red-500 text-xs">{errors.taskAssignTo}</p>
              )}
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
              {errors.taskType && (
                <p className="text-red-500 text-xs">{errors.taskType}</p>
              )}
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
              {errors.taskStartingDate && (
                <p className="text-red-500 text-xs">
                  {errors.taskStartingDate}
                </p>
              )}
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
              {errors.taskExpectedCompletionDate && (
                <p className="text-red-500 text-xs">
                  {errors.taskExpectedCompletionDate}
                </p>
              )}
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

            {/* Send Manual Notification */}
            <div className="w-full mb-4 px-3">
              <label className="block text-base font-medium">
                Send Manual Notification
              </label>
              <div className="flex items-center gap-4">
                <label>
                  <input
                    type="radio"
                    name="manualNotification"
                    value="true"
                    checked={manualNotification === true}
                    onChange={() => setManualNotification(true)}
                    className="me-1"
                  />
                  Yes
                </label>
                <label>
                  <input
                    type="radio"
                    name="manualNotification"
                    value="false"
                    checked={manualNotification === false}
                    onChange={() => setManualNotification(false)}
                    className="me-1"
                  />
                  No
                </label>
              </div>
            </div>

            {manualNotification && (
              <div className="w-full px-3">
                <button
                  type="button"
                  onClick={handleAddNotification}
                  className="text-blue-500 font-medium"
                >
                  + Add Manual Notification
                </button>

                {notifications.map((notification, index) => (
                  <div key={index} className="mt-4 flex flex-wrap gap-4">
                    <div className="w-full md:w-1/2 mb-2">
                      <label className="block text-base font-medium">
                        Notification DateTime
                      </label>
                      <div className="flex items-center gap-2">
                        <input
                          type="datetime-local"
                          value={notification.reminderDateTime}
                          onChange={(e) =>
                            handleNotificationChange(
                              index,
                              "reminderDateTime",
                              e.target.value
                            )
                          }
                          className="w-full mb-2 rounded-md border py-[10px] px-4 border-active"
                        />
                        <button
                          type="button"
                          onClick={() => handleRemoveNotification(index)}
                          className="text-red-500"
                        >
                          <FaTimes size={18} />
                        </button>
                      </div>
                    </div>
                    {/* <div className="w-full md:w-1/2 mb-2">
                      <label className="block text-base font-medium">Notification Message</label>
                      <input
                        type="text"
                        value={notification.message}
                        onChange={(e) => handleNotificationChange(index, "message", e.target.value)}
                        className="w-full mb-2 rounded-md border py-[10px] px-4 border-active"
                      />
                    </div> */}
                  </div>
                ))}
              </div>
            )}

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
                {isSubmitting ? "Submitting..." : "Add Sub Task"}
              </motion.button>
            </div>
          </div>
        </form>
      </section>
    </>
  );
};

export default CreateSubTask;
