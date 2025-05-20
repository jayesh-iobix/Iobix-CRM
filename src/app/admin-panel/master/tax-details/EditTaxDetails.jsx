//#region Imports
import React, { useEffect, useState } from 'react'
import { FaArrowLeft } from "react-icons/fa";
import { Link, useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { motion } from "framer-motion"; // Import framer-motion
import { TaxDetailService } from '../../../service/TaxDetailService';
//#endregion

//#region Component: EditTaxDetails
const EditTaxDetails = () => {

  //#region State Variables
  const [taxName, setTaxName] = useState("");
  const [percentage, setPercentage] = useState("");
  const [isActive, setIsActive] = useState(""); // New state for checkbox
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { id } = useParams(); 
  const navigate = useNavigate();
  //#endregion

  //#region useEffect - Fetch Tax Detail data
  useEffect(() => {
    const fetchData = async () => {
      const result = await TaxDetailService.getByIdTaxDetail(id);
      setTaxName(result.data.taxName);
      setPercentage(result.data.percentage);
      setIsActive(result.data.isActive); // Assuming the department object contains isActive
    };
    fetchData();
  }, [id]);
  //#endregion
  
   //#region Validation Function & Form Submission
    const validateForm = () => {
      const newErrors = {};
      if (!taxName) newErrors.taxName = 'Tax Name is required';
      if (!percentage) newErrors.percentage = 'Percentage is required';
  
      setErrors(newErrors);
      return Object.keys(newErrors).length === 0;
    };
  
    const handleSubmit = async (e) => {
      e.preventDefault();
  
      if (validateForm()) {
        setIsSubmitting(true);
  
        // Simulate API call or form submission logic
        setTimeout(() => {
          setTaxName('');
          setPercentage('');
          setIsSubmitting(false);
        }, 1000); // Simulate a delay for submission
      }
      // Logic for form submission goes here
      const taxDetailData = {
        taxName,
        percentage,
        isActive // Include isActive in the submitted data
      };
  
      if (validateForm()) {
        try {
          const response = await TaxDetailService.updateTaxDetail(id,taxDetailData);
          if (response.status === 1) {
            navigate(-1);
            toast.success("Tax Detail Updated successfully"); // Toast on success
            // navigate('/master/leave-type-list');
          }
          // Reset the form
          setTaxName('');
          setPercentage('');
        } catch (error) {
          console.error('Error adding tax detail:', error);
          alert('Failed to add tax detail.');
        }
      };
    };
    //#endregion
  
 //#region Render
   return (
     <>
       {/* Header Section */}
       <div className="flex justify-between items-center my-3">
         <h1 className="font-semibold text-2xl">Edit Tax Detail</h1>
         <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
         <Link onClick={() => navigate(-1)} className="bg-gray-500 hover:bg-gray-400 text-white font-bold py-2 px-4 rounded flex items-center gap-2 hover:no-underline">
           <FaArrowLeft size={16} />
           Back
         </Link>
         </motion.button>
       </div>
 
       {/* Form Section */}
       <section className='bg-white rounded-lg  shadow-sm m-1 py-8 pt-'>
         <form onSubmit={handleSubmit} className='container'>
           <div className='-mx-4 px-10 mt- flex flex-wrap'>
              
              {/* Tax Name */}
              <div className="w-full mb-2 px-3 md:w-1/2 lg:w-1/2">
                <label className="mb-[10px] block text-base font-medium text-dark dark:text-white">
                  Tax Name
                </label>
                <input
                  type="text"
                  placeholder="Tax Name"
                  value={taxName}
                  onChange={(e) => setTaxName(e.target.value)}
                  className="w-full mb-2 bg-transparent rounded-md border border-red py-3 px-4 text-dark-6 border-active transition"
                  autoFocus
                />
                {errors.taxName && (
                  <p className="text-red-500 text-xs">{errors.taxName}</p>
                )}
              </div>
 
  {/* Percentage */}
              <div className="w-full mb-2 px-3 md:w-1/2 lg:w-1/2">
                <label className="mb-[10px] block text-base font-medium text-dark dark:text-white">
                 Percentage
                </label>
                <input
                  type="number"
                  placeholder="Percentage"
                  value={percentage}
                  onChange={(e) => setPercentage(e.target.value)}
                  className="w-full mb-2 bg-transparent rounded-md border border-red py-3 px-4 text-dark-6 border-active transition"
                  autoFocus
                />
                {errors.percentage && (
                  <p className="text-red-500 text-xs">{errors.percentage}</p>
                )}
              </div>

             <div className='w-full flex px-3'>
             <motion.button
                 type="submit"
                 whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}
                 className={`px-5 py-3 bg-blue-600 text-white font-medium rounded-md hover:bg-[#2564ebdb] active:border-[#a8adf4] outline-none active:border-2 focus:ring-2 ring-blue-300 
                   ${
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

export default EditTaxDetails
//#endregion