//#region Import
import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { FaArrowLeft } from 'react-icons/fa';
import { InquiryTypeService } from '../../service/InquiryTypeService';
import { InquirySourceService } from '../../service/InquirySourceService';
import { toast } from 'react-toastify';
import { InquiryService } from '../../service/InquiryService';
import { PartnerService } from '../../service/PartnerService';
import { ClientCompanyService } from '../../service/ClientCompanyService';
import { VendorService } from '../../service/VendorService';
//#endregion

//#region InputField Component
const InputField = ({ label, value, onChange, name, type = 'text', error, className }) => (
  <div className={`w-full mb-2 px-3 ${className}`}>
    <label className="block text-base font-medium">{label}</label>
    {type === 'textarea' ? (
      <textarea
        name={name}
        value={value}
        onChange={onChange}
        placeholder={label}
        className="w-full mb-2 bg-transparent rounded-md border py-[10px] px-4 text-dark border-active"
        rows="3"
      />
    ): type === 'file' ? (
      <input
        name={name}
        type="file"
        onChange={onChange}
        className="w-full mb-2 bg-transparent rounded-md border py-[10px] px-4 text-dark border-active"
      />
    ) : (
      <input
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={label}
        className="w-full mb-2 bg-transparent rounded-md border py-[10px] px-4 text-dark border-active"
      />
    )}
    {error && <p className="text-red-500 text-xs">{error}</p>}
  </div>
);
//#endregion

//#region SelectField Component
const SelectField = ({ label, value, onChange, name, options, error }) => (
  <div className="w-full mb-2 px-3 md:w-1/3">
    <label className="block text-base font-medium">{label}</label>
    <select
      name={name}
      value={value}
      onChange={onChange}
      className="w-full mb-2 rounded-md border py-[10px] px-4 border-active"
    >
      <option value="" className="text-gray-400">--Select {label}--</option>
      {options.length > 0 ? (
        options.map((item) => (
          <option key={item.id} value={item.id}>
            {item.name}
          </option>
        ))
      ) : (
        <option value="" disabled>No options available</option>
      )}
    </select>
    {error && <p className="text-red-500 text-xs">{error}</p>}
  </div>
);
//#endregion

//#region Component: AddProject Component
const AddProject = () => {
  //#region State Variables
  const [formData, setFormData] = useState({
    partnerRegistrationId: '',
    clientRegistrationId: '',
    vendorId: '',
    inquiryTitle: '',
    inquiryLocation: '',
    inquiryTypeId: '',
    inquirySourceId: '',
    customerName: '',
    customerContactInfo: '',
    estimatedValue: '',
    inquiryDescription: '',
    priorityLevel: '',
    // inquiryStatus: '',
    specialNotes: '',  // Replaced reasonForClosure with specialNotes
    inquiryDocuments: null, // Store file here
  });
  const [partnerList, setPartnerList] = useState([]);
  const [clientCompanyList, setClientCompanyList] = useState([]);
  const [vendorList, setVendorList] = useState([]);
  const [inquiryTypeList, setInquiryTypeList] = useState([]);
  const [inquirySourceList, setInquirySourceList] = useState([]);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedType, setSelectedType] = useState('partner'); // New state for selecting Partner or Client Company
  const navigate = useNavigate();
  //#endregion

  //#region Data Fetching
  useEffect(() => {
    const fetchData = async () => {
      try {
        const partnerResult = await PartnerService.getPartner();
        setPartnerList(partnerResult.data.filter(item => item.isActive));

        const clientCompanyResult = await ClientCompanyService.getClientCompany();
        setClientCompanyList(clientCompanyResult.data.filter(item => item.isActive));
        
        const vendorResult = await VendorService.getVendor();
        setVendorList(vendorResult.data.filter(item => item.isActive));

        const inquiryTypeResult = await InquiryTypeService.getInquiryType();
        setInquiryTypeList(inquiryTypeResult.data.filter(item => item.isActive));

        const inquirySourceResult = await InquirySourceService.getInquirySource();
        setInquirySourceList(inquirySourceResult.data.filter(item => item.isActive));
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, []);
  //#endregion

  //#region Event Handlers
  const handleInputChange = (e) => {
    const { name, value } = e.target;

    // Regex for 10-digit number validation
    const phoneNumberRegex = /^[0-9]{10}$/;
    
    // If the field is either phoneNumber or whatsAppNumber, validate the input
    if (name === "customerContactInfo" && value && !phoneNumberRegex.test(value)) {
      setErrors((prev) => ({ ...prev, [name]: "Please enter a valid 10-digit number" }));
    } else {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }

    setFormData(prev => ({ ...prev, [name]: value }));

    // If Partner is selected, reset clientRegistrationId, and vice versa
    if (['partnerRegistrationId', 'clientRegistrationId', 'vendorId'].includes(name)) {
      // Reset other fields based on selected type
      const resetFields = { partnerRegistrationId: '', clientRegistrationId: '', vendorId: '' };
      resetFields[name] = value;
      setFormData(prev => ({ ...prev, ...resetFields }));
    }
    // if (name === 'partnerRegistrationId' && selectedType === 'partner') {
    //     setFormData(prev => ({
    //       ...prev,
    //       [name]: value,
    //       clientRegistrationId: null, // Reset clientRegistrationId
    //       vendorId: null // Reset vendorId
    //     }));
    //   } else if (name === 'clientRegistrationId' && selectedType === 'clientCompany') {
    //     setFormData(prev => ({
    //       ...prev,
    //       [name]: value,
    //       partnerRegistrationId: null, // Reset partnerRegistrationId
    //       vendorId: null // Reset vendorId
    //     }));
    //   } else if (name === 'vendorId' && selectedType === 'vendor') {
    //     setFormData(prev => ({
    //       ...prev,
    //       [name]: value,
    //       clientRegistrationId: null, // Reset clientRegistrationId,
    //       partnerRegistrationId: null // Reset partnerRegistrationId
    //     }));
    //   } else {
    //     setFormData(prev => ({ ...prev, [name]: value }));
    //   }
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    setFormData(prev => ({ ...prev, [name]: files[0] }));  // Storing the first file
  };  

  const validateForm = () => {
    const newErrors = {};
    if (!formData.inquiryTitle) newErrors.inquiryTitle = "Project Title is required";
    if (!formData.inquiryLocation) newErrors.inquiryLocation = "Project Location is required";
    if (!formData.inquiryDescription) newErrors.inquiryDescription = "Project Description is required";
    if (!formData.inquiryTypeId) newErrors.inquiryTypeId = "Project Type is required.";
    if (!formData.customerName) newErrors.customerName = "Customer Name is required.";
    if (!formData.priorityLevel) newErrors.priorityLevel = "Priority Level is required.";
    if (!formData.inquiryDescription) newErrors.inquiryDescription = "Project Description is required.";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // setIsSubmitting(true);

    // debugger;
    // Add form validation logic here
    // Add form validation and submission logic here

    if (!validateForm()) return;

    const formDataToSend = new FormData();

    // Conditionally append values based on selected type (Partner or Client Company)
    // Conditionally append values based on selected type
    if (selectedType === 'partner' && formData.partnerRegistrationId) {
      formDataToSend.append('partnerRegistrationId', formData.partnerRegistrationId);
    } else if (selectedType === 'clientCompany' && formData.clientRegistrationId) {
      formDataToSend.append('clientRegistrationId', formData.clientRegistrationId);
    } else if (selectedType === 'vendor' && formData.vendorId) {
      formDataToSend.append('vendorId', formData.vendorId);
    }

    // if (selectedType === 'partner') {
    //   if (formData.partnerRegistrationId) {
    //     formDataToSend.append('partnerRegistrationId', formData.partnerRegistrationId);
    //   }
    // } else if (selectedType === 'clientCompany') {
    //   if (formData.clientRegistrationId) {
    //     formDataToSend.append('clientRegistrationId', formData.clientRegistrationId);
    //   }
    // } else if (selectedType === 'vendor') {
    //   if (formData.vendorId) {
    //     formDataToSend.append('vendorId', formData.vendorId);
    //   }
    // }
  
    // Append other form fields to FormData
    Object.keys(formData).forEach((key) => {
      if (!['partnerRegistrationId', 'clientRegistrationId', 'vendorId'].includes(key)) {
        formDataToSend.append(key, formData[key]);
      }
      // if (key !== 'partnerRegistrationId' && key !== 'clientRegistrationId' && key !== 'vendorId') {
      //   formDataToSend.append(key, formData[key]);
      // }
    });

    // const formDataToSend = new FormData();
    // Object.keys(formData).forEach((key) => {
    //   formDataToSend.append(key, formData[key]);
    // });

    // console.log(formDataToSend);
    // console.log(formData);

    setIsSubmitting(true);

    try {
      const result = await InquiryService.addInquiryByAdmin(formDataToSend);
      if (result.status === 1) {
        navigate(-1);
        toast.success("Project added successfully!");
      } else {
        toast.error("Faild to add Project!");
        // console.log(result.data);
        // setErrors({ general: "Something went wrong, please try again later." });
      }
    //   const result = InquiryService.addInquiry(formDataToSend);
    //   if (result.status === 201) {
    //     toast.success("Inquiry added successfully!");
    //     navigate(-1);
    //   } else {    
    //     setErrors({ general: "Something went wrong, please try again later." });
    //   }
    //   // navigate('/success');
    } catch (error) {
      console.error("Error submitting form:", error);
      setErrors({ general: "Something went wrong, please try again later." });
    }
    finally {
      setIsSubmitting(false);
      // setLoading(false); // Stop loading spinner after request
    }    
  };
  //#endregion

  //#region Render
  return (
    <div>
      {/* Header + Buttons */}
      <div className="flex justify-between items-center my-3">
        <h1 className="font-semibold text-2xl">Add Project</h1>
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

      {/* Form Section */}
      <section className="bg-white rounded-lg shadow-lg m-1 py-8">
        <form onSubmit={handleSubmit} className="container">
          <div className="-mx-4 px-10 mt- flex flex-wrap">

            {/* Radio buttons for selecting Partner or Client Company */}
            <div className="w-full mb-4 px-3">
              <label className="block text-base font-medium">Created for:</label>
              <div className="flex items-center gap-6">
                <label>
                  <input
                    type="radio"
                    name="createdFor"
                    value="partner"
                    checked={selectedType === 'partner'}
                    onChange={() => setSelectedType('partner')}
                    className="mr-2"
                  />
                  Partner
                </label>
                <label>
                  <input
                    type="radio"
                    name="createdFor"
                    value="clientCompany"
                    checked={selectedType === 'clientCompany'}
                    onChange={() => setSelectedType('clientCompany')}
                    className="mr-2"
                  />
                  Client Company
                </label>
                <label>
                  <input
                    type="radio"
                    name="createdFor"
                    value="vendor"
                    checked={selectedType === 'vendor'}
                    onChange={() => setSelectedType('vendor')}
                    className="mr-2"
                  />
                  Vendor
                </label>
              </div>
            </div>

            {/* Conditionally render Partner or Client Company drop-down */}
            {selectedType === 'partner' && (
              <SelectField
                label="Partner"
                value={formData.partnerRegistrationId}
                onChange={handleInputChange}
                name="partnerRegistrationId"
                options={partnerList.map(item => ({ id: item.partnerRegistrationId, name: item.companyName }))}
                error={errors.partnerRegistrationId}
                className="md:w-1/3" 
              />
            )}

            {selectedType === 'clientCompany' && (
              <SelectField
                label="Client Company"
                value={formData.clientRegistrationId}
                onChange={handleInputChange}
                name="clientRegistrationId"
                options={clientCompanyList.map(item => ({ id: item.clientRegistrationId, name: item.companyName }))}
                error={errors.clientRegistrationId}
                className="md:w-1/3"
              />
            )}

            {selectedType === 'vendor' && (
              <SelectField
                label="Vendor"
                value={formData.vendorId}
                onChange={handleInputChange}
                name="vendorId"
                options={vendorList.map(item => ({ id: item.vendorId, name: item.companyName }))}
                error={errors.vendorId}
                className="md:w-1/3"
              />
            )}

            {/* Project Title Field */}
            <InputField
              label="Project Title"
              value={formData.inquiryTitle}
              onChange={handleInputChange}
              name="inquiryTitle"
              error={errors.inquiryTitle}
              className="md:w-1/3" 
            />
            {/* Project Location Field */}
            <InputField
              label="Project Location"
              value={formData.inquiryLocation}
              onChange={handleInputChange}
              name="inquiryLocation"
              error={errors.inquiryLocation}
              className="md:w-1/3" 
            />
            {/* Project Type */}
            <SelectField
              label="Project Type"
              value={formData.inquiryTypeId}
              onChange={handleInputChange}
              name="inquiryTypeId"
              options={inquiryTypeList.map(item => ({ id: item.inquiryTypeId, name: item.inquiryTypeName }))}
              error={errors.inquiryTypeId}
              className="md:w-1/3" 
            />
            {/* Project Source */}
            <SelectField
              label="Project Source"
              value={formData.inquirySourceId}
              onChange={handleInputChange}
              name="inquirySourceId"
              options={inquirySourceList.map(item => ({ id: item.inquirySourceId, name: item.inquirySourceName }))}
              error={errors.inquirySourceId}
              className="md:w-1/3" 
            />
            {/* Customer Name */}
            <InputField
              label="Customer Name"
              value={formData.customerName}
              onChange={handleInputChange}
              name="customerName"
              error={errors.customerName}
              className="md:w-1/3" 
            />
            {/* Customer Contact Info */}
            <InputField
              label="Customer Contact Info"
              value={formData.customerContactInfo}
              onChange={handleInputChange}
              name="customerContactInfo"
              error={errors.customerContactInfo}
              className="md:w-1/3" 
            />
            {/* Estimated Value */}
            <InputField
              label="Estimated Value"
              type="number"
              value={formData.estimatedValue}
              onChange={handleInputChange}
              name="estimatedValue"
              error={errors.estimatedValue}
              className="md:w-1/3" 
            />
            {/* Priority Level */}
            <SelectField
              label="Priority Level"
              value={formData.priorityLevel}
              onChange={handleInputChange}
              name="priorityLevel"
              options={[
                { id: '1', name: 'High' },
                { id: '2', name: 'Medium' },
                { id: '3', name: 'Low' },
              ]}
              error={errors.priorityLevel}
              className="md:w-1/3" 
            />
            {/* Project Document */}
            <InputField
              label="Project Document"
              value={formData.inquiryDocuments}
              onChange={handleFileChange}
              name="inquiryDocuments"
              type="file"
              error={errors.inquiryDocuments}
              className="md:w-1/3"
            />
            {/* Project Description */}
            <InputField
              label="Project Description"
              value={formData.inquiryDescription}
              onChange={handleInputChange}
              name="inquiryDescription"
              type="textarea"
              error={errors.inquiryDescription}
              className="md:w-1/2" // Applied w-1/2 for Project Description
            />
            {/* Special Notes */}
            <InputField
              label="Special Notes"  // Replaced reasonForClosure with specialNotes
              value={formData.specialNotes}
              onChange={handleInputChange}
              name="specialNotes"
              type="textarea"
              error={errors.specialNotes}
              className="md:w-1/2" 
            />
            {/* Submit Button */}
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
                {isSubmitting ? "Submitting..." : "Add Project"}
              </motion.button>
            </div>
          </div>
        </form>
      </section>
    </div>
  );
  //#endregion
};

export default AddProject;
//#endregion