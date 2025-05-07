//#region Imports
import React, { useState, useEffect } from 'react';
import { FaArrowLeft } from "react-icons/fa";
import { Link, useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { motion } from "framer-motion"; // Import framer-motion
import { InquiryTypeService } from '../../../service/InquiryTypeService';
//#endregion

//#region Component: EditInquiryType
const EditInquiryType = () => {

  //#region State Variables
  const [inquiryTypeName, setInquiryTypeName] = useState("");
  const [isActive, setIsActive] = useState(""); // New state for checkbox
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { id } = useParams(); 
  const navigate = useNavigate();
  //#endregion

  //#region useEffect - Fetch Inquiry Type data
  useEffect(() => {
    const fetchData = async () => {
      const inquiryType = await InquiryTypeService.getByIdInquiryType(id);
      setInquiryTypeName(inquiryType.data.inquiryTypeName);
      setIsActive(inquiryType.data.isActive); // Assuming the department object contains isActive
    };
    fetchData();
  }, [id]);
  //#endregion

  //#region Validation Function & Form Submission
  const validateForm = () => {
    const newErrors = {};
    if (!inquiryTypeName) newErrors.inquiryTypeName = 'Inquiry Type Name is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (validateForm()) {
      setIsSubmitting(true);

      const inquiryTypeData = {
        inquiryTypeName,
        isActive, // Include isActive in the submitted data
      };

      try {
        const response = await InquiryTypeService.updateInquiryType(id, inquiryTypeData);
        if (response.status === 1) {
          navigate(-1);
          toast.success(response.message); // Toast on success
          // navigate('/master/inquirytype-list');
        }
        setInquiryTypeName('');
      } catch (error) {
        console.error('Error Editing inquiry type:', error);
        alert('Failed to edit inquiry type.');
      }

      setIsSubmitting(false);
    }
  };
  //#endregion

  //#region Render
  return (
    <>
      {/* Header Section */}
      <div className="flex justify-between items-center my-3">
        <h1 className="font-semibold text-2xl">Edit Inquiry Type</h1>
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
      <section className="bg-white shadow-sm m-1 py-8 pt-">
        <form onSubmit={handleSubmit} className="container">
          <div className="-mx-4 px-10 mt- flex flex-wrap">
            <div className="w-full mb-2 px-3 md:w-1/2 lg:w-1/2">
              <label className="mb-[10px] block text-base font-medium text-dark dark:text-white">
                Inquiry Type Name
              </label>
              <input
                type="text"
                placeholder="Inquiry Type Name"
                value={inquiryTypeName}
                onChange={(e) => setInquiryTypeName(e.target.value)}
                className="w-full mb-2 bg-transparent rounded-md border border-red py-[10px] pl-5 pr-12 text-dark-6 border-active transition"
                autoFocus
              />
              {errors.inquiryTypeName && (
                <p className="text-red-500 text-xs">{errors.inquiryTypeName}</p>
              )}
            </div>

            {/* Is Active Toggle Button */}
            {/* <div className="w-full mt-11 mb-2 px-3 md:w-1.5 lg:w-1.5">
              <label className="inline-flex ms-3 items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={isActive}
                  onChange={(e) => setIsActive(e.target.checked)}
                  value=""
                  className="sr-only peer"
                />
                <div className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                <span className="ms-3 w-[86px] text-sm font-medium text-gray-900 dark:text-gray-300"></span>
              </label>
            </div> */}

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
                {isSubmitting ? "Submitting..." : "Update"}
              </motion.button>
            </div>
          </div>
        </form>
      </section>
    </>
  );
  //#endregion
}

export default EditInquiryType
//#endregion
