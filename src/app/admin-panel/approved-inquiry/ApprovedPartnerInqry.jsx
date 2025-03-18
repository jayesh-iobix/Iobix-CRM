import React, { useEffect, useRef, useState } from "react";
import { FaCheck, FaEdit, FaEllipsisV, FaEye, FaPlus, FaTimes, FaTrash, FaTrashAlt } from "react-icons/fa";
import { Link, useParams } from "react-router-dom";
import { InquiryService } from "../../service/InquiryService"; // Assuming you have an InquiryService for API calls
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import { ReportService } from "../../service/ReportService"; // Assuming you have a ReportService for downloading reports
import { DepartmentService } from "../../service/DepartmentService";
import { EmployeeService } from "../../service/EmployeeService";
import { InquiryFollowUpService } from "../../service/InquiryFollowUpService";
import { InquiryApproveRejectService } from "../../service/InquiryApproveRejectService";

const ApprovedPartnerInqry = () => {
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
  
  //#region Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(7); // Items per page
  const [totalItems, setTotalItems] = useState(0); // Total items count for pagination
  //#endregion
  
  const { id } = useParams();
  const role = sessionStorage.getItem("role");
  // console.log(role);

  // const navigateTo = role === 'partner' 
  // ? '/partner/inquiry-list/add-inquiry' 
  // : '/company/inquiry-list/add-inquiry';

  const fetchInquiries = async () => {
    try {
        const result = await InquiryApproveRejectService.getInquiryApproveRejectPartner(id);
        setInquiries(result.data);
        console.log(result.data);
        setFilteredInquiries(result.data);
        setTotalItems(result.data.length);

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
    } catch (error) {
      console.error("Error fetching inquiries:", error);

    }
  };

  useEffect(() => {
    fetchInquiries();
  }, [departmentId]);
  
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

  const handleApprove = async (item, status) => {
    // Add your approval logic here

    // debugger;

    const inquiryApproveRejectData = {
      inquiryRegistrationId: id,
      inquiryGivenTo: item.inquiryApprovedBy,
      clientApprovedReject: null, // Store status if the role is 'client'
      partnerApprovedReject: null, // Store status if the role is 'partner'
      finalApproval: status
    };

    // console.log(inquiryApproveRejectData);
    try {
      const response = await InquiryApproveRejectService.addFinalInquiryApprove( inquiryApproveRejectData);
      debugger;
      if (response.status === 1) {
        toast.success(response.message); // Toast on success
        // fetchInquiries();
      } else if (response.status === 2) {
        toast.error(response.message); // Toast on error
      } else {
        toast.error(response.message); // Toast on error
      }
    } catch (error) {
      console.error("Error:", error.response?.data || error.message);
      if (error.response?.data?.errors) {
        console.log("Validation Errors:", error.response.data.errors); // This will help pinpoint specific fields causing the issue
      }
    }
  };

  const handleCancle = async (item, status) => {
    // Add your approval logic here

    // debugger;

    const inquiryApproveRejectData = {
      inquiryRegistrationId: id,
      inquiryCancleTo: item.inquiryApprovedBy,
      finalApprovalCancle: status
    };

    // console.log(inquiryApproveRejectData);
    try {
      const response = await InquiryApproveRejectService.cancleFinalInquiryApprove(inquiryApproveRejectData);
      debugger;
      if (response.status === 1) {
        toast.error(response.message); // Toast on success
        // fetchInquiries();
      } else if (response.status === 2) {
        toast.error(response.message); // Toast on error
      } else {
        toast.error(response.message); // Toast on error
      }
    } catch (error) {
      console.error("Error:", error.response?.data || error.message);
      if (error.response?.data?.errors) {
        console.log("Validation Errors:", error.response.data.errors); // This will help pinpoint specific fields causing the issue
      }
    }
  };

  
  
  // Function to set the color based on the leave status
  // const getStatusColor = (inquiryStatusName) => {
  //   switch (inquiryStatusName) {
  //     case "Pending":
  //       return "text-yellow-500 bg-yellow-100"; // Yellow for Pending
  //     case "Approved":
  //       return "text-green-500 bg-green-100"; // Green for Approved
  //     case "Rejected":
  //       return "text-red-500 bg-red-100"; // Red for Rejected
  //     default:
  //       return "text-gray-500 bg-gray-100"; // Default color
  //   }
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
        <h1 className="font-semibold text-2xl">Approved Partner Inquiry List</h1>
        {/* <div className="flex">
          <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
            <Link
              to="/clientinquiry-list/add-clientinquiry"
              // to={navigateTo}
              className="bg-blue-600 hover:bg-blue-700 flex gap-2 text-center text-white font-medium py-2 px-4 rounded hover:no-underline"
            >
              Add
              <FaPlus className="mt-[3px]" size={14} />
            </Link>
          </motion.button>
        </div> */}
      </div>

      {/* <div className="flex gap-4 my-4">
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
          <option value="Approved">Approved</option>
          <option value="Close">Close</option>
        </select>
      </div> */}

      <div className="grid overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-200 rounded-lg">
          <thead className="bg-gray-900 border-b">
          <tr>
            <th className="text-left py-3 pl-7 uppercase font-semibold text-sm text-[#939393]">
              Partner Name
            </th>
            <th className="text-right py-3 pr-24 uppercase font-semibold text-sm text-[#939393]">
              Action
            </th>
          </tr>
          </thead>
          {currentItems.length === 0 ? (
            <tr>
              <td colSpan="5" className="text-center py-3 px-4 text-gray-700">
                No partner approved inquiries found.
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
                    {item.inquiryApprovedByName}
                  </td>
                  <td className="px-4 py-2 border-b">
                    <div className="flex gap-2 justify-end">
                      {inquiries.finalApproval !== 0 &&  ( 
                        <motion.button
                        type="button"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => handleApprove(item, 1)} 
                        // onClick={(e) => {
                        //   handelApproveRejectLeave(leave, 1, e);
                        // }}
                        className="bg-green-600 hover:bg-green-700 flex gap-2 text-center text-white font-medium py-2 px-4 mr-3 rounded hover:no-underline"
                      >
                        Approve
                        <FaCheck size={18} />
                      </motion.button>
                      )}

                      <motion.button
                        type="button"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        // onClick={(e) => {
                        //   handelApproveRejectLeave(leave, 2, e);
                        // }}
                        className="bg-red-600 text-white py-2 px-4 flex gap-2 rounded-md"
                      >
                        Cancle
                        <FaTimes size={18} />
                      </motion.button>
                    </div>
                  </td>
                </motion.tr>
              );
            })
          )}
        </table>
      </div>


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

export default ApprovedPartnerInqry;
