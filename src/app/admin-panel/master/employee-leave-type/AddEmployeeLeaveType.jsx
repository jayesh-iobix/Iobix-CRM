import React, { useEffect, useState } from "react";
import { FaArrowLeft } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { motion } from "framer-motion"; // Import framer-motion
import { EmployeeLeaveTypeService } from "../../../service/EmployeeLeaveTypeService";
import { LeaveTypeService } from "../../../service/LeaveTypeService";
import Select from 'react-select';  // Import react-select

const AddEmployeeLeaveType = () => {
  const [selectedLeaveTypes, setSelectedLeaveTypes] = useState([]);
  const [employeeLeaveTypeName, setEmployeeLeaveTypeName] = useState("");
  const [leaveTypeList, setLeaveTypeList] = useState([]);
  const [leaveTypeDays, setLeaveTypeDays] = useState({});
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      const leaveTypeResult = await LeaveTypeService.getLeaveTypes();
      const activeLeaveTypes = leaveTypeResult.data.filter(leaveType => leaveType.isActive === true);
      setLeaveTypeList(activeLeaveTypes);
    };
    fetchData();
  }, []);

  const validateForm = () => {
    const newErrors = {};
    if (!employeeLeaveTypeName) newErrors.employeeLeaveTypeName = "Employee Leave Type is required";
    if (selectedLeaveTypes.length === 0) newErrors.selectedLeaveTypes = "At least one leave type must be selected";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLeaveTypeChange = (selectedOptions) => {
    setSelectedLeaveTypes(selectedOptions);
    // Reset the days of leave for newly selected leave types
    const newLeaveTypeDays = { ...leaveTypeDays };
    selectedOptions.forEach(option => {
      if (!newLeaveTypeDays[option.value]) {
        newLeaveTypeDays[option.value] = 0; // Initialize with 0 days
      }
    });
    setLeaveTypeDays(newLeaveTypeDays);
  };

  const handleTotalDaysChange = (e, leaveTypeId) => {
    const newLeaveTypeDays = { ...leaveTypeDays };
    newLeaveTypeDays[leaveTypeId] = e.target.value;
    setLeaveTypeDays(newLeaveTypeDays);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (validateForm()) {
      setIsSubmitting(true);

      // Construct the employee leave type data
      const employeeLeaveTypeData = {
        employeeLeaveTypeName,
        leaveData: selectedLeaveTypes.map(option => ({
          leaveTypeId: option.value,
          totalDaysofLeave: leaveTypeDays[option.value]
        }))
      };

      try {
        const response = await EmployeeLeaveTypeService.addEmployeeLeaveType(employeeLeaveTypeData);
        if (response.status === 1) {
          navigate(-1);
          toast.success("Employee Leave Type added successfully");
        }
        // Reset the form
        setEmployeeLeaveTypeName("");
        setSelectedLeaveTypes([]);
        setLeaveTypeDays({});
      } catch (error) {
        console.error("Error adding employee leave type:", error);
        toast.error("Failed to add employee leave type.");
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  // Prepare options for react-select
  const leaveTypeOptions = leaveTypeList.map(leaveType => ({
    value: leaveType.leaveTypeId,
    label: leaveType.leaveTypeName
  }));

  return (
    <>
      <div className="flex justify-between items-center my-3">
        <h1 className="font-semibold text-2xl">Add Employee Leave Type</h1>
        <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
          <Link
            to="/master/employee-leavetype-list"
            className="bg-gray-500 hover:bg-gray-400 text-white font-bold py-2 px-4 rounded flex items-center gap-2 hover:no-underline"
          >
            <FaArrowLeft size={16} />
            Back
          </Link>
        </motion.button>
      </div>

      <section className="bg-white rounded-lg shadow-sm m-1 py-8 pt-">
        <form onSubmit={handleSubmit} className="container">
          <div className="-mx-4 px-10 mt- flex flex-wrap">
            {/* Leave Type */}
            <div className="w-full mb-2 px-3 md:w-1/2 lg:w-1/2">
              <label className="mb-[10px] block text-base font-medium text-dark dark:text-white">Leave Type</label>
              <div className="relative z-20">
                <Select
                  isMulti
                  name="leaveTypes"
                  options={leaveTypeOptions}
                  value={selectedLeaveTypes}
                  onChange={handleLeaveTypeChange}
                  className="mb-2"
                  placeholder="Select Leave Types"
                />
              </div>
              {errors.selectedLeaveTypes && <p className="text-red-500 text-xs">{errors.selectedLeaveTypes}</p>}
            </div>

            {/* Employee Leave Type Name */}
            <div className="w-full mb-2 px-3 md:w-1/2 lg:w-1/2">
              <label className="mb-[10px] block text-base font-medium text-dark dark:text-white">Employee Leave Type Name</label>
              <input
                type="text"
                placeholder="Employee Leave Type Name"
                value={employeeLeaveTypeName}
                onChange={(e) => setEmployeeLeaveTypeName(e.target.value)}
                className="w-full mb-2 bg-transparent rounded-md border border-red py-[10px] pl-5 pr-12 text-dark-6 border-active transition"
              />
              {errors.employeeLeaveTypeName && <p className="text-red-500 text-xs">{errors.employeeLeaveTypeName}</p>}
            </div>

            {/* Total Days of Leave */}
            {selectedLeaveTypes.length > 0 && selectedLeaveTypes.map((leaveType) => (
              <div key={leaveType.value} className="w-full mb-2 px-3 md:w-1/2 lg:w-1/2">
                <label className="mb-[10px] block text-base font-medium text-dark dark:text-white">
                  Total Days of Leave for {leaveType.label}
                </label>
                <input
                  type="number"
                  placeholder="Total Days of Leave"
                  value={leaveTypeDays[leaveType.value]}
                  // value={leaveTypeDays[leaveType.value] || 0}
                  onChange={(e) => handleTotalDaysChange(e, leaveType.value)}
                  className="w-full mb-2 bg-transparent rounded-md border border-red py-[10px] pl-5 pr-12 text-dark-6 border-active transition"
                />
              </div>
            ))}

            <div className="w-full flex px-3">
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                type="submit"
                className={`px-5 py-3 bg-blue-600 text-white font-medium rounded-md hover:bg-[#2564ebdb] active:border-[#a8adf4] outline-none active:border-2 focus:ring-2 ring-blue-300 ${
                  isSubmitting ? "opacity-50 cursor-not-allowed" : ""
                }`}
                disabled={isSubmitting}
              >
                {isSubmitting ? "Submitting..." : "Add"}
              </motion.button>
            </div>
          </div>
        </form>
      </section>
    </>
  );
};

export default AddEmployeeLeaveType;