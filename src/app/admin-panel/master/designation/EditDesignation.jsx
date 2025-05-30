//#region Imports
import React, { useEffect, useState } from "react";
import { FaArrowLeft } from "react-icons/fa";
import { Link, useNavigate, useParams } from "react-router-dom";
import { DesignationService } from "../../../service/DesignationService";
import { DepartmentService } from "../../../service/DepartmentService";
import { toast } from "react-toastify";
import { motion } from "framer-motion"; // Import framer-motion
//#endregion

//#region Component: EditDesignation
const EditDesignation = () => {
  
  //#region State Variables
  const [departmentId, setDepartmentId] = useState("");
  const [designationName, setDesignationName] = useState("");
  const [isActive, setIsActive] = useState("");
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [departmentList, setDepartmentList] = useState([]);
  const navigate = useNavigate();
  const { id } = useParams();
  //#endregion

  //#region useEffect - Fetch Department and Designation data
  useEffect(() => {

    const fetchDepartmentData = async () => {
      //#region Fetch DepartmentList
      const departmentResult = await DepartmentService.getDepartments();
      const activeDepartments = departmentResult.data.filter(department => department.isActive === true);
      setDepartmentList(activeDepartments);

      //#endregion Fetch DepartmentList
    };

    const fetchData = async () => {
      //#region Fetch DepartmentList
      const designation = await DesignationService.getByIdDesignation(id);
      //console.log(department);
      setDepartmentId(designation.data.departmentId);
      setDesignationName(designation.data.designationName);
      setIsActive(designation.data.isActive); // Assuming the designation object contains isActive

      //#endregion Fetch DepartmentList
    };
    fetchData();
    fetchDepartmentData();
  }, []);
  //#endregion

  //#region Validation Function & Form Submission
  const validateForm = () => {
    const newErrors = {};
    if (!departmentId) newErrors.departmentId = "Department Name is required";
    if (!designationName) newErrors.designationName = "Designation is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (validateForm()) {
      setIsSubmitting(true);

      // Simulate API call or form submission logic
      setTimeout(() => {
        setDesignationName("");
        setIsSubmitting(false);
      }, 1000); // Simulate a delay for submission
    }
    // Logic for form submission goes here
    const designationData = {
      departmentId,
      designationName,
      isActive
    };

    // console.log("Submitted Data:", designationData);

    if (validateForm()) {
      try {
        const response = await DesignationService.updateDesignation(
          id,
          designationData
        );
        if (response.status === 1) {
          navigate(-1);
          toast.success("Designation Updated Successfully"); // Toast on success
          // navigate("/master/designation-list");
          // toast.success(response.message); // Toast on success
        }
      } catch (error) {
        console.error("Error editing designation:", error);
        alert("Failed to edit designation.");
      }
    }
  };
  //#endregion

  //#region Render
  return (
    <>
      {/* Header Section */}
      <div className="flex justify-between items-center my-3">
        <h1 className="font-semibold text-2xl">Edit Designation</h1>
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
        <Link
          to="/master/designation-list"
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
            <div className="w-full mb-2 px-3 md:w-1/3 lg:w-1/3">
              <label className="mb-[10px] block text-base font-medium text-dark dark:text-white">
                Department
              </label>
              <div className="relative z-20">
                <select
                  value={departmentId}
                  onChange={(e) => setDepartmentId(e.target.value)}
                  className="relative z-20 w-full mb-2 appearance-none rounded-lg border border-stroke bg-transparent py-[10px] px-4 text-dark-6 border-active transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-gray-2"
                  autoFocus
                >
                  <option value="" className="text-gray-400">
                    --Select Department--
                  </option>
                  {departmentList.length > 0 ? (
                    departmentList.map((departmentItem) => (
                      <option
                        key={departmentItem.departmentId}
                        value={departmentItem.departmentId}
                      >
                        {departmentItem.departmentName}
                      </option>
                    ))
                  ) : (
                    <option value="" disabled>
                      No Departments available
                    </option>
                  )}
                </select>
                <span className="absolute right-4 top-1/2 z-10 mt-[-2px] h-[10px] w-[10px] -translate-y-1/2 rotate-45 border-r-2 border-b-2 border-body-color"></span>
              </div>

              {errors.departmentId && (
                <p className="text-red-500 text-xs">{errors.departmentId}</p>
              )}
            </div>

            {/* Designation Name */}
            <div className="w-full mb-2 px-3 md:w-1/3 lg:w-1/3">
              <label className="mb-[10px] block text-base font-medium text-dark dark:text-white">
                Designation Name
              </label>
              <input
                type="text"
                placeholder="Designation Name"
                value={designationName}
                onChange={(e) => setDesignationName(e.target.value)}
                className="w-full mb-2 bg-transparent rounded-md border border-red py-[10px] pl-5 pr-12 text-dark-6 border-active transition"
              />
              {errors.designationName && (
                <p className="text-red-500 text-xs">{errors.designationName}</p>
              )}
            </div>

            {/* Is Active Checkbox */}
             {/* <div className='w-full mt-3 mb-2 px-3 md:w-1/3 lg:w-1/3'>
              <input
                type="checkbox"
                checked={isActive}
                onChange={(e) => setIsActive(e.target.checked)}
                className='w-5 mt-8 h-5 border-active'
              />
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
};

export default EditDesignation;
//#endregion
