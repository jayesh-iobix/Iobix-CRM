import React, { useEffect, useState } from "react";
import { FaArrowLeft } from "react-icons/fa";
import { Link, useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { motion } from "framer-motion"; // Import framer-motion
import { EmployeeLeaveTypeService } from "../../../service/EmployeeLeaveTypeService";
import { LeaveTypeService } from "../../../service/LeaveTypeService";
import Select from 'react-select';  // Import react-select

const EditEmployeeLeaveType = () => {
  const { id } = useParams(); // Get the ID from the URL
  const [selectedLeaveTypes, setSelectedLeaveTypes] = useState([]);
  const [employeeLeaveTypeName, setEmployeeLeaveTypeName] = useState("");
  const [leaveTypeList, setLeaveTypeList] = useState([]);
  const [leaveTypeDays, setLeaveTypeDays] = useState({});
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const leaveTypeResult = await LeaveTypeService.getLeaveTypes();
        // console.log(leaveTypeResult.data);
        const activeLeaveTypes = leaveTypeResult.data.filter(leaveType => leaveType.isActive === true);
        setLeaveTypeList(activeLeaveTypes);
  
        // Fetch the employee leave type details by ID
        const employeeLeaveTypeResponse = await EmployeeLeaveTypeService.getByIdEmployeeLeaveTypes(id);
        const employeeLeaveType = employeeLeaveTypeResponse.data;
        console.log(employeeLeaveType);
  
        // Check if leaveData exists before proceeding
        if (employeeLeaveType && employeeLeaveType.leaveData) {
          // Set form values from the fetched data
          setEmployeeLeaveTypeName(employeeLeaveType.employeeLeaveTypeName);
          
          // Ensure leaveData is in the expected format
          const leaveData = employeeLeaveType.leaveData || [];
          setSelectedLeaveTypes(
            leaveData.map(leave => ({
              value: leave.leaveTypeId,
              label: leave.leaveTypeName
            }))
          );
          // console.log(selectedLeaveTypes);
  
          const initialLeaveTypeDays = {};
          leaveData.forEach(leave => {
            initialLeaveTypeDays[leave.leaveTypeId] = leave.totalDaysofLeave;
          });
          setLeaveTypeDays(initialLeaveTypeDays);
        } else {
          toast.error("Leave data is not available.");
        }
      } catch (error) {
        console.error("Error fetching employee leave type:", error);
        toast.error("Failed to fetch employee leave type.");
      }
    };
  
    fetchData();
  }, [id]); // Fetch data when the component mounts or the ID changes
  

  const validateForm = () => {
    const newErrors = {};
    if (!employeeLeaveTypeName) newErrors.employeeLeaveTypeName = "Employee Leave Type is required";
    if (selectedLeaveTypes.length === 0) newErrors.selectedLeaveTypes = "At least one leave type must be selected";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLeaveTypeChange = (selectedOptions) => {
    setSelectedLeaveTypes(selectedOptions);
    // Reset the days of leave for newly selected leave types
    const newLeaveTypeDays = { ...leaveTypeDays };
    selectedOptions.forEach(option => {
      if (!newLeaveTypeDays[option.value]) {
        newLeaveTypeDays[option.value] = 0; // Initialize with 0 days
      }
    });
    setLeaveTypeDays(newLeaveTypeDays);
  };

  const handleTotalDaysChange = (e, leaveTypeId) => {
    const newLeaveTypeDays = { ...leaveTypeDays };
    newLeaveTypeDays[leaveTypeId] = e.target.value;
    setLeaveTypeDays(newLeaveTypeDays);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (validateForm()) {
      setIsSubmitting(true);

      // Construct the employee leave type data
      const employeeLeaveTypeData = {
        employeeLeaveTypeName,
        leaveData: selectedLeaveTypes.map(option => ({
          leaveTypeId: option.value,
          totalDaysofLeave: leaveTypeDays[option.value]
        }))
      };

      try {
        const response = await EmployeeLeaveTypeService.updateEmployeeLeaveTypes(id, employeeLeaveTypeData);
        if (response.status === 1) {
          navigate(-1);
          toast.success("Employee Leave Type updated successfully");
        }
        // Reset the form
        setEmployeeLeaveTypeName("");
        setSelectedLeaveTypes([]);
        setLeaveTypeDays({});
      } catch (error) {
        console.error("Error updating employee leave type:", error);
        toast.error("Failed to update employee leave type.");
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  // Prepare options for react-select
  const leaveTypeOptions = leaveTypeList.map(leaveType => ({
    value: leaveType.leaveTypeId,
    label: leaveType.leaveTypeName
  }));

  return (
    <>
      <div className="flex justify-between items-center my-3">
        <h1 className="font-semibold text-2xl">Edit Employee Leave Type</h1>
        <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
          <Link
            to="/master/employee-leavetype-list"
            className="bg-gray-500 hover:bg-gray-400 text-white font-bold py-2 px-4 rounded flex items-center gap-2 hover:no-underline"
          >
            <FaArrowLeft size={16} />
            Back
          </Link>
        </motion.button>
      </div>

      <section className="bg-white rounded-lg shadow-sm m-1 py-8 pt-">
        <form onSubmit={handleSubmit} className="container">
          <div className="-mx-4 px-10 mt- flex flex-wrap">
            {/* Leave Type */}
            <div className="w-full mb-2 px-3 md:w-1/2 lg:w-1/2">
              <label className="mb-[10px] block text-base font-medium text-dark dark:text-white">Leave Type</label>
              <div className="relative z-20">
                <Select
                  isMulti
                  name="leaveTypes"
                  options={leaveTypeOptions}
                  value={selectedLeaveTypes}
                  onChange={handleLeaveTypeChange}
                  className="mb-2"
                  placeholder="Select Leave Types"
                />
              </div>
              {errors.selectedLeaveTypes && <p className="text-red-500 text-xs">{errors.selectedLeaveTypes}</p>}
            </div>

            {/* Employee Leave Type Name */}
            <div className="w-full mb-2 px-3 md:w-1/2 lg:w-1/2">
              <label className="mb-[10px] block text-base font-medium text-dark dark:text-white">Employee Leave Type Name</label>
              <input
                type="text"
                placeholder="Employee Leave Type Name"
                value={employeeLeaveTypeName}
                onChange={(e) => setEmployeeLeaveTypeName(e.target.value)}
                className="w-full mb-2 bg-transparent rounded-md border border-red py-[10px] pl-5 pr-12 text-dark-6 border-active transition"
              />
              {errors.employeeLeaveTypeName && <p className="text-red-500 text-xs">{errors.employeeLeaveTypeName}</p>}
            </div>

            {/* Total Days of Leave */}
            {selectedLeaveTypes.length > 0 && selectedLeaveTypes.map((leaveType) => (
              <div key={leaveType.value} className="w-full mb-2 px-3 md:w-1/2 lg:w-1/2">
                <label className="mb-[10px] block text-base font-medium text-dark dark:text-white">
                  Total Days of Leave for {leaveType.label}
                </label>
                <input
                  type="number"
                  placeholder="Total Days of Leave"
                  value={leaveTypeDays[leaveType.value]}
                  onChange={(e) => handleTotalDaysChange(e, leaveType.value)}
                  className="w-full mb-2 bg-transparent rounded-md border border-red py-[10px] pl-5 pr-12 text-dark-6 border-active transition"
                />
              </div>
            ))}

            <div className="w-full flex px-3">
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                type="submit"
                className={`px-5 py-3 bg-blue-600 text-white font-medium rounded-md hover:bg-[#2564ebdb] active:border-[#a8adf4] outline-none active:border-2 focus:ring-2 ring-blue-300 ${isSubmitting ? "opacity-50 cursor-not-allowed" : ""}`}
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
};

export default EditEmployeeLeaveType;









// import React, { useEffect, useState } from "react";
// import { FaArrowLeft } from "react-icons/fa";
// import { Link, useNavigate, useParams } from "react-router-dom";
// import { toast } from "react-toastify";
// import { motion } from "framer-motion"; // Import framer-motion
// import { EmployeeLeaveTypeService } from "../../../service/EmployeeLeaveTypeService";
// import { LeaveTypeService } from "../../../service/LeaveTypeService";


// const EditEmployeeLeaveType = () => {
  
//   const [leaveTypeId , setLeaveTypeId ] = useState("");
//   const [employeeLeaveTypeName  , setEmployeeLeaveTypeName  ] = useState("");
//   const [totalDaysofLeave , setTotalDaysofLeave ] = useState("");
//   const [isActive, setIsActive] = useState("");
//   const [errors, setErrors] = useState({});
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const { id } = useParams();
//   const [leaveTypeList, setLeaveTypeList] = useState([]);
//   const navigate = useNavigate();

//   useEffect(() => {
//     const fetchLeaveTypeData = async () => {
//       //#region Fetch LeaveTypeList
//       const leaveTypeResult = await LeaveTypeService.getLeaveTypes();
//       const activeLeaveTypes = leaveTypeResult.data.filter(leaveType => leaveType.isActive === true);
//       setLeaveTypeList(activeLeaveTypes);

//       //#endregion Fetch LeaveTypeList
//     };

//     const fetchData = async () => {
//       //#region Fetch EmployeeLeaveTypeList
//       const employeLeaveType = await EmployeeLeaveTypeService.getByIdEmployeeLeaveTypes(id);
//       //console.log(employeLeaveType);
//       setLeaveTypeId(employeLeaveType.data.leaveTypeId);
//       setEmployeeLeaveTypeName(employeLeaveType.data.employeeLeaveTypeName);
//       setTotalDaysofLeave(employeLeaveType.data.totalDaysofLeave);
//       setIsActive(employeLeaveType.data.isActive); // Assuming the designation object contains isActive

//       //#endregion Fetch EmployeeLeaveTypeList
//     };
//     fetchData();
//     fetchLeaveTypeData();
//   }, []);

//   const validateForm = () => {
//     const newErrors = {};
//     if (!leaveTypeId ) newErrors.leaveTypeId  = "Leave Type Name is required";
//     if (!employeeLeaveTypeName ) newErrors.employeeLeaveTypeName  = "Employee Leave Type is required";

//     setErrors(newErrors);
//     return Object.keys(newErrors).length === 0;
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     if (validateForm()) {
//       setIsSubmitting(true);

//       // Simulate API call or form submission logic
//       setTimeout(() => {
//         setEmployeeLeaveTypeName ("");
//         setIsSubmitting(false);
//       }, 1000); // Simulate a delay for submission
//     }
//     // Logic for form submission goes here
//     const employeeLeaveTypeData = {
//       leaveTypeId,
//       employeeLeaveTypeName,
//       totalDaysofLeave,
//       isActive,
//     };

//     console.log("Submitted Data:", employeeLeaveTypeData);

//     if (validateForm()) {
//       try {
//         const response = await EmployeeLeaveTypeService.updateEmployeeLeaveTypes(
//           id,
//           employeeLeaveTypeData
//         );
//         if (response.status === 1) {
//           navigate(-1);
//            toast.success("Employe Leave Type update successfully"); // Toast on success
//         //   navigate("/master/designation-list");
//         //   toast.success(response.message); // Toast on success
//         }
//       } catch (error) {
//         console.error("Error update employee leavetype:", error);
//         alert("Failed to update employee leavetype.");
//       }
//     }
//   };

//   return (
//     <>
//       <div className="flex justify-between items-center my-3">
//         <h1 className="font-semibold text-2xl">Edit Employee Leave Type</h1>
//         <motion.button
//           whileHover={{ scale: 1.1 }}
//           whileTap={{ scale: 0.9 }}
//         >
//         <Link
//           to="/master/employee-leavetype-list"
//           className="bg-gray-500 hover:bg-gray-400 text-white font-bold py-2 px-4 rounded flex items-center gap-2 hover:no-underline"
//         >
//           <FaArrowLeft size={16} />
//           Back
//         </Link>
//         </motion.button>
//       </div>

//       <section className="bg-white shadow-sm m-1 py-8 pt-">
//         <form onSubmit={handleSubmit} className="container">
//           <div className="-mx-4 px-10 mt- flex flex-wrap">
//             {/* Leave Type */}
//             <div className="w-full mb-2 px-3 md:w-1/2 lg:w-1/2">
//               <label className="mb-[10px] block text-base font-medium text-dark dark:text-white">
//                 Leave Type
//               </label>
//               <div className="relative z-20">
//                 <select
//                   value={leaveTypeId }
//                   onChange={(e) => setLeaveTypeId (e.target.value)}
//                   className="relative z-20 w-full mb-2 appearance-none rounded-lg border border-stroke bg-transparent py-[10px] px-4 text-dark-6 border-active transition disabled:cursor-default disabled:bg-gray-2"
//                   autoFocus
//                 >
//                   <option value="" className="text-gray-400">
//                     --Select Leave Type--
//                   </option>
//                   {leaveTypeList.length > 0 ? (
//                     leaveTypeList.map((leaveTypeItem) => (
//                       <option
//                         key={leaveTypeItem.leaveTypeId }
//                         value={leaveTypeItem.leaveTypeId }
//                       >
//                         {leaveTypeItem.leaveTypeName}
//                       </option>
//                     ))
//                   ) : (
//                     <option value="" disabled>
//                       No leavetype available
//                     </option>
//                   )}
//                 </select>
//                 <span className="absolute right-4 top-1/2 z-10 mt-[-2px] h-[10px] w-[10px] -translate-y-1/2 rotate-45 border-r-2 border-b-2 border-body-color"></span>
//               </div>

//               {errors.leaveTypeId  && (
//                 <p className="text-red-500 text-xs">{errors.leaveTypeId }</p>
//               )}
//             </div>

//             {/* Employee Leave Type Name */}
//             <div className="w-full mb-2 px-3 md:w-1/2 lg:w-1/2">
//               <label className="mb-[10px] block text-base font-medium text-dark dark:text-white">
//                 Employe Leave Type Name
//               </label>
//               <input
//                 type="text"
//                 placeholder="Employe Leave Type Name"
//                 value={employeeLeaveTypeName }
//                 onChange={(e) => setEmployeeLeaveTypeName (e.target.value)}
//                 className="w-full mb-2 bg-transparent rounded-md border border-red py-[10px] pl-5 pr-12 text-dark-6 border-active transition"
//               />
//               {errors.employeeLeaveTypeName  && (
//                 <p className="text-red-500 text-xs">{errors.employeeLeaveTypeName }</p>
//               )}
//             </div>

//             {/* Total Days of Leave */}
//             <div className="w-full mb-2 px-3 md:w-1/2 lg:w-1/2">
//               <label className="mb-[10px] block text-base font-medium text-dark dark:text-white">
//                 Total Days of Leave
//               </label>
//               <input
//                 type="text"
//                 placeholder="Total Days of Leave"
//                 value={totalDaysofLeave }
//                 onChange={(e) => setTotalDaysofLeave (e.target.value)}
//                 className="w-full mb-2 bg-transparent rounded-md border border-red py-[10px] pl-5 pr-12 text-dark-6 border-active transition"
//               />
//               {errors.totalDaysofLeave  && (
//                 <p className="text-red-500 text-xs">{errors.totalDaysofLeave }</p>
//               )}
//             </div>

//             {/* Is Active Checkbox */}
//              <div className='w-full mt-3 mb-2 px-3 md:w-1/3 lg:w-1/3'>
//               <input
//                 type="checkbox"
//                 checked={isActive}
//                 onChange={(e) => setIsActive(e.target.checked)}
//                 className='w-5 mt-8 h-5 border-active'
//               />
//             </div>

//             <div className="w-full flex px-3">
//             <motion.button
//               whileHover={{ scale: 1.1 }}
//               whileTap={{ scale: 0.9 }}
//               type="submit"
//                 className={`px-5 py-3 bg-blue-600 text-white font-medium rounded-md hover:bg-[#2564ebdb] active:border-[#a8adf4] outline-none active:border-2 focus:ring-2 ring-blue-300 ${
//                   isSubmitting ? "opacity-50 cursor-not-allowed" : ""
//                 }`}
//                 disabled={isSubmitting}
//             >
//                 {isSubmitting ? "Submitting..." : "Update"}
//               </motion.button>
//             </div>
//           </div>
//         </form>
//       </section>
//     </>
//   );
// };

// export default EditEmployeeLeaveType;
