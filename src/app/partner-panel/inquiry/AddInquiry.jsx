//#region Import
import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { FaArrowLeft } from 'react-icons/fa';
import { InquiryTypeService } from '../../service/InquiryTypeService';
import { InquirySourceService } from '../../service/InquirySourceService';
import { toast } from 'react-toastify';
import { InquiryService } from '../../service/InquiryService';
import { el } from 'date-fns/locale';
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

//#region Component: AddInquiry Component
const AddInquiry = () => {
  //#region State Variables
  const [formData, setFormData] = useState({
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
    inquiryDocuments: '', // Store file here
  });

  const role = sessionStorage.getItem("role");
  // console.log(role);

  const [inquiryTypeList, setInquiryTypeList] = useState([]);
  const [inquirySourceList, setInquirySourceList] = useState([]);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const navigate = useNavigate();
  //#endregion

  //#region Data Fetching
  useEffect(() => {
    const fetchData = async () => {
      try {
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
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    setFormData(prev => ({ ...prev, [name]: files[0] }));  // Storing the first file
  };  

  const validate = () => {
    const newErrors = {};
    if (!formData.inquiryTitle) newErrors.inquiryTitle = "Project Title is required.";
    if (!formData.inquiryLocation) newErrors.inquiryLocation = "Project Location is required.";
    if (!formData.inquiryTypeId) newErrors.inquiryTypeId = "Project Type is required.";
    // if (!formData.inquirySourceId) newErrors.inquirySourceId = "Project Source is required.";
    if (!formData.customerName) newErrors.customerName = "Customer Name is required.";
    // if (!formData.customerContactInfo) newErrors.customerContactInfo = "Customer Contact Info is required.";
    // if (!formData.estimatedValue) newErrors.estimatedValue = "Estimated Value is required.";
    if (!formData.priorityLevel) newErrors.priorityLevel = "Priority Level is required.";
    if (!formData.inquiryDescription) newErrors.inquiryDescription = "Project Description is required.";
    // if (!formData.specialNotes) newErrors.specialNotes = "Special Notes are required.";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    // debugger;

    // Validate form before submitting
    if (!validate()) {
      setIsSubmitting(false);
      return; // Prevent form submission if validation fails
    }

    // const formDataToSend = new FormData();
    // Object.keys(formData).forEach((key) => {
    //   formDataToSend.append(key, formData[key]);
    // });

    const formDataToSend = new FormData();

    // Append all form fields to the FormData object
    Object.keys(formData).forEach((key) => {
      // Append the field as normal if it's not a file
      formDataToSend.append(key, formData[key]);
    });

     // Make sure the file is also appended
    if (formData.inquiryDocuments) {
      formDataToSend.append('inquiryDocuments', formData.inquiryDocuments);
    }
    // console.log(formDataToSend);
    // console.log(formData);

    try {
      // debugger;
      if (role === "partner") {
        const result = await InquiryService.addInquiry(formDataToSend);
        if (result.status === 1) {
          toast.success("Inquiry added successfully!");
          navigate(-1);
        } else {
          toast.error("Faild to add inquiry!");
          // console.log(result.data);
          // setErrors({ general: "Something went wrong, please try again later." });
        }
      } else if (role === "company") {
        const result = await InquiryService.addInquiryByCompany(formDataToSend);
        if (result.status === 1) {
          toast.success("Inquiry added successfully!");
          navigate(-1);
        } 
        else {
          toast.error("Faild to add inquiry!");
          // console.log(result.data);
          // setErrors({ general: "Something went wrong, please try again later." });
        }
      } else if (role === "vendor") {
        const result = await InquiryService.addInquiryByVendor(formDataToSend);
        if (result.status === 1) {
          toast.success("Inquiry added successfully!");
          navigate(-1);
        } 
        else {
          toast.error("Faild to add inquiry!");
        }
      } else {
        toast.error("You are not authorized to add inquiry!");
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      // setErrors({ general: "Something went wrong, please try again later." });
    }
    
    setIsSubmitting(false);
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
            <InputField
              label="Project Title"
              value={formData.inquiryTitle}
              onChange={handleInputChange}
              name="inquiryTitle"
              error={errors.inquiryTitle}
              className="md:w-1/3" // Applied w-1/2 for Inquiry Description
            />
            <InputField
              label="Project Location"
              value={formData.inquiryLocation}
              onChange={handleInputChange}
              name="inquiryLocation"
              error={errors.inquiryLocation}
              className="md:w-1/3" // Applied w-1/2 for Inquiry Description
            />
            <SelectField
              label="Project Type"
              value={formData.inquiryTypeId}
              onChange={handleInputChange}
              name="inquiryTypeId"
              options={inquiryTypeList.map(item => ({ id: item.inquiryTypeId, name: item.inquiryTypeName }))}
              error={errors.inquiryTypeId}
              className="md:w-1/3" // Applied w-1/2 for Inquiry Description
            />
            <SelectField
              label="Project Source"
              value={formData.inquirySourceId}
              onChange={handleInputChange}
              name="inquirySourceId"
              options={inquirySourceList.map(item => ({ id: item.inquirySourceId, name: item.inquirySourceName }))}
              error={errors.inquirySourceId}
              className="md:w-1/3" // Applied w-1/2 for Inquiry Description
            />
            <InputField
              label="Customer Name"
              value={formData.customerName}
              onChange={handleInputChange}
              name="customerName"
              error={errors.customerName}
              className="md:w-1/3" // Applied w-1/2 for Inquiry Description
            />
            <InputField
              label="Customer Contact Info"
              value={formData.customerContactInfo}
              onChange={handleInputChange}
              name="customerContactInfo"
              error={errors.customerContactInfo}
              className="md:w-1/3" // Applied w-1/2 for Inquiry Description
            />
            <InputField
              label="Estimated Value"
              type="number"
              value={formData.estimatedValue}
              onChange={handleInputChange}
              name="estimatedValue"
              error={errors.estimatedValue}
              className="md:w-1/3" // Applied w-1/2 for Inquiry Description
            />
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
              className="md:w-1/3" // Applied w-1/2 for Inquiry Description
            />
            {/* <InputField
              label="Inquiry Document"
              value={formData.inquiryDocuments}
              onChange={handleFileChange}
              name="inquiryDocuments"
              type="file"
              error={errors.inquiryDocuments}
              className="md:w-1/3"  // Optional, adjust width as needed
            /> */}
            
            <InputField
              label="Project Document"
              value={formData.inquiryDocuments}
              onChange={handleFileChange}
              name="inquiryDocuments"
              type="file"
              error={errors.inquiryDocuments}
              className="md:w-1/3"
            />
            <InputField
              label="Project Description"
              value={formData.inquiryDescription}
              onChange={handleInputChange}
              name="inquiryDescription"
              type="textarea"
              error={errors.inquiryDescription}
              className="md:w-1/2" // Applied w-1/2 for Inquiry Description
            />
            <InputField
              label="Special Notes"  // Replaced reasonForClosure with specialNotes
              value={formData.specialNotes}
              onChange={handleInputChange}
              name="specialNotes"
              type="textarea"
              error={errors.specialNotes}
              className="md:w-1/2" // Applied w-1/2 for Inquiry Description
            />

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

export default AddInquiry;
//#endregion
