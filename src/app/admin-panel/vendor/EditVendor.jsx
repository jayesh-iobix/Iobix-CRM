//#region Imports
import React, { useEffect, useState } from "react";
import { FaArrowLeft } from "react-icons/fa";
import { Link, useNavigate, useParams } from "react-router-dom";
import { CommonService } from "../../service/CommonService";
import { toast } from "react-toastify";
import { motion } from "framer-motion"; // Import framer-motion
import { InquirySourceService } from "../../service/InquirySourceService";
import { VendorService } from "../../service/VendorService";
import { DepartmentService } from "../../service/DepartmentService";
import { EmployeeService } from "../../service/EmployeeService";
//#endregion

//#region Component: EditVendor
const EditVendor = () => {

  //#region State Variables
  const [formData, setFormData] = useState({
    companyName: "",
    companyRegistrationNumber : "",
    companyGSTNumber : "",
    companyLinkedin : "",
    contactPersonName : "",
    phoneNumber : "",
    email: "",
    contactPersonLinkedin : "",
    address: "",
    countryId: "",
    stateId: "",
    cityId: "",
    whatsAppNumber: "",
    companyWebsite : "",
    departmentId: "",
    relationalManagerId : "",
    isRelationalManagerId : "",
  });

  const { id } = useParams();
  const [inquirySourceList, setInquirySourceList] = useState([]);
  
  const [countryList, setCountryList] = useState([]);
  const [stateList, setStateList] = useState([]);
  const [cityList, setCityList] = useState([]);
  const [departmentList, setDepartmentList] = useState([]);
  const [employeeList, setEmployeeList] = useState([]);
  const [isRelationalManager, setIsRelationalManager] = useState("");
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  //#endregion

  //#region useEffect: Fetch Data
  useEffect(() => {
      const fetchData = async () => {
        try {
          // Fetch Vendor
          const vendor = await VendorService.getByIdVendor(id);
          setFormData(vendor.data);
          setIsRelationalManager(vendor.data.isRelationalManager)
          //   console.log(vendor.data);
  
          // Fetch Countries
          const [countries] = await Promise.all([
            CommonService.getCountry(),
          ]);
          setCountryList(countries.data);
        } catch (error) {
          console.error("Error fetching data:", error);
          alert("Error fetching data, please try again.");
        }
      };
  
      fetchData();
    }, [id]);

  useEffect(() => {
    const fetchData = async () => {

      //#region Fetch Employee By Department
             const departmentResult = await DepartmentService.getDepartments();
             const activeDepartments = departmentResult.data.filter(department => department.isActive === true);
             setDepartmentList(activeDepartments); 
             if (formData.departmentId) {
               // Fetch Employee from department
               const employeeResult = await EmployeeService.getEmployeeByDepartment(formData.departmentId);
               setEmployeeList(employeeResult.data);
             }
            //#endregion Fetch Employee By Department

      //#region Fetch Inqiry Source
      const inquirySourceResult = await InquirySourceService.getInquirySource();
      const activeInquirySource = inquirySourceResult.data.filter(inquirySource => inquirySource.isActive === true);
      setInquirySourceList(activeInquirySource);
      //#endregion Fetch Inqiry Source

      //#region Fetch Country, State, and City Source
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
      //#endregion Fetch Country, State, and City Source
    };
    fetchData();
  }, [formData.countryId, formData.stateId, formData.departmentId])
  //#endregion

  //#region Form Validation and Submission
  const validateForm = () => {
    const newErrors = {};
    if (!formData.companyName) newErrors.companyName = "Company Name is required";
    if (!formData.companyLinkedin) newErrors.companyLinkedin = "Company Linkedin is required";
    if (!formData.contactPersonName) newErrors.contactPersonName = "Contact Person Name is required";
    if (!formData.phoneNumber || !/^[0-9]{10}$/.test(formData.phoneNumber)) {
      newErrors.phoneNumber = "Please enter a valid 10-digit phone number";
    }
    if (!formData.whatsAppNumber || !/^[0-9]{10}$/.test(formData.whatsAppNumber)) {
      newErrors.whatsAppNumber = "Please enter a valid 10-digit WhatsApp number";
    }
    if (!formData.email) newErrors.email = "Email name is required";
    if (!formData.contactPersonLinkedin) newErrors.contactPersonLinkedin = "Contact Person Linkedin is required";
    if (!formData.address) newErrors.address = "Address is required";
    if (!formData.countryId) newErrors.countryId = "Country is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // debugger; 

    if (validateForm()) {
      setIsSubmitting(true);

      const updatedCompanyData = {
        ...formData,
        isRelationalManager,
        // departmentId: isRelationalManager ? formData.departmentId : "",
        relationalManagerId: isRelationalManager ? formData.relationalManagerId : null,
      };

      try {
        //debugger;
        // Call the API to add the employee
        const response = await VendorService.updateVendor(id, updatedCompanyData); // Call the service
        if (response.status === 1) {
          toast.success("Vendor updated successfully");
          navigate(-1);
        //   toast.success(response.message);
        //   navigate("/vendor-list");
        }
        if (response.status === 0) {
          toast.error("This Email Is Already Registered, Please Enter Another Valid Email"); // Toast on error
        }

        // Reset the form after successful submission
        // setFormData({
        //   companyName: "",
        //   companyRegistrationNumber : "",
        //   companyGSTNumber : "",
        //   companyLinkedin : "",
        //   contactPersonName : "",
        //   phoneNumber : "",
        //   email: "",
        //   contactPersonLinkedin : "",
        //   address: "",
        //   countryId: "",
        //   stateId: "",
        //   cityId: "",
        //   whatsAppNumber: "",
        //   companyWebsite : "",
        // });

        setErrors({});
      } catch (error) {
        console.error("Error adding vendor:", error);
        alert("Failed to add vendor. Please try again.");
      } finally {
        setIsSubmitting(false);
      }
    }
  };
  //#endregion

  //#region Handle Change Function
  const handleChange = (e) => {
    const { name, value } = e.target;
    
    // Regex for 10-digit number validation
    const phoneNumberRegex = /^[0-9]{10}$/;
    
    // If the field is either phoneNumber or whatsAppNumber, validate the input
    if (name === "phoneNumber" || name === "whatsAppNumber") {
      if (value && !phoneNumberRegex.test(value)) {
        // Only allow 10 digits
        setErrors((prev) => ({
          ...prev,
          [name]: "Please enter a valid 10-digit number",
        }));
      } else {
        setErrors((prev) => ({
          ...prev,
          [name]: "",
        }));
      }
    }
  
    // Update form data for all fields
    setFormData((prev) => ({ ...prev, [name]: value }));
  };
  //#endregion

  //#region Render
  return (
    <>
      {/* Header Section */}
      <div className="flex justify-between items-center my-3">
        <h1 className="font-semibold text-2xl">Edit Vendor</h1>
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
      <section className="bg-white rounded-lg shadow-sm m-1 py-8 pt-4 dark:bg-dark">
        <form onSubmit={handleSubmit} className="container">
          <div className="-mx-4 px-10 mt- flex flex-wrap">
            {/* Select Employee Assign To */}
          <div className="w-full mb-4 px-3">
              <label className="block text-base font-medium">
                Relational Manager Assign To Partner ?
              </label>
              <div className="flex items-center gap-4">
                <label>
                  <input
                    type="radio"
                    name="isRelationalManager"
                    value="true"
                    checked={isRelationalManager === true}
                    onChange={() => setIsRelationalManager(true)}
                    className="me-1"
                  />
                  Yes
                </label>
                <label>
                  <input
                    type="radio"
                    name="isRelationalManager"
                    value="false"
                    checked={isRelationalManager === false}
                    onChange={() => setIsRelationalManager(false)}
                    className="me-1"
                  />
                  No
                </label>
              </div>
            </div>
            {isRelationalManager && (
              <>
                {/* Department Select */}
                <div className="w-full mb-2 px-3 md:w-1/2 lg:w-1/3">
                  <label className="mb-2 block text-base font-medium">
                    Department
                  </label>
                  <select
                    value={formData.departmentId}
                    onChange={handleChange}
                    // onChange={(e) => setDepartmentId(e.target.value)}
                    name="departmentId"
                    className="w-full mb-2 bg-transparent rounded-md border border-red py-[8px] pl-5 pr-12 text-dark-6 border-active transition"
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

                {/* Relational Manager */}
                <div className="w-full mb-2 px-3 md:w-1/2 lg:w-1/3">
                  <label className="mb-2 block text-base font-medium">
                    Assign To
                  </label>
                  <select
                    value={formData.relationalManagerId}
                    onChange={handleChange}
                    name="relationalManagerId"
                    className="w-full mb-2 bg-transparent rounded-md border border-red py-[8px] pl-5 pr-12 text-dark-6 border-active transition"
                  >
                    <option value="">--Select Employee--</option>
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
                </div>
              </>
            )}

            {[
              {
                label: "Company Name",
                name: "companyName",
                type: "text",
                placeholder: "Enter Company name",
              },
              {
                label: "Company Registration Number",
                name: "companyRegistrationNumber",
                type: "text",
                placeholder: "Enter Company Registration Number",
              },
              {
                label: "Email",
                name: "email",
                type: "email",
                placeholder: "Enter your email",
              },
              // {
              //   label: "Password",
              //   name: "password",
              //   type: "password",
              //   placeholder: "Enter your password",
              // },
              {
                label: "Contact Person Name",
                name: "contactPersonName",
                type: "text",
                placeholder: "Enter Contact Person Name",
              },
              {
                label: "Company GST Number",
                name: "companyGSTNumber",
                type: "text",
                placeholder: "Enter Company GST Number",
              },
              {
                label: "Company Linkedin",
                name: "companyLinkedin",
                type: "url",
                placeholder: "Enter Company Linkedin",
              },
              {
                label: "Company Website",
                name: "companyWebsite",
                type: "url",
                placeholder: "Enter Company Website",
              },
              {
                label: "Contact Person Phone No.",
                name: "phoneNumber",
                type: "number",
                placeholder: "Enter your phone number",
              },
              {
                label: "Contact Person WhatsApp No.",
                name: "whatsAppNumber",
                type: "text",
                placeholder: "Enter WhatsApp Number",
              },
              {
                label: "Contact Person Linkedin",
                name: "contactPersonLinkedin",
                type: "url",
                placeholder: "Enter Contact Person Linkedin",
              },
            //   {
            //     label: "Employee Code",
            //     name: "employeecode",
            //     type: "text",
            //     placeholder: "Employee code",
            //   },
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
                  className={"w-full mb-2 rounded-md border border-red py-[10px] pl-5 pr-12 text-dark-6 border-active transition"} />
                  {errors[name] && (
                  <p className="text-red-500 text-xs">{errors[name]}</p>
                  )}
              </div>
            ))}

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

            {/* Address Input and KeyResponsibility Input */}
            <div className="w-full mb-2 px-3">
              {/* Address Input */}
              <div className="w-full mb-2 px-3">
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
                {isSubmitting ? "Submitting..." : "Update Vendor"}
              </motion.button>
            </div>
          </div>
        </form>
      </section>
    </>
  );
  //#endregion
};

export default EditVendor;
//#endregion