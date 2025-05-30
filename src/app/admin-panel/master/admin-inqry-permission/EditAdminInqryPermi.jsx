//#region Imports
import React, { useEffect, useState } from "react";
import { FaArrowLeft } from "react-icons/fa";
import { Link, useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { motion } from "framer-motion"; // Import framer-motion
import { InquiryPermissionService } from "../../../service/InquiryPermissionService";
import { InquiryTypeService } from "../../../service/InquiryTypeService";
import Select from "react-select"; // Import react-select for searchable dropdown
import { CommonService } from "../../../service/CommonService";
//#endregion

//#region Component: EditAdminInqryPermi
const EditAdminInqryPermi = () => {

  //#region State Variables
  const [userId, setUserId] = useState("");
  const [departmentId, setDepartmentId] = useState("");
  const [inquiryTypeIds, setInquiryTypeIds] = useState([]);

  const [adminList, setAdminList] = useState([]);
  const [inquiryTypeList, setInquiryTypeList] = useState([]);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const {id} = useParams();
  const navigate = useNavigate();
  //#endregion

  //#region useEffect - Fetch Employee data
  useEffect(() => {
    const fetchEmployees = async () => {
      try {

        // Fetch Inquiry Permission
        const inquiryPermissionResult = await InquiryPermissionService.getByIdInquiryPermission(id);
        const inquiryPermissionData = inquiryPermissionResult.data;
        console.log(inquiryPermissionData);
        setUserId(inquiryPermissionData.userId);
        setInquiryTypeIds(inquiryPermissionData.inquiryTypeIds);

        // debugger;
        // Fetch Admin
        const adminResult = await CommonService.getAdmin();
        setAdminList(adminResult.data);

        // Fetch Inquiry Type
        const inquiryTypeResult = await InquiryTypeService.getInquiryType();
        const activeInquiryType = inquiryTypeResult.data.filter(
          (inquiryType) => inquiryType.isActive === true
        );
        setInquiryTypeList(activeInquiryType);

      } catch (error) {
        console.error("Error fetching admin list:", error);
      }
    };
    fetchEmployees();
  }, [departmentId]);
  //#endregion

  //#region Validation Function & Form Submission
  const validateForm = () => {
    const newErrors = {};
    if (!userId) newErrors.userId  = "Admin is required";
    if (!inquiryTypeIds) newErrors.inquiryTypeIds  = "Inquiry Type is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSelectChange = (selectedOptions, field) => {
    const selectedValues = selectedOptions ? selectedOptions.map((option) => option.value) : [];
    if (field === "inquiryTypeId") {
      setInquiryTypeIds(selectedValues);
    }
  };
  
  const inquiryTypeOptions = inquiryTypeList.map((inquiryType) => ({
    value: inquiryType.inquiryTypeId,
    label: inquiryType.inquiryTypeName,
  }));

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    const inquiryPermissionData = {
      userId,
      inquiryTypeIds,
    };

    setIsSubmitting(true);
    try {
      const response = await InquiryPermissionService.updateInquiryPermission(id,inquiryPermissionData);
      if (response.status === 1) {
        navigate(-1);
        toast.success("Inquiry Permission Updated Sucesfully"); // Toast on success
        // toast.success(response.message); // Toast on success
      }
    } catch (error) {
      console.error("Error adding inquiry permission:", error);
      toast.error("Failed to add inquiry permission.");
    } finally {
      setIsSubmitting(false);
    }
  };
  //#endregion

  //#region Render
  return (
    <>
      {/* Header Section */}
      <div className="flex justify-between items-center my-3">
        <h1 className="font-semibold text-2xl">Edit Inquiry Permission</h1>
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
      <section className="bg-white rounded-lg shadow-lg m-1 py-8">
        <form onSubmit={handleSubmit} className="container">
          <div className="-mx-4 px-10 mt- flex flex-wrap">

            {/* Users */}
            <div className="w-full mb-2 px-3 md:w-1/3">
              <label className="block text-base font-medium">Users</label>
              <select
                value={userId}
                onChange={(e) => setUserId(e.target.value)}
                className="w-full mb-2 rounded-md border py-[7px] px-4 border-active"
              >
                <option value="">--Select User--</option>
                {adminList.map((admin) => (
                  <option key={admin.adminId} value={admin.adminId}>
                    {admin.firstName + " " + admin.lastName}
                    {/* {admin.userName} */}
                  </option>
                ))}
              </select>
              {errors.userId && (
                <p className="text-red-500 text-xs">{errors.userId}</p>
              )}
            </div>

            {/* Inquiry Type */}
            <div className="w-full mb-2 px-3 md:w-1/3">
              <label className="block text-base font-medium">
                Inquiry Type
              </label>
              <Select
                isMulti
                options={inquiryTypeOptions}
                value={inquiryTypeOptions.filter((option) =>
                  inquiryTypeIds.includes(option.value)
                )}
                onChange={(selectedOption) =>
                  handleSelectChange(selectedOption, "inquiryTypeId")
                }
                placeholder="Select Inquiry Type"
                className="w-full mb-2 text-lg" // Adjust width, padding, and font size
              />

              {errors.inquiryTypeIds && (
                <p className="text-red-500 text-xs">{errors.inquiryTypeIds}</p>
              )}
            </div>

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

export default EditAdminInqryPermi;
//#endregion
