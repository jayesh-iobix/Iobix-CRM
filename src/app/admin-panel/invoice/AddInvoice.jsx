//#region Imports
import React, { useEffect, useState } from 'react'
import { FaArrowLeft } from "react-icons/fa";
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { motion } from "framer-motion"; // Import framer-motion
import { InvoiceService } from '../../service/InvoiceService'; // Assuming you have an InvoiceService
import { InvoiceDetailService } from '../../service/InvoiceDetailService';
//#endregion

//#region Component: AddInvoice
const AddInvoice = () => {

  //#region State Variables
  const [formData, setFormData] = useState({
    invoiceNumber: "",
    invoiceDate: "",
    dueDate: "",
    customerName: "",
    customerEmail: "",
    customerAddress: "",
    items: [{ description: "", quantity: 1, unitPrice: 0, total: 0 }],
    totalAmount: 0,
  }); 
  const [selectedCompany, setSelectedCompany] = useState("");
  const [companyList, setCompanyList] = useState([]);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  //#endregion  

  //#region Fetch Data
  useEffect(() => {
    const fetchData = async () => {
      //#region Fetch DepartmentList
      const companyResult = await InvoiceDetailService.getInvoiceDetail();
      console.log(companyResult)
      const activeCompanyss = companyResult.data.filter(company => company.isActive === true);
      setCompanyList(activeCompanyss);
      //#endregion Fetch DepartmentList
    };
    fetchData();
  }, []);
  //#endregion

  //#region Validation Function & Form Submission
  const validateForm = () => {
    const newErrors = {};
    if (!formData.invoiceNumber) newErrors.invoiceNumber = "Invoice Number is required";
    if (!formData.invoiceDate) newErrors.invoiceDate = 'Invoice Date is required';
    if (!formData.customerName) newErrors.customerName = 'Customer Name is required';
    if (!formData.customerEmail) newErrors.customerEmail = 'Customer Email is required';
    if (!formData.customerAddress) newErrors.customerAddress = 'Customer Address is required';
    if (formData.items.length === 0 || formData.items.some(item => !item.description || item.quantity <= 0 || item.unitPrice <= 0)) {
      newErrors.items = "Each item must have a description, quantity, and unit price greater than zero.";
    }
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

    // Include the selected company in formData
    const data = { ...formData, invoiceDetailId: selectedCompany };

    try {
      const response = await InvoiceService.addInvoice(data);
      if (response.status === 1) {
        navigate(-1);
        toast.success("Invoice Added Successfully"); // Toast on success
      }

      // Reset the form
      setFormData({
        invoiceNumber: "",
        invoiceDate: "",
        dueDate: "",
        customerName: "",
        customerEmail: "",
        customerAddress: "",
        items: [{ description: "", quantity: 1, unitPrice: 0, total: 0 }],
        totalAmount: 0,
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

  const handleItemChange = (index, e) => {
    const { name, value } = e.target;
    const updatedItems = [...formData.items];
    updatedItems[index] = { ...updatedItems[index], [name]: value };

    // Update total for the item
    updatedItems[index].total = updatedItems[index].quantity * updatedItems[index].unitPrice;

    setFormData((prev) => ({
      ...prev,
      items: updatedItems,
      totalAmount: updatedItems.reduce((acc, item) => acc + item.total, 0), // Update total amount
    }));
  };

  const addItem = () => {
    setFormData((prev) => ({
      ...prev,
      items: [...prev.items, { description: "", quantity: 1, unitPrice: 0, total: 0 }],
    }));
  };

  const removeItem = (index) => {
    const updatedItems = [...formData.items];
    updatedItems.splice(index, 1);

    setFormData((prev) => ({
      ...prev,
      items: updatedItems,
      totalAmount: updatedItems.reduce((acc, item) => acc + item.total, 0),
    }));
  };

  //#endregion

  //#region Render
  return (
    <>
      {/* Header Section */}
      <div className="flex justify-between items-center my-3">
        <h1 className="font-semibold text-2xl">Add Invoice</h1>
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
                Invoice Date
              </label>
              <input
                type="date"
                value={formData.invoiceDate}
                onChange={handleChange}
                name="invoiceDate"
                className="w-full mb-2 bg-transparent rounded-md border border-red py-3 px-4 text-dark-6 border-active transition"
              />
              {errors.invoiceDate && (
                <p className="text-red-500 text-xs">{errors.invoiceDate}</p>
              )}
            </div>

            {/* Invoice Number */}
            <div className="w-full mb-2 px-3 md:w-1/3 lg:w-1/3">
              <label className="mb-[10px] block text-base font-medium text-dark dark:text-white">
                Invoice Number
              </label>
              <input
                type="text"
                placeholder="Invoice Number"
                value={formData.invoiceNumber}
                onChange={handleChange}
                name="invoiceNumber"
                className="w-full mb-2 bg-transparent rounded-md border border-red py-3 px-4 text-dark-6 border-active transition"
              />
              {errors.invoiceNumber && (
                <p className="text-red-500 text-xs">{errors.invoiceNumber}</p>
              )}
            </div>

            {/* Company Selection Dropdown */}
            <div className="w-full mb-2 px-3 md:w-1/3 lg:w-1/3">
              <label className="mb-[10px] block text-base font-medium text-dark dark:text-white">
                Select Company
              </label>
              <select
                name="companyName"
                value={selectedCompany}
                onChange={(e) => setSelectedCompany(e.target.value)}
                className="w-full mb-2 bg-transparent rounded-md border py-3 px-4 text-dark-6 border-active transition"
              >
                <option value="">Select a Company</option>
                {companyList.map((company) => (
                  <option key={company.invoiceDetailId} value={company.invoiceDetailId}>
                    {company.companyName}
                  </option>
                ))}
              </select>
              {errors.companyName && (
                <p className="text-red-500 text-xs">{errors.companyName}</p>
              )}
            </div>


            {/* Due Date */}
            <div className="w-full mb-2 px-3 md:w-1/3 lg:w-1/3">
              <label className="mb-[10px] block text-base font-medium text-dark dark:text-white">
                Due Date
              </label>
              <input
                type="date"
                value={formData.dueDate}
                onChange={handleChange}
                name="dueDate"
                className="w-full mb-2 bg-transparent rounded-md border border-red py-3 px-4 text-dark-6 border-active transition"
              />
            </div>

            {/* Customer Name */}
            <div className="w-full mb-2 px-3 md:w-1/3 lg:w-1/3">
              <label className="mb-[10px] block text-base font-medium text-dark dark:text-white">
                Customer Name
              </label>
              <input
                type="text"
                placeholder="Customer Name"
                value={formData.customerName}
                onChange={handleChange}
                name="customerName"
                className="w-full mb-2 bg-transparent rounded-md border border-red py-3 px-4 text-dark-6 border-active transition"
              />
              {errors.customerName && (
                <p className="text-red-500 text-xs">{errors.customerName}</p>
              )}
            </div>

            {/* Customer Email */}
            <div className="w-full mb-2 px-3 md:w-1/3 lg:w-1/3">
              <label className="mb-[10px] block text-base font-medium text-dark dark:text-white">
                Customer Email
              </label>
              <input
                type="email"
                placeholder="Customer Email"
                value={formData.customerEmail}
                onChange={handleChange}
                name="customerEmail"
                className="w-full mb-2 bg-transparent rounded-md border border-red py-3 px-4 text-dark-6 border-active transition"
              />
              {errors.customerEmail && (
                <p className="text-red-500 text-xs">{errors.customerEmail}</p>
              )}
            </div>

            {/* Customer Address */}
            <div className="w-full mb-2 px-3">
              <label className="mb-[10px] block text-base font-medium text-dark dark:text-white">
                Customer Address
              </label>
              <textarea
                name="customerAddress"
                value={formData.customerAddress}
                onChange={handleChange}
                rows="3"
                className="w-full mb-2 bg-transparent rounded-md border border-red py-[8px] pl-5 pr-12 text-dark-6 border-active transition"
              ></textarea>
              {errors.customerAddress && (
                <p className="text-red-500 text-xs">{errors.customerAddress}</p>
              )}
            </div>

            {/* Item List */}
            <div className="w-full mb-2 px-3">
              <label className="mb-[10px] block text-base font-medium text-dark dark:text-white">
                Items
              </label>
              {formData.items.map((item, index) => (
                <div key={index} className="flex gap-3 mb-2">
                  <input
                    type="text"
                    name="description"
                    value={item.description}
                    onChange={(e) => handleItemChange(index, e)}
                    placeholder="Item Description"
                    className="w-1/3 py-3 px-4 bg-transparent border rounded-md"
                  />
                  <input
                    type="number"
                    name="quantity"
                    value={item.quantity}
                    onChange={(e) => handleItemChange(index, e)}
                    min="1"
                    className="w-1/3 py-3 px-4 bg-transparent border rounded-md"
                  />
                  <input
                    type="number"
                    name="unitPrice"
                    value={item.unitPrice}
                    onChange={(e) => handleItemChange(index, e)}
                    min="0"
                    className="w-1/3 py-3 px-4 bg-transparent border rounded-md"
                  />
                  <button
                    type="button"
                    onClick={() => removeItem(index)}
                    className="text-red-500"
                  >
                    Remove
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={addItem}
                className="text-blue-500"
              >
                Add Item
              </button>
              {errors.items && (
                <p className="text-red-500 text-xs">{errors.items}</p>
              )}
            </div>

            {/* Total Amount */}
            <div className="w-full mb-2 px-3 md:w-1/3 lg:w-1/3">
              <label className="mb-[10px] block text-base font-medium text-dark dark:text-white">
                Total Amount
              </label>
              <input
                type="text"
                value={formData.totalAmount}
                readOnly
                className="w-full mb-2 bg-transparent rounded-md border py-3 px-4 text-dark-6 border-active transition"
              />
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
                {isSubmitting ? "Submitting..." : "Add Invoice"}
              </motion.button>
            </div>

          </div>
        </form>
      </section>
    </>
  );
};

export default AddInvoice;
//#endregion
