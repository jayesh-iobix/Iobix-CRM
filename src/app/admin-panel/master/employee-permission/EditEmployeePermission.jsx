import React, { useState, useEffect } from 'react';
import { FaArrowLeft } from "react-icons/fa";
import { Link, useNavigate, useParams } from 'react-router-dom';
import { EmployeePermissionService } from '../../../service/EmployeePermissionService';
import { toast } from 'react-toastify';
import { motion } from "framer-motion"; // Import framer-motion

const EditEmployeePermission = () => {
  const { id } = useParams(); 
  const [permissionName, setPermissionName] = useState("");
  const [isActive, setIsActive] = useState(""); // New state for checkbox
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      const employeePermission = await EmployeePermissionService.getByIdEmployeePermission(id);
      setPermissionName(employeePermission.data.permissionName);
      setIsActive(employeePermission.data.isActive); // Assuming the department object contains isActive
    };
    fetchData();
  }, [id]);

  const validateForm = () => {
    const newErrors = {};
    if (!permissionName) newErrors.permissionName = 'Permission Name is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (validateForm()) {
      setIsSubmitting(true);

      const employeePermissionData = {
        permissionName,
        isActive, // Include isActive in the submitted data
      };

      try {
        const response = await EmployeePermissionService.updateEmployeePermission(id, employeePermissionData);
        if (response.status === 1) {
          navigate('/master/employeepermission-list');
          toast.success(response.message); // Toast on success
        }
        setPermissionName('');
      } catch (error) {
        console.error('Error Editing employee permission:', error);
        alert('Failed to edit employee permission.');
      }

      setIsSubmitting(false);
    }
  };

  return (
    <>
      <div className="flex justify-between items-center my-3">
        <h1 className="font-semibold text-2xl">Edit Employee Permission</h1>
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
        <Link to='/master/employeepermission-list' className="bg-gray-500 hover:bg-gray-400 text-white font-bold py-2 px-4 rounded flex items-center gap-2 hover:no-underline">
          <FaArrowLeft size={16} />
          Back
        </Link>
        </motion.button>
      </div>

      <section className='bg-white shadow-sm m-1 py-8 pt-'>
        <form onSubmit={handleSubmit} className='container'>
          <div className='-mx-4 px-10 mt- flex flex-wrap'>
            <div className='w-full mb-2 px-3 md:w-1/2 lg:w-1/2'>
              <label className='mb-[10px] block text-base font-medium text-dark dark:text-white'>
                Permission Name
              </label>
              <input
                type='text'
                placeholder='Permission Name'
                value={permissionName}
                onChange={(e) => setPermissionName(e.target.value)}
                className='w-full mb-2 bg-transparent rounded-md border border-red py-[10px] pl-5 pr-12 text-dark-6 border-active transition'
                autoFocus
              />
              {errors.permissionName && <p className="text-red-500 text-xs">{errors.permissionName}</p>}
            </div>

            {/* Is Active Checkbox */}
            <div className='w-full mt-3 mb-2 px-3 md:w-1/2 lg:w-1/2'>
              <input
                type="checkbox"
                checked={isActive}
                onChange={(e) => setIsActive(e.target.checked)}
                className='w-5 mt-8 h-5 border-active'
              />
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
  );
}

export default EditEmployeePermission