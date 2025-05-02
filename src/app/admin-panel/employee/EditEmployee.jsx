//#region Imports
import React, { useEffect, useState } from "react";
import { FaArrowLeft } from "react-icons/fa";
import { Link, useNavigate, useParams } from "react-router-dom";
import { CommonService } from "../../service/CommonService";
import { DepartmentService } from "../../service/DepartmentService";
import { DesignationService } from "../../service/DesignationService";
import { EmployeeService } from "../../service/EmployeeService";
import { motion } from "framer-motion"; // Import framer-motion
import { EmployeeLeaveTypeService } from "../../service/EmployeeLeaveTypeService";
import { toast } from "react-toastify";
//#endregion

//#region Component: AddEmployee
const EditEmployee = () => {

  //#region State Initialization
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
    bloodGroup: "",
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

  const { id } = useParams();
  const navigate = useNavigate();
  //#endregion

  //#region Fetch Employee Details + Static Dropdown Data
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch Employee
        const employee = await EmployeeService.getByIdEmployee(id);
        // console.log(employee.data);
        const formattedEmployee = {
          ...employee.data,
          birthDate: employee.data.birthDate ? employee.data.birthDate.split("T")[0] : "",
          dateOfJoining: employee.data.dateOfJoining ? employee.data.dateOfJoining.split("T")[0] : "",
        };
        setFormData(formattedEmployee);

        // Fetch Departments, Designations, and Countries
        const [departments, countries, employeeLeaveType] = await Promise.all([
          DepartmentService.getDepartments(),
          CommonService.getCountry(),
          EmployeeLeaveTypeService.getLeaveEmployeeTypes(),
          // DesignationService.getDesignation(formData.departmentId),
        ]);
        setDepartmentList(departments.data);
        setEmployeeLeaveTypeList(employeeLeaveType.data);
        // setDesignationList(designations.data);
        setCountryList(countries.data);
      } catch (error) {
        console.error("Error fetching data:", error);
        alert("Error fetching data, please try again.");
      }
    };

    fetchData();
  }, [id]);
  //#endregion

  //#region Fetch Dependent Dropdowns: Designation, State, City, Employee
  useEffect(() => {
    const fetchDropdownData = async () => {
      if(formData.departmentId)
      {
        try{
          // Fetch designation from department
          const designationResult = await DesignationService.getDesignationByDepartment(formData.departmentId);
          setDesignationList(designationResult.data);

           // Fetch Employee from department
           const employeeResult = await EmployeeService.getEmployeeByDepartment(formData.departmentId);
           setEmployeeList(employeeResult.data);
          } catch (error) {
            console.error("Error fetching location data:", error);
          }
      }


      if (formData.countryId) {
        try {
          const states = await CommonService.getState(formData.countryId);
          setStateList(states.data);

          if (formData.stateId) {
            const cities = await CommonService.getCity(formData.stateId);
            setCityList(cities.data);
          }
        } catch (error) {
          console.error("Error fetching location data:", error);
        }
      }
    };

    fetchDropdownData();
  }, [formData.countryId, formData.stateId, formData.departmentId]);
  //#endregion

  //#region Form Handlers
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const validateForm = () => {
    const requiredFields = [
      "firstName", "lastName", "email","departmentId", "designationId", "gender",
      "mobileNumber", "emergencyMobileNumber", "birthDate", "dateOfJoining", "countryId", "stateId", "cityId",
      "bloodGroup", "address", "keyResponsibility"
    ];

    const newErrors = {};
    requiredFields.forEach((field) => {
      if (!formData[field]) newErrors[field] = `${field.replace(/([A-Z])/g, ' $1').toLowerCase()} is required`;
    });
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  //#endregion

  //#region Submit Handler
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateForm()) {
      setIsSubmitting(true);
      const employeeData = {
        ...formData,
        reportingTo:
          formData.reportingTo === "" ? null : formData.reportingTo, // Convert empty string to null
        probationPeriod:
          formData.probationPeriod === "" ? 0 : formData.probationPeriod, // Convert empty string to 0
        employeeLeaveTypeId:
          formData.employeeLeaveTypeId === "" ? null : formData.employeeLeaveTypeId, // Convert empty string to null
      };
      try {
        const response = await EmployeeService.updateEmployee(id, employeeData);
        if(response.status === 1)
          {
            toast.success("Employee updated successfully");
            // toast.success(response.message);
            navigate('/employee-list');
          }
      } catch (error) {
        console.error("Error updating employee:", error);
        alert("Failed to update employee. Please try again.");
      } finally {
        setIsSubmitting(false);
      }
    }
  };
  //#endregion

  //#region JSX Renderin
  return (
    <>
      <div className="flex justify-between items-center my-3">
        <h1 className="font-semibold text-2xl">Edit Employee</h1>
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
        <Link
          onClick={() => navigate(-1)}
          className="bg-gray-500 hover:bg-gray-400 text-white font-bold py-2 px-4 rounded flex items-center gap-2 hover:no-underline"
        >
          <FaArrowLeft size={16} />
          Back
        </Link>
        </motion.button>
      </div>

      <section className="bg-white shadow-sm m-1 py-8 pt-4 dark:bg-dark">
        <form onSubmit={handleSubmit} className="container">
          <div className="-mx-4 px-10 mt-5 flex flex-wrap">
            {/* Form Fields */}
            {[
              { label: "First Name", name: "firstName", type: "text" },
              { label: "Middle Name", name: "middleName", type: "text" },
              { label: "Last Name", name: "lastName", type: "text" },
              { label: "Email", name: "email", type: "email" },
              { label: "Mobile Number", name: "mobileNumber", type: "number" },
              { label: "Emergency Mobile Number", name: "emergencyMobileNumber", type: "number" },
              { label: "Date of Birth", name: "birthDate", type: "date" },
              { label: "Blood Group", name: "bloodGroup", type: "text" },
              { label: "Date of Joining", name: "dateOfJoining", type: "date" }
            ].map(({ label, name, type }) => (
              <div className="w-full mb-2 px-3 md:w-1/2 lg:w-1/3" key={name}>
                <label className="mb-2 block text-base font-medium">{label}</label>
                <input
                  type={type}
                  name={name}
                  value={formData[name] || ""}
                  onChange={handleChange}
                  className="w-full mb-2 bg-transparent rounded-md border py-[10px] pl-5 pr-12 text-dark-6 border-active transition"
                />
                {errors[name] && <p className="text-red-500 text-xs">{errors[name]}</p>}
              </div>
            ))}

            {/* Department */}
            <div className="w-full mb-2 px-3 md:w-1/2 lg:w-1/3">
              <label className="mb-[10px] block text-base font-medium">Department</label>
              <select
                name="departmentId"
                value={formData.departmentId}
                onChange={handleChange}
                className="w-full mb-2 bg-transparent rounded-md border py-[10px] pl-5 pr-12 text-dark-6 border-active transition"
              >
                <option value="">--Select Department--</option>
                {departmentList.map((dept) => (
                  <option key={dept.departmentId} value={dept.departmentId}>{dept.departmentName}</option>
                ))}
              </select>
              {errors.departmentId && <p className="text-red-500 text-xs">{errors.departmentId}</p>}
            </div>

            {/* Designation */}
            <div className="w-full mb-2 px-3 md:w-1/2 lg:w-1/3">
              <label className="mb-[10px] block text-base font-medium">Designation</label>
              <select
                name="designationId"
                value={formData.designationId}
                onChange={handleChange}
                className="w-full mb-2 bg-transparent rounded-md border py-[10px] pl-5 pr-12 text-dark-6 border-active transition"
              >
                <option value="">--Select Designation--</option>
                {designationList.map((desig) => (
                  <option key={desig.designationId} value={desig.designationId}>{desig.designationName}</option>
                ))}
              </select>
              {errors.designationId && <p className="text-red-500 text-xs">{errors.designationId}</p>}
            </div>

            {/* Gender */}
            <div className="w-full mb-2 px-3 md:w-1/2 lg:w-1/3">
              <label className="mb-[10px] block text-base font-medium">Gender</label>
              <select
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                className="w-full mb-2 bg-transparent rounded-md border py-[10px] pl-5 pr-12 text-dark-6 border-active transition"
              >
                <option value="">--Select Gender--</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
              {errors.gender && <p className="text-red-500 text-xs">{errors.gender}</p>}
            </div>

            {/* Country */}
            <div className="w-full mb-2 px-3 md:w-1/2 lg:w-1/3">
              <label className="mb-[10px] block text-base font-medium">Country</label>
              <select
                name="countryId"
                value={formData.countryId}
                onChange={handleChange}
                className="w-full mb-2 bg-transparent rounded-md border py-[10px] pl-5 pr-12 text-dark-6 border-active transition"
              >
                <option value="">--Select Country--</option>
                {countryList.map((country) => (
                  <option key={country.countryId} value={country.countryId}>{country.name}</option>
                ))}
              </select>
              {errors.countryId && <p className="text-red-500 text-xs">{errors.countryId}</p>}
            </div>

            {/* State */}
            <div className="w-full mb-2 px-3 md:w-1/2 lg:w-1/3">
              <label className="mb-[10px] block text-base font-medium">State</label>
              <select
                name="stateId"
                value={formData.stateId}
                onChange={handleChange}
                className="w-full mb-2 bg-transparent rounded-md border py-[10px] pl-5 pr-12 text-dark-6 border-active transition"
              >
                <option value="">--Select State--</option>
                {stateList.map((state) => (
                  <option key={state.stateId} value={state.stateId}>{state.name}</option>
                ))}
              </select>
              {errors.stateId && <p className="text-red-500 text-xs">{errors.stateId}</p>}
            </div>

            {/* City */}
            <div className="w-full mb-2 px-3 md:w-1/2 lg:w-1/3">
              <label className="mb-[10px] block text-base font-medium">City</label>
              <select
                name="cityId"
                value={formData.cityId}
                onChange={handleChange}
                className="w-full mb-2 bg-transparent rounded-md border py-[10px] pl-5 pr-12 text-dark-6 border-active transition"
              >
                <option value="">--Select City--</option>
                {cityList.map((city) => (
                  <option key={city.cityId} value={city.cityId}>{city.name}</option>
                ))}
              </select>
              {errors.cityId && <p className="text-red-500 text-xs">{errors.cityId}</p>}
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
                    <option key={employee.employeeId} value={employee.employeeId}>
                      {employee.firstName + " "+ employee.lastName}
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

            {/* Submit Button */}
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
                {isSubmitting ? "Submitting..." : "Update Employee"}
              </motion.button>
            </div>
          </div>
        </form>
      </section>
    </>
  );
  //#endregion
};

export default EditEmployee;
//#endregion

