import React, { useEffect, useState } from "react";
import { FaArrowLeft } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { CommonService } from "../../service/CommonService";
import { DepartmentService } from "../../service/DepartmentService";
import { DesignationService } from "../../service/DesignationService";
import { EmployeeService } from "../../service/EmployeeService";
import { toast } from "react-toastify";
import { motion } from "framer-motion"; // Import framer-motion
import { EmployeeLeaveTypeService } from "../../service/EmployeeLeaveTypeService";


const AddEmployee = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    middleName: "",
    lastName: "",
    employeecode: "",
    email: "",
    password: "",
    departmentId: "",
    designationId: "",
    gender: "",
    mobileNumber: "",
    emergencyMobileNumber: "",
    birthDate: "",
    dateOfJoining: "",
    countryId: "",
    stateId: "",
    cityId: "",
    bloodgroup: "",
    address: "",
    keyResponsibility: "",
    reportingTo: "",
    onProbation: "",
    probationPeriod: "",
    employeeLeaveTypeId: "",
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [departmentList, setDepartmentList] = useState([]);
  const [employeeLeaveTypeList, setEmployeeLeaveTypeList] = useState([]);
  const [designationList, setDesignationList] = useState([]);
  const [countryList, setCountryList] = useState([]);
  const [stateList, setStateList] = useState([]);
  const [cityList, setCityList] = useState([]);
  const [employeeList, setEmployeeList] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch departments
        const departmentResult = await DepartmentService.getDepartments();
        const activeDepartments = departmentResult.data.filter(
          (department) => department.isActive === true
        );

        setDepartmentList(activeDepartments);

        if (formData.departmentId) {
          // Fetch designation from department
          const designationResult =
            await DesignationService.getDesignationByDepartment(
              formData.departmentId
            );
          //  const activeDesignation = designationResult.data.filter(designation => designation.isActive === true);

          setDesignationList(designationResult.data);

          // Fetch Employee from department
          const employeeResult = await EmployeeService.getEmployeeByDepartment(
            formData.departmentId
          );
          setEmployeeList(employeeResult.data);
        }

        // Fetch employeeLeaveType
        const employeeLeaveTypeResult =
          await EmployeeLeaveTypeService.getLeaveEmployeeTypes();
        const activeEmployeeLeaveType = employeeLeaveTypeResult.data.filter(
          (employeeLeaveType) => employeeLeaveType.isActive === true
        );
        //  console.log(employeeLeaveTypeResult.data)
        setEmployeeLeaveTypeList(activeEmployeeLeaveType);

        if (formData.dateOfJoining) {
          const employeeCodeData = await EmployeeService.getEmployeeCode(
            formData.dateOfJoining
          );
          formData.employeecode = employeeCodeData.data;
        }

        // Fetch countries
        const countryResult = await CommonService.getCountry();
        setCountryList(countryResult.data);

        // Fetch states and cities if country and state are selected
        if (formData.countryId) {
          const stateResult = await CommonService.getState(formData.countryId);
          setStateList(stateResult.data);

          if (formData.stateId) {
            const cityResult = await CommonService.getCity(formData.stateId);
            setCityList(cityResult.data);
          }
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData(); // Call the function to fetch data
  }, [
    formData.countryId,
    formData.stateId,
    formData.departmentId,
    formData.dateOfJoining,
  ]); // Watch country, state, departmentfrom and employeecode formData

  const validateForm = () => {
    const requiredFields = [
      "firstName",
      "middleName",
      "lastName",
      "employeecode",
      "email",
      "password",
      "departmentId",
      "designationId",
      "gender",
      "mobileNumber",
      "emergencyMobileNumber",
      "birthDate",
      "dateOfJoining",
      "countryId",
      "stateId",
      "cityId",
      "bloodgroup",
      "address",
      "keyResponsibility",
      "onProbation",
    ];
    const newErrors = {};
    requiredFields.forEach((field) => {
      if (!formData[field]) newErrors[field] = `${field} is required`;
    });
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    debugger;
    e.preventDefault();
    if (validateForm()) {
      setIsSubmitting(true);
      try {
        //debugger;
        // Call the API to add the employee
        const employeeData = {
          ...formData,
          reportingTo:
            formData.reportingTo === "" ? null : formData.reportingTo, // Convert empty string to null
          probationPeriod:
            formData.probationPeriod === "" ? 0 : formData.probationPeriod, // Convert empty string to 0
          employeeLeaveTypeId:
            formData.employeeLeaveTypeId === "" ? null : formData.employeeLeaveTypeId, // Convert empty string to null
        };
        const response = await EmployeeService.addEmployee(employeeData); // Call the service
        if (response.status === 1) {
          toast.success(response.message);
          navigate("/employee-list");
        }

        // Reset the form after successful submission
        setFormData({
          firstName: "",
          middleName: "",
          lastName: "",
          employeecode: "",
          email: "",
          password: "",
          departmentId: "",
          designationId: "",
          gender: "",
          mobileNumber: "",
          emergencyMobileNumber: "",
          birthDate: "",
          dateOfJoining: "",
          countryId: "",
          stateId: "",
          cityId: "",
          bloodgroup: "",
          address: "",
          keyResponsibility: "",
          reportingTo: "",
          onProbation: "",
          probationPeriod: "",
          employeeLeaveTypeId: "",
          // documentName: "",
        });
        setErrors({});
      } catch (error) {
        console.error("Error adding employee:", error);
        alert("Failed to add employee. Please try again.");
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <>
      <div className="flex justify-between items-center my-3">
        <h1 className="font-semibold text-2xl">Add Employee</h1>
        <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
          <Link
            to="/employee-list"
            className="bg-gray-500 hover:bg-gray-400 text-white font-bold py-2 px-4 rounded flex items-center gap-2 hover:no-underline"
          >
            <FaArrowLeft size={16} />
            Back
          </Link>
        </motion.button>
      </div>

      <section className="bg-white rounded-lg shadow-sm m-1 py-8 pt-4 dark:bg-dark">
        <form onSubmit={handleSubmit} className="container">
          <div className="-mx-4 px-10 mt- flex flex-wrap">
            {[
              {
                label: "First Name",
                name: "firstName",
                type: "text",
                placeholder: "Enter your first name",
              },
              {
                label: "Middle Name",
                name: "middleName",
                type: "text",
                placeholder: "Enter your middle name",
              },
              {
                label: "Last Name",
                name: "lastName",
                type: "text",
                placeholder: "Enter your last name",
              },
              {
                label: "Email",
                name: "email",
                type: "email",
                placeholder: "Enter your middle name",
              },
              {
                label: "Password",
                name: "password",
                type: "password",
                placeholder: "Enter your password",
              },
              {
                label: "Mobile Number",
                name: "mobileNumber",
                type: "number",
                placeholder: "Enter your phone number",
              },
              {
                label: "Emergency Mobile Number",
                name: "emergencyMobileNumber",
                type: "number",
                placeholder: "Enter an emergency contact number",
              },
              {
                label: "Date of Birth",
                name: "birthDate",
                type: "date",
                placeholder: "Select your birth date",
              },
              {
                label: "Date of Joining",
                name: "dateOfJoining",
                type: "date",
                placeholder: "Select your joining date",
              },
              {
                label: "Employee Code",
                name: "employeecode",
                type: "text",
                placeholder: "Employee code",
              },
              {
                label: "Blood Group",
                name: "bloodgroup",
                type: "text",
                placeholder: "Enter your blood group",
              },
            ].map(({ label, name, type, placeholder }) => (
              <div className="w-full mb-2 px-3 md:w-1/2 lg:w-1/3" key={name}>
                <label className="mb-2 block text-base font-medium">
                  {label}
                </label>
                <input
                  type={type}
                  name={name}
                  placeholder={placeholder}
                  value={formData[name]}
                  onChange={handleChange}
                  className={`w-full mb-2 rounded-md border border-red py-[10px] pl-5 pr-12 text-dark-6 border-active transition ${
                    name === "employeecode" ? "bg-gray-100" : "bg-transparent"
                  }`}
                  disabled={name === "employeecode"} // Disable Employee Code field
                />
                {errors[name] && (
                  <p className="text-red-500 text-xs">{errors[name]}</p>
                )}
              </div>
            ))}

            {/* Department Select */}
            <div className="w-full mb-2 px-3 md:w-1/3 lg:w-1/3">
              <label className="mb-[10px] block text-base font-medium text-dark dark:text-white">
                Department
              </label>
              <div className="relative z-20">
                <select
                  value={formData.departmentId}
                  onChange={handleChange}
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
              {errors.department && (
                <p className="text-red-500 text-xs">{errors.department}</p>
              )}
            </div>

            {/* Designation Select */}
            <div className="w-full mb-2 px-3 md:w-1/2 lg:w-1/3">
              <label className="mb-[10px] block text-base font-medium text-dark dark:text-white">
                Designation
              </label>
              <div className="relative z-20">
                <select
                  value={formData.designationId}
                  onChange={handleChange}
                  name="designationId"
                  className="relative z-20 w-full mb-2 appearance-none rounded-lg border border-stroke bg-transparent py-[10px] px-4 text-dark-6 border-active transition disabled:cursor-default disabled:bg-gray-2"
                >
                  <option value="" className="text-gray-400">
                    --Select Designation--
                  </option>
                  {designationList.length > 0 ? (
                    designationList.map((designationItem) => (
                      <option
                        key={designationItem.designationId}
                        value={designationItem.designationId}
                      >
                        {designationItem.designationName}
                      </option>
                    ))
                  ) : (
                    <option value="" disabled>
                      No Designation available
                    </option>
                  )}
                </select>
              </div>
              {errors.designation && (
                <p className="text-red-500 text-xs">{errors.designation}</p>
              )}
            </div>

            {/* Gender Select */}
            <div className="w-full mb-2 px-3 md:w-1/3 lg:w-1/3">
              <label className="mb-[10px] block text-base font-medium text-dark dark:text-white">
                Gender
              </label>
              <div className="relative z-20">
                <select
                  value={formData.gender}
                  onChange={handleChange}
                  name="gender"
                  className="relative z-20 w-full mb-2 appearance-none rounded-lg border border-stroke bg-transparent py-[10px] px-4 text-dark-6 border-active transition disabled:cursor-default disabled:bg-gray-2"
                >
                  <option value="" className="text-gray-400">
                    --Select Gender--
                  </option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              {errors.gender && (
                <p className="text-red-500 text-xs">{errors.gender}</p>
              )}
            </div>

            {/* Country Select */}
            <div className="w-full mb-2 px-3 md:w-1/3 lg:w-1/3">
              <label className="mb-[10px] block text-base font-medium text-dark dark:text-white">
                Country
              </label>
              <select
                value={formData.countryId}
                onChange={handleChange}
                name="countryId"
                className="w-full mb-2 bg-transparent rounded-md border border-red py-[10px] pl-5 pr-12 text-dark-6 border-active transition"
              >
                <option value="" className="text-gray-400">
                  --Select Country--
                </option>
                {countryList.length > 0 ? (
                  countryList.map((country) => (
                    <option key={country.countryId} value={country.countryId}>
                      {country.name}
                    </option>
                  ))
                ) : (
                  <option value="" disabled>
                    No countries available
                  </option>
                )}
              </select>
              {errors.countryId && (
                <p className="text-red-500 text-xs">{errors.countryId}</p>
              )}
            </div>

            {/* State Select */}
            <div className="w-full mb-2 px-3 md:w-1/3 lg:w-1/3">
              <label className="mb-[10px] block text-base font-medium text-dark dark:text-white">
                State
              </label>
              <select
                value={formData.stateId}
                onChange={handleChange}
                name="stateId"
                className="w-full mb-2 bg-transparent rounded-md border border-red py-[10px] pl-5 pr-12 text-dark-6 border-active transition"
              >
                <option value="" className="text-gray-400">
                  --Select State--
                </option>
                {stateList.length > 0 ? (
                  stateList.map((state) => (
                    <option key={state.stateId} value={state.stateId}>
                      {state.name}
                    </option>
                  ))
                ) : (
                  <option value="" disabled>
                    No states available
                  </option>
                )}
              </select>
              {errors.stateId && (
                <p className="text-red-500 text-xs">{errors.stateId}</p>
              )}
            </div>

            {/* City Select */}
            <div className="w-full mb-2 px-3 md:w-1/3 lg:w-1/3">
              <label className="mb-[10px] block text-base font-medium text-dark dark:text-white">
                City
              </label>
              <select
                value={formData.cityId}
                onChange={handleChange}
                name="cityId"
                className="w-full mb-2 bg-transparent rounded-md border border-red py-[10px] pl-5 pr-12 text-dark-6 border-active transition"
              >
                <option value="" className="text-gray-400">
                  --Select City--
                </option>
                {cityList.length > 0 ? (
                  cityList.map((city) => (
                    <option key={city.cityId} value={city.cityId}>
                      {city.name}
                    </option>
                  ))
                ) : (
                  <option value="" disabled>
                    No cities available
                  </option>
                )}
              </select>
              {errors.cityId && (
                <p className="text-red-500 text-xs">{errors.cityId}</p>
              )}
            </div>

            {/* Reporting To Select */}
            <div className="w-full mb-2 px-3 md:w-1/3 lg:w-1/3">
              <label className="mb-[10px] block text-base font-medium text-dark dark:text-white">
                Reporting To
              </label>
              <select
                value={formData.reportingTo}
                onChange={handleChange}
                name="reportingTo"
                className="w-full mb-2 bg-transparent rounded-md border border-red py-[10px] pl-5 pr-12 text-dark-6 border-active transition"
              >
                <option value="" className="text-gray-400">
                  --Select Employee--
                </option>
                {employeeList.length > 0 ? (
                  employeeList.map((employee) => (
                    <option
                      key={employee.employeeId}
                      value={employee.employeeId}
                    >
                      {employee.firstName + " " + employee.lastName}
                    </option>
                  ))
                ) : (
                  <option value="" disabled>
                    No Employees available
                  </option>
                )}
              </select>
              {/* {errors.reportingTo && (
                <p className="text-red-500 text-xs">{errors.reportingTo}</p>
              )} */}
            </div>

            {/* On Probation Select */}
            <div className="w-full mb-2 px-3 md:w-1/3 lg:w-1/3">
              <label className="mb-[10px] block text-base font-medium text-dark dark:text-white">
                On Probation
              </label>
              <div className="relative z-20">
                <select
                  value={formData.onProbation}
                  onChange={handleChange}
                  name="onProbation"
                  className="relative z-20 w-full mb-2 appearance-none rounded-lg border border-stroke bg-transparent py-[10px] px-4 text-dark-6 border-active transition disabled:cursor-default disabled:bg-gray-2"
                >
                  <option value="" className="text-gray-400">
                    --Select On Probation--
                  </option>
                  <option value="Yes">Yes</option>
                  <option value="No">No</option>
                </select>
              </div>
              {errors.onProbation && (
                <p className="text-red-500 text-xs">{errors.onProbation}</p>
              )}
            </div>

            {/* Probation Period */}
            {formData.onProbation === "Yes" && (
            <div className="w-full mb-2 px-3 md:w-1/3 lg:w-1/3">
              <label className="mb-[10px] block text-base font-medium text-dark dark:text-white">
                Probation Period
              </label>
              <div className="relative z-20">
                <select
                  value={formData.probationPeriod}
                  onChange={handleChange}
                  name="probationPeriod"
                  className="relative z-20 w-full mb-2 appearance-none rounded-lg border border-stroke bg-transparent py-[10px] px-4 text-dark-6 border-active transition disabled:cursor-default disabled:bg-gray-2"
                >
                  <option value="" className="text-gray-400">
                    --Select Probation Period--
                  </option>
                  <option value="90">90 Days</option>
                  <option value="180">180 Days</option>
                  <option value="365">365 Days</option>
                </select>
              </div>
              {/* {errors.probationPeriod && (
                <p className="text-red-500 text-xs">{errors.probationPeriod}</p>
              )} */}
            </div>
            )}

            {/* EmployeeLeave Type - Show only if "No" is selected in On Probation */}
            {formData.onProbation === "No" && (
              <div className="w-full mb-2 px-3 md:w-1/3 lg:w-1/3">
                <label className="mb-[10px] block text-base font-medium text-dark dark:text-white">
                  Employee Leave Type
                </label>
                <div className="relative z-20">
                  <select
                    value={formData.employeeLeaveTypeId}
                    onChange={handleChange}
                    name="employeeLeaveTypeId"
                    className="relative z-20 w-full mb-2 appearance-none rounded-lg border border-stroke bg-transparent py-[10px] px-4 text-dark-6 border-active transition disabled:cursor-default disabled:bg-gray-2"
                  >
                    <option value="" className="text-gray-400">
                      --Select Employee Leave Type--
                    </option>
                    {employeeLeaveTypeList.length > 0 ? (
                      employeeLeaveTypeList.map((employeeLeaveTypeItem) => (
                        <option
                          key={employeeLeaveTypeItem.employeeLeaveTypeId}
                          value={employeeLeaveTypeItem.employeeLeaveTypeId}
                        >
                          {employeeLeaveTypeItem.employeeLeaveTypeName}
                        </option>
                      ))
                    ) : (
                      <option value="" disabled>
                        No employee leave type available
                      </option>
                    )}
                  </select>
                </div>
                {/* {errors.employeeLeaveTypeId && (
                  <p className="text-red-500 text-xs">
                    {errors.employeeLeaveTypeId}
                  </p>
                )} */}
              </div>
            )}

            {/* Address Input and KeyResponsibility Input */}
            <div className="w-full mb-2 px-3 flex">
              {/* Address Input */}
              <div className="w-full mb-2 px-3 md:w-1/2 lg:w-1/2">
                <label className="mb-2 block text-base font-medium text-dark dark:text-white">
                  Address
                </label>
                <textarea
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  rows="3"
                  className="w-full mb-2 bg-transparent rounded-md border border-red py-[10px] pl-5 pr-12 text-dark-6 border-active transition"
                ></textarea>
                {errors.address && (
                  <p className="text-red-500 text-xs">{errors.address}</p>
                )}
              </div>

              {/* KeyResponsibility Input */}
              <div className="w-full mb-2 px-3 md:w-1/2 lg:w-1/2">
                <label className="mb-2 block text-base font-medium text-dark dark:text-white">
                  Roles & Responsibility
                </label>
                <textarea
                  name="keyResponsibility"
                  value={formData.keyResponsibility}
                  onChange={handleChange}
                  rows="3"
                  className="w-full mb-2 bg-transparent rounded-md border border-red py-[10px] pl-5 pr-12 text-dark-6 border-active transition"
                ></textarea>
                {errors.keyResponsibility && (
                  <p className="text-red-500 text-xs">
                    {errors.keyResponsibility}
                  </p>
                )}
              </div>
            </div>

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
                {isSubmitting ? "Submitting..." : "Add Employee"}
              </motion.button>
              {/* <button
                type="submit"
                className={`px-5 py-3 bg-blue-600 text-white font-medium rounded-md hover:bg-[#2564ebdb] active:border-[#a8adf4] outline-none active:border-2 focus:ring-2 ring-blue-300  ${
                  isSubmitting ? "opacity-50 cursor-not-allowed" : ""
                }`}
                disabled={isSubmitting}
              >
                {isSubmitting ? "Submitting..." : "Add Employee"}
              </button> */}
            </div>
          </div>
        </form>
      </section>
    </>
  );
};

export default AddEmployee;


