//#region Imports
import React, { useEffect, useState } from "react";
import { FaArrowLeft, FaPlus, FaTimes } from "react-icons/fa";
import { Link, useNavigate, useParams } from "react-router-dom";
import { CommonService } from "../../service/CommonService";
import { toast } from "react-toastify";
import { motion } from "framer-motion"; // Import framer-motion
import Stepper from "../../components/Stepper";
import { GtmClientService } from "../../service/GtmClientService";
import { AgreementService } from "../../service/AgreementService";
import { InvoiceDetailService } from "../../service/InvoiceDetailService";
import { TaxDetailService } from "../../service/TaxDetailService";
import { GtmConnectionService } from "../../service/GtmConnectionService";
import Select from 'react-select';  // Import react-select
//#endregion Imports

//#region Component: EditGtmServiceClient
const EditGtmServiceClient = () => {

    //#region State Variables
     const [formData, setFormData] = useState({
       companyName: "",
       companyGstNumber : "",
       fullName  : "",
       panCardNumber: "",
       companyLinkedin : "",
       personalLinkedin : "",
       companyWebsite : "",
       pointOfContact : "",
       phoneNumber : "",
       companyEmail: "",
       personalEmail: "",
       address: "",
       countryId: "",
       stateId: "",
       cityId: "",
     });
     const [isStepOneSubmitted, setIsStepOneSubmitted] = useState(false);
   
    const [secondFormData, setSecondFormData] = useState({
        gtmClientServiceId: "",
        startDate: "",
        endDate : "",
        renewDate : "",
        amount : "",
        agreementDocument : null,
      });
   
      const [thirdFormData, setThirdFormData] = useState({
        gtmInvoiceConnectionId: "",
        gtmClientServiceId: "",
        invoiceDetailId: "",
        // description : "",
        // quantity : "",
        // unit : "",
        selectedTaxes: [],  // Changed to an array
        allProducts: [{ description: "", quantity: "", unit: "", unitPrice: "" }]  // Initialize with one empty item
      });
        
     const [taxDetailsList, setTaxDetailsList] = useState([]);
     const [gTMClientList, setGTMClientList] = useState([]);
     const [invoiceDetailList, setInvoiceDetailList] = useState([]);
     const [selectedTaxDetails, setSelectedTaxDetails] = useState([]);
      
     const [countryList, setCountryList] = useState([]);
     const [stateList, setStateList] = useState([]);
     const [cityList, setCityList] = useState([]);
   
     const [errors, setErrors] = useState({});
     const [isSubmitting, setIsSubmitting] = useState(false);
     const navigate = useNavigate();
     const {id} = useParams();
   
     const [currentStep, setCurrentStep] = useState(1); // Stepper state
     //#endregion
      
  //#region useEffect Hooks to fetch data  
    useEffect(() => {
    const fetchData = async () => {
    
      //Fetch GTMClient Data
      const gtmClientResult = await GtmClientService.getByIdGtmClient(id);
      setFormData(gtmClientResult.data);
      // console.log(gtmClientResult.data)

      //Fetch Agreement Data
      const agreementResult = await AgreementService.getByIdAgreement(id);
      const rawData = agreementResult?.data || {};
      // console.log(rawData)
      const agreementData = {
        ...rawData,
        startDate: rawData.startDate ? rawData.startDate.split("T")[0] : "",
        endDate: rawData.endDate ? rawData.endDate.split("T")[0] : "",
        renewDate: rawData.renewDate ? rawData.renewDate.split("T")[0] : "",
      };
      // const agreementData = {
      //     ...agreementResult.data,
      //     startDate: agreementResult.data.startDate
      //       ? agreementResult.data.startDate.split("T")[0]
      //       : "",
      //     endDate: agreementResult.data.endDate
      //       ? agreementResult.data.endDate.split("T")[0]
      //       : "",
      //     renewDate: agreementResult.data.renewDate
      //       ? agreementResult.data.renewDate.split("T")[0]
      //       : "",
      //   };
        // console.log(agreementData)

      if (agreementData) {
        setSecondFormData(agreementData || {});
      } else {
        setSecondFormData({
        startDate: "",
        endDate: "",
        renewDate: "",
        amount: "",
        agreementDocument: null,
      });
      }

      //#region Fetch TaxDetails, GTM Client Details, Invoice Details
      const taxDetailResult = await TaxDetailService.getTaxDetail();
      const taxData = taxDetailResult?.data || {};
      // console.log(taxData)
      setTaxDetailsList(taxData);


      // debugger
      //Fetch Invoice Data
      // const invoiceResult = await GtmConnectionService.getByIdGtmConnection(id);
      // // console.log(invoiceResult.data)
      // setThirdFormData(invoiceResult.data);

      // Fetch Invoice Data
      const invoiceResult = await GtmConnectionService.getByIdGtmConnection(id);
      const invoiceData = invoiceResult.data || {};

      setThirdFormData({
        ...invoiceData,
        allProducts:
          invoiceData.allProducts && invoiceData.allProducts.length > 0
            ? invoiceData.allProducts
            : [{ description: "", quantity: "", unit: "", unitPrice: "" }],
      });

      // const invoiceData = invoiceResult.data

      // setSelectedTaxDetails(
      //   taxDetailsList.map(tax => ({
      //     value: tax.taxDetailId,
      //     label: tax.taxName
      //   }))
      // );

      // debugger;
  //     setSelectedTaxDetails(
  //       invoiceData.selectedTaxes.map(selectedTax => {
  //       const matchedTax = taxDetailsList.find(
  //       tax => tax.taxDetailId === selectedTax
  //     );
  //     return {
  //       value: selectedTax,
  //       label: matchedTax ? matchedTax.taxName : "Unknown Tax"
  //     };
  //   })
  // );

      const gTMClientResult = await GtmClientService.getGtmClient();
      setGTMClientList(gTMClientResult.data);

      const invoiceDetailResult = await InvoiceDetailService.getInvoiceDetail();
      setInvoiceDetailList(invoiceDetailResult.data);
      //#endregion
      
      //#region Fetch Country, State, and City Source
      // Fetch countries
      const countryResult = await CommonService.getCountry();
      setCountryList(countryResult.data);

      // Fetch states and cities if country and state are selected
      if (formData.countryId) {
        const stateResult = await CommonService.getState(formData.countryId);
        setStateList(stateResult.data);  
        if (formData.stateId) {
          const cityResult = await CommonService.getCity(formData.stateId);
          setCityList(cityResult.data);
        }
      }
      //#endregion Fetch Country, State, and City Source
    };
    fetchData();
  }, [formData.countryId, formData.stateId, id])
  //#endregion

  //#region Form Validation and Submission
    // Validate form data before submission
    const validateForm = () => {
    const newErrors = {};
    if (!formData.companyName) newErrors.companyName = "Company Name is required";
    if (!formData.companyGstNumber) newErrors.companyGSTNumber = "Company GSt Number is required";
    if (!formData.fullName) newErrors.fullName = "Contact Person Name is required";
    if (!formData.companyLinkedin) newErrors.companyLinkedin = "Company Linkedin is required";
    if (!formData.pointOfContact) newErrors.pointOfContact = "Point Of Contact Person Name is required";
    if (!formData.phoneNumber || !/^[0-9]{10}$/.test(formData.phoneNumber)) {
      newErrors.phoneNumber = "Please enter a valid 10-digit phone number";
    }
    // if (!formData.phoneNumber) newErrors.phoneNumber = "Phone Number is required";
    if (!formData.companyEmail) newErrors.companyEmail = "Company Email is required";
    if (!formData.personalEmail) newErrors.personalEmail = "Person Email is required";
    if (!formData.panCardNumber) newErrors.panCardNumber = "Pan Number is required";
    // if (!formData.personalLinkedin) newErrors.personalLinkedin = "Contact Person Linkedin is required";
    if (!formData.address) newErrors.address = "Address is required";
    if (!formData.countryId) newErrors.countryId = "Country is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

    // Handle form submission
    const handleSubmit = async (e) => {
        debugger;
       e.preventDefault();
   
       console.log(formData);
       if (validateForm()) {
         setIsSubmitting(true);
         try {
           // Call the API to add the employee
           const companyData = {
               ...formData,
               stateId: formData.stateId === "" ? 0 : formData.stateId,
               cityId: formData.cityId === "" ? 0 : formData.cityId,
           }
           const response = await GtmClientService.updateGtmClient(id, companyData); // Call the service
           
           secondFormData.gtmClientServiceId = response.data
   
           if (response.status === 1) {
             toast.success("Gtm Client Registration Successfully");
             setIsStepOneSubmitted(true); // ✅ Enable next button
             // toast.success(response.message);
           }
           if (response.status === 2) {
             toast.error("This Email Is Already Registered, Please Enter Another Valid Email"); // Toast on error
           }
   
           // Reset the form after successful submission
           setFormData({
             companyName: "",
             companyRegistrationNumber : "",
             companyGSTNumber : "",
             companyLinkedin : "",
             fullName : "",
             pointOfContact : "",
             phoneNumber : "",
             companyEmail: "",
             personalLinkedin : "",
             address: "",
             countryId: "",
             stateId: "",
             cityId: "",
             whatsAppNumber: "",
             companyWebsite : "",
             relationalManagerId : "",
           });
           setErrors({});
         } catch (error) {
           console.error("Error adding gtm client:", error);
           toast.error("Failed to add gtm client. Please try again.");
         } finally {
           setIsSubmitting(false);
         }
       }
     };
    //#endregion 
  
  //#region Form Validation and Submission For Submit Agreement
  
  // Validation
   const validate = () => {
    const newErrors = {};
    if (!secondFormData.startDate) newErrors.startDate = "Start Date is required";
    if (!secondFormData.endDate) newErrors.endDate = "End Date is required";
    // if (!secondFormData.renewDate) newErrors.renewDate = "Renew Date is required";
    if (!secondFormData.amount) newErrors.amount = "Amount is required";
    if (!secondFormData.agreementDocument) newErrors.agreementDocument = "Agreement Document is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleAgreementSubmit = async (e) => {
     e.preventDefault();
     if (validate()) {
  
       setIsSubmitting(true);
  
       console.log(secondFormData);
  
       const formDataToSend = new FormData();
  
       // Append all form fields to the FormData object
       // Object.keys(secondFormData).forEach((key) => {
       //   formDataToSend.append(key, secondFormData[key]);
       // });
      //  debugger;
       if(secondFormData.gtmClientServiceId)
      //  if(secondFormData.gtmClientServiceId === null || secondFormData.gtmClientServiceId === "" || secondFormData.gtmClientServiceId === "undefined")
       {
         formDataToSend.append('GtmClientServiceId', secondFormData.gtmClientServiceId);
        }
        else {
         formDataToSend.append('GtmClientServiceId', id);
       }
       formDataToSend.append('StartDate', secondFormData.startDate);
       formDataToSend.append('EndDate', secondFormData.endDate);
       formDataToSend.append('RenewDate', secondFormData.renewDate);
       formDataToSend.append('Amount', secondFormData.amount);
      //  formDataToSend.append('AgreementDocument', secondFormData.agreementDocument?.name || '');
  
      if (secondFormData.agreementDocument instanceof File) {
          formDataToSend.append('AgreementDocument', secondFormData.agreementDocument?.name || '');
      }
      else{
        formDataToSend.append("AgreementDocument", secondFormData.agreementDocument);
      }

       // Make sure the file is also appended
       // Append the file only if it's available
       if (secondFormData.agreementDocument) {
         formDataToSend.append('agreementFile', secondFormData.agreementDocument);
       } else {
         toast.error("Agreement Document is required.");
         return;
       }

       
  
       try {
         //debugger;
         // Call the API to add the employee
         const response = await AgreementService.addAgreement(formDataToSend); // Call the service
  
         if (response.status === 1) {
           toast.success("Agreement Updated Successfully");
           // navigate(-1);
         }
         if (response.status === 2) {
           toast.error("This Email Is Already Registered, Please Enter Another Valid Email"); // Toast on error
         }
  
         // Reset the form after successful submission
         setSecondFormData({
           startDate: "",
           endDate: "",
           renewDate: "",
           amount: "",
           agreementDocument: null,
         });
         setErrors({});
       } catch (error) {
         console.error("Error adding gtm client:", error);
         toast.error("Failed to add agreement. Please try again.");
       } finally {
         setIsSubmitting(false);
       }
     }
  };
  //#endregion
    
  //#region Form Validation and Submission For GTM COnnection (Invoice Details)
    // Validation
     const validateInvoiceForm = () => {
      const newErrors = {};
      // if (!thirdFormData.gtmClientServiceId) newErrors.gtmClientServiceId = "GTM Service Company Name is required";
      if (!thirdFormData.invoiceDetailId) newErrors.invoiceDetailId = "Issue By Company is required";
      // if (!thirdFormData.selectedTaxes) newErrors.selectedTaxes = "Tax Type is required";
      // if (!thirdFormData.description) newErrors.description = "Description is required";
      // if (!thirdFormData.quantity) newErrors.quantity = "Quantity is required";
      // if (!thirdFormData.unit) newErrors.unit = "Unit is required";
      setErrors(newErrors);
      return Object.keys(newErrors).length === 0;
    };
  
    // Handle form submission
    const handleInvoiceSubmit = async (e) => {
     e.preventDefault();
     debugger;
 
     if (validateInvoiceForm()) {
 
       setIsSubmitting(true);
 
      //  const gtmConnectionData = {
      //    thirdFormData
      //  };
       
      //  console.log(thirdFormData);
 
       // const formDataToSend = new FormData();
 
       // Append all form fields to the FormData object
       // Object.keys(secondFormData).forEach((key) => {
       //   // Append the field as normal if it's not a file
       //   formDataToSend.append(key, secondFormData[key]);
       // });
 
       // Make sure the file is also appended
       // if (secondFormData.agreementDocument) {
       //   formDataToSend.append('agreementFile', secondFormData.agreementDocument);
       // }
 
       try {
         debugger;
         // Call the API to add the employee
         if(thirdFormData.gtmInvoiceConnectionId)
         {
            const response = await GtmConnectionService.updateGtmConnection(thirdFormData.gtmInvoiceConnectionId, thirdFormData); // Call the service
            if (response.status === 1) {
            toast.success("Invoice Updated Successfully");
            navigate(-1);
            }
          }
          else{
             const gtmConnectionData = {
                ...thirdFormData,
                gtmClientServiceId : id
              };
      
             const response = await GtmConnectionService.addGtmConnection(gtmConnectionData); // Call the service
             if (response.status === 1) {
             toast.success("Invoice Updated Successfully");
             navigate(-1);
            }  
          }
 
        
        //  if (response.status === 2) {
        //    toast.error("This Email Is Already Registered, Please Enter Another Valid Email"); // Toast on error
        //  }
         setErrors({});
       } catch (error) {
         console.error("Error adding invoice:", error);
         toast.error("Failed to add invoice. Please try again.");
       } finally {
         setIsSubmitting(false);
       }
     }
   };
   //#endregion
  
  //#region Handle Change Function
  const handleChange = (e) => {
    const { name, value, files } = e.target;
    // Regex for 10-digit number validation
    const phoneNumberRegex = /^[0-9]{10}$/;
    // If the field is either phoneNumber or whatsAppNumber, validate the input
    if (name === "phoneNumber" || name === "whatsAppNumber") {
      if (value && !phoneNumberRegex.test(value)) {
        // Only allow 10 digits
        setErrors((prev) => ({
          ...prev,
          [name]: "Please enter a valid 10-digit number",
        }));
      } else {
        setErrors((prev) => ({
          ...prev,
          [name]: "",
        }));
      }
    }

    // If it's a file input
    if (e.target.type === "file") {
      setSecondFormData((prev) => ({
        ...prev,
        [name]: files[0], // Only storing the first file
      }));
      return;
    }

    // Update formData
    setFormData((prev) => ({ ...prev, [name]: value }));
    setSecondFormData((prev) => ({ ...prev, [name]: value }));
    setThirdFormData((prev) => ({ ...prev, [name]: value }));
  };
  //#endregion

  //#region Prepare Select Options
  // Prepare options for react-select
  const taxDetailOptions = taxDetailsList.map(taxDetail => ({
    value: taxDetail.taxDetailId,
    label: taxDetail.taxName
  }));
  //#endregion

  //#region Handle Daynamic Row Events
  const handleItemChange = (index, e) => {
    const { name, value } = e.target;
    const updatedItems = [...thirdFormData.allProducts];
    updatedItems[index] = { ...updatedItems[index], [name]: value };

    // Update total for the item
    updatedItems[index].total = updatedItems[index].quantity * updatedItems[index].unitPrice;

    setThirdFormData((prev) => ({
      ...prev,
      allProducts: updatedItems,
      // totalAmount: updatedItems.reduce((acc, item) => acc + item.total, 0), // Update total amount
    }));
  };

   const addItem = () => {
    setThirdFormData((prev) => ({
      ...prev,
      allProducts: [...prev.allProducts, { description: "", quantity: "", unit: "" }],
    }));
  };

  const removeItem = (index) => {
    const updatedItems = [...thirdFormData.allProducts];
    updatedItems.splice(index, 1);

    setThirdFormData((prev) => ({
      ...prev,
      allProducts: updatedItems,
      // totalAmount: updatedItems.reduce((acc, item) => acc + item.total, 0),
    }));
  };
  //#endregion

  //#region Event Handlers
  const handleTaxDetailChange = (selectedOptions) => {
    setSelectedTaxDetails(selectedOptions);
    // Reset the days of leave for newly selected leave types
    const newTaxDetail = { ...thirdFormData.selectedTaxes };

    selectedOptions.forEach(option => {
      if (!newTaxDetail[option.value]) {
        newTaxDetail[option.value] = 0; // Initialize with 0 days
      }
    });
     // Now update the selectedTaxes in the thirdFormData state
    setThirdFormData(prevState => ({
      ...prevState,
      selectedTaxes: selectedOptions.map(option => option.value), // or you can adjust as needed
    }));
  };
  //#endregion

  const handleSelectChange = (selectedOptions, field) => {
    const selectedValues = selectedOptions ? selectedOptions.map((option) => option.value) : [];
    if (field === "taxDetailId") {
      setThirdFormData(prevState => ({
      ...prevState,
      selectedTaxes: selectedValues, // or you can adjust as needed
      }));
    }
  };
  
  //#region Steps Configuration
  const steps = [
    // GTM Service Client
    {
      label: "GTM Client",
      component: (
        <fieldset>
          <legend className="text-xl font-semibold text-gray-700 mb-4">
            Step 1: Edit GTM Client
          </legend>

          {/* GTM Client Fields */}
          <form onSubmit={handleSubmit} className="container">
          <div className="-mx-4 px-10 mt- flex flex-wrap">
        

            {/* Form Fields */}
            {/* Company Name, Registration Number, Company Email, Contact Person Name, GST Number, Website, Phone No., WhatsApp No., Contact Person Linkedin */}
            {[
              {
                label: "Company Name",
                name: "companyName",
                type: "text",
                placeholder: "Enter Company name",
              },
              {
                label: "Person Full Name",
                name: "fullName",
                type: "text",
                placeholder: "Enter Full Name",
              },
              {
                label: "Point Of Contact Name (POC)",
                name: "pointOfContact",
                type: "text",
                placeholder: "Enter Point Of Contact Name",
              },
              {
                label: "Company Email",
                name: "companyEmail",
                type: "email",
                placeholder: "Enter your Company Email",
              },
              {
                label: "Company GST Number",
                name: "companyGstNumber",
                type: "text",
                placeholder: "Enter Company GST Number",
              },
              {
                label: "Company Linkedin",
                name: "companyLinkedin",
                type: "url",
                placeholder: "Enter Company Linkedin",
              },
              {
                label: "Company Website",
                name: "companyWebsite",
                type: "url",
                placeholder: "Enter Company Website",
              },
              {
                label: "Person Email",
                name: "personalEmail",
                type: "email",
                placeholder: "Enter your Personal Email",
              },
              {
                label: "Pan Number",
                name: "panCardNumber",
                type: "text",
                placeholder: "Enter Pan Number",
              },
              {
                label: "Phone No.",
                name: "phoneNumber",
                type: "number",
                placeholder: "Enter phone number",
              },
              {
                label: "Person Linkedin",
                name: "personalLinkedin",
                type: "url",
                placeholder: "Enter Person Linkedin link",
              },
            ].map(({ label, name, type, placeholder }) => (
              <div className="w-full mb-2 px-3 md:w-1/2 lg:w-1/3" key={name}>
                <label className="mb-2 block text-base font-medium">
                  {label}
                </label>
                <input
                  type={type}
                  name={name}
                  placeholder={placeholder}
                  value={formData[name]}
                  onChange={handleChange}
                  className={
                    "w-full mb-2 rounded-md border border-red py-[10px] pl-5 pr-12 text-dark-6 border-active transition"
                  }
                />
                {errors[name] && (
                  <p className="text-red-500 text-xs">{errors[name]}</p>
                )}
              </div>
            ))}

            {/* Country Select */}
            <div className="w-full mb-2 px-3 md:w-1/3 lg:w-1/3">
              <label className="mb-2 block text-base font-medium">
                Country
              </label>
              <select
                value={formData.countryId}
                onChange={handleChange}
                name="countryId"
                className="w-full mb-2 bg-transparent rounded-md border border-red py-[8px] pl-5 pr-12 text-dark-6 border-active transition"
              >
                <option value="" className="text-gray-400">
                  --Select Country--
                </option>
                {countryList.length > 0 ? (
                  countryList.map((country) => (
                    <option key={country.countryId} value={country.countryId}>
                      {country.name}
                    </option>
                  ))
                ) : (
                  <option value="" disabled>
                    No countries available
                  </option>
                )}
              </select>
              {errors.countryId && (
                <p className="text-red-500 text-xs">{errors.countryId}</p>
              )}
            </div>

            {/* State Select */}
            <div className="w-full mb-2 px-3 md:w-1/3 lg:w-1/3">
              <label className="mb-[10px] block text-base font-medium text-dark dark:text-white">
                State
              </label>
              <select
                value={formData.stateId}
                onChange={handleChange}
                name="stateId"
                className="w-full mb-2 bg-transparent rounded-md border border-red py-[8px] pl-5 pr-12 text-dark-6 border-active transition"
              >
                <option value="" className="text-gray-400">
                  --Select State--
                </option>
                {stateList.length > 0 ? (
                  stateList.map((state) => (
                    <option key={state.stateId} value={state.stateId}>
                      {state.name}
                    </option>
                  ))
                ) : (
                  <option value="" disabled>
                    No states available
                  </option>
                )}
              </select>
              {errors.stateId && (
                <p className="text-red-500 text-xs">{errors.stateId}</p>
              )}
            </div>

            {/* City Select */}
            <div className="w-full mb-2 px-3 md:w-1/3 lg:w-1/3">
              <label className="mb-[10px] block text-base font-medium text-dark dark:text-white">
                City
              </label>
              <select
                value={formData.cityId}
                onChange={handleChange}
                name="cityId"
                className="w-full mb-2 bg-transparent rounded-md border border-red py-[8px] pl-5 pr-12 text-dark-6 border-active transition"
              >
                <option value="" className="text-gray-400">
                  --Select City--
                </option>
                {cityList.length > 0 ? (
                  cityList.map((city) => (
                    <option key={city.cityId} value={city.cityId}>
                      {city.name}
                    </option>
                  ))
                ) : (
                  <option value="" disabled>
                    No cities available
                  </option>
                )}
              </select>
              {errors.cityId && (
                <p className="text-red-500 text-xs">{errors.cityId}</p>
              )}
            </div>

            {/* Address Input */}
            <div className="w-full mb-2">
              {/* Address Input */}
              <div className="w-full mb-2 px-3">
                <label className="mb-2 block text-base font-medium text-dark dark:text-white">
                  Address
                </label>
                <textarea
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  rows="3"
                  className="w-full mb-2 bg-transparent rounded-md border border-red py-[10px] pl-5 pr-12 text-dark-6 border-active transition"
                ></textarea>
                {errors.address && (
                  <p className="text-red-500 text-xs">{errors.address}</p>
                )}
              </div>
            </div>
          </div>
          </form>
        </fieldset>
      ),
    },
    // Agreement
    {
      label: "Agreement",
      component: (
        <fieldset>
          <legend className="text-xl font-semibold text-gray-700 mb-4">
            Step 2: Edit Agreement
          </legend>

          {/* Agreement Fields */}
          <form onSubmit={handleAgreementSubmit} className="container">
          <div className="-mx-4 px-10 mt- flex flex-wrap">     

            {/* Form Fields */}
            {/* Start Date, End Date, Renew Date, Amount, Uplaod Document */}
            {[
              {
                label: "Start Date",
                name: "startDate",
                type: "date",
                placeholder: "Enter Start name",
              },
              {
                label: "End Date",
                name: "endDate",
                type: "date",
                placeholder: "Enter End Date",
              },
              {
                label: "Renew Date",
                name: "renewDate",
                type: "date",
                placeholder: "Enter Renew Date",
              },
              {
                label: "Amount",
                name: "amount",
                type: "number",
                placeholder: "Enter your Amount",
              },
              // {
              //   label: "Uplaod Document",
              //   name: "agreementDocument",
              //   type: "file",
              //   placeholder: "Enter document file",
              // },
            ].map(({ label, name, type, placeholder }) => (
              <div className="w-full mb-2 px-3 md:w-1/2 lg:w-1/3" key={name}>
                <label className="mb-2 block text-base font-medium">
                  {label}
                </label>
                <input
                  type={type}
                  name={name}
                  placeholder={placeholder}
                  value={secondFormData?.[name] || ""}
                  onChange={handleChange}
                  className={
                    "w-full mb-2 rounded-md border border-red py-[10px] pl-5 pr-12 text-dark-6 border-active transition"
                  }
                />
                {errors[name] && (
                  <p className="text-red-500 text-xs">{errors[name]}</p>
                )}
              </div>
            ))}

              {/* Uplaod Document */}
              <div className="w-full mb-2 px-3 md:w-1/3 lg:w-1/3">
                <label className="mb-[10px] block text-base font-medium text-dark dark:text-white">
                  Uplaod Document
                </label>
                <input
                  type="file"
                  name="agreementDocument"
                  onChange={handleChange}
                  className="w-full mb-2 bg-transparent rounded-md border border-red py-3 px-4 text-dark-6 border-active transition"
                ></input>
                {errors.agreementDocument && (
                  <p className="text-red-500 text-xs">{errors.agreementDocument}</p>
                )}
              </div>
            </div>
          </form>
        </fieldset>        
      ),
    },
    // Invoice Details
    {
      label: "Invoice",
      component: (
        <fieldset>
          <legend className="text-xl font-semibold text-gray-700 mb-4">
            Step 1: Add Invoice
          </legend>

          {/* GTM Client Fields */}
          <form onSubmit={handleInvoiceSubmit} className="container">
          <div className="-mx-4 px-10 mt- flex flex-wrap">

            {/* IssuedByCompany */}
            <div className="w-full mb-2 px-3 md:w-1/3 lg:w-1/3">
              <label className="mb-[10px] block text-base font-medium text-dark dark:text-white">
                IssuedByCompany
              </label>
              <select
                 value={thirdFormData?.invoiceDetailId || ""}
                onChange={handleChange}
                name="invoiceDetailId"
                className="w-full mb-2 bg-transparent rounded-md border border-red py-[8px] pl-5 pr-12 text-dark-6 border-active transition"
              >
                <option value="" className="text-gray-400">
                  --Select IssuedByCompany--
                </option>
                {invoiceDetailList.length > 0 ? (
                  invoiceDetailList.map((invoiceDetail) => (
                    <option key={invoiceDetail.invoiceDetailId} value={invoiceDetail.invoiceDetailId}>
                      {invoiceDetail.companyName}
                    </option>
                  ))
                ) : (
                  <option value="" disabled>
                    No IssuedByCompany available
                  </option>
                )}
              </select>
              {errors.invoiceDetailId && (
                <p className="text-red-500 text-xs">{errors.invoiceDetailId}</p>
              )}
            </div>

            {/* Tax Type */}
            <div className="w-full mb-2 px-3 md:w-1/3 lg:w-1/3">
              <label className="mb-[10px] block text-base font-medium text-dark dark:text-white">Tax Type</label>
              <div className="relative z-20">
                <Select
                  isMulti
                  // name="selectedTaxes"
                  options={taxDetailOptions}
                  value={taxDetailOptions.filter((option) =>
                    thirdFormData?.selectedTaxes?.includes(option.value)
                  )}

                  // value={taxDetailOptions.filter((option) =>
                  //   thirdFormData.selectedTaxes.includes(option.value)
                  // )}
                  onChange={(selectedOption) =>
                  handleSelectChange(selectedOption, "taxDetailId")
                }
                  // value={selectedTaxDetails}
                  // onChange={handleTaxDetailChange}
                  className="mb-2"
                  placeholder="Select Tax Type"
                />
              </div>
              {errors.selectedTaxDetails && <p className="text-red-500 text-xs">{errors.selectedTaxDetails}</p>}
            </div>

            {/* Item List */}
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
              {/* <label className="mb-[10px] block text-base font-medium text-dark dark:text-white">
                Items
              </label> */}
                {(thirdFormData?.allProducts?.length ? thirdFormData.allProducts : [{ description: "", quantity: "", unit: "", unitPrice: "" }]).map((item, index) => (
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
                    type="text"
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
                  {/* <button
                    type="button"
                    onClick={() => removeItem(index)}
                    className="text-red-500"
                  >
                    Remove
                  </button> */}
                </div>
              ))}
  
              {/* <button
                type="button"
                onClick={addItem}
                className="text-blue-500"
              >
                Add Item
              </button> */}
              {errors.items && (
                <p className="text-red-500 text-xs">{errors.items}</p>
              )}
            </div>



          </div>
          </form>
        </fieldset>
      ),
    },
  ];

  const handleNextClick = () => {
    if (validateForm(currentStep)) {
      setCurrentStep(currentStep + 1);
    }
  };
  //#endregion

   //#region Render
  return (
    <>
      {/* Header Section */}
      <div className="flex justify-between items-center my-3">
        <h1 className="font-semibold text-2xl">Edit GTM Service Client</h1>
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
      <section className="bg-white rounded-lg shadow-sm m-1 py-8 pt-4 dark:bg-dark">
        <div className="container px-4 sm:px-6 mx-auto">
          {/* Stepper */}
          <Stepper steps={steps} currentStep={currentStep} />

          {/* Navigation Buttons */}
          <div className="flex flex-wrap items-center mt-6 gap-x-2">
  {/* Previous Button */}
  {currentStep > 1 && (
    <button
      onClick={() => setCurrentStep(currentStep - 1)}
      className="px-4 py-2 bg-gray-300 rounded-md hover:bg-gray-400"
    >
      Previous
    </button>
  )}

  {/* Next Button */}
  {currentStep < steps.length && (
    <button
      onClick={handleNextClick}
      className="px-4 py-2 rounded-md text-white bg-blue-500 hover:bg-blue-600"
    >
      Next
    </button>
  )}

  {/* Submit Button */}
  {currentStep && (
    <button
      type="submit"
      onClick={
        currentStep === 1
          ? handleSubmit
          : currentStep === 2
          ? handleAgreementSubmit
          : handleInvoiceSubmit
      }
      className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600"
    >
      Submit
    </button>
  )}
</div>

        </div>
      </section>
    </>
  );
  //#endregion
};

export default EditGtmServiceClient
//#endregion
