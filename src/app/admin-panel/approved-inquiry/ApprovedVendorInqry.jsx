//#region Imports
import React, { useEffect, useRef, useState } from "react";
import { FaCheck, FaTimes } from "react-icons/fa";
import { useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import { InquiryApproveRejectService } from "../../service/InquiryApproveRejectService";
//#endregion

//#region Component: ApprovedVendorInqry
const ApprovedVendorInqry = () => {
  //#region State Variables
  const [inquiries, setInquiries] = useState([]);
  const [filteredInquiries, setFilteredInquiries] = useState([]);
  const [inquiryFilter, setInquiryFilter] = useState(""); // Filter for inquiry name or code
  const [categoryFilter, setCategoryFilter] = useState(""); // Filter for inquiry category
  const [isApprovePopupOpen, setIsApprovePopupOpen] = useState(false); // Popup for confirmation
  const [isCancelPopupOpen, setIsCancelPopupOpen] = useState(false); // Popup for confirmation
  const [cancelId, setCancelId] = useState(null); // Store the eventTypeId for deletion
  const [approveId, setApproveId] = useState(null); // Store the eventTypeId for deletion
  const [inquiryGivenTo, setInquiryGivenTo] = useState(null); // Store the inquiryGivenTo 
  
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(7); // Items per page
  const [totalItems, setTotalItems] = useState(0); // Total items count for pagination
  const { id } = useParams();
  //#endregion
  
  //#region Fetch Approved/Rejected Vendor Inquiry
  const fetchInquiries = async () => {
    try {
      const result =
      await InquiryApproveRejectService.getInquiryApproveRejectVendor(id);
      setInquiries(result.data);
      console.log(result.data);

      setFilteredInquiries(result.data);
      setTotalItems(result.data.length);
    } catch (error) {
      console.error("Error fetching inquiries:", error);
    }
  };

  useEffect(() => {
    fetchInquiries();
  }, []);
  //#endregion
  
  
  const handleInquiryFilterChange = (event) => {
    setInquiryFilter(event.target.value);
  };

  const handleCategoryFilterChange = (event) => {
    setCategoryFilter(event.target.value);
  };
  
  //#region Filter Logic
  // Filter inquiries based on inquiryFilter and categoryFilter
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
  //#endregion
  
  //#region Status Color
  // Function to set the color based on the leave status
  const getStatusColor = (finalApproval) => {
    switch (finalApproval) {
      case 0:
        return ""; 
      case 1:
        return "text-green-500 bg-green-100"; // Green for Approved
      case "Rejected":
        return "text-red-500 bg-red-100"; // Red for Rejected
      default:
        return "text-gray-500 bg-gray-100"; // Default color
    }
  };
  //#endregion

  //#region Handle Approve/Cancel Clicks
  const handleApproveClick = (item) => {
    setApproveId(item.inquiryRegistrationId);
    setInquiryGivenTo(item.inquiryApprovedBy);
    setIsApprovePopupOpen(true);
  };

  const handleCancelClick = (item) => {
    setCancelId(item.inquiryRegistrationId);
    setInquiryGivenTo(item.inquiryApprovedBy);
    setIsCancelPopupOpen(true);
  };
  //#endregion

  //#region Handle Approve/Cancel Inquiry Submission
  // Function to approve the inquiry 
  const approveInquiry = async (status) => {
    if (!approveId) return;

    // debugger;
    const inquiryApproveRejectData = {
      inquiryRegistrationId: id,
      inquiryGivenTo,
      finalApproval: status
    };
    
    try {
      const response = await InquiryApproveRejectService.addFinalInquiryApproveReject(inquiryApproveRejectData);
      if (response.status === 1) {
        toast.success(response.message); // Toast on success
        fetchInquiries();
      } else if (response.status === 2) {
        toast.error(response.message); // Toast on error
      } else {
        toast.error(response.message); // Toast on error
      }
      setIsApprovePopupOpen(false)
    } catch (error) {
      console.error("Error approving inquiry:", error);
      toast.error("Failed to approve inquiry.");
    }
  };

  // Function to cancel the inquiry
  const cancelInquiry = async (status) => {
    if (!cancelId) return;

    const inquiryApproveRejectData = {
      inquiryRegistrationId: id,
      inquiryCancleTo: inquiryGivenTo,
      finalApprovalCancle: status
    };
    
    try {
      const response = await InquiryApproveRejectService.cancleFinalInquiryApprove(inquiryApproveRejectData);
      if (response.status === 1) {
        toast.success(response.message); // Toast on success
        // fetchInquiries();
      } else if (response.status === 2) {
        toast.error(response.message); // Toast on error
      } else {
        toast.error(response.message); // Toast on error
      }
      setIsCancelPopupOpen(false)
    } catch (error) {
      console.error("Error canceling inquiry:", error);
      toast.error("Failed to cancel inquiry.");
    }
  };
  //#endregion

  //#region Handle Popup Close
  const handleApprovePopupClose = () => {
    setIsApprovePopupOpen(false);
    setInquiryGivenTo("");
    // setDeleteId(null);
  };

  const handleCancelPopupClose = () => {
    setIsCancelPopupOpen(false);
    setInquiryGivenTo("");
    // setDeleteId(null);
  };
  //#endregion

  //#region Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredInquiries.slice(indexOfFirstItem, indexOfLastItem);

  const totalPages = Math.ceil(totalItems / itemsPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };
  //#endregion

  //#region Render
  return (
    <>
      {/* Header Section */}
      <div className="flex justify-between items-center my-3">
        <h1 className="font-semibold text-2xl">Approved Vendor Project List</h1>
      </div>

      {/* Table Section */}
      <div className="grid overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-200 rounded-lg">
          <thead className="bg-gray-900 border-b">
            <tr>
              <th className="text-left py-3 pl-7 uppercase font-semibold text-sm text-[#939393]">
                Vendor Name
              </th>
              <th className="text-right py-3 pr-24 uppercase font-semibold text-sm text-[#939393]">
                Action
              </th>
            </tr>
          </thead>
          {currentItems.length === 0 ? (
            <tr>
              <td colSpan="5" className="text-center py-3 px-4 text-gray-700">
                No vendor approved projects found.
              </td>
            </tr>
          ) : (
            currentItems.map((item, index) => {
              // const isLastRow = index === inquiries.length - 1;
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
                      
                      <div>
                      <span
                          className={`px-2 py-1 rounded-lg font-medium ${getStatusColor(
                            item.finalApproval
                          )}`}
                        >
                          {item.finalApproval === 1 ? "Approved" : ""}
                        </span>
                      </div>

                      {item.finalApproval !== 1 && (
                      <motion.button
                        type="button"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => {
                          handleApproveClick(item);
                        }}
                        // onClick={() => handleApprove(item, 1)}
                        className="bg-green-600 hover:bg-green-700 flex gap-2 text-center text-white font-medium py-2 px-4 mr-3 rounded hover:no-underline"
                      >
                        Approve
                        <FaCheck size={18} />
                      </motion.button>
                      )}

                      {item.finalApproval === 1 && (
                      <motion.button
                        type="button"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => {
                          handleCancelClick(item);
                          // handleCancelClick(item.inquiryRegistrationId);
                        }}
                        className="bg-red-600 text-white py-2 px-4 flex gap-2 rounded-md"
                      >
                        Cancle
                        <FaTimes size={18} />
                      </motion.button>
                      )}
                      
                    </div>
                  </td>
                </motion.tr>
              );
            })
          )}
        </table>
      </div>

      {/* Approve Confirmation Popup */}
      {isApprovePopupOpen && (
        <div className="fixed inset-0 flex justify-center items-center bg-gray-600 bg-opacity-50">
          <div className="bg-white p-5 rounded-lg shadow-lg max-w-lg">
            <div className="flex justify-center mb-4">
              <div className="bg-green-100 p-5 rounded-full">
                <FaCheck className="text-green-600 text-4xl" />
              </div>
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-4 text-center">
              Are you sure you want to approve this project?
            </h3>
            <div className="flex justify-center gap-4">
              <motion.button
                type="button"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={handleApprovePopupClose}
                className="flex items-center gap-2 bg-gray-400 px-8 py-3 rounded-lg text-white font-semibold hover:bg-gray-500"
              >
                No
              </motion.button>
              <motion.button
                type="button"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => approveInquiry(1)}
                className="flex items-center gap-2 bg-green-600 font-semibold text-white px-8 py-3 rounded-lg hover:bg-green-700"
              >
                Yes
              </motion.button>
            </div>
          </div>
        </div>
      )}

      {/* Cancel Confirmation Popup */}
      {isCancelPopupOpen && (
        <div className="fixed inset-0 flex justify-center items-center bg-gray-600 bg-opacity-50">
          <div className="bg-white p-5 rounded-lg shadow-lg max-w-lg">
            <div className="flex justify-center mb-4">
              <div className="bg-red-100 p-5 rounded-full">
                <FaTimes className="text-red-600 text-4xl" />
              </div>
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-4 text-center">
              Are you sure you want to cancel this project?
            </h3>
            <div className="flex justify-center gap-4">
              <motion.button
                type="button"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={handleCancelPopupClose}
                className="flex items-center gap-2 bg-gray-400 px-8 py-3 rounded-lg text-white font-semibold hover:bg-gray-500"
              >
                No
              </motion.button>
              <motion.button
                type="button"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => cancelInquiry(true)}
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
  //#endregion
};

export default ApprovedVendorInqry;
//#endregion