// #region Imports
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import { InvoiceService } from "../../service/InvoiceService"; // Create this service file to fetch invoices
import { FaDownload, FaEye } from "react-icons/fa";
import { GtmClientService } from "../../service/GtmClientService";
import { Link } from "react-router-dom";
//#endregion

// #region Component: InvoiceHistory
const InvoiceHistory = () => {
  //#region State Variables
  const [clients, setClients] = useState([]);
  const [selectedClientId, setSelectedClientId] = useState("");
  const [year, setYear] = useState(new Date().getFullYear());
  const [month, setMonth] = useState(new Date().getMonth());
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  //#endregion

  //#region Fetch Clients
  useEffect(() => {
    const fetchClients = async () => {
      try {
        const response = await GtmClientService.getGtmClient(); // replace with your actual method
        setClients(response.data);
        // console.log(response.data);
      } catch (err) {
        toast.error("Failed to load clients.");
        console.error(err);
      }
    };

    fetchClients();
  }, []);
  //#endregion

  //#region Months & Years
  // Define the current month and year
  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  // Function to get the last 10 years including the current year
  const getYears = () => {
    const current = new Date().getFullYear();
    return Array.from({ length: 11 }, (_, i) => current - 5 + i);
  };
  //#endregion

  //#region Fetch Invoices
  // Fetch invoices based on selected client, month, and year
  const fetchInvoices = async () => {
    if (!selectedClientId) return;

    setLoading(true);
    try {
      // debugger;
      const response = await InvoiceService.getInvoicesByClientMonthYear(
        selectedClientId,
        months[month],
        year
      );
      setInvoices(response.data || []);
    } catch (error) {
      toast.error("Failed to fetch invoices.");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (selectedClientId) fetchInvoices();
  }, [selectedClientId, month, year]);
  //#endregion

  //#region Download Report
  const handleDownloadReport = async (invoiceMasterId) => {
    setIsSubmitting(true);
    try {
      // Wait for the report download to complete
      const response = await InvoiceService.downloadInvoiceReport(invoiceMasterId);
      console.log(response);
      // Optionally, add a success message or additional logic after the download
      // toast.success("Report downloaded successfully!");
    } catch (error) {
      console.error("Error downloading report:", error);
      toast.error("Failed to download report.");
    } finally {
      setIsSubmitting(false);
    }
  };
  //#endregion

  //#region Format Date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    
    // Ensure the date is valid
    if (isNaN(date)) {
      return 'Invalid Date'; // Handle invalid date
    }
  
    const day = String(date.getDate()).padStart(2, '0'); // Ensure 2 digits for day
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Ensure 2 digits for month
    const year = String(date.getFullYear()).slice(-2); // Get last 2 digits of the year
  
    return `${day}/${month}/${year}`;
  };
  //#endregion

  //#region Render
  return (
    <div className="mt-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-center mb-4">
        <h1 className="text-2xl font-semibold">Invoice History</h1>
      </div>

      {/* Filters */}
      <div className="-mx-4 px-2 flex flex-wrap gap-4 mb-4">
        <div className="w-full md:w-1/4 px-2">
          <label htmlFor="client" className="block mb-1">
            Client:
          </label>
          <select
            id="client"
            className="w-full border p-2 rounded border-active"
            value={selectedClientId}
            onChange={(e) => setSelectedClientId(e.target.value)}
          >
            <option value="">--Select Client--</option>
            {clients.map((client) => (
              <option
                key={client.gtmClientServiceId}
                value={client.gtmClientServiceId}
              >
                {client.companyName}
              </option>
            ))}
          </select>
        </div>

        <div className="w-full md:w-1/4 px-2">
          <label htmlFor="year" className="block mb-1">
            Year:
          </label>
          <select
            id="year"
            className="w-full border p-2 rounded border-active"
            value={year}
            onChange={(e) => setYear(parseInt(e.target.value))}
          >
            {getYears().map((y) => (
              <option key={y} value={y}>
                {y}
              </option>
            ))}
          </select>
        </div>

        <div className="w-full md:w-1/4 px-2">
          <label htmlFor="month" className="block mb-1">
            Month:
          </label>
          <select
            id="month"
            className="w-full border p-2 rounded border-active"
            value={month}
            onChange={(e) => setMonth(parseInt(e.target.value))}
          >
            {months.map((m, index) => (
              <option key={index} value={index}>
                {m}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="grid overflow-x-auto">
        <table className="min-w-full bg-white rounded-lg border border-gray-200">
          <thead className="bg-gray-900 border-b">
            <tr>
              {[
                "Invoice #",
                "Date",
                "Issued By",
                "Client",
                "Total Amount",
                "Products",
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
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="7" className="text-center py-5">
                  Loading...
                </td>
              </tr>
            ) : invoices.length === 0 ? (
              <tr>
                <td colSpan="7" className="text-center py-5 text-gray-500">
                  No invoices found.
                </td>
              </tr>
            ) : (
              invoices.map((invoice, index) => (
                <motion.tr
                  key={invoice.invoiceMasterId}
                  className="border-b hover:bg-gray-50"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.05 }}
                >
                  <td className="py-3 px-4">{invoice.invoiceNumber}</td>
                  <td className="py-3 px-4">
                    {formatDate(invoice.invoiceDate) ? formatDate(invoice.invoiceDate) : "N/A"}
                  </td>
                  <td className="py-3 px-4">
                    {invoice.issuedByCompanyName || "N/A"}
                  </td>
                  <td className="py-3 px-4">
                    {invoice.clientCompanyName || "N/A"}
                  </td>
                  <td className="py-3 px-4">₹{invoice.total || "N/A"}</td>
                  <td className="py-3 px-4 text-left">
                    {(invoice.allProducts || []).map((item, i) => (
                      <div key={i}>
                        • {item.description} ({item.quantity} @ {item.unitPrice}
                        )
                      </div>
                    ))}
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex gap-2">
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                      >
                        <Link 
                          className="text-green-500 hover:text-green-700"
                          to={`/invoice/invoice-history/${invoice.invoiceMasterId}`}
                        >
                          <FaEye size={24} />
                        </Link>
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => handleDownloadReport(invoice.invoiceMasterId)}
                        className="text-blue-500 hover:text-blue-700"
                      >
                        {/* 📥 */}
                        <FaDownload size={23} />
                      </motion.button>
                    </div>
                  </td>
                </motion.tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
  //#endregion
};

export default InvoiceHistory;
//#endregion




// //#region Imports
// import React, { useEffect, useState } from "react";
// import { FaEye, FaTrash, FaTrashAlt } from "react-icons/fa";
// import { motion } from "framer-motion";
// import { InvoiceService } from "../../service/InvoiceService";
// import { toast } from "react-toastify";
// import { Link } from "react-router-dom";
// //#endregion

// const InvoiceHistory = () => {
//   //#region State Variables
//   const [invoiceHistory, setInvoiceHistory] = useState([]);
//   const [filteredInvoices, setFilteredInvoices] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [search, setSearch] = useState("");
//   const [isPopupOpen, setIsPopupOpen] = useState(false);
//   const [deleteId, setDeleteId] = useState(null);

//   const [currentPage, setCurrentPage] = useState(1);
//   const [itemsPerPage, setItemsPerPage] = useState(7); // Set to 7 items per page
//   const [totalItems, setTotalItems] = useState(0);
//   //#endregion

//   //#region Fetch Invoices
//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const res = await InvoiceService.getInvoiceHistory();
//         setInvoiceHistory(res.data);
//         setFilteredInvoices(res.data);
//         console.log(res.data)
//       } catch (err) {
//         toast.error("Failed to load invoice history");
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchData();
//   }, []);
//   //#endregion

//   //#region Filter
//   // useEffect(() => {
//   //   const filtered = invoiceHistory.filter((invoice) =>
//   //     invoice.companyName?.toLowerCase().includes(search.toLowerCase())
//   //   );
//   //   setFilteredInvoices(filtered);
//   //   setCurrentPage(1);
//   // }, [search, invoiceHistory]);

//   // Function to filter tasks based on selected department
//     useEffect(() => {
//       // Apply filters to the invoiceHistory array
//       let filtered = invoiceHistory;
        
//       // Filter by client name
//       if (search) {
//         filtered = filtered.filter((invoice) =>
//           invoice.companyName.toLowerCase().includes(search.toLowerCase())
//         );
//       }
  
//       setFilteredInvoices(filtered); // Update filtered invoiceHistory based on all filters
  
//       setTotalItems(filtered.length); // Update total items for pagination
//       setCurrentPage(1); // Reset to the first page when a new filter is applied
  
//     }, [search, invoiceHistory]);
//     //#endregion


//   //#region Delete
//   const handleDeleteClick = (id) => {
//     setDeleteId(id);
//     setIsPopupOpen(true);
//   };

//   const deleteInvoice = async () => {
//     try {
//       // Replace with actual API call
//       // await InvoiceService.deleteInvoice(deleteId);
//       toast.success("Invoice deleted successfully");
//       setFilteredInvoices((prev) =>
//         prev.filter((invoice) => invoice.invoiceNumber !== deleteId)
//       );
//       setIsPopupOpen(false);
//     } catch {
//       toast.error("Error deleting invoice");
//     }
//   };
//   //#endregion

//   //#region Pagination logic
//   const indexOfLastItem = currentPage * itemsPerPage;
//   const indexOfFirstItem = indexOfLastItem - itemsPerPage;
//   const currentItems = filteredInvoices.slice(indexOfFirstItem, indexOfLastItem);

//   const totalPages = Math.ceil(totalItems / itemsPerPage);

//   const handlePageChange = (pageNumber) => {
//     setCurrentPage(pageNumber);
//   };
//   //#endregion

//   return (
//     <>
//       <div className="flex justify-between items-center my-3">
//         <h2 className="text-2xl font-semibold">Invoice History</h2>
//       </div>

//       {/* Search */}
//       <div className="mb-4">
//         <input
//           type="text"
//           value={search}
//           onChange={(e) => setSearch(e.target.value)}
//           placeholder="Search by company name"
//           className="border p-2 rounded w-full max-w-md"
//         />
//       </div>

//       {/* Table */}
//       <div className="grid overflow-x-auto">
//         <table className="min-w-full bg-white rounded-lg border border-gray-200">
//           <thead className="bg-gray-900 border-b">
//             <tr>
//               {["Invoice #", "Date", "Issued By", "Client", "Tax Type", "Items", "Actions"].map((header) => (
//                 <th key={header} className="text-left py-3 px-4 uppercase font-semibold text-sm text-[#939393]">
//                   {header}
//                 </th>
//               ))}
//             </tr>
//           </thead>
//           <tbody>
//             {/* {loading ? (
//               <tr>
//                 <td colSpan="7" className="text-center py-5">Loading...</td>
//               </tr>
//             ) : currentItems.length === 0 ? ( */}
//             {currentItems.length === 0 ? (
//               <tr>
//                 <td colSpan="7" className="text-center py-5 text-gray-500">
//                   No invoices found.
//                 </td>
//               </tr>
//             ) : (
//               currentItems.map((invoice) => (
//                 <motion.tr
//                   key={invoice.invoiceMasterId}
//                   className="border-b hover:bg-gray-50"
//                   initial={{ opacity: 0, y: 20 }}
//                   animate={{ opacity: 1, y: 0 }}
//                   transition={{ duration: 0.5, delay: invoice * 0.1 }}
//                   // transition={{ delay: invoice * 0.05 }}
//                 >
//                   <td className="py-3 px-4">{invoice.invoiceNumber}</td>
//                   <td className="py-3 px-4">
//                     {invoice.invoiceDate ? new Date(invoice.invoiceDate).toLocaleDateString() : "N/A"}
//                   </td>
//                   <td className="py-3 px-4">{invoice.issuedByCompanyName || "N/A"}</td>
//                   <td className="py-3 px-4">{invoice.clientCompanyName || "N/A"}</td>
//                   <td className="py-3 px-4">{invoice.taxName || "N/A"}</td>
//                   <td className="py-3 px-4 text-left">
//                     {(invoice.allProducts || []).map((item, i) => (
//                       <div key={i}>
//                         • {item.description} ({item.quantity} @ {item.unitPrice})
//                       </div>
//                     ))}
//                   </td>
//                   <td className="py-3 px-4">
//                     <div className="flex gap-2">
//                       <motion.button
//                         whileHover={{ scale: 1.1 }}
//                         whileTap={{ scale: 0.9 }}
//                       >
//                         <Link
//                           className="text-green-500 hover:text-green-700"
//                           to={/invoice/invoice-history/${invoice.invoiceMasterId}}
//                         >
//                           <FaEye size={24} />
//                         </Link>
//                       </motion.button>
//                       {/* <Link to={/invoice/view/${invoice.invoiceNumber}} className="text-blue-600 hover:text-blue-800">
//                         <FaEye />
//                       </Link> */}

//                       {/* <motion.button
//                         whileHover={{ scale: 1.1 }}
//                         whileTap={{ scale: 0.9 }}
//                         onClick={() =>
//                           handleDeleteClick(invoice.invoiceMasterId)
//                         }
//                         className="text-red-500 hover:text-red-700"
//                       >
//                         <FaTrash size={22} />
//                       </motion.button> */}
//                       {/* <button onClick={() => handleDeleteClick(invoice.invoiceNumber)} className="text-red-500 hover:text-red-700">
//                         <FaTrash />
//                       </button> */}
//                     </div>
//                   </td>
//                 </motion.tr>
//               ))
//             )}
//           </tbody>
//         </table>
//       </div>

//       {/* Delete Confirmation Modal */}
//       {isPopupOpen && (
//         <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
//           <div className="bg-white p-6 rounded shadow-lg w-full max-w-md">
//             <div className="flex justify-center mb-4">
//               <div className="bg-red-100 p-4 rounded-full">
//                 <FaTrashAlt className="text-red-600 text-3xl" />
//               </div>
//             </div>
//             <h3 className="text-lg font-semibold text-center text-gray-800 mb-4">
//               Are you sure you want to delete this invoice?
//             </h3>
//             <div className="flex justify-center gap-4">
//               <button
//                 onClick={() => setIsPopupOpen(false)}
//                 className="bg-gray-400 text-white px-6 py-2 rounded hover:bg-gray-500"
//               >
//                 No
//               </button>
//               <button
//                 onClick={deleteInvoice}
//                 className="bg-red-600 text-white px-6 py-2 rounded hover:bg-red-700"
//               >
//                 Yes
//               </button>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* Pagination Section */}
//       <div
//         className={`flex mt-4 items-center justify-between border-t border-gray-200 bg-white px-4 py-3 sm:px-6 shadow-lg ${isPopupOpen ? "hidden" : ""
//           }`}
//       >
//         <div className="flex flex-1 justify-between sm:hidden">
//           <motion.button
//             onClick={() => handlePageChange(currentPage - 1)}
//             disabled={currentPage === 1}
//             className="relative inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
//             whileHover={{ scale: 1.1 }}
//             whileTap={{ scale: 0.9 }}
//           >
//             Previous
//           </motion.button>
//           <motion.button
//             onClick={() => handlePageChange(currentPage + 1)}
//             disabled={currentPage === totalPages}
//             className="relative ml-3 inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
//             whileHover={{ scale: 1.1 }}
//             whileTap={{ scale: 0.9 }}
//           >
//             Next
//           </motion.button>
//         </div>
//         <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
//           <div>
//             <p className="text-sm text-gray-700">
//               Showing
//               <span className="font-semibold mx-1">{indexOfFirstItem + 1}</span>
//               to
//               <span className="font-semibold mx-1">
//                 {Math.min(indexOfLastItem, totalItems)}
//               </span>
//               of
//               <span className="font-semibold mx-1">{totalItems}</span>
//               results
//             </p>
//           </div>
//           <div>
//             <nav
//               className="isolate inline-flex -space-x-px rounded-md shadow-sm"
//               aria-label="Pagination"
//             >
//               <motion.button
//                 onClick={() => handlePageChange(currentPage - 1)}
//                 disabled={currentPage === 1}
//                 className="relative inline-flex items-center rounded-l-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
//                 whileHover={{ scale: 1.1 }}
//                 whileTap={{ scale: 0.9 }}
//               >
//                 <span className="sr-only">Previous</span>
//                 <svg
//                   className="size-5"
//                   viewBox="0 0 20 20"
//                   fill="currentColor"
//                   aria-hidden="true"
//                 >
//                   <path
//                     fillRule="evenodd"
//                     d="M11.78 5.22a.75.75 0 0 1 0 1.06L8.06 10l3.72 3.72a.75.75 0 1 1-1.06 1.06l-4.25-4.25a.75.75 0 0 1 0-1.06l4.25-4.25a.75.75 0 0 1 1.06 0Z"
//                     clipRule="evenodd"
//                   />
//                 </svg>
//               </motion.button>

//               {/* Pagination Buttons */}
//               {[...Array(totalPages)].map((_, index) => (
//                 <motion.button
//                   key={index}
//                   onClick={() => handlePageChange(index + 1)}
//                   className={`relative z-10 inline-flex items-center px-4 py-2 text-sm font-semibold text-white focus:z-20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 ${currentPage === index + 1
//                       ? "bg-indigo-600"
//                       : "bg-gray-200 text-gray-700"
//                     }`}
//                   whileHover={{ scale: 1.1 }}
//                   whileTap={{ scale: 0.9 }}
//                 >
//                   {index + 1}
//                 </motion.button>
//               ))}

//               <motion.button
//                 onClick={() => handlePageChange(currentPage + 1)}
//                 disabled={currentPage === totalPages}
//                 className="relative inline-flex items-center rounded-r-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
//                 whileHover={{ scale: 1.1 }}
//                 whileTap={{ scale: 0.9 }}
//               >
//                 <span className="sr-only">Next</span>
//                 <svg
//                   className="size-5"
//                   viewBox="0 0 20 20"
//                   fill="currentColor"
//                   aria-hidden="true"
//                 >
//                   <path
//                     fillRule="evenodd"
//                     d="M8.22 5.22a.75.75 0 0 1 1.06 0l4.25 4.25a.75.75 0 0 1 0 1.06l-4.25 4.25a.75.75 0 0 1-1.06-1.06L11.94 10 8.22 6.28a.75.75 0 0 1 0-1.06Z"
//                     clipRule="evenodd"
//                   />
//                 </svg>
//               </motion.button>
//             </nav>
//           </div>
//         </div>
//       </div>

//       {/* Pagination */}
//       {/* {filteredInvoices.length > itemsPerPage && (
//         <div className="flex justify-between items-center mt-6">
//           <p className="text-sm text-gray-700">
//             Showing {indexOfFirstItem + 1} to {Math.min(indexOfLastItem, filteredInvoices.length)} of {filteredInvoices.length}
//           </p>
//           <div className="flex gap-2">
//             {[...Array(totalPages)].map((_, index) => (
//               <motion.button
//                 key={index}
//                 onClick={() => handlePageChange(index + 1)}
//                 className={`px-4 py-2 rounded ${
//                   currentPage === index + 1 ? "bg-indigo-600 text-white" : "bg-gray-200 text-gray-800"
//                 }`}
//                 whileHover={{ scale: 1.1 }}
//                 whileTap={{ scale: 0.95 }}
//               >
//                 {index + 1}
//               </motion.button>
//             ))}
//           </div>
//         </div>
//       )} */}
//     </>
//   );
// };

// export default InvoiceHistory;
