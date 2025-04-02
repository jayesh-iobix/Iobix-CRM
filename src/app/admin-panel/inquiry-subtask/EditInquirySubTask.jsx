import React, { useEffect, useState } from "react";
import { FaArrowLeft } from "react-icons/fa";
import { Link, useNavigate, useParams } from "react-router-dom";
import { EmployeeService } from "../../service/EmployeeService";
import { TaskService } from "../../service/TaskService";
import { DepartmentService } from "../../service/DepartmentService";
import { toast } from "react-toastify";
import { motion } from "framer-motion"; // Import framer-motion
import { PartnerService } from "../../service/PartnerService";
import { ClientCompanyService } from "../../service/ClientCompanyService";
import { InquiryTaskService } from "../../service/InquiryTaskService";
import { InquirySubTaskService } from "../../service/InquirySubTaskService";
import { VendorService } from "../../service/VendorService";

const EditInquirySubTask = () => {
  const [taskName, setTaskName] = useState("");
  const [partnerRegistrationId, setPartnerRegistrationId] = useState("");
  const [clientRegistrationId, setClientRegistrationId] = useState("");
  const [employeeId, setEmployeeId] = useState("");
  const [vendorId, setVendorId] = useState("");
  const [inquiryRegistrationId, setInquiryRegistrationId] = useState("");
  const [inquiryTaskAllocationId, setInquiryTaskAllocationId] = useState("");
  const [taskAssignTo, setTaskAssignTo] = useState("");
  const [taskAssignBy, setTaskAssignBy] = useState("");
  const [taskDocument, setTaskDocument] = useState(null);
  const [taskPriority, setTaskPriority] = useState("");
  const [taskType, setTaskType] = useState("");
  const [taskStartingDate, setTaskStartingDate] = useState("");
  const [taskExpectedCompletionDate, setTaskExpectedCompletionDate] = useState("");
  const [taskCompletionDate, setTaskCompletionDate] = useState("");
  const [taskDescription, setTaskDescription] = useState("");
  const [departmentId, setDepartmentId] = useState("");
  const [employeeList, setEmployeeList] = useState([]);
  const [partnerList, setPartnerList] = useState([]);
  const [vendorList, setVendorList] = useState([]);
  const [clientCompanyList, setClientCompanyList] = useState([]);
  const [departmentList, setDepartmentList] = useState([]);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selection, setSelection] = useState("partner"); // Add this to track the radio button selection (partner, client, employee)
  const navigate = useNavigate();

  const { id } = useParams(); // Get the task ID from the URL parameters

  useEffect(() => {
    const fetchTaskData = async () => {
      try {
        const taskResponse = await InquirySubTaskService.getInquirySubTasksById(id);
        const taskData = taskResponse.data;
        console.log(taskData)

        setInquiryTaskAllocationId(taskData.inquiryTaskAllocationId);
        setInquiryRegistrationId(taskData.inquiryRegistrationId);
        setTaskName(taskData.taskName);
        setPartnerRegistrationId(taskData.partnerRegistrationId || "");
        setClientRegistrationId(taskData.clientRegistrationId || "");
        setEmployeeId(taskData.employeeId || "");
        setTaskAssignTo(taskData.taskAssignTo);
        setTaskAssignBy(taskData.taskAssignBy);
        setTaskPriority(taskData.taskPriority);
        setTaskType(taskData.taskType);
        setTaskStartingDate(taskData.taskStartingDate.slice(0, 10)); // Format as YYYY-MM-DD
        setTaskExpectedCompletionDate(taskData.taskExpectedCompletionDate?.slice(0, 10) || ""); // Format as YYYY-MM-DD
        setTaskCompletionDate(taskData.taskCompletionDate?.slice(0, 10) || "");
        // setTaskCompletionDate(taskData.taskCompletionDate || "");
        setTaskDescription(taskData.taskDescription);
        setDepartmentId(taskData.departmentId !== null ? taskData.departmentId : "");


         // Set the selection based on the taskAssignTo value
         if (taskData.taskAssignTo && taskData.taskFilter === "Partner") {
           setSelection("partner");
           setPartnerRegistrationId(taskData.taskAssignTo);
         } else if (taskData.taskAssignTo && taskData.taskFilter === "Client") {
           setSelection("client");
           setClientRegistrationId(taskData.taskAssignTo);
         } else if (taskData.taskAssignTo && taskData.taskFilter === "Employee") {
           setSelection("employee");
           setEmployeeId(taskData.taskAssignTo);
         }

        // Fetch partner, client, and department data
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

    fetchTaskData();
  }, [id, departmentId]); // Fetch data when task ID or department ID changes

  const validateForm = () => {
    const newErrors = {};
    if (!taskName) newErrors.taskName = "Task name is required";
    if (!taskPriority) newErrors.taskPriority = "Priority is required";
    if (!taskType) newErrors.taskType = "Task Type is required";
    if (!taskStartingDate) newErrors.taskStartingDate = "Task Starting Date is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    if (!validateForm()) return;

    // debugger;
    const inquiryTaskData = {
      inquiryTaskAllocationId,
      inquiryRegistrationId,
      taskName,
      departmentId,
      taskAssignTo: (partnerRegistrationId === "" && clientRegistrationId === "" && vendorId === "" && employeeId !== "") ? employeeId : 
      (partnerRegistrationId === "" && employeeId === "" && vendorId === "" && clientRegistrationId !== "") ? clientRegistrationId : 
      (partnerRegistrationId === "" && employeeId === "" && clientRegistrationId === "" && vendorId !== "") ? vendorId : 
      (clientRegistrationId === "" && employeeId === "" && vendorId === "" && partnerRegistrationId !== "") ? partnerRegistrationId : null,
      taskAssignBy,
      taskPriority,
      taskType,
      taskStartingDate,
      taskExpectedCompletionDate: taskExpectedCompletionDate || null,
      taskDescription,
      taskDocument,
    };

    const inquiryTaskDataToSend = new FormData();
    Object.keys(inquiryTaskData).forEach((key) => {
      inquiryTaskDataToSend.append(key, inquiryTaskData[key]);
    });

    try {
      const response = await InquirySubTaskService.updateSubTask(id, inquiryTaskDataToSend);
      if (response.status === 1) {
        toast.success(response.message);
        navigate(-1); // Navigate back
      }
    } catch (error) {
      console.error("Error updating inquiry task:", error);
      toast.error("Failed to update inquiry task.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setTaskDocument(file); // Store the selected document
    }
  };

  return (
    <>
      <div className="flex justify-between items-center my-3">
        <h1 className="font-semibold text-2xl">Edit Inquiry Sub Task</h1>
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
              />
              {errors.taskName && <p className="text-red-500 text-xs">{errors.taskName}</p>}
            </div>

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
                <label className="block text-base font-medium">Client Company</label>
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
                <div className="w-full mb-2 px-3 md:w-1/3">
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
              {errors.taskType && <p className="text-red-500 text-xs">{errors.taskType}</p>}
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
              {errors.taskPriority && <p className="text-red-500 text-xs">{errors.taskPriority}</p>}
            </div>

            {/* Starting Date */}
            <div className="w-full mb-2 px-3 md:w-1/3">
              <label className="block text-base font-medium">Starting Date</label>
              <input
                type="date"
                value={taskStartingDate}
                onChange={(e) => setTaskStartingDate(e.target.value)}
                className="w-full mb-2 rounded-md border py-[10px] px-4 border-active"
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
                className="w-full mb-2 rounded-md border py-[10px] px-4 border-active"
              />
              {errors.taskExpectedCompletionDate && <p className="text-red-500 text-xs">{errors.taskExpectedCompletionDate}</p>}
            </div>

            {/* Task Description */}
            <div className="w-full mb-2 px-3">
              <label className="block text-base font-medium">Task Description</label>
              <textarea
                value={taskDescription}
                onChange={(e) => setTaskDescription(e.target.value)}
                className="w-full mb-2 rounded-md border py-[10px] px-4 border-active"
                placeholder="Describe the task"
              />
            </div>

            {/* Task Document Upload */}
            <div className="w-full mb-6 px-3">
              <label className="block text-base font-medium">Attach Document</label>
              <input type="file" onChange={handleFileChange} />
            </div>

            {/* Submit Button */}
            <div className="w-full mb-6 px-3">
              <motion.button
                type="submit"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className={`px-5 py-3 bg-blue-600 text-white font-medium rounded-md hover:bg-[#2564ebdb] active:border-[#a8adf4] outline-none active:border-2 focus:ring-2 ring-blue-300 ${
                    isSubmitting ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                  disabled={isSubmitting}
              >
                {isSubmitting ? "Updating..." : "Update Task"}
              </motion.button>
            </div>
          </div>
        </form>
      </section>
    </>
  );
};

export default EditInquirySubTask;