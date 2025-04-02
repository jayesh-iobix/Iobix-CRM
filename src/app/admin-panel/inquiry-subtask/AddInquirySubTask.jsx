import React, { useEffect, useState } from "react";
import { FaArrowLeft, FaTimes } from "react-icons/fa";
import { Link, useNavigate, useParams } from "react-router-dom";
import { DepartmentService } from "../../service/DepartmentService";
import { EmployeeService } from "../../service/EmployeeService";
import { SubTaskService } from "../../service/SubTaskService";
import { toast } from "react-toastify";
import { motion } from "framer-motion"; // Import framer-motion
import { InquirySubTaskService } from "../../service/InquirySubTaskService";
import { PartnerService } from "../../service/PartnerService";
import { ClientCompanyService } from "../../service/ClientCompanyService";
import { VendorService } from "../../service/VendorService";

const AddInquirySubTask = () => {
  // const [subTaskAllocationId, setSubTaskAllocationId] = useState("");
  const [inquiryTaskAllocationId, setInquiryTaskAllocationId] = useState("");
  const [partnerRegistrationId, setPartnerRegistrationId] = useState("");
  const [clientRegistrationId, setClientRegistrationId] = useState("");
  const [vendorId, setVendorId] = useState("");
  const [employeeId, setEmployeeId] = useState("");
  const [taskName, setTaskName] = useState("");
  const [taskAssignTo, setTaskAssignTo] = useState("");
  const [taskDocument, setTaskDocument] = useState("");
  const [taskPriority, setTaskPriority] = useState("");
  const [taskType, setTaskType] = useState("");
  const [taskStartingDate, setTaskStartingDate] = useState("");
  const [taskExpectedCompletionDate, setTaskExpectedCompletionDate] = useState("");
  const [taskCompletionDate, settaskCompletionDate] = useState("");
  const [taskDescription, setTaskDescription] = useState("");
  const [departments, setDepartments] = useState([]);
  const [departmentId, setDepartmentId] = useState("");
  const [employeeList, setEmployeeList] = useState([]);
  const [partnerList, setPartnerList] = useState([]);
  const [clientCompanyList, setClientCompanyList] = useState([]);
  const [vendorList, setVendorList] = useState([]);
  const [departmentList, setDepartmentList] = useState([]);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selection, setSelection] = useState("partner"); // Add this to track the radio button selection (partner, client, employee)
  const [manualNotification, setManualNotification] = useState(false);
  const [notifications, setNotifications] = useState([{ reminderDateTime: ""}]);
  const navigate = useNavigate();
  const {id} = useParams();
  

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const partnerResult = await PartnerService.getPartner();
        setPartnerList(partnerResult.data.filter(item => item.isActive));

        const clientCompanyResult = await ClientCompanyService.getClientCompany();
        setClientCompanyList(clientCompanyResult.data.filter(item => item.isActive));

        const vendorResult = await VendorService.getVendor();
        setVendorList(vendorResult.data.filter(item => item.isActive));

        const departmentResult = await DepartmentService.getDepartments();
        setDepartments(departmentResult.data); // Set the 'data' array to the state\
        setDepartmentList(departmentResult.data);
        setInquiryTaskAllocationId(id);
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
    // if (!taskAssignTo) newErrors.taskAssignTo = "Assign To is required";
    if (!taskType) newErrors.taskType = "Task Type is required";
    if (!taskStartingDate) newErrors.taskStartingDate = "Task Starting Date is required";
    if (!taskExpectedCompletionDate) newErrors.taskExpectedCompletionDate = "Task ExpectedCompletion Date is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;
    setInquiryTaskAllocationId(id);

    debugger;

    const inquirySubTaskData = {
      inquiryTaskAllocationId: id,
      taskName,
      departmentId,
      taskAssignTo: (partnerRegistrationId === "" && clientRegistrationId === "" && vendorId === "" && employeeId !== "") ? employeeId : 
      (partnerRegistrationId === "" && employeeId === "" && vendorId === "" && clientRegistrationId !== "") ? clientRegistrationId : 
      (partnerRegistrationId === "" && employeeId === "" && clientRegistrationId === "" && vendorId !== "") ? vendorId : 
      (clientRegistrationId === "" && employeeId === "" && vendorId === "" && partnerRegistrationId !== "") ? partnerRegistrationId : null,
      taskPriority,
      taskType,
      taskStartingDate,
      taskExpectedCompletionDate: taskExpectedCompletionDate || null,
      taskDescription,
      taskDocument,
      manualNotification,
      taskReminderVM: manualNotification ? {
        reminderDateTimes: notifications.map(notification => ({
          reminderDateTime: notification.reminderDateTime
        }))
      } : {}
    };

    const inquirySubTaskDataToSend = new FormData();
    Object.keys(inquirySubTaskData).forEach(key => {
      if (key === 'taskReminderVM' && inquirySubTaskData[key] && Object.keys(inquirySubTaskData[key]).length > 0) {
        inquirySubTaskDataToSend.append("taskReminderJson", JSON.stringify(inquirySubTaskData[key]));
      } else {
        inquirySubTaskDataToSend.append(key, inquirySubTaskData[key]);
      }
    });

    if (taskDocument) {
      inquirySubTaskDataToSend.append('taskDocument', taskDocument);
    }


    // const inquirySubTaskData = {
    //     // inquiryRegistrationId: id,
    //     InquiryTaskAllocationId: id,
    //     taskName,
    //     departmentId,
    //     taskAssignTo: (partnerRegistrationId === "" && clientRegistrationId === "" && vendorId === "" && employeeId !== "") ? employeeId : 
    //     (partnerRegistrationId === "" && employeeId === "" && vendorId === "" && clientRegistrationId !== "") ? clientRegistrationId : 
    //     (partnerRegistrationId === "" && employeeId === "" && clientRegistrationId === "" && vendorId !== "") ? vendorId : 
    //     (clientRegistrationId === "" && employeeId === "" && vendorId === "" && partnerRegistrationId !== "") ? partnerRegistrationId : null,
    //     taskPriority,
    //     taskType,
    //     taskStartingDate,
    //     taskExpectedCompletionDate: taskExpectedCompletionDate === "" ? null : taskExpectedCompletionDate,
    //     taskDescription,
    //     taskDocument, // Add the task document to the data
    //     manualNotification,
    //     taskReminderVM: manualNotification ? {
    //       reminderDateTimes: notifications.map(notification => ({
    //         reminderDateTime: notification.reminderDateTime, // Ensure it's a string (ISO8601 or other formats)
    //       }))
    //     } : {},
    //     // taskCompletionDate: taskCompletionDate === "" ? null : taskCompletionDate, // Convert empty string to null
    //   };
    // // console.log(subTaskData)

    // const inquirySubTaskDataToSend = new FormData();
    // Object.keys(inquirySubTaskData).forEach((key) => {
    //     inquirySubTaskDataToSend.append(key, inquirySubTaskData[key]);
    // });

    setIsSubmitting(true);
    try {
      const response = await InquirySubTaskService.addInquirySubTask(inquirySubTaskDataToSend);
      if (response.status === 1) {
        toast.success(response.message); // Toast on success
        navigate(-1);
        // navigate("/task/task-list");
      }
    } catch (error) {
      console.error("Error adding inquiry sub task:", error);
      toast.error("Failed to inquiry add sub task.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setTaskDocument(file);  // Store the selected document
    }
  };

   // Handle adding new notification row
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
        <h1 className="font-semibold text-2xl">Add Inquiry Sub Task</h1>
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
            {/* Radio buttons for Partner, Client Company, and Employee */}
            <div className="w-full mb-6 px-3">
              <label className="block text-base font-medium">
                Assign Task To:
              </label>
              <div className="flex gap-4">
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="assignTo"
                    value="partner"
                    checked={selection === "partner"}
                    onChange={() => setSelection("partner")}
                  />
                  <span className="ml-2">Partner</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="assignTo"
                    value="client"
                    checked={selection === "client"}
                    onChange={() => setSelection("client")}
                  />
                  <span className="ml-2">Client Company</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="assignTo"
                    value="employee"
                    checked={selection === "employee"}
                    onChange={() => setSelection("employee")}
                  />
                  <span className="ml-2">Employee</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="assignTo"
                    value="vendor"
                    checked={selection === "vendor"}
                    onChange={() => setSelection("vendor")}
                  />
                  <span className="ml-2">Vendor</span>
                </label>
              </div>
            </div>

            {/* Task Name */}
            <div className="w-full mb-2 px-3 md:w-1/3">
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

            {/* Conditional rendering based on radio button selection */}

            {/* Partner Select */}
            {selection === "partner" && (
              <div className="w-full mb-2 px-3 md:w-1/3">
                <label className="block text-base font-medium">Partner</label>
                <div className="relative z-20">
                  <select
                    value={partnerRegistrationId}
                    onChange={(e) => setPartnerRegistrationId(e.target.value)}
                    name="partnerRegistrationId"
                    className="relative z-20 w-full mb-2 appearance-none rounded-lg border border-stroke bg-transparent py-[10px] px-4 text-dark-6 border-active transition disabled:cursor-default disabled:bg-gray-2"
                  >
                    <option value="" className="text-gray-400">
                      --Select Partner--
                    </option>
                    {partnerList.length > 0 ? (
                      partnerList.map((partnerItem) => (
                        <option
                          key={partnerItem.partnerRegistrationId}
                          value={partnerItem.partnerRegistrationId}
                        >
                          {partnerItem.companyName}
                        </option>
                      ))
                    ) : (
                      <option value="" disabled>
                        No Partner available
                      </option>
                    )}
                  </select>
                </div>
              </div>
            )}

            {/* Client Company Select */}
            {selection === "client" && (
              <div className="w-full mb-2 px-3 md:w-1/3">
                <label className="block text-base font-medium">
                  Client Company
                </label>
                <div className="relative z-20">
                  <select
                    value={clientRegistrationId}
                    onChange={(e) => setClientRegistrationId(e.target.value)}
                    name="clientRegistrationId"
                    className="relative z-20 w-full mb-2 appearance-none rounded-lg border border-stroke bg-transparent py-[10px] px-4 text-dark-6 border-active transition disabled:cursor-default disabled:bg-gray-2"
                  >
                    <option value="" className="text-gray-400">
                      --Select Client Company--
                    </option>
                    {clientCompanyList.length > 0 ? (
                      clientCompanyList.map((clientItem) => (
                        <option
                          key={clientItem.clientRegistrationId}
                          value={clientItem.clientRegistrationId}
                        >
                          {clientItem.companyName}
                        </option>
                      ))
                    ) : (
                      <option value="" disabled>
                        No Client Company available
                      </option>
                    )}
                  </select>
                </div>
              </div>
            )}

            {/* Employee Select */}
            {selection === "employee" && (
              <>
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
                      className="relative z-20 w-full mb-2 appearance-none rounded-lg border border-stroke bg-transparent py-[10px] px-4 text-dark-6 border-active transition disabled:cursor-default disabled:bg-gray-2"
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
                </div>

                {/* Employee Select */}
                <div className="w-full mb-2 px-3 md:w-1/3">
                  <label className="block text-base font-medium">
                    Employee
                  </label>
                  <select
                    value={employeeId}
                    onChange={(e) => setEmployeeId(e.target.value)}
                    className="w-full mb-2 rounded-md border py-[10px] px-4 border-active"
                  >
                    <option value="">--Select Employee--</option>
                    {employeeList.map((employee) => (
                      <option
                        key={employee.employeeId}
                        value={employee.employeeId}
                      >
                        {employee.firstName + " " + employee.lastName}
                      </option>
                    ))}
                  </select>
                  {errors.taskAssignTo && (
                    <p className="text-red-500 text-xs">
                      {errors.taskAssignTo}
                    </p>
                  )}
                </div>
              </>
            )}

            {/* Vendor Select */}
            {selection === "vendor" && (
              <div className="w-full mb-2 px-3 md:w-1/3">
                <label className="block text-base font-medium">Vendor</label>
                <div className="relative z-20">
                  <select
                    value={vendorId}
                    onChange={(e) => setVendorId(e.target.value)}
                    name="vendorId"
                    className="relative z-20 w-full mb-2 appearance-none rounded-lg border border-stroke bg-transparent py-[10px] px-4 text-dark-6 border-active transition disabled:cursor-default disabled:bg-gray-2"
                  >
                    <option value="" className="text-gray-400">
                      --Select Vendor--
                    </option>
                    {vendorList.length > 0 ? (
                      vendorList.map((vendorItem) => (
                        <option
                          key={vendorItem.vendorId}
                          value={vendorItem.vendorId}
                        >
                          {vendorItem.companyName}
                        </option>
                      ))
                    ) : (
                      <option value="" disabled>
                        No Vendor available
                      </option>
                    )}
                  </select>
                </div>
              </div>
            )}

            {/* Task Type */}
            <div className="w-full mb-2 px-3 md:w-1/3">
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
            <div className="w-full mb-2 px-3 md:w-1/3">
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
            <div className="w-full mb-2 px-3 md:w-1/3">
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
            <div className="w-full mb-2 px-3 md:w-1/3">
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

            {/* Task Document */}
            <div className="w-full mb-2 px-3 md:w-1/3">
              <label className="block text-base font-medium">
                Task Document
              </label>
              <input
                type="file"
                onChange={handleFileChange} // Handle file selection
                className="w-full mb-2 rounded-md border py-[10px] px-4"
              />
              {taskDocument && (
                <p className="text-gray-500 text-xs">{taskDocument.name}</p>
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
              <label className="block text-base font-medium">Send Manual Notification</label>
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
                      <label className="block text-base font-medium">Notification DateTime</label>
                      <div className="flex items-center gap-2">
                        <input
                          type="datetime-local"
                          value={notification.reminderDateTime}
                          onChange={(e) => handleNotificationChange(index, "reminderDateTime", e.target.value)}
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
                {isSubmitting ? "Submitting..." : "Add Inquiry Task"}
              </motion.button>
            </div>
          </div>
        </form>
      </section>
    </>
  );
};

export default AddInquirySubTask;
