import React, { useEffect, useState } from "react";
import { FaArrowLeft } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { EmployeeService } from "../../service/EmployeeService";
import { TaskService } from "../../service/TaskService";
import { DepartmentService } from "../../service/DepartmentService";
import { toast } from "react-toastify";
import { motion } from "framer-motion"; // Import framer-motion
import { PartnerService } from "../../service/PartnerService";
import { ClientCompanyService } from "../../service/ClientCompanyService";
import { InquiryTaskService } from "../../service/InquiryTaskService";

const AddInquiryTask = () => {
  const [taskName, setTaskName] = useState("");
  const [partnerRegistrationId, setPartnerRegistrationId] = useState("");
  const [clientRegistrationId, setClientRegistrationId] = useState("");
  const [employeeId, setEmployeeId] = useState("");
  const [taskAssignTo, setTaskAssignTo] = useState("");
  const [taskDocument, setTaskDocument] = useState(null);
  const [taskPriority, setTaskPriority] = useState("");
  const [taskType, setTaskType] = useState("");
  const [taskStartingDate, setTaskStartingDate] = useState("");
  const [taskExpectedCompletionDate, setTaskExpectedCompletionDate] = useState("");
  const [taskCompletionDate, settaskCompletionDate] = useState("");
  const [taskDescription, setTaskDescription] = useState("");
  const [departmentId, setDepartmentId] = useState("");
  const [employeeList, setEmployeeList] = useState([]);
  const [partnerList, setPartnerList] = useState([]);
  const [clientCompanyList, setClientCompanyList] = useState([]);
  const [departmentList, setDepartmentList] = useState([]);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selection, setSelection] = useState("partner"); // Add this to track the radio button selection (partner, client, employee)
  const navigate = useNavigate();

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const partnerResult = await PartnerService.getPartner();
        setPartnerList(partnerResult.data.filter(item => item.isActive));

        const clientCompanyResult = await ClientCompanyService.getClientCompany();
        setClientCompanyList(clientCompanyResult.data.filter(item => item.isActive));

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

  const validateForm = () => {
    const newErrors = {};
    if (!taskName) newErrors.taskName = "Task name is required";
    if (!taskPriority) newErrors.taskPriority = "Priority is required";
    if (!taskAssignTo) newErrors.taskAssignTo = "Assign To is required";
    if (!taskType) newErrors.taskType = "Task Type is required";
    if (!taskStartingDate) newErrors.taskStartingDate = "Task Starting Date is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    const inquiryTaskData = {
      taskName,
      departmentId: departmentId === "" ? null : departmentId,
      taskAssignTo: (partnerRegistrationId === "" && clientRegistrationId === "" && employeeId !== "") ? employeeId : 
      (partnerRegistrationId === "" && employeeId === "" && clientRegistrationId !== "") ? clientRegistrationId : 
      (clientRegistrationId === "" && employeeId === "" && partnerRegistrationId !== "") ? partnerRegistrationId : null,
      taskPriority,
      taskType,
      taskStartingDate,
      taskExpectedCompletionDate: taskExpectedCompletionDate === "" ? null : taskExpectedCompletionDate,
      taskDescription,
      taskCompletionDate: taskCompletionDate === "" ? null : taskCompletionDate, // Convert empty string to null
      taskDocument, // Add the task document to the data
    };

    setIsSubmitting(true);
    try {
      const response = await InquiryTaskService.addInquiryTask(inquiryTaskData);
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

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setTaskDocument(file);  // Store the selected document
    }
  };

  return (
    <>
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
                autoFocus
              />
              {errors.taskName && <p className="text-red-500 text-xs">{errors.taskName}</p>}
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
                          value={partnerItem.companyName}
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
                          value={clientItem.companyName}
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
                  {errors.taskAssignTo && <p className="text-red-500 text-xs">{errors.taskAssignTo}</p>}
                </div>
              </>
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

            {/* Task Document */}
            <div className="w-full mb-2 px-3 md:w-1/3">
              <label className="block text-base font-medium">Task Document</label>
              <input
                type="file"
                onChange={handleFileChange}  // Handle file selection
                className="w-full mb-2 rounded-md border py-[10px] px-4"
              />
              {taskDocument && <p className="text-gray-500 text-xs">{taskDocument.name}</p>}
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

export default AddInquiryTask;
