//#region Imports
import React, { useEffect, useState } from "react";
import { FaArrowLeft, FaTimes } from "react-icons/fa";
import { Link, useNavigate, useParams } from "react-router-dom";
import { EmployeeService } from "../../service/EmployeeService";
import { TaskService } from "../../service/TaskService";
import { DepartmentService } from "../../service/DepartmentService";
import { toast } from "react-toastify";
import { motion } from "framer-motion"; // Import framer-motion
import { PartnerService } from "../../service/PartnerService";
import { ClientCompanyService } from "../../service/ClientCompanyService";
import { InquiryTaskService } from "../../service/InquiryTaskService";
import { VendorService } from "../../service/VendorService";
import AssignmentDropdown from './AssignmentDropdown'; // adjust path based on your file structure

//#endregion

//#region  Component: AddInquiryTask
const AddInquiryTask = () => {
  //#region State Initialization
  const [taskName, setTaskName] = useState("");
  const [partnerRegistrationId, setPartnerRegistrationId] = useState("");
  const [clientRegistrationId, setClientRegistrationId] = useState("");
  const [vendorId, setVendorId] = useState("");
  const [employeeId, setEmployeeId] = useState("");
  const [taskAssignTo, setTaskAssignTo] = useState("");
  const [taskDocument, setTaskDocument] = useState("");
  const [taskPriority, setTaskPriority] = useState("");
  const [taskType, setTaskType] = useState("");
  const [taskStartingDate, setTaskStartingDate] = useState("");
  const [taskExpectedCompletionDate, setTaskExpectedCompletionDate] = useState("");
  const [taskDescription, setTaskDescription] = useState("");
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
  //#endregion

  //#region Fetch Employees, Departments, Partner, Client, and Vendor  
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
        const activeDepartments = departmentResult.data.filter(department => department.isActive === true);
        setDepartmentList(activeDepartments);

        if (departmentId) {
          // Fetch Employee from department
          const employeeResult = await EmployeeService.getEmployeeByDepartment(departmentId);
          setEmployeeList(employeeResult.data);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
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
    // if (!taskAssignTo) newErrors.taskAssignTo = "Assign To is required";
    if (!taskType) newErrors.taskType = "Task Type is required";
    if (!taskStartingDate) newErrors.taskStartingDate = "Task Starting Date is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    if (!validateForm()) return;

    const inquiryTaskData = {
      inquiryRegistrationId: id,
      taskName,
      departmentId,
      taskAssignTo: selection === "employee" ? employeeId
        : selection === "partner" ? partnerRegistrationId
        : selection === "client" ? clientRegistrationId
        : selection === "vendor" ? vendorId
        : null,
      // taskAssignTo: (partnerRegistrationId === "" && clientRegistrationId === "" && vendorId === "" && employeeId !== "") ? employeeId : 
      // (partnerRegistrationId === "" && employeeId === "" && vendorId === "" && clientRegistrationId !== "") ? clientRegistrationId : 
      // (partnerRegistrationId === "" && employeeId === "" && clientRegistrationId === "" && vendorId !== "") ? vendorId : 
      // (clientRegistrationId === "" && employeeId === "" && vendorId === "" && partnerRegistrationId !== "") ? partnerRegistrationId : null,
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

    // console.log("inquiryTaskData:", inquiryTaskData);

    const inquiryTaskDataToSend = new FormData();
    Object.keys(inquiryTaskData).forEach(key => {
      if (key === 'taskReminderVM' && inquiryTaskData[key] && Object.keys(inquiryTaskData[key]).length > 0) {
        // const taskReminderVMString = JSON.stringify(inquiryTaskData[key]);
        const taskReminderVMString = JSON.stringify(inquiryTaskData[key] ?? {});
        inquiryTaskDataToSend.append("taskReminderJson", taskReminderVMString);
        // console.log(`Appended taskReminderJson: ${taskReminderVMString}`);
      } else {
        inquiryTaskDataToSend.append(key, inquiryTaskData[key]);
      }
    });

    if (taskDocument) {
      inquiryTaskDataToSend.append('taskDocument', taskDocument);
    }

    try {
      const response = await InquiryTaskService.addInquiryTask(inquiryTaskDataToSend);
      if (response.status === 1) {
        toast.success(response.message); // Toast on success
        navigate(-1);
      }
    } catch (error) {
      console.error("Error adding inquiry task:", error);
      toast.error("Failed to add inquiry task.");
    } finally {
      setIsSubmitting(false);
    }
  };
  //#endregion

  //#region File Handling
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setTaskDocument(file);  // Store the selected document
    }
  };
  //#endregion

  //#region Notification Management
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
  //#endregion

  //#region Render
  return (
    <>
      {/* Header Section */}
      <div className="flex justify-between items-center my-3">
        <h1 className="font-semibold text-2xl">Add Inquiry Task</h1>
        <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
          <Link
            onClick={() => navigate(-1)}
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

            {/* Radio buttons for Partner, Client Company, and Employee */}
            <div className="w-full mb-6 px-3">
              <label className="block text-base font-medium">Assign Task To:</label>
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
              {errors.taskName && <p className="text-red-500 text-xs">{errors.taskName}</p>}
            </div>

            {/* Conditional rendering based on radio button selection */}

            {/* Partner Select */}
            {selection === "partner" && (
              <AssignmentDropdown
                label="Partner"
                options={partnerList}
                value={partnerRegistrationId}
                onChange={setPartnerRegistrationId}
                // displayField="companyName"
                displayField={(opt) => opt.companyName}
                valueField="partnerRegistrationId"
              />
            )}

            {/* Client Company Select */}
            {selection === "client" && (
              <AssignmentDropdown
                label="Client Company"
                options={clientCompanyList}
                value={clientRegistrationId}
                onChange={setClientRegistrationId}
                // displayField="companyName"
                displayField={(opt) => opt.companyName}
                valueField="clientRegistrationId"
              />
            )}

            {/* Employee Select */}
            {selection === "employee" && (
              <>
                {/* Department Select */}
                <div className="w-full mb-2 px-3 md:w-1/3">
                  <label className="block text-base font-medium">Department</label>
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
                 <AssignmentDropdown
                   label="Employee"
                   options={employeeList}
                   value={employeeId}
                   onChange={setEmployeeId}
                   displayField={(opt) => `${opt.firstName} ${opt.lastName}`}
                   valueField="employeeId"
                 />
                {/* <div className="w-full mb-2 px-3 md:w-1/3">
                  <label className="block text-base font-medium">Employee</label>
                  <select
                    value={employeeId}
                    onChange={(e) => setEmployeeId(e.target.value)}
                    className="w-full mb-2 rounded-md border py-[10px] px-4 border-active"
                  >
                    <option value="">--Select Employee--</option>
                    {employeeList.map((employee) => (
                      <option key={employee.employeeId} value={employee.employeeId}>
                        {employee.firstName + ' ' + employee.lastName}
                      </option>
                    ))}
                  </select>
                  {errors.taskAssignTo && <p className="text-red-500 text-xs">{errors.taskAssignTo}</p>}
                </div> */}
              </>
            )}

            {/* Vendor Select */}
            {selection === "vendor" && (
              <AssignmentDropdown
                label="Vendor"
                options={vendorList}
                value={vendorId}
                onChange={setVendorId}
                displayField={(opt) => opt.companyName}
                valueField="vendorId"
              />
              // <div className="w-full mb-2 px-3 md:w-1/3">
              //   <label className="block text-base font-medium">Vendor</label>
              //   <div className="relative z-20">
              //     <select
              //       value={vendorId}
              //       onChange={(e) => setVendorId(e.target.value)}
              //       name="vendorId"
              //       className="relative z-20 w-full mb-2 appearance-none rounded-lg border border-stroke bg-transparent py-[10px] px-4 text-dark-6 border-active transition disabled:cursor-default disabled:bg-gray-2"
              //     >
              //       <option value="" className="text-gray-400">
              //         --Select Vendor--
              //       </option>
              //       {vendorList.length > 0 ? (
              //         vendorList.map((vendorItem) => (
              //           <option
              //             key={vendorItem.vendorId}
              //             value={vendorItem.vendorId}
              //           >
              //             {vendorItem.companyName}
              //           </option>
              //         ))
              //       ) : (
              //         <option value="" disabled>
              //           No Vendor available
              //         </option>
              //       )}
              //     </select>
              //   </div>
              // </div>
            )}

            {/* Task Type */}
            <div className="w-full mb-2 px-3 md:w-1/3">
              <label className="block text-base font-medium">Task Type</label>
              <select
                value={taskType}
                onChange={(e) => setTaskType(e.target.value)}
                className="w-full rounded-md border p-2 border-active"
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
            <div className="w-full mb-2 px-3 md:w-1/3">
              <label className="block text-base font-medium">Priority</label>
              <select
                value={taskPriority}
                onChange={(e) => setTaskPriority(e.target.value)}
                className="w-full mb-2 rounded-md border p-2 border-active"
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
            <div className="w-full mb-2 px-3 md:w-1/3">
              <label className="block text-base font-medium">Starting Date</label>
              <input
                type="date"
                value={taskStartingDate}
                onChange={(e) => setTaskStartingDate(e.target.value)}
                className="w-full mb-2 rounded-md border py-[9px] px-4 border-active"
              />
             {errors.taskStartingDate && <p className="text-red-500 text-xs">{errors.taskStartingDate}</p>}
            </div>

            {/* Expected Completion Date */}
            <div className="w-full mb-2 px-3 md:w-1/3">
              <label className="block text-base font-medium">Expected Completion Date</label>
              <input
                type="date"
                value={taskExpectedCompletionDate}
                onChange={(e) => setTaskExpectedCompletionDate(e.target.value)}
                className="w-full mb-2 rounded-md border py-[9px] px-4 border-active"
              />
              {errors.taskExpectedCompletionDate && <p className="text-red-500 text-xs">{errors.taskExpectedCompletionDate}</p>}
            </div>

            {/* Task Document */}
            <div className="w-full mb-2 px-3 md:w-1/3">
              <label className="block text-base font-medium">Task Document</label>
              <input
                type="file"
                onChange={handleFileChange}  // Handle file selection
                className="w-full mb-2 rounded-md border p-2 border-active"
              />
              {taskDocument && <p className="text-gray-500 text-xs">Selected: {taskDocument.name}</p>}
            </div>

            {/* Task Description */}
            <div className="w-full mb-2 px-3">
              <label className="block text-base font-medium">Task Description</label>
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
  //#endregion
};

export default AddInquiryTask;
//#endregion
