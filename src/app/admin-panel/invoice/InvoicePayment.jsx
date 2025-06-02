// #region Imports
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import { Link, useParams } from "react-router-dom";
import { FaEye, FaPlus } from "react-icons/fa";
import { InvoicePaymentService } from "../../service/InvoicePaymentService";
//#endregion

//#region Component: InvoicePayment
const InvoicePayment = () => {
  //#region State Variables
  const [invoicePayment, setInvoicePayment] = useState([]);
  const [loading, setLoading] = useState(false);

  const { id } = useParams(); // invoice number or ID from route
  //#endregion
  
  // const months = [
  //   "January", "February", "March", "April", "May", "June",
  //   "July", "August", "September", "October", "November", "December"
  // ];

  // useEffect(() => {
  //   const fetchClients = async () => {
  //     try {
  //       const response = await GtmClientService.getGtmClient(); // replace with your actual method
  //       setClients(response.data);
  //     } catch (err) {
  //       toast.error("Failed to load clients.");
  //       console.error(err);
  //     }
  //   };

  //   fetchClients();
  // }, []);

  // const getYears = () => {
  //   const current = new Date().getFullYear();
  //   return Array.from({ length: 11 }, (_, i) => current - 5 + i);
  // };

  //#region Fetch Invoices
  // Function to fetch invoices based on the invoice ID
  const fetchInvoices = async () => {
    if (!id) return;

    setLoading(true);
    try {
      // debugger;
      const response = await InvoicePaymentService.getInvoicePaymentByInvoiceId(id);
      setInvoicePayment(response.data || []);
    } catch (error) {
      toast.error("Failed to fetch invoices.");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) fetchInvoices();
  }, [id]);
  //#endregion

  //#region Status Color Logic
  // Function to set the color based on the leave status
  const getStatusColor = (amountStatusName) => {
    switch (amountStatusName) {
      case "Partial":
        return "text-yellow-500 bg-yellow-100"; // Yellow for Pending
      case "Paid":
        return "text-green-500 bg-green-100"; // Blue for FinalApproval
      case "Pending":
        return "text-red-500 bg-red-100"; // Red for Rejected
      default:
        return "text-gray-500 bg-gray-100"; // Default color
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
        <h1 className="text-xl font-semibold">Invoice Payment History</h1>
        <div className="flex">
          <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
            <Link
              to={`/invoice/add-invoice-payment/${id}`}
              className="bg-blue-600 hover:bg-blue-700 flex gap-2 text-center text-white font-medium py-2 px-4 rounded hover:no-underline"
            >
              Add
              <FaPlus className="mt-[3px]" size={14} />
            </Link>
          </motion.button>
        </div>
      </div>

      {/* Filters */}
      {/* <div className="-mx-4 px-2 flex flex-wrap gap-4 mb-4">
        <div className="w-full md:w-1/4 px-2">
          <label htmlFor="client" className="block mb-1">Client:</label>
          <select
            id="client"
            className="w-full border p-2 rounded border-gray-300"
            value={selectedClientId}
            onChange={(e) => setSelectedClientId(e.target.value)}
          >
            <option value="">Select Client</option>
            {clients.map((client) => (
              <option key={client.gtmClientServiceId} value={client.gtmClientServiceId}>
                {client.companyName}
              </option>
            ))}
          </select>
        </div>

        <div className="w-full md:w-1/4 px-2">
          <label htmlFor="year" className="block mb-1">Year:</label>
          <select
            id="year"
            className="w-full border p-2 rounded border-gray-300"
            value={year}
            onChange={(e) => setYear(parseInt(e.target.value))}
          >
            {getYears().map((y) => (
              <option key={y} value={y}>{y}</option>
            ))}
          </select>
        </div>

        <div className="w-full md:w-1/4 px-2">
          <label htmlFor="month" className="block mb-1">Month:</label>
          <select
            id="month"
            className="w-full border p-2 rounded border-gray-300"
            value={month}
            onChange={(e) => setMonth(parseInt(e.target.value))}
          >
            {months.map((m, index) => (
              <option key={index} value={index}>{m}</option>
            ))}
          </select>
        </div>
      </div> */}

      {/* Table */}
      <div className="grid overflow-x-auto">
        <table className="min-w-full bg-white rounded-lg border border-gray-200">
          <thead className="bg-gray-900 border-b">
            <tr>
              {["Paid Date", "Paid Amount", "Remaining Amount", "Status", 
              //"Actions"
              ].map((header) => (
                <th key={header} className="text-left py-3 px-4 uppercase font-semibold text-sm text-[#939393]">
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="7" className="text-center py-5">Loading...</td>
              </tr>
            ) : invoicePayment.length === 0 ? (
              <tr>
                <td colSpan="7" className="text-center py-5 text-gray-500">
                  No payment history found.
                </td>
              </tr>
            ) : (
              invoicePayment.map((invoice, index) => (
                <motion.tr
                  key={invoice.gtmClientPaymentId}
                  className="border-b hover:bg-gray-50"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.05 }}
                >
                  {/* <td className="py-3 px-4">{invoice.paidDate}</td> */}
                  <td className="py-3 px-4">
                    {invoice.paidDate ? formatDate(invoice.paidDate) : "N/A"}
                  </td>
                  <td className="py-3 px-4">₹{invoice.paidAmount || "N/A"}</td>
                  <td className="py-3 px-4">₹{invoice.remainingAmount || "N/A"}</td>
                  <td className="py-3 px-4">
                    <span
                      className={`px-2 py-1 rounded-lg font-medium ${getStatusColor(
                        invoice.amountStatusName
                      )}`}
                    >
                      {invoice.amountStatusName || "N/A"}
                    </span>
                    </td>
                  {/* <td className="py-3 px-4">
                    <div className="flex gap-2">
                      <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                        <Link
                          className="text-green-500 hover:text-green-700"
                          to={`/invoice/invoice-history/${invoice.invoiceMasterId}`}
                        >
                          <FaEye size={24} />
                        </Link>
                      </motion.button>
                    </div>
                  </td> */}
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

export default InvoicePayment;
// #endregion
