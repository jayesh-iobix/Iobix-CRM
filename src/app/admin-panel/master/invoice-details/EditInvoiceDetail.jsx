//#region Imports
import React, { useEffect, useState } from 'react'
import { FaArrowLeft } from "react-icons/fa";
import { Link, useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { motion } from "framer-motion"; // Import framer-motion
import { TaxDetailService } from '../../../service/TaxDetailService';
import { InvoiceDetailService } from '../../../service/InvoiceDetailService';
//#endregion


//#region Component: EditInvoiceDetail
const EditInvoiceDetail = () => {
  //#region State Variables
  const [formData, setFormData] = useState({
    companyLogo: "",
    companyName: "",
    companyAddress: "",
    panNumber: "",
    gstNumber: "",
    lutNumber: "",
    companyStamp: "",
    bankName: "",
    chequeName: "",
    accountNumber: "",
    branch: "",
    ifscCode: "",
    swiftCode: "",
    isActive: ""
  });
//   const [isActive, setIsActive] = useState(""); // New state for checkbox
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  const { id } = useParams();
  //#endregion

  //#region useEffect - Fetch Invoice Detail data
  useEffect(() => {
    const fetchData = async () => {
      const result = await InvoiceDetailService.getByIdInvoiceDetail(id);
      setFormData(result.data);
      console.log(result.data);
    //   setIsActive(result.data.isActive); // Assuming the department object contains isActive
    };
    fetchData();
  }, [id]);
  //#endregion

  //#region Validation Function & Form Submission
  const validateForm = () => {
    const newErrors = {};
    if (!formData.companyName)
      newErrors.companyName = "Company Name is required";
    if (!formData.companyAddress)
      newErrors.companyAddress = "Company Address is required";
    if (!formData.companyLogo)
      newErrors.companyLogo = "Company Logo is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (validateForm()) {
      setIsSubmitting(true);

      // Simulate API call or form submission logic
      setTimeout(() => {
        setIsSubmitting(false);
      }, 1000); // Simulate a delay for submission
    }

    debugger;

    const formDataToSend = new FormData();

    // Append the InvoiceDetails as a JSON string
    // Flattened keys - send each field separately
    formDataToSend.append('InvoiceDetails.CompanyName', formData.companyName);
    formDataToSend.append('InvoiceDetails.CompanyAddress', formData.companyAddress);
    formDataToSend.append('InvoiceDetails.PanNumber', formData.panNumber);
    formDataToSend.append('InvoiceDetails.GstNumber', formData.gstNumber);
    formDataToSend.append('InvoiceDetails.LutNumber', formData.lutNumber);
    formDataToSend.append('InvoiceDetails.BankName', formData.bankName);
    formDataToSend.append('InvoiceDetails.ChequeName', formData.chequeName);
    formDataToSend.append('InvoiceDetails.AccountNumber', formData.accountNumber);
    formDataToSend.append('InvoiceDetails.Branch', formData.branch);
    formDataToSend.append('InvoiceDetails.IfscCode', formData.ifscCode);
    formDataToSend.append('InvoiceDetails.SwiftCode', formData.swiftCode);
    formDataToSend.append('InvoiceDetails.IsActive', formData.isActive);

    // Fix here: send empty or actual file names for validation
    // formDataToSend.append('InvoiceDetails.CompanyLogo', formData.companyLogo?.name || '');
    if (formData.companyLogo instanceof File) {
      formDataToSend.append("InvoiceDetails.CompanyLogo", formData.companyLogo?.name || '');
    }
    else{
      formDataToSend.append("InvoiceDetails.CompanyLogo", formData.companyLogo);
    }
    if(formData.companyStamp instanceof File)
    {
     formDataToSend.append('InvoiceDetails.CompanyStamp', formData.companyStamp?.name || '');
    }
    else{
      formDataToSend.append('InvoiceDetails.CompanyStamp', formData.companyStamp);
    }

    // Append file fields correctly
    if (formData.companyLogo) {
      formDataToSend.append("companyLogoFile", formData.companyLogo);
    }

    if (formData.companyStamp) {
      formDataToSend.append("companyStampFile", formData.companyStamp);
    }

    for (const [key, value] of formDataToSend.entries()) {
      console.log(`${key}:`, value);
    }

    // // Logic for form submission goes here
    // const invoiceDetailData = {
    //   ...formData,
    //   isActive,
    // };

    if (validateForm()) {
      try {
        const response = await InvoiceDetailService.updateInvoiceDetail(id, formDataToSend);
        console.log(response);
        if (response.status === 1) {
          navigate(-1);
          toast.success("Invoice Detail Updated successfully"); // Toast on success
          // navigate('/master/leave-type-list');
        }
        if(response.status === 0)
        {
          toast.error(response.message); // Toast on success
        }
        // Reset the form
      } catch (error) {
        console.error("Error adding invoice detail:", error);
        alert("Failed to add invoice detail.");
      }
    }
  };
  //#endregion

  //#region Handle Change Function
  const handleChange = (e) => {
    const { name, value } = e.target;

    // Update form data for all fields
    setFormData((prev) => ({ ...prev, [name]: value }));
  };
  //#endregion

  //#region Handle FIle Change Function
  const handleFileChange = (e) => {
    const { name, files } = e.target;
    setFormData(prev => ({ ...prev, [name]: files[0] }));  // Storing the first file
  };
  //#endregion

  //#region Render
  return (
    <>
      {/* Header Section */}
      <div className="flex justify-between items-center my-3">
        <h1 className="font-semibold text-2xl">Edit Invoice Detail</h1>
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
      <section className="bg-white rounded-lg  shadow-sm m-1 py-8 pt-">
        <form onSubmit={handleSubmit} className="container">
          <div className="-mx-4 px-10 mt- flex flex-wrap">
            {/* Company Name */}
            <div className="w-full mb-2 px-3 md:w-1/3 lg:w-1/3">
              <label className="mb-[10px] block text-base font-medium text-dark dark:text-white">
                Company Name
              </label>
              <input
                type="text"
                placeholder="Company Name"
                value={formData.companyName}
                onChange={handleChange}
                name="companyName"
                className="w-full mb-2 bg-transparent rounded-md border border-red py-3 px-4 text-dark-6 border-active transition"
                autoFocus
              />
              {errors.companyName && (
                <p className="text-red-500 text-xs">{errors.companyName}</p>
              )}
            </div>

            {/* Company GST No */}
            <div className="w-full mb-2 px-3 md:w-1/3 lg:w-1/3">
              <label className="mb-[10px] block text-base font-medium text-dark dark:text-white">
                Company GST No.
              </label>
              <input
                type="text"
                placeholder="Company GST No"
                value={formData.gstNumber}
                onChange={handleChange}
                name="gstNumber"
                className="w-full mb-2 bg-transparent rounded-md border border-red py-3 px-4 text-dark-6 border-active transition"
              />
            </div>

            {/* LUT No */}
            <div className="w-full mb-2 px-3 md:w-1/3 lg:w-1/3">
              <label className="mb-[10px] block text-base font-medium text-dark dark:text-white">
                LUT No.
              </label>
              <input
                type="text"
                placeholder="LUT No"
                value={formData.lutNumber}
                onChange={handleChange}
                name="lutNumber"
                className="w-full mb-2 bg-transparent rounded-md border border-red py-3 px-4 text-dark-6 border-active transition"
              />
            </div>

            {/* PAN No */}
            <div className="w-full mb-2 px-3 md:w-1/3 lg:w-1/3">
              <label className="mb-[10px] block text-base font-medium text-dark dark:text-white">
                PAN No.
              </label>
              <input
                type="text"
                placeholder="PAN No"
                value={formData.panNumber}
                onChange={handleChange}
                name="panNumber"
                className="w-full mb-2 bg-transparent rounded-md border border-red py-3 px-4 text-dark-6 border-active transition"
              />
            </div>

            {/* Company Logo */}
            <div className="w-full mb-2 px-3 md:w-1/3 lg:w-1/3">
              <label className="mb-[10px] block text-base font-medium text-dark dark:text-white">
                Company Logo
              </label>
              <input
                type="file"
                placeholder="Company Logo"
                // value={formData.companyLogo}
                onChange={handleFileChange}
                name="companyLogo"
                className="w-full mb-2 bg-transparent rounded-md border border-red py-3 px-4 text-dark-6 border-active transition"
              />
              {errors.companyLogo && (
                <p className="text-red-500 text-xs">{errors.companyLogo}</p>
              )}
            </div>

            {/* Company Stamp */}
            <div className="w-full mb-2 px-3 md:w-1/3 lg:w-1/3">
              <label className="mb-[10px] block text-base font-medium text-dark dark:text-white">
                Company Stamp
              </label>
              <input
                type="file"
                placeholder="Company Stamp"
                // value={formData.companyStamp}
                onChange={handleFileChange}
                name="companyStamp"
                className="w-full mb-2 bg-transparent rounded-md border border-red py-3 px-4 text-dark-6 border-active transition"
              />
            </div>

            {/* Company Address */}
            <div className="w-full mb-2 px-3">
              <label className="mb-[10px] block text-base font-medium text-dark dark:text-white">
                Company Address
              </label>
              <textarea
                name="companyAddress"
                value={formData.companyAddress}
                onChange={handleChange}
                rows="3"
                className="w-full mb-2 bg-transparent rounded-md border border-red py-[8px] pl-5 pr-12 text-dark-6 border-active transition"
              ></textarea>
              {errors.companyAddress && (
                <p className="text-red-500 text-xs">{errors.companyAddress}</p>
              )}
            </div>

            {/* Bank Details */}
            {/* <div className="w-full mb-2 px-3 text-gray-500 font-bold">
                    <hr/>
                    <p>Company Bank Details</p>
                </div> */}

            {/* Bank Name */}
            <div className="w-full mb-2 px-3 md:w-1/3 lg:w-1/3">
              <label className="mb-[10px] block text-base font-medium text-dark dark:text-white">
                Bank Name
              </label>
              <input
                type="text"
                placeholder="Bank Name"
                value={formData.bankName}
                onChange={handleChange}
                name="bankName"
                className="w-full mb-2 bg-transparent rounded-md border border-red py-3 px-4 text-dark-6 border-active transition"
              />
            </div>

            {/* Cheque Name */}
            <div className="w-full mb-2 px-3 md:w-1/3 lg:w-1/3">
              <label className="mb-[10px] block text-base font-medium text-dark dark:text-white">
                Cheque Name
              </label>
              <input
                type="text"
                placeholder="Cheque Name"
                value={formData.chequeName}
                onChange={handleChange}
                name="chequeName"
                className="w-full mb-2 bg-transparent rounded-md border border-red py-3 px-4 text-dark-6 border-active transition"
              />
            </div>

            {/* Account No */}
            <div className="w-full mb-2 px-3 md:w-1/3 lg:w-1/3">
              <label className="mb-[10px] block text-base font-medium text-dark dark:text-white">
                Account No.
              </label>
              <input
                type="text"
                placeholder="Account Number"
                value={formData.accountNumber}
                onChange={handleChange}
                name="accountNumber"
                className="w-full mb-2 bg-transparent rounded-md border border-red py-3 px-4 text-dark-6 border-active transition"
              />
            </div>

            {/* Branch */}
            <div className="w-full mb-2 px-3 md:w-1/3 lg:w-1/3">
              <label className="mb-[10px] block text-base font-medium text-dark dark:text-white">
                Branch
              </label>
              <input
                type="text"
                placeholder="Branch"
                value={formData.branch}
                onChange={handleChange}
                name="branch"
                className="w-full mb-2 bg-transparent rounded-md border border-red py-3 px-4 text-dark-6 border-active transition"
              />
            </div>

            {/* IFSC Code */}
            <div className="w-full mb-2 px-3 md:w-1/3 lg:w-1/3">
              <label className="mb-[10px] block text-base font-medium text-dark dark:text-white">
                IFSC Code
              </label>
              <input
                type="text"
                placeholder="IFSC Code"
                value={formData.ifscCode}
                onChange={handleChange}
                name="ifscCode"
                className="w-full mb-2 bg-transparent rounded-md border border-red py-3 px-4 text-dark-6 border-active transition"
              />
            </div>

            {/* SWIFT Code */}
            <div className="w-full mb-2 px-3 md:w-1/3 lg:w-1/3">
              <label className="mb-[10px] block text-base font-medium text-dark dark:text-white">
                SWIFT Code
              </label>
              <input
                type="text"
                placeholder="SWIFT Code"
                value={formData.swiftCode}
                onChange={handleChange}
                name="swiftCode"
                className="w-full mb-2 bg-transparent rounded-md border border-red py-3 px-4 text-dark-6 border-active transition"
              />
            </div>

            <div className="w-full flex px-3">
              <motion.button
                type="submit"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className={`px-5 py-3 bg-blue-600 text-white font-medium rounded-md hover:bg-[#2564ebdb] active:border-[#a8adf4] outline-none active:border-2 focus:ring-2 ring-blue-300 
                     ${isSubmitting ? "opacity-50 cursor-not-allowed" : ""}`}
                disabled={isSubmitting}
              >
                {isSubmitting ? "Submitting..." : "Update"}
              </motion.button>
            </div>
          </div>
        </form>
      </section>
    </>
  );
  //#endregion
};

export default EditInvoiceDetail
//#endregion