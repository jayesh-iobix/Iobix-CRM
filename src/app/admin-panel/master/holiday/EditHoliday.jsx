import React, { useEffect, useState } from 'react'
import { FaArrowLeft } from "react-icons/fa";
import { Link, useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { motion } from "framer-motion"; // Import framer-motion
import { HolidayService } from '../../../service/HolidayService';


const EditHoliday = () => {

  const { id } = useParams(); 
  const [holidayName, setHolidayName] = useState("");
  const [holidayStartDate, setHolidayStartDate] = useState("");
  const [holidayEndDate, setHolidayEndDate] = useState("");
  const [totalHolidayDays, setTotalHolidayDays] = useState("");
  const [holidayType, setHolidayType] = useState("");
  const [holidayDescription, setHolidayDescription] = useState("");
  const [isActive, setIsActive] = useState(""); // New state for checkbox
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();



useEffect(() => {
    const fetchData = async () => {
        const holidayResult = await HolidayService.getByIdHoliday(id);
        const holiday = holidayResult.data;

        // Ensure the date format is correct for the input fields
        const formattedStartDate = holiday.holidayStartDate.split("T")[0]; // Format to "yyyy-MM-dd"
        const formattedEndDate = holiday.holidayEndDate.split("T")[0]; // Format to "yyyy-MM-dd"

        setHolidayName(holiday.holidayName);
        setHolidayStartDate(formattedStartDate);  // Set correctly formatted date
        setHolidayEndDate(formattedEndDate);      // Set correctly formatted date
        setTotalHolidayDays(holiday.totalHolidayDays);
        // setHolidayType(holiday.holidayType);
        // setHolidayDescription(holiday.holidayDescription);
        setIsActive(holiday.isActive); // Assuming the department object contains isActive
    };
    fetchData();
}, [id]);


  // Function to calculate total days between fromDate and toDate
  const calculateTotalHolidays = (from, to) => {
    const fromDateObj = new Date(from);
    const toDateObj = new Date(to);

    const timeDiff = toDateObj - fromDateObj;
    const dayDiff = timeDiff / (1000 * 3600 * 24);

    setTotalHolidayDays(dayDiff + 1); // Including both start and end date
  };

  const validateForm = () => {
    const newErrors = {};
    if (!holidayName) newErrors.holidayName = 'Holiday Name is required';
    if (!holidayStartDate) newErrors.holidayStartDate = 'Holiday StartDate is required';
    if (!totalHolidayDays) newErrors.totalHolidayDays = 'Total Holiday Days is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    // Logic for form submission goes here
    const holidayData = {
      holidayName,
      holidayStartDate,
      holidayEndDate,
      totalHolidayDays,
    //   holidayType,
    //   holidayDescription,
      isActive
    };

    setIsSubmitting(true);
    //console.log("Submitted Data:", holidayData);

    // if (validateForm()) {
      try {
        const response = await HolidayService.updateHoliday(id, holidayData);
        if (response.status === 1) {
          navigate(-1);
          toast.success("Holiday update successfully"); // Toast on success
          // navigate('/master/holiday-list');
          // console.log('Holiday added successfully:', response);
        }
        // Reset the form
        // setHolidayName('');
      } catch (error) {
        console.error('Error updating holiday:', error);
        alert('Failed to update holiday.');
      }
    // };
  };

  return (
    <>
      <div className="flex justify-between items-center my-3">
        <h1 className="font-semibold text-2xl">Edit Holiday</h1>
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
        <Link onClick={() => navigate(-1)} className="bg-gray-500 hover:bg-gray-400 text-white font-bold py-2 px-4 rounded flex items-center gap-2 hover:no-underline">
          <FaArrowLeft size={16} />
          Back
        </Link>
        </motion.button>
      </div>

      <section className='bg-white rounded-lg  shadow-sm m-1 py-8 pt-'>
        <form onSubmit={handleSubmit} className='container'>
          <div className='-mx-4 px-10 mt- flex flex-wrap'>
            
            {/* Holiday Name */}
            <div className='w-full mb-2 px-3 md:w-1/3 lg:w-1/3'>
              <label className='mb-[10px] block text-base font-medium text-dark dark:text-white'>
                Holiday Name
              </label>
              <input
                type='text'
                placeholder='Holiday Name'
                value={holidayName}
                onChange={(e) => setHolidayName(e.target.value)}
                className='w-full mb-2 bg-transparent rounded-md border border-red py-[10px] pl-5 pr-12 text-dark-6 border-active transition'
                autoFocus
              />
              {errors.holidayName && <p className="text-red-500 text-xs">{errors.holidayName}</p>}

            </div>

            {/* Holiday StartDate */}
            <div className="w-full mb-2 px-3 md:w-1/3 lg:w-1/3">
              <label className="mb-[10px] block text-base font-medium">Holiday StartDate</label>
              <input
                type="date"
                value={holidayStartDate}
                onChange={(e) => {
                    setHolidayStartDate(e.target.value);
                    if (holidayEndDate) {
                      calculateTotalHolidays(e.target.value, holidayEndDate);
                    }
                  }}
                className="w-full mb-2 rounded-md border py-[10px] px-4 border-active"
              />
             {errors.holidayStartDate && <p className="text-red-500 text-xs">{errors.holidayStartDate}</p>}
            </div>

            {/* Holiday EndDate */}
            <div className="w-full mb-2 px-3 md:w-1/3 lg:w-1/3">
              <label className="mb-[10px] block text-base font-medium">Holiday EndDate</label>
              <input
                type="date"
                value={holidayEndDate}
                // onChange={(e) => setHolidayEndDate(e.target.value)}
                onChange={(e) => {
                    setHolidayEndDate(e.target.value);
                    if (holidayStartDate) {
                      calculateTotalHolidays(holidayStartDate, e.target.value);
                    }
                  }}
                className="w-full mb-2 rounded-md border py-[10px] px-4 border-active"
              />
              {/* {errors.holidayEndDate && <p className="text-red-500 text-xs">{errors.holidayEndDate}</p>} */}
            </div>

            {/* Total Holiday Days */}
            <div className="w-full mb-2 px-3 md:w-1/3 lg:w-1/3">
              <label className="mb-[10px] block text-base font-medium">Total Holiday Days</label>
              <input
                type="text"
                value={totalHolidayDays}
                disabled
                className="block mb-2 w-full p-2 border border-gray-300 rounded-md"
              />
             {errors.totalHolidayDays && <p className="text-red-500 text-xs">{errors.totalHolidayDays}</p>}
            </div>

            <div className='w-full flex px-3'>
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
  )
}

export default EditHoliday