import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import Select from 'react-select';
import { DepartmentService } from "../../service/DepartmentService";
import { EmployeeService } from "../../service/EmployeeService";
import { AnnouncementService } from "../../service/AnnouncementService";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion"; // Import framer-motion
import { FaArrowLeft } from "react-icons/fa";

const AddAnnouncement = () => {
  const [departmentList, setDepartmentList] = useState([]);
  const [employeeList, setEmployeeList] = useState([]);
  const [selectedDepartment, setSelectedDepartment] = useState([]);
  const [selectedEmployees, setSelectedEmployees] = useState([]);
  const [announcementTitle, setAnnouncementTitle] = useState("");
  const [announcementMessage, setAnnouncementMessage] = useState("");
  const [announcementDateTime, setAnnouncementDateTime] = useState("");
  const [showModal, setShowModal] = useState(false);

  // For instant announcement toggle
  const [isInstantAnnouncement, setIsInstantAnnouncement] = useState(false);

  // Filter States
  const [nameFilter, setNameFilter] = useState("");
  const [designationFilter, setDesignationFilter] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        const result = await DepartmentService.getDepartments();
        setDepartmentList(result.data);
      } catch (error) {
        console.error("Error fetching departments:", error);
      }
    };
    fetchDepartments();
  }, []);

  useEffect(() => {
    if (selectedDepartment.length > 0) {
      const fetchEmployees = async () => {
        try {
          let result;
          if (selectedDepartment.includes("all")) {
            result = await EmployeeService.getEmployees();  // Fetch all employees if "All" is selected
          } else {
            result = await EmployeeService.getEmployeeByMultiDepartment(selectedDepartment);
          }
          setEmployeeList(result.data);
          // const result = await EmployeeService.getEmployeeByDepartment(selectedDepartment);
          // setEmployeeList(result.data);
        } catch (error) {
          console.error("Error fetching visitors:", error);
        }
      };

      fetchEmployees();
    }
  }, [selectedDepartment]);

  // const handleDepartmentChange = (event) => setSelectedDepartment(event.target.value);

  const handleDepartmentChange = (selectedOptions) => {
    // Update selected departments
    const selectedValues = selectedOptions.map(option => option.value);
    setSelectedDepartment(selectedValues);
  };

  const handleEmployeeSelection = (e, employee) => {
    if (e.target.checked) {
      setSelectedEmployees([...selectedEmployees, employee]);
    } else {
      setSelectedEmployees(selectedEmployees.filter((em) => em.employeeId !== employee.employeeId));
    }
  };

  const handleSelectAllEmployees = (e) => {
    if (e.target.checked) {
      setSelectedEmployees(employeeList); // Select all visitors
    } else {
      setSelectedEmployees([]); // Deselect all visitors
    }
  };

  const sendNotification = async () => {
    if (!announcementTitle || !announcementMessage) {
      toast.error("Please provide both a title and a message.");
      return;
    }

    if (selectedEmployees.length === 0) {
      toast.error("Please select at least one visitor or exhibitor or exhibitor reps.");
      return;
    }

    // debugger;

    // If it's an instant announcement, set announcementDateTime to current date and time
    // const currentDateTime = isInstantAnnouncement ? null : announcementDateTime;

    // If no department is selected (i.e., 'all' is selected), set departmentId to empty array []
     const departmentToSend = selectedDepartment.includes("all") ? [] : selectedDepartment;

    const announcementData = {
      departmentId: departmentToSend,  // Pass empty array if "all" is selected
      // departmentId: selectedDepartment,  // Array of event IDs
      isInstanceAnnouncement: isInstantAnnouncement,
      title: announcementTitle,   // Title of the notification
      message: announcementMessage, // Message of the notification
      announcementDateTime: isInstantAnnouncement ? null : announcementDateTime,  // DateTime is null if it's an instant notification
      userId: selectedEmployees.map((employee) => employee.employeeId) || [], // List of employee IDs
      // announcementDateTime: currentDateTime,  // DateTime is null if it's an instant notification
    };

    // const instantAnnouncementData = {
    //   departmentId: [selectedDepartment],  // Array of event IDs
    //   isInstanceAnnouncement: isInstantAnnouncement,
    //   title: announcementTitle,   // Title of the notification
    //   message: announcementMessage, // Message of the notification
    //   userId: selectedEmployees.map((employee) => employee.employeeId) || [], // List of employee IDs
    // };
    
    // console.log(instantAnnouncementData)

    // if (isInstantAnnouncement) {
        // Call the API to send the instant announcement
        const response = await AnnouncementService.addAnnouncement(announcementData);
        if (response.status === 1) {
          toast.success("Instant announcement sent successfully!");
        } else {
          toast.error("Failed to send instant announcement.");
        }
        resetForm();
        navigate(-1);  
    // } 
    // else {
        // console.log(announcementData)
        // Call the API to send the instant announcement
        // const response = await AnnouncementService.addAnnouncement(announcementData);
        // if (response.status === 1) {
        //   toast.success("Instant announcement sent successfully!");
        // } else {
        //   toast.error("Failed to send instant announcement.");
        // }
        // resetForm();
        // navigate(-1);
    // }

  };

  // Filter visitors based on company name
  const filteredEmployees = employeeList.filter((employee) =>
    (employee.firstName || "").toLowerCase().includes(nameFilter.toLowerCase()) ||
    (employee.lastName || "").toLowerCase().includes(nameFilter.toLowerCase())
  );  

  const departmentOptions = [
    { label: "All", value: "all" },
    ...departmentList.map(department => ({
      label: department.departmentName,
      value: department.departmentId
    }))
  ];

  const resetForm = () => {
    setSelectedDepartment("");
    setEmployeeList([]);
    setSelectedEmployees([]);
    setAnnouncementTitle("");
    setAnnouncementMessage("");
    setAnnouncementDateTime("");
    setIsInstantAnnouncement(false);
    setShowModal(false);
    setNameFilter("");
    setDesignationFilter("");
  };

  const resetPopupForm = () => {
    setAnnouncementTitle("");
    setAnnouncementMessage("");
    setAnnouncementDateTime("");
    setShowModal(false);
  };
  

  return (
    <div className="p-5 bg-white shadow-lg rounded-lg">
      <div className="flex justify-between items-center my-3">
        <h2 className="font-semibold text-2xl">Announcement</h2>
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

      <div className="grid sm:grid-cols-1 md:grid-cols-2 gap-4 mt-8">
        {/* Department Dropdown */}
        <div className="mb-4">
          <label className="block mb-2 text-sm font-medium text-gray-700">
            Select Department
          </label>
          <Select
            isMulti
            options={departmentOptions}
            value={departmentOptions.filter((option) =>
              selectedDepartment.includes(option.value)
            )}
            onChange={handleDepartmentChange}
            className="w-full"
          />
        </div>
        {/* <div className="mb-4">
          <label className="block mb-2 text-sm font-medium text-gray-700">
            Select Department
          </label>
          <select
            value={selectedDepartment}
            onChange={handleDepartmentChange}
            className="border border-gray-300 px-4 py-2 rounded-md w-full"
          >
            <option value="">--Select Department--</option>
            {departmentList.map((department) => (
              <option key={department.departmentId} value={department.departmentId}>
                {department.departmentName}
              </option>
            ))}
          </select>
        </div> */}
      </div>

      {/* Instant Announcement Toggle */}
      <div className="mb-4">
        <label className="flex items-center">
          <input
            type="checkbox"
            checked={isInstantAnnouncement}
            onChange={() => setIsInstantAnnouncement(!isInstantAnnouncement)}
            className="mr-2"
          />
          <span className="text-sm font-medium">
            Send announcement instantly
          </span>
        </label>
      </div>

      {/* Name Filter */}
      <div className="mb-4">
        <label className="block mb-2 text-sm font-medium text-gray-700">
          Filter by Name
        </label>
        <input
          type="text"
          value={nameFilter}
          onChange={(e) => setNameFilter(e.target.value)}
          placeholder="Enter name"
          className="border border-gray-300 px-4 py-2 rounded-md w-full"
        />
      </div>

      {/* Display Employee based on selected type */}
      {selectedDepartment.length > 0 && (
        <div className="mb-4">
          <label className="block mb-2 text-sm font-medium text-gray-700">
            {selectedDepartment
              ? `Select Employees for ${
                  departmentList.find(
                    (dep) => dep.departmentId === selectedDepartment
                  )?.departmentName || ""
                }`
              : "Select Employees"}
            {/* Select Employees */}
          </label>
          <div className="overflow-x-auto">
            <table className="table-auto w-full border-collapse border border-gray-300">
              <thead>
                <tr>
                  <th className="border px-4 py-2">
                    <input
                      type="checkbox"
                      onChange={handleSelectAllEmployees}
                      checked={
                        selectedEmployees.length === filteredEmployees.length
                      }
                    />
                  </th>
                  <th className="border px-4 py-2">Name</th>
                  <th className="border px-4 py-2">Email</th>
                  <th className="border px-4 py-2">Employee Code</th>
                  <th className="border px-4 py-2">Address</th>
                </tr>
              </thead>
              <tbody>
                {filteredEmployees.map((employee) => (
                  <tr key={employee.employeeId}>
                    <td className="border px-4 py-2">
                      <input
                        type="checkbox"
                        checked={selectedEmployees.some(
                          (em) => em.employeeId === employee.employeeId
                        )}
                        onChange={(e) => handleEmployeeSelection(e, employee)}
                      />
                    </td>
                    <td className="border px-4 py-2">{employee.name}</td>
                    <td className="border px-4 py-2">{employee.email}</td>
                    <td className="border px-4 py-2">
                      {employee.employeeCode}
                    </td>
                    <td className="border px-4 py-2">
                      {employee.departmentName}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Send Announcement Button */}
      <div className="mb-4">
        <button
          onClick={() => setShowModal(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-md"
        >
          Send Announcement
        </button>
      </div>

      {/* Modal for Announcement Title and Message */}
      {showModal && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-11/12 sm:w-3/4 md:w-2/3 lg:w-1/3 xl:w-1/4">
            <h3 className="text-xl font-semibold mb-4 text-center">
              Add Announcement
            </h3>

            <div className="mb-4">
              <label className="block mb-2 text-sm font-medium text-gray-700">
                Announcement Title
              </label>
              <input
                type="text"
                value={announcementTitle}
                onChange={(e) => setAnnouncementTitle(e.target.value)}
                className="border border-gray-300 px-4 py-2 rounded-md w-full"
              />
            </div>

            <div className="mb-4">
              <label className="block mb-2 text-sm font-medium text-gray-700">
                Announcement Message
              </label>
              <textarea
                value={announcementMessage}
                onChange={(e) => setAnnouncementMessage(e.target.value)}
                className="border border-gray-300 px-4 py-2 rounded-md w-full"
                rows="4"
              />
            </div>

            {/* Date and Time for scheduled notifications */}
            {!isInstantAnnouncement && (
              <div className="mb-4">
                <label className="block mb-2 text-sm font-medium text-gray-700">
                  Announcement Date
                </label>
                <input
                  type="datetime-local"
                  value={announcementDateTime}
                  onChange={(e) => setAnnouncementDateTime(e.target.value)}
                  className="border border-gray-300 px-4 py-2 rounded-md w-full"
                />
              </div>
            )}

            {/* Buttons */}
            <div className="flex justify-between mt-4">
              <button
                onClick={resetPopupForm}
                className="bg-gray-500 text-white px-4 py-2 rounded-md w-full sm:w-auto"
              >
                Cancel
              </button>
              <button
                onClick={sendNotification}
                className="bg-blue-600 text-white px-4 py-2 rounded-md w-full sm:w-auto"
              >
                Send Announcement
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AddAnnouncement;













// import React, { useState, useEffect } from "react";
// import { toast } from "react-toastify";
// import Select from 'react-select';
// import { DepartmentService } from "../../service/DepartmentService";
// import { EmployeeService } from "../../service/EmployeeService";

// const AddAnnouncement = () => {
//   const [departmentList, setDepartmentList] = useState([]);
//   const [employeeList, setEmployeeList] = useState([]);
//   const [selectedDepartment, setSelectedDepartment] = useState("");
//   const [selectedTypes, setSelectedTypes] = useState([]);
//   const [selectedEmployees, setSelectedEmployees] = useState([]);
//   const [announcementTitle, setAnnouncementTitle] = useState("");
//   const [announcementMessage, setAnnouncementMessage] = useState("");
//   const [announcementDateTime, setAnnouncementDateTime] = useState("");
//   const [showModal, setShowModal] = useState(false);

//   // For instant announcement toggle
//   const [isInstantAnnouncement, setIsInstantAnnouncement] = useState(false);

//   // Filter States
//   const [nameFilter, setNameFilter] = useState("");
//   const [designationFilter, setDesignationFilter] = useState("");

//   useEffect(() => {
//     const fetchDepartments = async () => {
//       try {
//         const result = await DepartmentService.getDepartments();
//         setDepartmentList(result.data);
//       } catch (error) {
//         console.error("Error fetching departments:", error);
//       }
//     };
//     fetchDepartments();
//   }, []);

//   useEffect(() => {
//     if (selectedDepartment) {
//       const fetchEmployees = async () => {
//         try {
//           const result = await EmployeeService.getEmployeeByDepartment(selectedDepartment);
//           // console.log(result.data)
//           setEmployeeList(result.data);
//         } catch (error) {
//           console.error("Error fetching visitors:", error);
//         }
//       };

//       fetchEmployees();
//     }
//   }, [selectedDepartment]);

//   const handleDepartmentChange = (event) => setSelectedDepartment(event.target.value);

//   // const handleTypeChange = (e) => setSelectedType(e.target.value);

//   const handleTypeChange = (selectedOptions) => {
//     const selectedValues = selectedOptions.map(option => option.value);
//     setSelectedTypes(selectedValues);
//   };

//   const handleEmployeeSelection = (e, employee) => {
//     if (e.target.checked) {
//       setSelectedEmployees([...selectedEmployees, employee]);
//     } else {
//       setSelectedEmployees(selectedEmployees.filter((em) => em.employeeId !== employee.employeeId));
//     }
//   };

//   const handleSelectAllEmployees = (e) => {
//     if (e.target.checked) {
//       setSelectedEmployees(employeeList); // Select all visitors
//     } else {
//       setSelectedEmployees([]); // Deselect all visitors
//     }
//   };

//   const sendNotification = async () => {
//     if (!announcementTitle || !announcementMessage) {
//       toast.error("Please provide both a title and a message.");
//       return;
//     }

//     if (selectedEmployees.length === 0) {
//       toast.error("Please select at least one visitor or exhibitor or exhibitor reps.");
//       return;
//     }

//     // debugger;

//     const announcementData = {
//       departmentId: [selectedDepartment],  // Array of event IDs
//       title: announcementTitle,   // Title of the notification
//       message: announcementMessage, // Message of the notification
//       scheduledDateTime: isInstantAnnouncement ? null : announcementDateTime,  // DateTime is null if it's an instant notification
//       employeeId: selectedEmployees.map((employee) => employee.employeeId) || [], // List of employee IDs
//     };

//     const instantAnnouncementData = {
//       departmentId: [selectedDepartment],  // Array of event IDs
//       title: announcementTitle,   // Title of the notification
//       message: announcementMessage, // Message of the notification
//       employeeId: selectedEmployees.map((employee) => employee.employeeId) || [], // List of employee IDs
//     };
    
//     console.log(instantAnnouncementData)

//     if (isInstantAnnouncement) {
//         console.log(instantAnnouncementData)
//     } 
//     else {
//         console.log(announcementData)
//     }

//   };

//   // Filter visitors based on company name
//   const filteredEmployees = employeeList.filter((employee) =>
//     (employee.firstName || "").toLowerCase().includes(nameFilter.toLowerCase()) ||
//     (employee.lastName || "").toLowerCase().includes(nameFilter.toLowerCase())
//   );  
  
//   const typeOptions = [
//     { label: "Visitor", value: "visitor" },
//     { label: "Exhibitor", value: "exhibitor" },
//     { label: "Exhibitor Rep", value: "exhibitorRep" },
//     { label: "Partner", value: "partner" },
//   ];

//   const resetForm = () => {
//     setSelectedDepartment("");
//     setEmployeeList([]);
//     setSelectedEmployees([]);
//     setAnnouncementTitle("");
//     setAnnouncementMessage("");
//     setAnnouncementDateTime("");
//     setIsInstantAnnouncement(false);
//     setShowModal(false);
//     setNameFilter("");
//     setDesignationFilter("");
//   };
  

//   return (
//     <div className="p-5 bg-white shadow-lg rounded-lg">
//       <h2 className="text-2xl font-semibold mb-5">Announcement</h2>

//       <div className="grid sm:grid-cols-1 md:grid-cols-2 gap-4">
//         {/* Department Dropdown */}
//         <div className="mb-4">
//           <label className="block mb-2 text-sm font-medium text-gray-700">
//             Select Department
//           </label>
//           <select
//             value={selectedDepartment}
//             onChange={handleDepartmentChange}
//             className="border border-gray-300 px-4 py-2 rounded-md w-full"
//           >
//             <option value="">--Select Department--</option>
//             {departmentList.map((department) => (
//               <option key={department.departmentId} value={department.departmentId}>
//                 {department.departmentName}
//               </option>
//             ))}
//           </select>
//         </div>

//       </div>

//       {/* Instant Announcement Toggle */}
//       <div className="mb-4">
//         <label className="flex items-center">
//           <input
//             type="checkbox"
//             checked={isInstantAnnouncement}
//             onChange={() => setIsInstantAnnouncement(!isInstantAnnouncement)}
//             className="mr-2"
//           />
//           <span className="text-sm font-medium">
//             Send announcement instantly
//           </span>
//         </label>
//       </div>

//       {/* Name Filter */}
//       <div className="mb-4">
//         <label className="block mb-2 text-sm font-medium text-gray-700">
//           Filter by Name
//         </label>
//         <input
//           type="text"
//           value={nameFilter}
//           onChange={(e) => setNameFilter(e.target.value)}
//           placeholder="Enter name"
//           className="border border-gray-300 px-4 py-2 rounded-md w-full"
//         />
//       </div>

//       {/* Display Employee based on selected type */}
//       {selectedDepartment && (
//         <div className="mb-4">
//           <label className="block mb-2 text-sm font-medium text-gray-700">
//           {selectedDepartment
//             ? `Select Employees for ${
//                 departmentList.find(dep => dep.departmentId === selectedDepartment)?.departmentName || ""
//               }`
//             : "Select Employees"}
//             {/* Select Employees */}
//           </label>
//           <div className="overflow-x-auto">
//             <table className="table-auto w-full border-collapse border border-gray-300">
//               <thead>
//                 <tr>
//                   <th className="border px-4 py-2">
//                     <input
//                       type="checkbox"
//                       onChange={handleSelectAllEmployees}
//                       checked={
//                         selectedEmployees.length === filteredEmployees.length
//                       }
//                     />
//                   </th>
//                   <th className="border px-4 py-2">Name</th>
//                   <th className="border px-4 py-2">Email</th>
//                   <th className="border px-4 py-2">Employee Code</th>
//                   <th className="border px-4 py-2">Address</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {filteredEmployees.map((employee) => (
//                   <tr key={employee.employeeId}>
//                     <td className="border px-4 py-2">
//                       <input
//                         type="checkbox"
//                         checked={selectedEmployees.some(
//                           (em) =>
//                             em.employeeId ===
//                           employee.employeeId
//                         )}
//                         onChange={(e) => handleEmployeeSelection(e, employee)}
//                       />
//                     </td>
//                     <td className="border px-4 py-2">
//                       {employee.firstName + " " + employee.lastName}
//                     </td>
//                     <td className="border px-4 py-2">{employee.email}</td>
//                     <td className="border px-4 py-2">{employee.employeeCode}</td>
//                     <td className="border px-4 py-2">{employee.address}</td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>
//         </div>
//     )} 

//       {/* Send Announcement Button */}
//       <div className="mb-4">
//         <button
//           onClick={() => setShowModal(true)}
//           className="bg-blue-600 text-white px-4 py-2 rounded-md"
//         >
//           Send Announcement
//         </button>
//       </div>

//       {/* Modal for Announcement Title and Message */}
//       {showModal && (
//         <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50">
//           <div className="bg-white p-6 rounded-lg shadow-lg w-11/12 sm:w-1/3">
//             <h3 className="text-xl font-semibold mb-4">Add Announcement</h3>
//             <div className="mb-4">
//               <label className="block mb-2 text-sm font-medium text-gray-700">
//                 Announcement Title
//               </label>
//               <input
//                 type="text"
//                 value={announcementTitle}
//                 onChange={(e) => setAnnouncementTitle(e.target.value)}
//                 className="border border-gray-300 px-4 py-2 rounded-md w-full"
//               />
//             </div>
//             <div className="mb-4">
//               <label className="block mb-2 text-sm font-medium text-gray-700">
//                 Announcement Message
//               </label>
//               <textarea
//                 value={announcementMessage}
//                 onChange={(e) => setAnnouncementMessage(e.target.value)}
//                 className="border border-gray-300 px-4 py-2 rounded-md w-full"
//                 rows="4"
//               />
//             </div>

//             {/* Date and Time for scheduled notifications */}
//             {!isInstantAnnouncement && (
//               <>
//                 <div className="mb-4">
//                   <label className="block mb-2 text-sm font-medium text-gray-700">
//                     Announcement Date
//                   </label>
//                   <input
//                     type="datetime-local"
//                     value={announcementDateTime}
//                     onChange={(e) => setAnnouncementDateTime(e.target.value)}
//                     className="border border-gray-300 px-4 py-2 rounded-md w-full"
//                   />
//                 </div>
//               </>
//             )}

//             {/* Buttons */}
//             <div className="flex justify-between">
//               <button
//                 onClick={resetForm}
//                 // onClick={() => setShowModal(false)}
//                 className="bg-gray-500 text-white px-4 py-2 rounded-md"
//               >
//                 Cancel
//               </button>
//               <button
//                 onClick={sendNotification}
//                 className="bg-blue-600 text-white px-4 py-2 rounded-md"
//               >
//                 Send Announcement
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default AddAnnouncement;






