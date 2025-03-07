import React, { useEffect, useRef, useState } from "react";
import { FaEdit, FaEllipsisV, FaEye, FaPlus, FaTrash, FaTrashAlt } from "react-icons/fa";
import { Link } from "react-router-dom";
import { InquiryService } from "../../service/InquiryService"; // Assuming you have an InquiryService for API calls
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import { ReportService } from "../../service/ReportService"; // Assuming you have a ReportService for downloading reports
import { DepartmentService } from "../../service/DepartmentService";
import { EmployeeService } from "../../service/EmployeeService";
import { InquiryFollowUpService } from "../../service/InquiryFollowUpService";
import { InquiryPermissionService } from "../../service/InquiryPermissionService";

const PartnerInquiryList = () => {
  const [inquiries, setInquiries] = useState([]);
  const [inquiryRegistrationId, setInquiryRegistrationId] = useState("");
  const [filteredInquiries, setFilteredInquiries] = useState([]);
  const [inquiryFilter, setInquiryFilter] = useState(""); // Filter for inquiry name or code
  const [categoryFilter, setCategoryFilter] = useState(""); // Filter for inquiry category
  const [deleteId, setDeleteId] = useState(null); // Store the eventTypeId for deletion
  const [isPopupOpen, setIsPopupOpen] = useState(false); // Popup for confirmation
  const [isSubmitting, setIsSubmitting] = useState(false); // Button loading state

  const buttonRefs = useRef({}); // To store references to dropdown buttons
  const [openDropdown, setOpenDropdown] = useState({}); // State to track which dropdown is open
  const [forwardPopupVisible, setForwardPopupVisible] = useState(false);
  const [transferPopupVisible, setTransferPopupVisible] = useState(false);
  const [departments, setDepartments] = useState([]);
  const [employeeList, setEmployeeList] = useState([]);
  const [departmentId, setDepartmentId] = useState("");
  const [inquiryForwardedTo, setInquiryForwardedTo] = useState("");  
  const [inquiryTransferTo, setInquiryTransferTo] = useState("");  
  const [inquiryFollowUpDescription, setInquiryFollowUpDescription] = useState("");  
  const [inquiryHideShow, setInquiryHideShow] = useState(false);
  
  
  //#region  Popup useState
  const [activeMenu, setActiveMenu] = useState(null); // Tracks the active menu by taskAllocationId
  const [activeSubTaskMenu, setActiveSubTaskMenu] = useState(null); // Track the active sub-task menu

  const [isPopupVisible, setIsPopupVisible] = useState(false);
  const [completionDateIsPopupVisible, setCompletionDateIsPopupVisible] = useState(false);
  const [taskTransferIsPopupVisible, setTaskTransferIsPopupVisible] = useState(false);
  const [subTaskTransferIsPopupVisible, setSubTaskTransferIsPopupVisible] = useState(false);
  const [currentTask, setCurrentTask] = useState(null);
  //#endregion
  
  //#region Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(7); // Items per page
  const [totalItems, setTotalItems] = useState(0); // Total items count for pagination
  //#endregion
  
  const role = sessionStorage.getItem("role");
  // console.log(role);

  // const navigateTo = role === 'partner' 
  // ? '/partner/inquiry-list/add-inquiry' 
  // : '/company/inquiry-list/add-inquiry';
  
  const fetchInquiriePermission = async (id) => {
    try {
      // Fetch Inquiry
      const inquiryPermission = await InquiryPermissionService.getAccessOfInquiryInAdmin(id);
      setInquiryHideShow(inquiryPermission.data);
      
    } catch (error) {
      console.error("Error fetching inquiries:", error);
      setInquiryHideShow(false);
    }
  }

  const fetchInquiries = async () => {
    try {
      // Fetch Inquiry
      // const inquiryPermission = await InquiryPermissionService.getAccessOfInquiryInAdmin(id);
      // setInquiryHideShow(inquiryPermission.data);

      if(role === "admin") {
        const result = await InquiryService.getInquiryFromPartner();
        setInquiries(result.data);
        setFilteredInquiries(result.data);
        setTotalItems(result.data.length);
      } else if (role === "user") {
        const result = await InquiryService.getInquiryInUserToPartner();
        setInquiries(result.data);
        setFilteredInquiries(result.data);
        setTotalItems(result.data.length);
      } else {
        console.log("Error fetching inquiry")
      }

      const departmentResult = await DepartmentService.getDepartments();
      setDepartments(departmentResult.data); // Set the 'data' array to the state\
      // console.log(departmentId);
      if (departmentId) {
        // debugger;
        const employeeResult = await EmployeeService.getEmployeeByDepartment(
          departmentId
        );
        setEmployeeList(employeeResult.data);
      }
      // const result = await InquiryService.getInquiry();
      // setInquiries(result.data);
      // setFilteredInquiries(result.data);
      // setTotalItems(result.data.length);
    } catch (error) {
      console.error("Error fetching inquiries:", error);
      setInquiries([]);
      setFilteredInquiries([]);
    }
  };

  useEffect(() => {
    fetchInquiries();
  }, [departmentId]);
  
  // Function to get the dropdown position (top or bottom) based on available space
  const getDropdownPosition = (inquiryRegistrationId, isLastRow) => {
    const button = buttonRefs.current[inquiryRegistrationId ];
    if (!button) return { top: 0, left: 0 };

    const buttonRect = button.getBoundingClientRect();
    const windowHeight = window.innerHeight;
    const spaceBelow = windowHeight - buttonRect.bottom;
    const spaceAbove = buttonRect.top;

    // If it's the last row or space below is too small, open the dropdown above
    if (isLastRow || spaceBelow < 400) {
      return { top: buttonRect.top - 100, left: buttonRect.left - 120 };
    }

    // Otherwise, open it below
    return { top: buttonRect.bottom - 5, left: buttonRect.left - 120 };
  };
  
  const handleInquiryFilterChange = (event) => {
    setInquiryFilter(event.target.value);
  };

  const handleCategoryFilterChange = (event) => {
    setCategoryFilter(event.target.value);
  };
  
  useEffect(() => {
    let filtered = inquiries;

    if (inquiryFilter) {
      filtered = filtered.filter((inquiry) =>
        inquiry.inquiryTitle.toLowerCase().includes(inquiryFilter.toLowerCase())
      );
    }

    if (categoryFilter) {
      filtered = filtered.filter((inquiry) => inquiry.inquiryStatusName === categoryFilter);
    }

    setFilteredInquiries(filtered);
    setTotalItems(filtered.length);
    setCurrentPage(1); // Reset page on filter change
  }, [inquiryFilter, categoryFilter, inquiries]);
  
  const deleteInquiry = async () => {
    if (!deleteId) return;
    try {
      const response = await InquiryService.deleteInquiry(deleteId);
      if (response.status === 1) {
        setFilteredInquiries((prevInquiries) =>
          prevInquiries.filter((inquiry) => inquiry.inquiryRegistrationId !== deleteId)
        );
        toast.error("Inquiry Deleted Successfully");
        setIsPopupOpen(false);
        setDeleteId(null);
      }
    } catch (error) {
      console.error("Error deleting inquiry:", error);
      toast.error("Failed to delete inquiry.");
    }
  };
  
  const handleDeleteClick = (inquiryRegistrationId) => {
    setDeleteId(inquiryRegistrationId);
    setIsPopupOpen(true);
  };

  const handlePopupClose = () => {
    setIsPopupOpen(false);
    setDeleteId(null);
  };
  
  const toggleDropdown = (inquiryRegistrationId) => {
    // Toggle dropdown for the current task, close if it's already open
    setOpenDropdown((prev) =>
      prev === inquiryRegistrationId ? null : inquiryRegistrationId
    );
  };

  const closeMenu = () => {
    setOpenDropdown(null);
  };
  
  // Function to set the color based on the leave status
  const getStatusColor = (inquiryStatusName) => {
    switch (inquiryStatusName) {
      case "Pending":
        return "text-yellow-500 bg-yellow-100"; // Yellow for Pending
      case "Approved":
        return "text-green-500 bg-green-100"; // Green for Approved
      case "Rejected":
        return "text-red-500 bg-red-100"; // Red for Rejected
      default:
        return "text-gray-500 bg-gray-100"; // Default color
    }
  };
  
  // Function to handle opening the popup and setting the current task
  const handleForwardInquiry = (inquiry) => {
    setInquiryRegistrationId(inquiry.inquiryRegistrationId); // Set the selected task data
    setForwardPopupVisible(true); // Show the popup
  };

  //Function to submit the api
  const handleInquirySubmit = async (event) => {
    event.preventDefault();

    debugger;

    const inquiryData = {
      inquiryRegistrationId,
      inquiryForwardedTo,
      inquiryFollowUpDescription,
      inquiryTransferTo : inquiryTransferTo === "" ? null : inquiryTransferTo,
      // taskTransferTo,
    };

    //console.log("Submitting task transfer data:", taskTransferData); // Log the data before submitting

    try {
      // Call the API to add the task note
      const response = await InquiryFollowUpService.addInquiryFollowUp(inquiryData);
      if (response.status === 1) {
        if(inquiryForwardedTo === null || "") {
          toast.success("Inquiry Transfer Successfully."); // Toast on success
        }

        if(inquiryTransferTo === null || "") {
          toast.success("Inquiry Forwarded Successfully."); // Toast on success
        }
        // toast.success(response.message); // Toast on success
        fetchInquiries();
        setInquiryFollowUpDescription("");
        setInquiryForwardedTo("");
        setInquiryTransferTo("");
      } else {
        setInquiryFollowUpDescription("");
        setInquiryForwardedTo("");
        setInquiryTransferTo("");
      }
      // console.log("task transfer added successfully:", response);

      // Optionally, you can update the task state or show a success message here
      setForwardPopupVisible(false); // Close the popup
    } catch (error) {
      console.error(
        "Error transfering or forwarding a inquiry:",
        error.response?.data || error.message
      );
      if (error.response?.data?.errors) {
        console.log("Validation Errors:", error.response.data.errors); // This will help pinpoint specific fields causing the issue
      }
    }
  
      // Close the popup after submission
      // setIsPopupVisible(false);
  };
   
  // Function to handle opening the popup and setting the current task
  const handleTransferInquiry = (inquiry) => {
    setInquiryRegistrationId(inquiry.inquiryRegistrationId); // Set the selected task data
    setTransferPopupVisible(true); // Show the popup
  };

  // const handleTransferSubmit = async (event) => {
  //   event.preventDefault();

  //   // debugger;

  //   const inquiryTransferData = {
  //     inquiryRegistrationId,
  //     inquiryForwardedTo,
  //     inquiryFollowUpDescription
  //     // taskTransferTo,
  //   };
  //   //console.log("Submitting task transfer data:", taskTransferData); // Log the data before submitting

  //   try {
  //     // Call the API to add the task note
  //     const response = await InquiryFollowUpService.addInquiryFollowUp(inquiryTransferData);
  //     if (response.status === 1) {
  //       toast.success("Inquiry Forwarded Successfully."); // Toast on success
  //       // toast.success(response.message); // Toast on success
  //       fetchInquiries();
  //     }
  //     console.log("task transfer added successfully:", response);

  //     // Optionally, you can update the task state or show a success message here
  //     setForwardPopupVisible(false); // Close the popup
  //   } catch (error) {
  //     console.error(
  //       "Error adding task note:",
  //       error.response?.data || error.message
  //     );
  //     if (error.response?.data?.errors) {
  //       console.log("Validation Errors:", error.response.data.errors); // This will help pinpoint specific fields causing the issue
  //     }
  //   }
  
  //     // Close the popup after submission
  //     // setIsPopupVisible(false);
  // };

  //#region Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredInquiries.slice(indexOfFirstItem, indexOfLastItem);

  const totalPages = Math.ceil(totalItems / itemsPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };
  //#endregion

  return (
    <>
      <div className="flex justify-between items-center my-3">
        <h1 className="font-semibold text-2xl">Partner Inquiry List</h1>
        <div className="flex">
          <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
            <Link
              to="/partnerinquiry-list/add-partnerinquiry"
              // to={navigateTo}
              className="bg-blue-600 hover:bg-blue-700 flex gap-2 text-center text-white font-medium py-2 px-4 rounded hover:no-underline"
            >
              Add
              <FaPlus className="mt-[3px]" size={14} />
            </Link>
          </motion.button>
        </div>
      </div>

      <div className="flex gap-4 my-4">
        <input
          type="text"
          value={inquiryFilter}
          onChange={handleInquiryFilterChange}
          placeholder="Search Inquiry"
          className="p-2 outline-none rounded border border-gray-300"
        />

        <select
          value={categoryFilter}
          onChange={handleCategoryFilterChange}
          className="border border-gray-300 rounded p-2"
        >
          <option value="">All Status</option>
          <option value="Pending">Pending</option>
          <option value="Open">Open</option>
          <option value="Close">Close</option>
        </select>
      </div>

      <div className="grid overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-200 rounded-lg">
          <thead className="bg-gray-900 border-b">
            <tr>
              {[
                "Inquiry Title",
                "Inquiry Location",
                "Inquiry Type",
                "Priority Level",
                "Inquiry Status",
                "Actions",
              ].map((header) => (
                <th
                  key={header}
                  className="text-left py-3 px-4 uppercase font-semibold text-sm text-[#939393]"
                >
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          {currentItems.length === 0 ? (
            <tr>
              <td colSpan="5" className="text-center py-3 px-4 text-gray-700">
                No inquiries found.
              </td>
            </tr>
          ) : (
            currentItems.map((item, index) => {
              const isLastRow = index === inquiries.length - 1;
              return (
                <motion.tr
                  key={item.id}
                  className="border-b hover:bg-gray-50"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: item * 0.1 }}
                >
                  <td className="py-3 px-4 text-gray-700">
                    {item.inquiryTitle}
                  </td>
                  <td className="py-3 px-4 text-gray-700">
                    {item.inquiryLocation}
                  </td>
                  <td className="py-3 px-4 text-gray-700">
                    {item.inquiryTypeName}
                  </td>
                  <td className="py-3 px-4 text-gray-700">
                    {item.priorityLevelName}
                  </td>
                  <td className="py-3 px-4">
                    <span
                      className={`px-2 py-1 rounded-lg font-medium ${getStatusColor(
                        item.inquiryStatusName
                      )}`}
                    >
                      {item.inquiryStatusName}
                    </span>
                  </td>
                  {/* <td className="py-3 px-4 text-gray-700">
                    {item.inquiryStatusName}
                  </td> */}
                  <td className="py-3 px-4">
                    <div className="flex gap-2">
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                      >
                        <Link
                          to={`/partnerinquiry-list/view-partnerinquiry/${item.inquiryRegistrationId}`}
                          className="text-green-500 hover:text-green-700"
                        >
                          <FaEye size={24} />
                        </Link>
                      </motion.button>

                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() =>
                          handleDeleteClick(item.inquiryRegistrationId)
                        }
                        className="text-red-500 hover:text-red-700"
                      >
                        <FaTrash size={22} />
                      </motion.button>

                        {/* <motion.button
                          type="button"
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => {
                            fetchInquiriePermission(item.inquiryRegistrationId);
                            toggleDropdown(item.inquiryRegistrationId);
                          }}
                          className="text-gray-500 hover:text-gray-700"
                          ref={(el) =>
                           (buttonRefs.current[item.inquiryRegistrationId] = el)
                        }
                        >
                          <FaEllipsisV size={24} />
                        </motion.button> */}

                      {/* Render dropdown above or below based on space */}
                      {openDropdown === item.inquiryRegistrationId && (
                        <div
                          className="absolute z-10 bg-white divide-y divide-gray-100 rounded-lg shadow w-44 dark:bg-gray-700 dark:divide-gray-600"
                          style={getDropdownPosition(
                            item.inquiryRegistrationId,
                            isLastRow
                          )}
                          onMouseLeave={closeMenu}
                        >
                          <ul className="py-2 text-sm text-gray-800 cursor-pointer dark:text-gray-200">
                            <li>
                              <span
                                onClick={() => handleForwardInquiry(item)}
                                className="block px-4 py-2 hover:bg-gray-100 hover:no-underline dark:hover:bg-gray-600 dark:hover:text-white"
                              >
                                Forward Inquiry
                              </span>
                            </li>

                            {inquiryHideShow === true && (
                              <>
                              <li>
                              <span
                                onClick={() => handleTransferInquiry(item)}
                                className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                              >
                                Inquiry Transfer
                              </span>
                            </li>
                            <li>
                              <span
                                // onClick={() => handleTaskTransfer(item)}
                                className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                              >
                                Take Inquiry
                              </span>
                            </li>
                              </>
                            )}
                            {/* <li>
                              <span
                                onClick={() => handleTransferInquiry(item)}
                                className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                              >
                                Inquiry Transfer
                              </span>
                            </li>
                            <li>
                              <span
                                // onClick={() => handleTaskTransfer(item)}
                                className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                              >
                                Take Inquiry
                              </span>
                            </li> */}
                          </ul>
                          {forwardPopupVisible && (
                            <div className="fixed inset-0 bg-gray-700 bg-opacity-50 flex justify-center items-center z-50">
                              <div className="bg-white p-6 rounded-lg shadow-lg md:w-1/3 xl:w-1/3">
                                <h2 className="text-xl font-semibold mb-4">
                                  Forward Inquiry
                                </h2>
                                <form>
                                  <div className="mb-4">
                                    <label className="block text-sm font-medium text-gray-700">
                                      Select Department
                                    </label>
                                    <select
                                      value={departmentId}
                                      onChange={(e) =>
                                        setDepartmentId(e.target.value)
                                      }
                                      className="w-full mt-1 px-3 py-2 rounded-md border border-active"
                                    >
                                      <option value="">
                                        --Select Department--
                                      </option>
                                      {departments.map((department) => (
                                        <option
                                          key={department.departmentId}
                                          value={department.departmentId}
                                        >
                                          {department.departmentName}
                                        </option>
                                      ))}
                                    </select>
                                  </div>

                                  <div className="mb-4">
                                    <label className="block text-sm font-medium text-gray-700">
                                      Forward to:
                                    </label>
                                    
                                    <select
                                      value={inquiryForwardedTo}
                                      onChange={(e) =>
                                        setInquiryForwardedTo(e.target.value)
                                      }
                                      className="w-full mt-1 px-3 py-2 rounded-md border border-active"
                                    >
                                      <option value="">
                                        --Select Employee--
                                      </option>
                                      {employeeList.map((employee) => (
                                        <option
                                          key={employee.employeeId}
                                          value={employee.employeeId}
                                        >
                                          {employee.firstName +
                                            " " +
                                            employee.lastName}
                                        </option>
                                      ))}
                                    </select>
                                  </div>

                                  {/* Description Field */}
                                  <div className="mb-4">
                                    <label className="block text-sm font-medium text-gray-700">
                                      FollowUp Description
                                    </label>
                                    <textarea
                                      value={inquiryFollowUpDescription}
                                      onChange={(e) =>
                                        setInquiryFollowUpDescription(e.target.value)
                                      }
                                      className="w-full mt-1 px-3 py-2 rounded-md border border-active"
                                      rows="4"
                                    />
                                  </div>

                                  <div className="flex flex-col md:flex-row justify-end gap-4">
                                    <button
                                      type="button"
                                      onClick={() =>
                                        setForwardPopupVisible(false)
                                      }
                                      className="px-7 py-2 bg-gray-300 text-black rounded border-active"
                                    >
                                      Cancel
                                    </button>
                                    <button
                                      onClick={handleInquirySubmit}
                                      className="px-4 py-2 bg-blue-500 text-white rounded border-active"
                                    >
                                      Forward
                                    </button>
                                  </div>
                                </form>
                              </div>
                            </div>
                          )}

                          {transferPopupVisible && (
                            <div className="fixed inset-0 bg-gray-700 bg-opacity-50 flex justify-center items-center z-50">
                              <div className="bg-white p-6 rounded-lg shadow-lg md:w-1/3 xl:w-1/3">
                                <h2 className="text-xl font-semibold mb-4">
                                  Transfer Inquiry
                                </h2>
                                <form>
                                  <div className="mb-4">
                                    <label className="block text-sm font-medium text-gray-700">
                                      Select Department
                                    </label>
                                    <select
                                      value={departmentId}
                                      onChange={(e) =>
                                        setDepartmentId(e.target.value)
                                      }
                                      className="w-full mt-1 px-3 py-2 rounded-md border border-active"
                                    >
                                      <option value="">
                                        --Select Department--
                                      </option>
                                      {departments.map((department) => (
                                        <option
                                          key={department.departmentId}
                                          value={department.departmentId}
                                        >
                                          {department.departmentName}
                                        </option>
                                      ))}
                                    </select>
                                  </div>

                                  <div className="mb-4">
                                    <label className="block text-sm font-medium text-gray-700">
                                      Trafser to:
                                    </label>
                                    
                                    <select
                                      value={inquiryTransferTo}
                                      onChange={(e) =>
                                        setInquiryTransferTo(e.target.value)
                                      }
                                      className="w-full mt-1 px-3 py-2 rounded-md border border-active"
                                    >
                                      <option value="">
                                        --Select Employee--
                                      </option>
                                      {employeeList.map((employee) => (
                                        <option
                                          key={employee.employeeId}
                                          value={employee.employeeId}
                                        >
                                          {employee.firstName +
                                            " " +
                                            employee.lastName}
                                        </option>
                                      ))}
                                    </select>
                                  </div>

                                  {/* Description Field */}
                                  <div className="mb-4">
                                    <label className="block text-sm font-medium text-gray-700">
                                      Transfer Reason
                                    </label>
                                    <textarea
                                      value={inquiryFollowUpDescription}
                                      onChange={(e) =>
                                        setInquiryFollowUpDescription(e.target.value)
                                      }
                                      className="w-full mt-1 px-3 py-2 rounded-md border border-active"
                                      rows="4"
                                    />
                                  </div>

                                  <div className="flex flex-col md:flex-row justify-end gap-4">
                                    <button
                                      type="button"
                                      onClick={() =>
                                        setTransferPopupVisible(false)
                                      }
                                      className="px-7 py-2 bg-gray-300 text-black rounded border-active"
                                    >
                                      Cancel
                                    </button>
                                    <button
                                      onClick={handleInquirySubmit}
                                      className="px-4 py-2 bg-blue-500 text-white rounded border-active"
                                    >
                                      Transfer
                                    </button>
                                  </div>
                                </form>
                              </div>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </td>
                </motion.tr>
              );
            })
          )}
        </table>
      </div>

      {/* Confirmation Popup */}
      {isPopupOpen && (
        <div className="fixed inset-0 flex justify-center items-center bg-gray-600 bg-opacity-50">
          <div className="bg-white p-5 rounded-lg shadow-lg max-w-lg">
            <div className="flex justify-center mb-4">
              <div className="bg-red-100 p-5 rounded-full">
                <FaTrashAlt className="text-red-600 text-4xl" />
              </div>
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-4 text-center">
              Are you sure you want to delete this inquiry?
            </h3>
            <div className="flex justify-center gap-4">
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={handlePopupClose}
                className="flex items-center gap-2 bg-gray-400 px-8 py-3 rounded-lg text-white font-semibold hover:bg-gray-500"
              >
                No
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={deleteInquiry}
                className="flex items-center gap-2 bg-red-600 font-semibold text-white px-8 py-3 rounded-lg hover:bg-red-700"
              >
                Yes
              </motion.button>
            </div>
          </div>
        </div>
      )}

      {/* Pagination Section */}
      <div className="flex mt-4 items-center justify-between border-t border-gray-200 bg-white px-4 py-3 sm:px-6 shadow-lg">
        <div className="flex flex-1 justify-between sm:hidden">
          <motion.button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="relative inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            Previous
          </motion.button>
          <motion.button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="relative ml-3 inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            Next
          </motion.button>
        </div>
        <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
          <div>
            <p className="text-sm text-gray-700">
              Showing
              <span className="font-semibold mx-1">{indexOfFirstItem + 1}</span>
              to
              <span className="font-semibold mx-1">
                {Math.min(indexOfLastItem, totalItems)}
              </span>
              of
              <span className="font-semibold mx-1">{totalItems}</span>
              results
            </p>
          </div>
          <div>
            <nav
              className="isolate inline-flex -space-x-px rounded-md shadow-sm"
              aria-label="Pagination"
            >
              <motion.button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="relative inline-flex items-center rounded-l-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <span className="sr-only">Previous</span>
                <svg
                  className="size-5"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path
                    fillRule="evenodd"
                    d="M11.78 5.22a.75.75 0 0 1 0 1.06L8.06 10l3.72 3.72a.75.75 0 1 1-1.06 1.06l-4.25-4.25a.75.75 0 0 1 0-1.06l4.25-4.25a.75.75 0 0 1 1.06 0Z"
                    clipRule="evenodd"
                  />
                </svg>
              </motion.button>

              {/* Pagination Buttons */}
              {[...Array(totalPages)].map((_, index) => (
                <motion.button
                  key={index}
                  onClick={() => handlePageChange(index + 1)}
                  className={`relative z-10 inline-flex items-center px-4 py-2 text-sm font-semibold text-white focus:z-20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 ${
                    currentPage === index + 1
                      ? "bg-indigo-600"
                      : "bg-gray-200 text-gray-700"
                  }`}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  {index + 1}
                </motion.button>
              ))}

              <motion.button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="relative inline-flex items-center rounded-r-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <span className="sr-only">Next</span>
                <svg
                  className="size-5"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path
                    fillRule="evenodd"
                    d="M8.22 5.22a.75.75 0 0 1 1.06 0l4.25 4.25a.75.75 0 0 1 0 1.06l-4.25 4.25a.75.75 0 0 1-1.06-1.06L11.94 10 8.22 6.28a.75.75 0 0 1 0-1.06Z"
                    clipRule="evenodd"
                  />
                </svg>
              </motion.button>
            </nav>
          </div>
        </div>
      </div>
    </>
  );
};

export default PartnerInquiryList;
