//#region Imports
import React, { useEffect, useState } from 'react'
import { FaArrowLeft } from "react-icons/fa";
import { Link, useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { motion } from "framer-motion"; // Import framer-motion
import { InvoiceService } from '../../service/InvoiceService'; // Assuming you have an InvoiceService
import { InvoicePaymentService } from '../../service/InvoicePaymentService';
//#endregion

//#region Component: AddInvoicePayment
const AddInvoicePayment = () => {

const { id } = useParams(); // invoice number or ID from route
  //#region State Variables
  const [formData, setFormData] = useState({
    invoiceMasterId : id,
    paidDate : "",
    paidAmount: "",
    remainingAmount: "",
    amountStatus: "",
    // refrenceInvoiceId: "",
  }); 

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  //#endregion  

  //#region Validation Function & Form Submission
  const validateForm = () => {
    const newErrors = {};
    // if (!formData.paidDate ) newErrors.paidDate  = 'Invoice Paid Date is required';
    if (!formData.paidAmount) newErrors.paidAmount = 'Paid Amount is required';
    if (!formData.remainingAmount) newErrors.remainingAmount = 'Remaining Amount is required';
    if (!formData.amountStatus) newErrors.amountStatus = 'Amount Statu is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Validate form before submitting
    if (!validateForm()) {
      setIsSubmitting(false);
      return; // Prevent form submission if validation fails
    }

    try {
        debugger;
        console.log(formData)
      const response = await InvoicePaymentService.addInvoicePayment(formData);
      if (response.status === 1) {
        navigate(-1);
        toast.success("Invoice Added Successfully"); // Toast on success
      }

      // Reset the form
      setFormData({
        invoiceMasterId: id,
        paidDate : "",
        paidAmount: "",
        remainingAmount: "",
        amountStatus: "",
        // refrenceInvoiceId: ""
      });
    } catch (error) {
      console.error('Error adding invoice:', error);
      toast.error('Failed to add invoice.');
    }
    setIsSubmitting(false);
  };
  //#endregion

  //#region Handle Change Function
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };
  //#endregion

  //#region Render
  return (
    <>
      {/* Header Section */}
      <div className="flex justify-between items-center my-3">
        <h1 className="font-semibold text-2xl">Add Invoice Payment</h1>
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

      {/* Form Section */}
      <section className="bg-white rounded-lg shadow-sm m-1 py-8 pt-">
        <form onSubmit={handleSubmit} className="container">
          <div className="-mx-4 px-10 mt- flex flex-wrap">

            {/* Invoice Date */}
            <div className="w-full mb-2 px-3 md:w-1/3 lg:w-1/3">
              <label className="mb-[10px] block text-base font-medium text-dark dark:text-white">
                Invoice Paid Date
              </label>
              <input
                type="date"
                value={formData.paidDate}
                onChange={handleChange}
                name="paidDate"
                className="w-full mb-2 bg-transparent rounded-md border border-red py-3 px-4 text-dark-6 border-active transition"
              />
              {errors.paidDate  && (
                <p className="text-red-500 text-xs">{errors.paidDate }</p>
              )}
            </div>

            {/* Status Selection Dropdown */}
            <div className="w-full mb-2 px-3 md:w-1/3 lg:w-1/3">
              <label className="mb-[10px] block text-base font-medium text-dark dark:text-white">
                Select Status
              </label>
              <select
                name="amountStatus"
                value={formData.amountStatus}
                onChange={handleChange}
                className="w-full mb-2 bg-transparent rounded-md border py-3 px-4 text-dark-6 border-active transition"
              >
                <option value="">--Select Status--</option>
                <option value="0">Pending</option>
                <option value="1">Paid</option>
                <option value="2">Partial</option>
              </select>
              {errors.amountStatus && (
                <p className="text-red-500 text-xs">{errors.amountStatus}</p>
              )}
            </div>

            {/* Total Paid Amount */}
            <div className="w-full mb-2 px-3 md:w-1/3 lg:w-1/3">
              <label className="mb-[10px] block text-base font-medium text-dark dark:text-white">
                Total Paid Amount
              </label>
              <input
                type="number"
                placeholder="Paid Amount"
                value={formData.paidAmount }
                onChange={handleChange}
                name="paidAmount"
                className="w-full mb-2 bg-transparent rounded-md border border-red py-3 px-4 text-dark-6 border-active transition"
              />
              {errors.paidAmount && (
                <p className="text-red-500 text-xs">{errors.paidAmount}</p>
              )}
            </div>

            {/* Total Rmaining Amount */}
            <div className="w-full mb-2 px-3 md:w-1/3 lg:w-1/3">
              <label className="mb-[10px] block text-base font-medium text-dark dark:text-white">
                Total Remaining Amount
              </label>
              <input
                type="number"
                placeholder="Remaining Amount"
                value={formData.remainingAmount }
                onChange={handleChange}
                name="remainingAmount"
                className="w-full mb-2 bg-transparent rounded-md border border-red py-3 px-4 text-dark-6 border-active transition"
              />
              {errors.remainingAmount && (
                <p className="text-red-500 text-xs">{errors.remainingAmount}</p>
              )}
            </div>

            <div className="w-full flex px-3">
              <motion.button
                type="submit"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className={`px-5 py-3 bg-blue-600 text-white font-medium rounded-md hover:bg-[#2564ebdb] active:border-[#a8adf4] outline-none active:border-2 focus:ring-2 ring-blue-300
                  ${isSubmitting ? "opacity-50 cursor-not-allowed" : ""}`}
                disabled={isSubmitting}
              >
                {isSubmitting ? "Submitting..." : "Add Invoice Paymentt"}
              </motion.button>
            </div>

          </div>
        </form>
      </section>
    </>
  );
};

export default AddInvoicePayment;
//#endregion
