//#region Imports
import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";
import { motion } from "framer-motion";
import InvoicePayment from "./InvoicePayment";
import { InvoiceService } from "../../service/InvoiceService";
import { toast } from "react-toastify";
//#endregion

const ViewInvoiceHistory = () => {
  //#region Hooks
  const { id } = useParams(); // invoice number or ID from route
  const navigate = useNavigate();
  //#endregion

  //#region State Variables
  const [formData, setFormData] = useState({
    gtmClientServiceId: "",
    invoiceDetailId: "",
    invoiceDate: "",
    invoiceNumber: "",
    productAmount: "",
    subTotal: "",
    total: "",
    invoice: "",
    clientCompanyName: "",
    issuedByCompanyName: "",
    gtmInvoiceConnectionId: "",
    taxDetailId: "",
    taxName: "",
    selectedTaxes: [],  // Changed to an array
    allProducts: [{ description: "", quantity: "", unit: "", unitPrice: "" }]  // Initialize with one empty item
  })
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState(1);
  //#endregion

  //#region Fetch Invoice Data
    useEffect(() => {
      const fetchData = async () => {
        try {
          // debugger;
          // Fetch Inquiry
          const invoice = await InvoiceService.getByIdInvoice(id);
          console.log(invoice.data);
          setFormData(invoice.data);
        } catch (error) {
          console.error("Error fetching data:", error);
        }
      };
  
      fetchData();
    }, [id]);
  //#endregion

  //#region Function to handle tab change
  // Function to handle tab change
  const handleTabClick = (tabIndex) => {
    setActiveTab(tabIndex);
  };
  //#endregion

  const handleEmailSend = async () => {
    setIsSubmitting(true);
    try {
      // Wait for the report download to complete
      const response = await InvoiceService.sendInvocieEmail(id, formData.gtmClientServiceId);
      if(response.status === 1) {
        // Optionally, add a success message or additional logic after the download
        toast.success("Email Send Successfully!");
      }
    } catch (error) {
      console.error("Error downloading report:", error);
      toast.error("Failed to download report.");
    } finally {
      setIsSubmitting(false);
    }
  }

  //#region Render
  return (
   <>
    {/* Header Section */}
      <div className="flex justify-between items-center my-3">
        <h1 className="font-semibold text-2xl">View Invoice History</h1>
        <div className="flex gap-2">
          <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
            <Link
              onClick={handleEmailSend}
              className={`me-3 bg-purple-600 hover:bg-purple-700 flex gap-2 text-center text-white font-medium py-2 px-4 rounded hover:no-underline 
              ${isSubmitting ? "opacity-50 cursor-not-allowed" : ""}`}
              disabled={isSubmitting}
              // className="bg-purple-500 hover:bg-purple-400 text-white font-bold py-2 px-4 rounded flex items-center gap-2 hover:no-underline"
            >
              {/* <FaArrowLeft size={16} /> */}
              {isSubmitting ? "Sending..." : "Send Email"}
            </Link>
          </motion.button>

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
      </div>
      <section className="bg-white rounded-lg shadow-lg m-1 p-4 sm:p-8">
        <form className="container">
          <div className="md:px-2 lg:px-2 px-7">
            {/* Tab Navigation */}
            <div className="border-b border-gray-200 dark:border-neutral-700">
              <nav
                className="flex flex-wrap gap-1"
                aria-label="Tabs"
                role="tablist"
                aria-orientation="horizontal"
              >
                {[
                  "Invoice History Details",
                  "Invoice Payment",
                ].map((tab, index) => (
                  <button
                    key={index}
                    type="button"
                    className={`${
                      activeTab === index + 1
                        ? "bg-blue-600 text-white font-bold border-b-2 border-blue-600 dark:bg-blue-700 dark:border-blue-800 dark:text-white"
                        : "bg-blue-100 text-blue-600 border-transparent hover:bg-blue-200 dark:bg-neutral-700 dark:text-blue-300 dark:hover:bg-neutral-600"
                    } -mb-px py-3 px-4 inline-flex items-center gap-x-2 text-sm font-medium text-center border rounded-t-lg`}

                    onClick={() => handleTabClick(index + 1)}
                    role="tab"
                    aria-selected={activeTab === index + 1}
                  >
                    {tab}
                  </button>
                ))}
              </nav>
            </div>

            {/* Tab Content */}
            <div className="mt-3">
              {activeTab === 1 && (
                // <h1>Invoice History Details</h1>
                // <div className="bg-white p-6 rounded-lg shadow border border-gray-200">
                <div className="bg-white p-6 rounded-lg ">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                    <div>
                      <p className="text-gray-500">Issued By:</p>
                      <p className="font-medium text-gray-800">{formData.issuedByCompanyName || "N/A"}</p>
                    </div>
                    <div>
                      <p className="text-gray-500">Client:</p>
                      <p className="font-medium text-gray-800">{formData.clientCompanyName || "N/A"}</p>
                    </div>
                    <div>
                      <p className="text-gray-500">Invoice Date:</p>
                      <p className="font-medium text-gray-800">
                        {formData.invoiceDate ? new Date(formData.invoiceDate).toLocaleDateString() : "N/A"}
                      </p>

                    </div>
                    <div>
                      <p className="text-gray-500">Tax Type:</p>
                      <p className="font-medium text-gray-800">{formData.taxName || "N/A"}</p>
                    </div>
                  </div>

                  {/* Products List */}
                  <div>
                    <p className="text-lg font-semibold mb-3 text-gray-800">Items</p>
                    <div className="overflow-x-auto">
                      <table className="min-w-full border border-gray-200 text-sm">
                        <thead className="bg-gray-100">
                          <tr>
                            <th className="p-2 border text-left">Description</th>
                            <th className="p-2 border text-right">Quantity</th>
                            <th className="p-2 border text-right">Unit Price</th>
                            <th className="p-2 border text-right">Total</th>
                          </tr>
                        </thead>
                        <tbody>
                          {(formData.allProducts || []).map((item, index) => (
                            <tr key={index} className="hover:bg-gray-50">
                              <td className="p-2 border">{item.description}</td>
                              <td className="p-2 border text-right">{item.quantity}</td>
                              <td className="p-2 border text-right">{item.unitPrice}</td>
                              <td className="p-2 border text-right">
                                {(item.quantity * item.unitPrice).toFixed(2)}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* Summary Section (Optional) */}
                  <div className="mt-6 text-right">
                    <p className="text-lg font-semibold">
                      Sub Total: ₹
                      {formData.allProducts?.reduce((sum, item) => sum + item.quantity * item.unitPrice, 0).toFixed(2)}
                    </p>
                  </div>
                </div>

                // <div
                //   id="card-type-tab-preview"
                //   role="tabpanel"
                //   className="mt-7"
                //   aria-labelledby="card-type-tab-item-1"
                // >
                //   <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                //     {[
                //       {
                //         label: "Invoice Date",
                //         name: "invoiceDate",
                //         value: formData.invoiceDate,
                //       },
                //       {
                //         label: "Invoice Number",
                //         name: "invoiceNumber",
                //         value: formData.invoiceNumber,
                //       },
                //       {
                //         label: "Issued By Company Name",
                //         name: "issuedByCompanyName",
                //         value: formData.issuedByCompanyName,
                //       },
                //       {
                //         label: "Client CompanyName",
                //         name: "clientCompanyName",
                //         value: formData.clientCompanyName,
                //       },
                //       {
                //         label: "Tax Name",
                //         name: "taxName",
                //         value: formData.taxName,
                //       },
                //       {
                //         label: "Sub Total",
                //         name: "subTotal",
                //         value: formData.subTotal,
                //       },
                //       {
                //         label: "Total",
                //         name: "total",
                //         value: formData.total,
                //       },
                //     ].map((field, idx) => (
                //       <div key={idx} className="w-full px-2">
                //         <label className="font-semibold text-gray-700 me-2">
                //           {field.label}:
                //         </label>
                //         <span className="text-gray-600">{field.value}</span>
                //       </div>
                //     ))}
                //   </div>
                // </div>
              )}

              {activeTab === 2 && <InvoicePayment />}
              {/* {activeTab === 3 && <ViewInvoice />} */}
            </div>
          </div>
        </form>
      </section>

    </>
  );
  //#endregion
};

export default ViewInvoiceHistory;
