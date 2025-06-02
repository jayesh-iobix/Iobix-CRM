//#region Imports
import React, { useEffect, useState } from 'react'
import { FaArrowLeft, FaPlus, FaTimes } from "react-icons/fa";
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { motion } from "framer-motion"; // Import framer-motion
import { InvoiceService } from '../../service/InvoiceService'; // Assuming you have an InvoiceService
import { InvoiceDetailService } from '../../service/InvoiceDetailService';
import { GtmClientService } from '../../service/GtmClientService';
import { ReportService } from '../../service/ReportService';
//#endregion

//#region Component: AddInvoice
const AddInvoice = () => {

  //#region State Variables
  const [formData, setFormData] = useState({
    // invoiceDetailId: "",
    invoiceDate: "",
    manualProducts: [{ description: "", quantity: 1, unit: "", unitPrice: "" }]  // Initialize with one empty item
  }); 
  // const [selectedCompany, setSelectedCompany] = useState("");
  const [selectedGtmCompany, setSelectedGtmCompany] = useState("");
  const [companyList, setCompanyList] = useState([]);
  const [clientList, setClientList] = useState([]);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  //#endregion  

  //#region Fetch Data
  useEffect(() => {
    const fetchData = async () => {
      //#region Fetch CompanyList
      const companyResult = await InvoiceDetailService.getInvoiceDetail();
      // console.log(companyResult)
      const activeCompanyss = companyResult.data.filter(company => company.isActive === true);
      setCompanyList(activeCompanyss);
      //#endregion Fetch CompanyList

      //#region Fetch GtmClientList
      const clientResult = await GtmClientService.getGtmClient();
      const activeClients = clientResult.data.filter(company => company.isActive === true);
      setClientList(activeClients);
      // console.log(activeClients)
      //#endregion Fetch GtmClientList
    };
    fetchData();
  }, []);
  //#endregion

  //#region Validation Function & Form Submission
  const validateForm = () => {
    const newErrors = {};
    // if (!formData.invoiceDate) newErrors.invoiceDate = 'Invoice Date is required';
    if (formData.manualProducts.length === 0 || formData.manualProducts.some(item => !item.description || item.quantity <= 0 || item.unitPrice <= 0)) {
      newErrors.items = "Each item must have a description, quantity, and unit price greater than zero.";
    }
    if (!selectedGtmCompany) newErrors.selectedGtmCompany = "Select GTM Client Company";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Validate form before submitting
    // if (!validateForm()) {
      // setIsSubmitting(false);
      // return; // Prevent form submission if validation fails
    // }

    // Include the selected company in formData
    // const data = { ...formData, gtmClientServiceId: selectedGtmCompany };

    try {
      // debugger;
      const response = await ReportService.downloadManualInvoiceReport(selectedGtmCompany, formData);

      if (response.status === 200) {
        navigate(-1);
        toast.success("Invoice Added Successfully"); // Toast on success
      }

      // Reset the form
      setFormData({
        invoiceDate: "",
        // invoiceDetailId: "",
        manualProducts: [{ description: "", quantity: 1, unit: "", unitPrice: 0 }], // Reset items
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
    const updatedItems = [...formData.manualProducts];
    updatedItems[index] = { ...updatedItems[index], 
      [name]: name === "quantity" || name === "unitPrice" ? Number(value) : value,
    };

    setFormData((prev) => ({
      ...prev,
      manualProducts: updatedItems,
    }));
  };

  const addItem = () => {
    setFormData((prev) => ({
      ...prev,
      manualProducts: [...prev.manualProducts, { description: "", quantity: 1, unit: "", unitPrice: 0 }],
    }));
  };

  const removeItem = (index) => {
    const updatedItems = [...formData.manualProducts];
    updatedItems.splice(index, 1);

    setFormData((prev) => ({
      ...prev,
      manualProducts: updatedItems,
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
            <div className="w-full mb-2 px-3 md:w-1/2 lg:w-1/2">
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

            {/* GtmClient Company Selection Dropdown */}
            <div className="w-full mb-2 px-3 md:w-1/2 lg:w-1/2">
              <label className="mb-[10px] block text-base font-medium text-dark dark:text-white">
                Gtm Client Company
              </label>
              <select
                name="companyName"
                value={selectedGtmCompany}
                onChange={(e) => setSelectedGtmCompany(e.target.value)}
                className="w-full mb-2 bg-transparent rounded-md border py-3 px-4 text-dark-6 border-active transition"
              >
                <option value="">--Select Client Company--</option>
                {clientList.map((client) => (
                  <option
                    key={client.gtmClientServiceId}
                    value={client.gtmClientServiceId}
                  >
                    {client.companyName}
                  </option>
                ))}
              </select>
              {errors.companyName && (
                <p className="text-red-500 text-xs">{errors.companyName}</p>
              )}
            </div>

            {/* Produts List */}
            <div className="w-full mb-2 px-3">
              <div className="flex mb-[10px]">
                <label className="block text-base font-medium text-dark dark:text-white">
                  Add Produts Details
                </label>
                <button
                  type="button"
                  onClick={addItem}
                  className="text-blue-500 text-xl ml-2"
                  title="Add Item"
                >
                  <FaPlus />
                </button>
              </div>
              {formData.manualProducts.map((item, index) => (
                <div key={index} className="flex gap-3 mb-2">
                  <input
                    type="text"
                    name="description"
                    value={item.description}
                    onChange={(e) => handleItemChange(index, e)}
                    placeholder="Item Description"
                    className="w-1/3 py-3 px-4 bg-transparent border rounded-md border-active"
                  />

                  <input
                    type="number"
                    name="quantity"
                    value={item.quantity}
                    placeholder="Quantity"
                    onChange={(e) => handleItemChange(index, e)}
                    min="1"
                    className="w-1/3 py-3 px-4 bg-transparent border rounded-md border-active"
                  />

                  <input
                    type="text"
                    name="unit"
                    value={item.unit}
                    onChange={(e) => handleItemChange(index, e)}
                    placeholder="Unit"
                    className="w-1/3 py-3 px-4 bg-transparent border rounded-md border-active"
                  />

                  <input
                    type="number"
                    name="unitPrice"
                    value={item.unitPrice}
                    onChange={(e) => handleItemChange(index, e)}
                    placeholder="Unit Price"
                    className="w-1/3 py-3 px-4 bg-transparent border rounded-md border-active"
                  />

                  <FaTimes
                    size={30}
                    type="button"
                    onClick={() => removeItem(index)}
                    className="text-red-500 m-2 cursor-pointer"
                  />
                </div>
              ))}

              {errors.items && (
                <p className="text-red-500 text-xs">{errors.items}</p>
              )}
            </div>

            {/* Submit Button */}
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
  //#endregion
};

export default AddInvoice;
//#endregion








// //#region Imports
// import React, { useEffect, useState } from 'react'
// import { FaArrowLeft, FaPlus, FaTimes } from "react-icons/fa";
// import { Link, useNavigate } from 'react-router-dom';
// import { toast } from 'react-toastify';
// import { motion } from "framer-motion"; // Import framer-motion
// import { InvoiceService } from '../../service/InvoiceService'; // Assuming you have an InvoiceService
// import { InvoiceDetailService } from '../../service/InvoiceDetailService';
// import { GtmClientService } from '../../service/GtmClientService';
// //#endregion

// //#region Component: AddInvoice
// const AddInvoice = () => {

//   //#region State Variables
//   const [formData, setFormData] = useState({
//     invoiceDetailId: "",
//     invoiceNumber: "",
//     invoiceDate: "",
//     // dueDate: "",
//     customerName: "",
//     customerEmail: "",
//     customerAddress: "",
//     // items: [{ description: "", quantity: 1, unitPrice: 0, total: 0 }],
//     allProducts: [{ description: "", quantity: "", unit: "", unitPrice: "" }]  // Initialize with one empty item
//   }); 
//   const [selectedCompany, setSelectedCompany] = useState("");
//   const [selectedGtmCompany, setSelectedGtmCompany] = useState("");
//   const [companyList, setCompanyList] = useState([]);
//   const [clientList, setClientList] = useState([]);
//   const [errors, setErrors] = useState({});
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const navigate = useNavigate();
//   //#endregion  

//   //#region Fetch Data
//   useEffect(() => {
//     const fetchData = async () => {
//       //#region Fetch CompanyList
//       const companyResult = await InvoiceDetailService.getInvoiceDetail();
//       // console.log(companyResult)
//       const activeCompanyss = companyResult.data.filter(company => company.isActive === true);
//       setCompanyList(activeCompanyss);
//       //#endregion Fetch CompanyList

//       //#region Fetch GtmClientList
//       const clientResult = await GtmClientService.getGtmClient();
//       const activeClients = clientResult.data.filter(company => company.isActive === true);
//       setClientList(activeClients);
//       console.log(activeClients)
//       //#endregion Fetch GtmClientList
//     };
//     fetchData();
//   }, []);
//   //#endregion

//   //#region Validation Function & Form Submission
//   const validateForm = () => {
//     const newErrors = {};
//     if (!formData.invoiceNumber) newErrors.invoiceNumber = "Invoice Number is required";
//     if (!formData.invoiceDate) newErrors.invoiceDate = 'Invoice Date is required';
//     if (!formData.customerName) newErrors.customerName = 'Customer Name is required';
//     if (!formData.customerEmail) newErrors.customerEmail = 'Customer Email is required';
//     if (!formData.customerAddress) newErrors.customerAddress = 'Customer Address is required';
//     if (formData.allProducts.length === 0 || formData.allProducts.some(item => !item.description || item.quantity <= 0 || item.unitPrice <= 0)) {
//       newErrors.items = "Each item must have a description, quantity, and unit price greater than zero.";
//     }
//     if (!selectedCompany) newErrors.selectedCompany = "Select Issued By Company";
//     setErrors(newErrors);
//     return Object.keys(newErrors).length === 0;
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setIsSubmitting(true);

//     // Validate form before submitting
//     if (!validateForm()) {
//       setIsSubmitting(false);
//       return; // Prevent form submission if validation fails
//     }

//     // Include the selected company in formData
//     const data = { ...formData, invoiceDetailId: selectedCompany };

//     try {
//       const response = await InvoiceService.addInvoice(data);
//       if (response.status === 1) {
//         navigate(-1);
//         toast.success("Invoice Added Successfully"); // Toast on success
//       }

//       // Reset the form
//       setFormData({
//         invoiceNumber: "",
//         invoiceDate: "",
//         invoiceDetailId: "",
//         // dueDate: "",
//         customerName: "",
//         customerEmail: "",
//         customerAddress: "",
//         // items: [{ description: "", quantity: 1, unitPrice: 0, total: 0 }],
//         allProducts: [{ description: "", quantity: 1, unit: "", unitPrice: 0 }], // Reset items
//         totalAmount: 0,
//       });
//     } catch (error) {
//       console.error('Error adding invoice:', error);
//       toast.error('Failed to add invoice.');
//     }
//     setIsSubmitting(false);
//   };
//   //#endregion

//   //#region Handle Change Function
//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData((prev) => ({ ...prev, [name]: value }));
//   };

//   const handleItemChange = (index, e) => {
//     const { name, value } = e.target;
//     const updatedItems = [...formData.allProducts];
//     updatedItems[index] = { ...updatedItems[index], 
//       [name]: name === "quantity" || name === "unitPrice" ? Number(value) : value,
//     };

//     setFormData((prev) => ({
//       ...prev,
//       allProducts: updatedItems,
//     }));
//   };

//   const addItem = () => {
//     setFormData((prev) => ({
//       ...prev,
//       allProducts: [...prev.allProducts, { description: "", quantity: "", unitPrice: 0 }],
//     }));
//   };

//   const removeItem = (index) => {
//     const updatedItems = [...formData.allProducts];
//     updatedItems.splice(index, 1);

//     setFormData((prev) => ({
//       ...prev,
//       allProducts: updatedItems,
//     }));
//   };

//   //#endregion

//   //#region Render
//   return (
//     <>
//       {/* Header Section */}
//       <div className="flex justify-between items-center my-3">
//         <h1 className="font-semibold text-2xl">Add Invoice</h1>
//         <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
//           <Link
//             onClick={() => navigate(-1)}
//             className="bg-gray-500 hover:bg-gray-400 text-white font-bold py-2 px-4 rounded flex items-center gap-2 hover:no-underline"
//           >
//             <FaArrowLeft size={16} />
//             Back
//           </Link>
//         </motion.button>
//       </div>

//       {/* Form Section */}
//       <section className="bg-white rounded-lg shadow-sm m-1 py-8 pt-">
//         <form onSubmit={handleSubmit} className="container">
//           <div className="-mx-4 px-10 mt- flex flex-wrap">
//             {/* Invoice Date */}
//             <div className="w-full mb-2 px-3 md:w-1/2 lg:w-1/2">
//               <label className="mb-[10px] block text-base font-medium text-dark dark:text-white">
//                 Invoice Date
//               </label>
//               <input
//                 type="date"
//                 value={formData.invoiceDate}
//                 onChange={handleChange}
//                 name="invoiceDate"
//                 className="w-full mb-2 bg-transparent rounded-md border border-red py-3 px-4 text-dark-6 border-active transition"
//               />
//               {errors.invoiceDate && (
//                 <p className="text-red-500 text-xs">{errors.invoiceDate}</p>
//               )}
//             </div>

//             {/* Invoice Number */}
//             <div className="w-full mb-2 px-3 md:w-1/2 lg:w-1/2">
//               <label className="mb-[10px] block text-base font-medium text-dark dark:text-white">
//                 Invoice Number
//               </label>
//               <input
//                 type="text"
//                 placeholder="Invoice Number"
//                 value={formData.invoiceNumber}
//                 onChange={handleChange}
//                 name="invoiceNumber"
//                 className="w-full mb-2 bg-transparent rounded-md border border-red py-3 px-4 text-dark-6 border-active transition"
//               />
//               {errors.invoiceNumber && (
//                 <p className="text-red-500 text-xs">{errors.invoiceNumber}</p>
//               )}
//             </div>

//             {/* IssuedBy Company Selection Dropdown */}
//             <div className="w-full mb-2 px-3 md:w-1/2 lg:w-1/2">
//               <label className="mb-[10px] block text-base font-medium text-dark dark:text-white">
//                 IssuedBy Company
//               </label>
//               <select
//                 name="invoiceDetailId"
//                 value={formData.invoiceDetailId}
//                 onChange={handleChange}
//                 className="w-full mb-2 bg-transparent rounded-md border py-3 px-4 text-dark-6 border-active transition"
//               >
//                 <option value="">--Select a Company--</option>
//                 {companyList.map((company) => (
//                   <option
//                     key={company.invoiceDetailId}
//                     value={company.invoiceDetailId}
//                   >
//                     {company.companyName}
//                   </option>
//                 ))}
//               </select>
//               {errors.companyName && (
//                 <p className="text-red-500 text-xs">{errors.companyName}</p>
//               )}
//             </div>

//             {/* GtmClient Company Selection Dropdown */}
//             <div className="w-full mb-2 px-3 md:w-1/2 lg:w-1/2">
//               <label className="mb-[10px] block text-base font-medium text-dark dark:text-white">
//                 Gtm Client Company
//               </label>
//               <select
//                 name="companyName"
//                 value={selectedGtmCompany}
//                 onChange={(e) => setSelectedGtmCompany(e.target.value)}
//                 className="w-full mb-2 bg-transparent rounded-md border py-3 px-4 text-dark-6 border-active transition"
//               >
//                 <option value="">--Select Client Company--</option>
//                 {clientList.map((client) => (
//                   <option
//                     key={client.gtmClientServiceId}
//                     value={client.gtmClientServiceId}
//                   >
//                     {client.companyName}
//                   </option>
//                 ))}
//               </select>
//               {errors.companyName && (
//                 <p className="text-red-500 text-xs">{errors.companyName}</p>
//               )}
//             </div>

//             {/* Due Date */}
//             {/* <div className="w-full mb-2 px-3 md:w-1/3 lg:w-1/3">
//               <label className="mb-[10px] block text-base font-medium text-dark dark:text-white">
//                 Due Date
//               </label>
//               <input
//                 type="date"
//                 value={formData.dueDate}
//                 onChange={handleChange}
//                 name="dueDate"
//                 className="w-full mb-2 bg-transparent rounded-md border border-red py-3 px-4 text-dark-6 border-active transition"
//               />
//             </div> */}

//             {/* Customer Name */}
//             {/* <div className="w-full mb-2 px-3 md:w-1/3 lg:w-1/3">
//               <label className="mb-[10px] block text-base font-medium text-dark dark:text-white">
//                 Customer Name
//               </label>
//               <input
//                 type="text"
//                 placeholder="Customer Name"
//                 value={formData.customerName}
//                 onChange={handleChange}
//                 name="customerName"
//                 className="w-full mb-2 bg-transparent rounded-md border border-red py-3 px-4 text-dark-6 border-active transition"
//               />
//               {errors.customerName && (
//                 <p className="text-red-500 text-xs">{errors.customerName}</p>
//               )}
//             </div> */}

//             {/* Customer Email */}
//             {/* <div className="w-full mb-2 px-3 md:w-1/3 lg:w-1/3">
//               <label className="mb-[10px] block text-base font-medium text-dark dark:text-white">
//                 Customer Email
//               </label>
//               <input
//                 type="email"
//                 placeholder="Customer Email"
//                 value={formData.customerEmail}
//                 onChange={handleChange}
//                 name="customerEmail"
//                 className="w-full mb-2 bg-transparent rounded-md border border-red py-3 px-4 text-dark-6 border-active transition"
//               />
//               {errors.customerEmail && (
//                 <p className="text-red-500 text-xs">{errors.customerEmail}</p>
//               )}
//             </div> */}

//             {/* Customer Address */}
//             {/* <div className="w-full mb-2 px-3">
//               <label className="mb-[10px] block text-base font-medium text-dark dark:text-white">
//                 Customer Address
//               </label>
//               <textarea
//                 name="customerAddress"
//                 value={formData.customerAddress}
//                 onChange={handleChange}
//                 rows="3"
//                 className="w-full mb-2 bg-transparent rounded-md border border-red py-[8px] pl-5 pr-12 text-dark-6 border-active transition"
//               ></textarea>
//               {errors.customerAddress && (
//                 <p className="text-red-500 text-xs">{errors.customerAddress}</p>
//               )}
//             </div> */}

//             {/* Produts List */}
//             <div className="w-full mb-2 px-3">
//               <div className="flex mb-[10px]">
//                 <label className="block text-base font-medium text-dark dark:text-white">
//                   Add Produts Details
//                 </label>
//                 <button
//                   type="button"
//                   onClick={addItem}
//                   className="text-blue-500 text-xl ml-2"
//                   title="Add Item"
//                 >
//                   <FaPlus />
//                 </button>
//               </div>
//               {formData.allProducts.map((item, index) => (
//                 <div key={index} className="flex gap-3 mb-2">
//                   <input
//                     type="text"
//                     name="description"
//                     value={item.description}
//                     onChange={(e) => handleItemChange(index, e)}
//                     placeholder="Item Description"
//                     className="w-1/3 py-3 px-4 bg-transparent border rounded-md border-active"
//                   />

//                   <input
//                     type="number"
//                     name="quantity"
//                     value={item.quantity}
//                     placeholder="Quantity"
//                     onChange={(e) => handleItemChange(index, e)}
//                     min="1"
//                     className="w-1/3 py-3 px-4 bg-transparent border rounded-md border-active"
//                   />

//                   <input
//                     type="number"
//                     name="unit"
//                     value={item.unit}
//                     onChange={(e) => handleItemChange(index, e)}
//                     placeholder="Unit"
//                     className="w-1/3 py-3 px-4 bg-transparent border rounded-md border-active"
//                   />

//                   <input
//                     type="number"
//                     name="unitPrice"
//                     value={item.unitPrice}
//                     onChange={(e) => handleItemChange(index, e)}
//                     placeholder="Unit Price"
//                     className="w-1/3 py-3 px-4 bg-transparent border rounded-md border-active"
//                   />

//                   <FaTimes
//                     size={30}
//                     type="button"
//                     onClick={() => removeItem(index)}
//                     className="text-red-500 m-2 cursor-pointer"
//                   />
//                 </div>
//               ))}

//               {errors.items && (
//                 <p className="text-red-500 text-xs">{errors.items}</p>
//               )}
//             </div>

//             {/* Submit Button */}
//             <div className="w-full flex px-3">
//               <motion.button
//                 type="submit"
//                 whileHover={{ scale: 1.1 }}
//                 whileTap={{ scale: 0.9 }}
//                 className={`px-5 py-3 bg-blue-600 text-white font-medium rounded-md hover:bg-[#2564ebdb] active:border-[#a8adf4] outline-none active:border-2 focus:ring-2 ring-blue-300
//                   ${isSubmitting ? "opacity-50 cursor-not-allowed" : ""}`}
//                 disabled={isSubmitting}
//               >
//                 {isSubmitting ? "Submitting..." : "Add Invoice"}
//               </motion.button>
//             </div>
//           </div>
//         </form>
//       </section>
//     </>
//   );
//   //#endregion
// };

// export default AddInvoice;
// //#endregion
