// #region Imports
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import { InvoiceService } from "../../service/InvoiceService"; // Create this service file to fetch invoices
import { FaDownload, FaEye, FaPlus } from "react-icons/fa";
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
        <div className="flex">
          {/* <motion.button 
            whileTap={{ scale: 0.9 }}
            whileHover={{ scale: 1.1 }} 
            onClick={handleDownloadReport }
            className ={`me-3 bg-purple-600 hover:bg-purple-700 flex gap-2 text-center text-white font-medium py-2 px-4 rounded hover:no-underline 
            ${isSubmitting ? "opacity-50 cursor-not-allowed" : "" }`}
            disabled={isSubmitting}
          >
            {isSubmitting ? "Downloading..." : "Download Report"}
          </motion.button> */}
          <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
            <Link
              to="/invoice/add-invoice"
              className="bg-blue-600 hover:bg-blue-700 flex gap-2 text-center text-white font-medium py-2 px-4 rounded hover:no-underline"
            >
              Add
              <FaPlus className="mt-[3px]" size={14} />
            </Link>
          </motion.button>
        </div>
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
            ) : !selectedClientId ? (
              <tr>
                <td colSpan="7" className="text-center py-5 text-gray-500">
                  Please select the client to see the history.
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
                    {formatDate(invoice.invoiceDate)
                      ? formatDate(invoice.invoiceDate)
                      : "N/A"}
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
                        onClick={() =>
                          handleDownloadReport(invoice.invoiceMasterId)
                        }
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
