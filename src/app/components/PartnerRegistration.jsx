//#region Imports
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import Logo from "../../assets/iobix-technolabs.png"
import { toast } from "react-toastify";
import FingerprintJS from "@fingerprintjs/fingerprintjs"; // For fingerprinting
import { UAParser } from "ua-parser-js";
import 'react-toastify/dist/ReactToastify.css';
import { AuthService } from "../service/AuthService";
import { messaging } from "../../firebase/firebase";
import { getToken } from "firebase/messaging";
import { InquirySourceService } from "../service/InquirySourceService";
import { CommonService } from "../service/CommonService";
import { PartnerService } from "../service/PartnerService";
//#endregion

//#region Component: PartnerRegistration
const PartnerRegistration = () => {
  //#region State Variables
  const [formData, setFormData] = useState({
      companyName: "",
      companyRegistrationNumber : "",
      companyGSTNumber : "",
      companyLinkedin : "",
      contactPersonName  : "",
      phoneNumber : "",
      email: "",
      contactPersonLinkedin : "",
      address: "",
      countryId: "",
      stateId: "",
      cityId: "",
      whatsAppNumber: "",
      companyWebsite : "",
  });  // State for form data
  const [inquirySource, setInquirySource] = useState("");  // State for Inquiry Source
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [countryList, setCountryList] = useState([]);
  const [stateList, setStateList] = useState([]);
  const [cityList, setCityList] = useState([]);
  const [inquirySourceList, setInquirySourceList] = useState([]);
  const navigate = useNavigate();

  const [deviceId, setDeviceId] = useState(null); // State to store the device ID
  const [deviceToken, setDeviceToken] = useState(null);
  //#endregion

  //#region useEffect Hooks to handle device token and fetch data
  useEffect(() => {
    // Check for stored device token
    const storedDeviceToken = sessionStorage.getItem("deviceToken");
    if (storedDeviceToken) {
      setDeviceToken(storedDeviceToken);
    } 
    else {
      // Get the device token if not stored
      const getDeviceToken = async () => {
        try {
          const currentToken = await getToken(messaging, { vapidKey: "BDwin9GPI89uYBOZ_kketB7Bko6cWpgVIiRed1FpdIbxMBihUYnpmDzupodPT5O2ESxHA4F9NVJm3jDvrzAYpC8" });
          if (currentToken) {
            setDeviceToken(currentToken);
            console.log(currentToken);
            sessionStorage.setItem("deviceToken", currentToken);
          } else {
            console.log("No device token available.");
          }
        } catch (error) {
          console.error("Error fetching device token:", error);
        }
      };
      getDeviceToken();
    }

    // Get the device ID using FingerprintJS
    const getDeviceId = async () => {
      const fp = await FingerprintJS.load();
      const result = await fp.get();
      setDeviceId(result.visitorId);
    };
    getDeviceId();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
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
  }, [formData.countryId, formData.stateId]);
  //#endregion

  //#region Form Validation and Submission
  const validateForm = () => {
    const newErrors = {};
    if (!formData.companyName) newErrors.companyName = "Company Name is required";
    if (!formData.contactPersonName) newErrors.contactPersonName = "Contact Person Name is required";
    if (!formData.email) newErrors.email = "Email name is required";
    if (!formData.contactPersonLinkedin) newErrors.contactPersonLinkedin = "Contact Person Linkedin is required";
    if (!formData.phoneNumber) newErrors.phoneNumber = "Phone Number is required";
    if (!formData.address) newErrors.address = "Address is required";
    if (!formData.countryId) newErrors.countryId = "Country is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // debugger;
    
    if (!validateForm()) return;

    // Initialize UAParser to get device information
    const parser = new UAParser();
    const result = parser.getResult();
    const { device, os } = result;

    // Collect device information
    const deviceInfoVM = {
      deviceId: deviceId || "Unknown Device ID",  // Include the device ID
      deviceToken: deviceToken || "Unknown Device Token",
      deviceName: device.model || "Unknown Device",
      deviceType: device.type || "Unknown Type",
      deviceOSName: os.name || "Unknown OS",
      deviceOSVersion: os.version || "Unknown Version",
    };

    // console.log(deviceInfoVM)
    
    const partnerData = {
      ...formData,
      stateId: formData.stateId === "" ? 0 : formData.stateId, // Convert empty string to 0
      cityId: formData.cityId === "" ? 0 : formData.cityId, // Convert empty string to 0
      deviceInfoVM
    }
    
    // const signInData = { email, password };
    
    setIsSubmitting(true);
    try {
      const response = await PartnerService.addPartner(
        partnerData
      );
      if (response.status === 1) {
        toast.success("Registration successfull!"); // Toast on success
      }
      if (response.status === 0) {
        toast.error("This Email Is Already Registered, Please Enter Another Valid Email"); // Toast on error
      } 
      // else {
      //   toast.error("Registration failed.");
      // }
    } catch (error) {
      console.error("Error during registration:", error);
      alert("Failed to registration. Please try again.");
    } finally {
      setIsSubmitting(false);
      // setLoading(false); // Stop loading spinner after request
    }
  };
  //#endregion

  //#region Handle Change Function
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };
  //#endregion

  //#region Render
  return (
    <>
      <div className="w-full min-h-screen flex items-center justify-center flex-col lg:flex-row bg-[#f3f4f6] bg-signin">
        <div className="w-full lg:w-auto md:w-auto flex gap-0 lg:gap-40 md:gap-38 flex-col md:flex-row items-center justify-center">
          <div className="w-full lg:w-1/3 md:w-1/2 p-4 flex flex-col justify-center items-center">
            <form
              onSubmit={handleSubmit}
              className="form-container w-full lg:w-[700px] md:w-[600px] flex flex-col gap-y-8 bg-white px-10 pt-14 pb-14 shadow-lg rounded-md"
            >
              <div>
                <p className="text-[#F9A01B] text-2xl font-bold text-center flex justify-center">
                  Partner Registration Form
                </p>
              </div>

              <div className="flex flex-col gap-y-5">
                {/* Company Name and Company Registration Number (two columns) */}
                <div className="flex gap-4">
                  {/* Company Name */}
                  <div className="w-full flex flex-col gap-1">
                    <label htmlFor="company name" className="text-slate-700 m-2">
                      Company Name
                    </label>
                    <input
                      type="text"
                      value={formData.companyName}
                      name="companyName"
                      placeholder="Enter Company Name"
                      onChange={handleChange}
                      className="bg-transparent px-3 py-2.5 2xl:py-3 border border-gray-300 placeholder-gray-400 text-gray-900 outline-none text-base focus:ring-2 ring-blue-300 w-full rounded-full"
                    />
                    {errors.companyName && (
                      <p className="text-red-500 text-xs">{errors.companyName}</p>
                    )}
                  </div> 

                  {/* Company Registration Number */}
                  <div className="w-full flex flex-col gap-1">
                    <label htmlFor="company registration number" className="text-slate-700 m-2">
                      Company Registration Number
                    </label>
                    <input
                      type="text"
                      value={formData.companyRegistrationNumber}
                      name="companyRegistrationNumber"
                      placeholder="Enter Company Registration Number"
                      onChange={handleChange}
                      className="bg-transparent px-3 py-2.5 2xl:py-3 border border-gray-300 placeholder-gray-400 text-gray-900 outline-none text-base focus:ring-2 ring-blue-300 w-full rounded-full"
                    />
                    {/* {errors.fname && (
                      <p className="text-red-500 text-xs">{errors.fname}</p>
                    )} */}
                  </div>
                </div>
                
                {/* Company Name and Company Registration Number (two columns) */}
                <div className="flex gap-4">
                 {/* Email */}
                  <div className="w-full flex flex-col gap-1">
                      <label htmlFor="email" className="text-slate-700 m-2">
                        Email
                      </label>
                      <input
                        type="email"
                        value={formData.email}
                        name="email"
                        placeholder="Enter Email Name"
                        onChange={handleChange}
                        className="bg-transparent px-3 py-2.5 2xl:py-3 border border-gray-300 placeholder-gray-400 text-gray-900 outline-none text-base focus:ring-2 ring-blue-300 w-full rounded-full"
                      />
                      {errors.email && (
                        <p className="text-red-500 text-xs">{errors.email}</p>
                      )}
                  </div> 

                  {/* Contact Person Name */}
                  <div className="w-full flex flex-col gap-1">
                    <label htmlFor="contact person name" className="text-slate-700 m-2">
                      Contact Person Name
                    </label>
                    <input
                      type="text"
                      value={formData.contactPersonName}
                      name="contactPersonName"
                      placeholder="Enter Contact Person Name"
                      onChange={handleChange}
                      className="bg-transparent px-3 py-2.5 2xl:py-3 border border-gray-300 placeholder-gray-400 text-gray-900 outline-none text-base focus:ring-2 ring-blue-300 w-full rounded-full"
                    />
                    {errors.contactPersonName && (
                      <p className="text-red-500 text-xs">{errors.contactPersonName}</p>
                    )}
                  </div>
                </div>

                {/* Company GST Number and Company Linkedin (two columns) */}
                <div className="flex gap-4">
                  {/* CompanyGSTNumber  */}
                  <div className="w-full flex flex-col gap-1">
                    <label htmlFor="nompany gST number" className="text-slate-700 m-2">
                      Company GST Number
                    </label>
                    <input
                      type="text"
                      value={formData.companyGSTNumber}
                      name="companyGSTNumber"
                      placeholder="Enter Company GST Number"
                      onChange={handleChange}
                      className="bg-transparent px-3 py-2.5 2xl:py-3 border border-gray-300 placeholder-gray-400 text-gray-900 outline-none text-base focus:ring-2 ring-blue-300 w-full rounded-full"
                    />
                  </div>  

                  {/* Company Linkedin */}
                  <div className="w-full flex flex-col gap-1">
                    <label htmlFor="company linkedin" className="text-slate-700 m-2">
                      Company Linkedin
                    </label>
                    <input
                      type="url"
                      value={formData.companyLinkedin}
                      name="companyLinkedin"
                      placeholder="Enter Company Linkedin"
                      onChange={handleChange}
                      className="bg-transparent px-3 py-2.5 2xl:py-3 border border-gray-300 placeholder-gray-400 text-gray-900 outline-none text-base focus:ring-2 ring-blue-300 w-full rounded-full"
                    />
                    {errors.companyLinkedin && (
                      <p className="text-red-500 text-xs">{errors.companyLinkedin}</p>
                    )}
                  </div>

                </div>

                {/* Phone Number and WhatsApp Number (two columns) */}
                <div className="flex gap-4">
                  {/* Phone Number */}
                  <div className="w-full flex flex-col gap-1">
                    <label htmlFor="phone number" className="text-slate-700 m-2">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      value={formData.phoneNumber}
                      name="phoneNumber"
                      placeholder="Enter Phone Number"
                      onChange={handleChange}
                      className="bg-transparent px-3 py-2.5 2xl:py-3 border border-gray-300 placeholder-gray-400 text-gray-900 outline-none text-base focus:ring-2 ring-blue-300 w-full rounded-full"
                    />
                    {errors.phoneNumber && (
                      <p className="text-red-500 text-xs">{errors.phoneNumber}</p>
                    )}
                  </div>

                  {/* WhatsApp Number */}
                  <div className="w-full flex flex-col gap-1">
                    <label htmlFor="whatsapp Number" className="text-slate-700 m-2">
                      WhatsApp Number
                    </label>
                    <input
                      type="tel"
                      value={formData.whatsAppNumber}
                      name="whatsAppNumber"
                      placeholder="Enter WhatsApp Number"
                      onChange={handleChange}
                      className="bg-transparent px-3 py-2.5 2xl:py-3 border border-gray-300 placeholder-gray-400 text-gray-900 outline-none text-base focus:ring-2 ring-blue-300 w-full rounded-full"
                    />
                    {errors.whatsAppNumber && (
                      <p className="text-red-500 text-xs">{errors.whatsAppNumber}</p>
                    )}
                  </div>
                </div>

                {/* Inquiry Source Dropdown and Country (two columns) */}
                <div className="flex gap-4">

                  {/* Contact Person Linkedin */}
                  <div className="w-full flex flex-col gap-1">
                  <label htmlFor="contact person linkedin" className="text-slate-700 m-2">
                    Contact Person Linkedin
                  </label>
                  <input
                    type="url"
                    value={formData.contactPersonLinkedin}
                    name="contactPersonLinkedin"
                    placeholder="Enter Contact Person Linkedin"
                    onChange={handleChange}
                    className="bg-transparent px-3 py-2.5 2xl:py-3 border border-gray-300 placeholder-gray-400 text-gray-900 outline-none text-base focus:ring-2 ring-blue-300 w-full rounded-full"
                  />
                  {errors.contactPersonLinkedin && (
                    <p className="text-red-500 text-xs">{errors.contactPersonLinkedin}</p>
                  )}
                  </div>

                  {/* Country */}
                  <div className="w-full flex flex-col gap-1">
                    <label
                      htmlFor="countryId"
                      className="text-slate-700 m-2"
                    >
                      Country
                    </label>
                    <select
                      value={formData.countryId}
                      onChange={handleChange}
                      name="countryId"
                      className="bg-transparent px-3 py-2.5 2xl:py-3 border border-gray-300 placeholder-gray-400 text-gray-900 outline-none text-base focus:ring-2 ring-blue-300 w-full rounded-full"
                    >
                      <option className="text-grey" value="">
                        --Select Country--
                      </option>
                      {countryList.length > 0 ? (
                        countryList.map((country) => (
                          <option
                            key={country.countryId}
                            value={country.countryId}
                          >
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
                      <p className="text-red-500 text-xs">
                        {errors.countryId}
                      </p>
                    )}
                  </div>

                </div>

                {/* State and City (two columns) */}
                <div className="flex gap-4">

                  {/* State */}
                  <div className="w-full flex flex-col gap-1">
                    <label
                      htmlFor="stateId"
                      className="text-slate-700 m-2"
                    >
                      State
                    </label>
                    <select
                      value={formData.stateId}
                      onChange={handleChange}
                      name="stateId"
                      className="bg-transparent px-3 py-2.5 2xl:py-3 border border-gray-300 placeholder-gray-400 text-gray-900 outline-none text-base focus:ring-2 ring-blue-300 w-full rounded-full"
                    >
                      <option className="text-grey" value="">
                        --Select State--
                      </option>
                      {stateList.length > 0 ? (
                        stateList.map((state) => (
                          <option
                            key={state.stateId}
                            value={state.stateId}
                          >
                            {state.name}
                          </option>
                        ))
                      ) : (
                        <option value="" disabled>
                          No states available
                        </option>
                      )}
                    </select>
                  </div>

                  {/* City */}
                  <div className="w-full flex flex-col gap-1">
                    <label
                      htmlFor="cityId"
                      className="text-slate-700 m-2"
                    >
                      City
                    </label>
                    <select
                      value={formData.cityId}
                      onChange={handleChange}
                      name="cityId"
                      className="bg-transparent px-3 py-2.5 2xl:py-3 border border-gray-300 placeholder-gray-400 text-gray-900 outline-none text-base focus:ring-2 ring-blue-300 w-full rounded-full"
                    >
                      <option className="text-grey" value="">
                        --Select City--
                      </option>
                      {cityList.length > 0 ? (
                        cityList.map((city) => (
                          <option
                            key={city.cityId}
                            value={city.cityId}
                          >
                            {city.name}
                          </option>
                        ))
                      ) : (
                        <option value="" disabled>
                          No cities available
                        </option>
                      )}
                    </select>
                  </div>
                </div>

                {/* Address*/}
                <div className="w-full flex flex-col gap-1">
                  <label htmlFor="address" className="text-slate-700 m-2">
                    Address
                  </label>
                  <input
                    type="text"
                    value={formData.address}
                    name="address"
                    placeholder="Enter Address"
                    onChange={handleChange}
                    className="bg-transparent px-3 py-2.5 2xl:py-3 border border-gray-300 placeholder-gray-400 text-gray-900 outline-none text-base focus:ring-2 ring-blue-300 w-full rounded-full"
                  />
                  {errors.address && (
                    <p className="text-red-500 text-xs">{errors.address}</p>
                  )}
                </div>

                {/* Company Website */}
                <div className="w-full flex flex-col gap-1">
                  <label htmlFor="company website" className="text-slate-700 m-2">
                    Company Website
                  </label>
                  <input
                    type="url"
                    value={formData.companyWebsite}
                    name="companyWebsite"
                    placeholder="Enter Company Website"
                    onChange={handleChange}
                    className="bg-transparent px-3 py-2.5 2xl:py-3 border border-gray-300 placeholder-gray-400 text-gray-900 outline-none text-base focus:ring-2 ring-blue-300 w-full rounded-full"
                  />
                  {errors.CompanyWebsite  && (
                    <p className="text-red-500 text-xs">{errors.CompanyWebsite }</p>
                  )}
                </div>

                <button
                  type="submit"
                  className={`w-full h-10 bg-[#0074BD] hover:bg-[#0075bdd4] active:border-[#a8adf4] outline-none active:border-2 focus:ring-2 ring-blue-300 text-white rounded-full ${
                    isSubmitting ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Submitting..." : "Register"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
  //#endregion
};

export default PartnerRegistration;
//#endregion