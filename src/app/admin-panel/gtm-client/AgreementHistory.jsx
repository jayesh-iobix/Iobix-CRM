//#region Imports
import React, { useEffect, useState } from "react";
import { FaEdit, FaEye, FaPlus, FaTrash, FaTrashAlt } from "react-icons/fa";
import { Link, useParams } from "react-router-dom";
import { motion } from "framer-motion"; // Import framer-motion
import { toast } from "react-toastify";
import { ReportService } from "../../service/ReportService";
import { GtmClientService } from "../../service/GtmClientService";
import { AgreementService } from "../../service/AgreementService";
//#endregion

//#region Component: AgreementHistory
const AgreementHistory = () => {
  //#region State variables
  const [gtmClientAgreement, setGtmClientAgreement] = useState([]);
  const [filteredGtmServiceAgreement, setFilteredGtmServiceAgreement] = useState([]);
  const [clientFilter, setClientFilter] = useState(""); // State for employee filter
  const [deleteId, setDeleteId] = useState(null); // Store the eventTypeId to delete
  const [isPopupOpen, setIsPopupOpen] = useState(false); // State for the popup
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(7); // Set to 7 items per page
  const [totalItems, setTotalItems] = useState(0);

  const { id } = useParams();
  //#endregion

  //#region useEffect: Fetch GtmServiceClients Data
  useEffect(() => {
    const fetchAgreementHistory = async () => {
      try {
        const result = await AgreementService.getAgreementHistory(id);
        setGtmClientAgreement(result.data); // Set the 'data' array to the state
        setFilteredGtmServiceAgreement(result.data); // Initially show all GtmServiceClients
        setTotalItems(result.data.length); // Set total items for pagination
      } catch (error) {
        console.error("Error fetching gtm client agreement:", error);
        setGtmClientAgreement([]); // Fallback to an empty array in case of an error
        setFilteredGtmServiceAgreement([]); // Fallback to an empty array in case of an error
      }
    };
    fetchAgreementHistory();
  }, [id]);
  //#endregion

  //#region useEffect: Filter GtmServiceClients
  // Function to filter tasks based on selected employee name
  const handleClientFilterChange = (event) => {
    setClientFilter(event.target.value);
  };

  // Function to filter tasks based on selected department
  useEffect(() => {
    // Apply filters to the GtmServiceClients array
    let filtered = gtmClientAgreement;
      
    // Filter by client name
    // if (clientFilter) {
    //   filtered = filtered.filter((gtmClient) =>
    //     gtmClient.companyName.toLowerCase().includes(clientFilter.toLowerCase())
    //   );
    // }

    setFilteredGtmServiceAgreement(filtered); // Update filtered GtmServiceClients based on all filters

    setTotalItems(filtered.length); // Update total items for pagination
    setCurrentPage(1); // Reset to the first page when a new filter is applied

  }, [clientFilter, gtmClientAgreement]);
  //#endregion

  //#region Delete CLick and Delete ClientCompany 
  // Function to handle delete button click
  const handleDeleteClick = (gtmClientServiceId) => {
    setDeleteId(gtmClientServiceId);
    setIsPopupOpen(true); // Open popup
  };
  
  // Function to handle popup close without deleting
  const handlePopupClose = () => {
    setIsPopupOpen(false); // Close popup without deleting
    setDeleteId(null); // Reset the ID
  };

  // Function to delete a clientCompany 
  const deleteGtmServiceClient = async () => {
    if (!deleteId) return; // If there's no ID to delete, do nothing
    try {
      const response = await GtmClientService.deleteGtmClient(deleteId);
      if (response.status === 1) {
        setFilteredGtmServiceAgreement((prevGtmClient) =>
          prevGtmClient.filter((gtmClient) => gtmClient.gtmClientServiceId !== deleteId)
        );
        toast.error("GTM Client Agreement Deleted Successfully"); // Toast on success
        setIsPopupOpen(false); // Close popup after deletion
        setDeleteId(null); // Reset the ID
      }
    } catch (error) {
      console.error("Error deleting gtm client agreement:", error);
      alert("Failed to delete gtm client agreement");
    }
  };
  //#endregion

  //#region Download Report
  // const handleDownloadReport = async () => {
  //   setIsSubmitting(true);
  //   try {
  //     // Wait for the report download to complete
  //     await ReportService.downloadEmployeeReport();
  //     // Optionally, add a success message or additional logic after the download
  //     toast.success("Report downloaded successfully!");
  //   } catch (error) {
  //     console.error("Error downloading report:", error);
  //     toast.error("Failed to download report.");
  //   } finally {
  //     setIsSubmitting(false);
  //   }
  // }
  //#endregion

  //#region Format the date in DD-MM-YYYY
  // Format the date in DD-MM-YYYY
  const formatDate = (dateString) => {
    if (!dateString) return "N/A"; // handles null, undefined, and empty string
    const date = new Date(dateString);
    return date.toLocaleDateString("en-GB"); // 'en-GB' format is DD/MM/YYYY
  };

  //#endregion

  //#region Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredGtmServiceAgreement.slice(indexOfFirstItem, indexOfLastItem);

  const totalPages = Math.ceil(totalItems / itemsPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };
  //#endregion

  //#region Render
  return (
    <>
      {/* Header Section */}
      <div className="flex justify-between items-center my-3 mt-5">
        <h1 className="font-semibold text-xl">GTM Client Agreement History</h1>
        <div className="flex">
          {/* <motion.button 
          whileHover={{ scale: 1.1 }} 
          whileTap={{ scale: 0.9 }}
          onClick={handleDownloadReport }
          className ={`me-3 bg-purple-600 hover:bg-purple-700 flex gap-2 text-center text-white font-medium py-2 px-4 rounded hover:no-underline 
            ${isSubmitting ? "opacity-50 cursor-not-allowed" : "" }`}
          disabled={isSubmitting}
          >
            {isSubmitting ? "Downloading..." : "Download Report"}
        </motion.button> */}
          {/* <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
            <Link
              to="/gtm-client/add-gtm-client"
              className="bg-blue-600 hover:bg-blue-700 flex gap-2 text-center text-white font-medium py-2 px-4 rounded hover:no-underline"
            >
              Add
              <FaPlus className="mt-[3px]" size={14} />
            </Link>
          </motion.button> */}
        </div>
      </div>

      {/* Filters Section */}
      {/* <div className="flex gap-4 my-4">
        <input
          type="text"
          value={clientFilter}
          onChange={handleClientFilterChange}
          placeholder="Search Company Name"
          className="p-2 outline-none rounded border border-gray-300"
        />
      </div> */}

      {/* Client Company Table */}
      <div className="grid overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-200 rounded-lg">
          <thead className="bg-gray-900 border-b">
            <tr>
              {[
                "Start Date",
                "End Date",
                "Renew Date",
                "Amount",
                "Agreement Document",
                // "Actions",
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
              <td colSpan="6" className="text-center py-3 px-4 text-gray-700">
                No gtm clients agreement found.
              </td>
            </tr>
          ) : (
            currentItems.map((item) => (
              <motion.tr
                key={item.gTMClientAgreementId}
                className="border-b hover:bg-gray-50"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: item * 0.1 }}
              >
                <td className="py-3 px-4 text-gray-700">{formatDate(item.startDate)}</td>
                <td className="py-3 px-4 text-gray-700">{formatDate(item.endDate)}</td>
                <td className="py-3 px-4 text-gray-700">{formatDate(item.renewDate)}</td>
                <td className="py-3 px-4 text-gray-700">{item.amount}</td>
                <td className="py-3 px-4 text-gray-700">  {item.agreementDocument ? (
                      <a
                        href={item.agreementDocument}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-500 underline"
                      >
                        Open Agreement Document
                      </a>
                    ) : (
                      "No document available"
                    )}
                </td>
                {/* <td className="py-3 px-4">
                  <div className="flex gap-2">
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      <Link
                        className="text-green-500 hover:text-green-700"
                        to={/gtm-client/view-gtm-client/${item.gtmClientServiceId}}
                      >
                        <FaEye size={24} />
                      </Link>
                    </motion.button>

                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      <Link
                        className="text-blue-500 hover:text-blue-700"
                        to={/employee-list/edit-employee/${item.gtmClientServiceId}}
                      >
                        <FaEdit size={24} />
                      </Link>
                    </motion.button>

                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() =>
                        handleDeleteClick(item.gtmClientServiceId)
                      }
                      className="text-red-500 hover:text-red-700"
                    >
                      <FaTrash size={22} />
                    </motion.button>
                  </div>
                </td> */}
              </motion.tr>
            ))
          )}
          {/* </motion.tbody> */}
        </table>
      </div>

      {/* Confirmation Popup */}
      {/* {isPopupOpen && (
        <div className="fixed inset-0 flex justify-center items-center bg-gray-600 bg-opacity-50 z-50">
          <div className="bg-white p-5 rounded-lg shadow-lg max-w-full sm:max-w-lg md:max-w-lg lg:max-w-md xl:max-w-lg w-11/12">
            <div className="flex justify-center mb-4">
              <div className="bg-red-100 p-5 rounded-full">
                <FaTrashAlt className="text-red-600 text-4xl" />
              </div>
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-4 text-center">
              Are you sure you want to delete ?
            </h3>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={handlePopupClose}
                className="flex items-center gap-2 bg-gray-400 px-8 py-3 rounded-lg text-white font-semibold hover:bg-gray-500 active:bg-gray-500 transition duration-200 w-full sm:w-auto"
              >
                No
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={deleteGtmServiceClient}
                className="flex items-center gap-2 bg-red-600 font-semibold text-white px-8 py-3 rounded-lg hover:bg-red-700 active:bg-red-800 transition duration-200 w-full sm:w-auto"
              >
                Yes
              </motion.button>
            </div>
          </div>
        </div>
      )} */}

      {/* Pagination Section */}
      <div
        className={`flex mt-4 items-center justify-between border-t border-gray-200 bg-white px-4 py-3 sm:px-6 shadow-lg ${
          isPopupOpen ? "hidden" : ""
        }`}
      >
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

export default AgreementHistory;
//#endregion
