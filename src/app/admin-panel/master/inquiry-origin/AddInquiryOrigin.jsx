//#region Imports
import React, { useState } from 'react'
import { FaArrowLeft } from "react-icons/fa";
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { motion } from "framer-motion"; // Import framer-motion
import { InquiryOriginService } from '../../../service/InquiryOriginService';
//#endregion

//#region Component: AddInquiryOrigin
const AddInquiryOrigin = () => {
  //#region State Variables
  const [inquiryOriginName, setInquiryOriginName] = useState("");
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  //#endregion

  //#region Validation Function & Form Submission
  const validateForm = () => {
    const newErrors = {};
    if (!inquiryOriginName)
      newErrors.inquiryOriginName = "Inquiry Origin Name is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (validateForm()) {
      setIsSubmitting(true);

      // Simulate API call or form submission logic
      setTimeout(() => {
        setInquiryOriginName("");
        setIsSubmitting(false);
      }, 1000); // Simulate a delay for submission
    }
    // Logic for form submission goes here
    const inquiryOriginData = {
      inquiryOriginName,
    };

    if (validateForm()) {
      try {
        const response = await InquiryOriginService.addInquiryOrigin(
          inquiryOriginData
        );
        if (response.status === 1) {
          navigate(-1);
          toast.success("Inquiry Origin Added Successfully"); // Toast on success
          // navigate('/master/inquiryorigin-list');
          // toast.success(response.message); // Toast on success
        }
        // Reset the form
        setInquiryOriginName("");
      } catch (error) {
        console.error("Error adding inquiry origin:", error);
        alert("Failed to add inquiry origin.");
      }
    }
  };
  //#endregion

  //#region Render
  return (
    <>
      {/* Header Section */}
      <div className="flex justify-between items-center my-3">
        <h1 className="font-semibold text-2xl">Add Inquiry Origin</h1>
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
            <div className="w-full mb-2 px-3 md:w-1/2 lg:w-1/2">
              <label className="mb-[10px] block text-base font-medium text-dark dark:text-white">
                Inquiry Origin Name
              </label>
              <input
                type="text"
                placeholder="Inquiry Origin Name"
                value={inquiryOriginName}
                onChange={(e) => setInquiryOriginName(e.target.value)}
                className="w-full mb-2 bg-transparent rounded-md border border-red py-[10px] pl-5 pr-12 text-dark-6 border-active transition"
                autoFocus
              />
              {errors.inquiryOriginName && (
                <p className="text-red-500 text-xs">
                  {errors.inquiryOriginName}
                </p>
              )}
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
                {isSubmitting ? "Submitting..." : "Add"}
              </motion.button>
            </div>
          </div>
        </form>
      </section>
    </>
  );
  //#endregion
};

export default AddInquiryOrigin
//#endregion