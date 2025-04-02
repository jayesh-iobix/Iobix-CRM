import React, { useEffect, useState } from "react";
import { FaArrowLeft } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { motion } from "framer-motion"; // Import framer-motion
import { DepartmentService } from "../../../service/DepartmentService";
import { EmployeeService } from "../../../service/EmployeeService";
import { InquiryPermissionService } from "../../../service/InquiryPermissionService";
import { InquiryTypeService } from "../../../service/InquiryTypeService";
import Select from "react-select"; // Import react-select for searchable dropdown


const AddInquiryPermission = () => {
  const [userId, setUserId] = useState("");
  const [departmentId, setDepartmentId] = useState("");
  const [inquiryTypeIds, setInquiryTypeIds] = useState([]);

  const [employeeList, setEmployeeList] = useState([]);
  const [departmentList, setDepartmentList] = useState([]);
  const [inquiryTypeList, setInquiryTypeList] = useState([]);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchEmployees = async () => {
      try {

        // Fetch Department
        const departmentResult = await DepartmentService.getDepartments();
        const activeDepartments = departmentResult.data.filter(
          (department) => department.isActive === true
        );
        setDepartmentList(activeDepartments);

        if (departmentId) {
          // debugger;
          // if(departmentId === "Admin") {
          //   // Fetch Admin
          //   // console.log("Admin Department Selected");
          //   const adminResult = await CommonService.getAdmin();
          //   setEmployeeList(adminResult.data);
          // } else {
            // Fetch Employee from department
          const employeeResult = await EmployeeService.getEmployeeByDepartment(
            departmentId
          );
          setEmployeeList(employeeResult.data);
        // }
        }

        // Fetch Inquiry Type
        const inquiryTypeResult = await InquiryTypeService.getInquiryType();
        const activeInquiryType = inquiryTypeResult.data.filter(
          (inquiryType) => inquiryType.isActive === true
        );
        setInquiryTypeList(activeInquiryType);

      } catch (error) {
        console.error("Error fetching employee list:", error);
      }
    };
    fetchEmployees();
  }, [departmentId]);

  const validateForm = () => {
    const newErrors = {};
    if (!userId) newErrors.userId  = "User is required";
    if (!inquiryTypeIds) newErrors.inquiryTypeIds  = "Inquiry Type is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSelectChange = (selectedOptions, field) => {
    const selectedValues = selectedOptions ? selectedOptions.map((option) => option.value) : [];
    if (field === "inquiryTypeId") {
      setInquiryTypeIds(selectedValues);
    }
  };
  
  const inquiryTypeOptions = inquiryTypeList.map((inquiryType) => ({
    value: inquiryType.inquiryTypeId,
    label: inquiryType.inquiryTypeName,
  }));

  const handleSubmit = async (e) => {
    e.preventDefault();

    debugger
    if (!validateForm()) return;

    const inquiryPermissionData = {
      departmentId,
      userId,
      inquiryTypeIds,
    };

    setIsSubmitting(true);
    try {
      const response = await InquiryPermissionService.addInquiryPermission(inquiryPermissionData);
      if (response.status === 1) {
        toast.success("Inquiry Permission Added Sucesfully"); // Toast on success
        // toast.success(response.message); // Toast on success
        navigate(-1);}
    } catch (error) {
      console.error("Error adding inquiry permission:", error);
      toast.error("Failed to add inquiry permission.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <div className="flex justify-between items-center my-3">
        <h1 className="font-semibold text-2xl">Add Inquiry Permission</h1>
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
                  {/* <option value="Admin"> Admin </option> */}
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

            {/* Users */}
            <div className="w-full mb-2 px-3 md:w-1/3">
              <label className="block text-base font-medium">Users</label>
              <select
                value={userId}
                onChange={(e) => setUserId(e.target.value)}
                className="w-full mb-2 rounded-md border py-[10px] px-4 border-active"
              >
                <option value="">--Select User--</option>
                {employeeList.map((employee) => (
                  <option key={employee.employeeId} value={employee.employeeId}>
                    {employee.firstName + " " + employee.lastName}
                  </option>
                ))}
              </select>
              {errors.userId && (
                <p className="text-red-500 text-xs">{errors.userId}</p>
              )}
            </div>

            {/* Inquiry Type */}
            <div className="w-full mb-2 px-3 md:w-1/3">
              <label className="block text-base font-medium">
                Inquiry Type
              </label>
              <Select
                options={inquiryTypeOptions}
                isMulti
                value={inquiryTypeOptions.filter((option) =>
                  inquiryTypeIds.includes(option.value)
                )}
                onChange={(selectedOption) =>
                  handleSelectChange(selectedOption, "inquiryTypeId")
                }
                placeholder="Select Inquiry Type"
                className="w-full mb-2 text-lg" // Adjust width, padding, and font size
              />
              {errors.inquiryTypeIds && (
                <p className="text-red-500 text-xs">{errors.inquiryTypeIds}</p>
              )}
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
                {isSubmitting ? "Submitting..." : "Add Inquiry Permission"}
              </motion.button>
            </div>
          </div>
        </form>
      </section>
    </>
  );
};

export default AddInquiryPermission;