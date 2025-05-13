//#region Imports
import React, { useEffect, useState } from 'react'
import { FaArrowLeft } from "react-icons/fa";
import { Link, useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { motion } from "framer-motion"; // Import framer-motion
import { LeaveTypeService } from '../../../service/LeaveTypeService';
//#endregion

//#region Component: EditLeaveType
const EditLeaveType = () => {

  //#region State Variables
  const [leaveTypeName, setLeaveTypeName] = useState("");
  const [isActive, setIsActive] = useState(""); // New state for checkbox
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { id } = useParams(); 
  const navigate = useNavigate();
  //#endregion

  //#region useEffect - Fetch Leave Type data
  useEffect(() => {
    const fetchData = async () => {
      const result = await LeaveTypeService.getByIdLeaveTypes(id);
      setLeaveTypeName(result.data.leaveTypeName);
      setIsActive(result.data.isActive); // Assuming the department object contains isActive
    };
    fetchData();
  }, [id]);
  //#endregion

  //#region Validation Function & Form Submission
  const validateForm = () => {
    const newErrors = {};
    if (!leaveTypeName) newErrors.leaveTypeName = 'Leave Type Name is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (validateForm()) {
      setIsSubmitting(true);

      // Simulate API call or form submission logic
      setTimeout(() => {
        setLeaveTypeName('');
        setIsSubmitting(false);
      }, 1000); // Simulate a delay for submission
    }
    // Logic for form submission goes here
    const leaveTypeData = {
      leaveTypeName,
      isActive // Include isActive in the submitted data
    };

    if (validateForm()) {
      try {
        const response = await LeaveTypeService.updateLeaveTypes(id,leaveTypeData);
        if (response.status === 1) {
          navigate(-1);
          toast.success("Leave Type Updated successfully"); // Toast on success
          // navigate('/master/leave-type-list');
        }
        // Reset the form
        setLeaveTypeName('');
      } catch (error) {
        console.error('Error adding leavetype:', error);
        alert('Failed to add leavetype.');
      }
    };
  };
  //#endregion

  //#region Render
  return (
    <>
      {/* Header Section */}
      <div className="flex justify-between items-center my-3">
        <h1 className="font-semibold text-2xl">Edit Event Type</h1>
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
             
             {/* Leave Type Name */}
             <div className='w-full mb-2 px-3 md:w-1/3 lg:w-1/3'>
              <label className='mb-[10px] block text-base font-medium text-dark dark:text-white'>
                Leave Type Name
              </label>
              <input
                type='text'
                placeholder='Leave Type Name'
                value={leaveTypeName}
                onChange={(e) => setLeaveTypeName(e.target.value)}
                className='w-full mb-2 bg-transparent rounded-md border border-red py-3 px-4 text-dark-6 border-active transition'
                autoFocus
              />
              {errors.leaveTypeName && <p className="text-red-500 text-xs">{errors.leaveTypeName}</p>}

            </div>

            {/* Is Active Toggle Button */}
            {/* <div className="w-full mt-11 mb-2 px-3 md:w-1.5 lg:w-1.5">
                <label className="inline-flex ms-3 items-center cursor-pointer">
                 <input type="checkbox"
                 checked={isActive}
                 onChange={(e) => setIsActive(e.target.checked)}
                 value="" className="sr-only peer"/>
                 <div className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                 <span className="ms-3 w-[86px] text-sm font-medium text-gray-900 dark:text-gray-300"></span>
               </label> 
            </div> */}

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

export default EditLeaveType
//#endregion
