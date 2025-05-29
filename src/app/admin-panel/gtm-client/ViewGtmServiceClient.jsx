//#region Import
import React, { useEffect, useState } from "react";
import { FaArrowLeft, FaEdit, FaPlus } from "react-icons/fa";
import { Link, useNavigate, useParams } from "react-router-dom";
import { motion } from "framer-motion"; // Import framer-motion
import { toast } from "react-toastify";
import { GtmClientService } from "../../service/GtmClientService";
import { AgreementService } from "../../service/AgreementService";
import ViewAgreement from "./ViewAgreement";
import ViewInvoice from "./ViewInvoice";
import { ReportService } from "../../service/ReportService";
//#endregion

//#region Component: ViewGtmServiceClient 
const ViewGtmServiceClient = () => {

    //#region State Variables
    const [gtmClientformData, setGtmClientFormData] = useState({
    gtmClientServiceId: '',
    companyName: '',
    companyGstNumber: '',
    fullName: '',
    panCardNumber: '',
    companyLinkedin: '',
    personalLinkedin: '',
    companyWebsite: '',
    pointOfContact: '',
    phoneNumber: '',
    companyEmail: '',
    personalEmail: '',
    address: '',
    countryId: '',
    stateId: '',  // Replaced reasonForClosure with specialNotes
    cityId: '', // Store file here
    countryName: '', 
    stateName:'',
    cityName:'',
  });
   const [agreementformData, setAgreementFormData] = useState({
    gtmClientServiceId: '',
    startDate: "",
    endDate : "",
    renewDate : "",
    amount : "",
    agreementDocument : "",
  });
  const [activeTab, setActiveTab] = useState(1);
  const [departmentId, setDepartmentId] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { id } = useParams();
  const navigate = useNavigate();
  //#endregion
    
   //#region Fetch Project Data
   const fetchData = async () => {
     try {
       // Fetch Gtm Client
       const gtmClient = await GtmClientService.getByIdGtmClient(id);
       setGtmClientFormData(gtmClient.data);
 
       // Fetch Inquiry
       const gtmAgreement = await AgreementService.getByIdAgreement(id);
      //  console.log(gtmAgreement.data);
       setAgreementFormData(gtmAgreement.data);

     } catch (error) {
       console.error("Error fetching data:", error);
       alert("Error fetching data, please try again.");
     }
   };

     useEffect(() => {
       fetchData();
     }, [id, departmentId]);
     //#endregion
   
  //#region Function to handle tab change
  // Function to handle tab change
  const handleTabClick = (tabIndex) => {
    setActiveTab(tabIndex);
  };
  //#endregion
  
  // Format the date in DD-MM-YYYY
    const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB'); // 'en-GB' format is DD/MM/YYYY
    };

  //#region Download Report
  const handleDownloadReport = async () => {
    setIsSubmitting(true);
    try {
      // Wait for the report download to complete
      await ReportService.downloadInvoiceReport(id);
      // Optionally, add a success message or additional logic after the download
      // if (response.status === 1) {
      //  toast.success("Report downloaded successfully!");
      // }
    } catch (error) {
      console.error("Error downloading report:", error);
      toast.error("Failed to download report.");
    } finally {
      setIsSubmitting(false);
    }
  }
  //#endregion

   //#region Render
  return (
    <>
      {/* Header Section + Button */}
      <div className="flex flex-wrap justify-between items-center my-3 flex-col md:flex-row ">
        <h1 className="font-semibold text-xl sm:text-2xl">
          View GTM Service Client
        </h1>
        <div className="flex flex-wrap space-x-2 mt-2 sm:mt-0">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={handleDownloadReport}
            className={`me-3 bg-purple-600 hover:bg-purple-700 flex gap-2 text-center text-white font-medium py-2 px-4 rounded hover:no-underline 
            ${isSubmitting ? "opacity-50 cursor-not-allowed" : ""}`}
            disabled={isSubmitting}
          >
            {isSubmitting ? "Generating..." : "Generate Invoice"}
          </motion.button>

          <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
            <Link
              to={`/gtm-client/edit-gtm-client/${id}`}
              className="bg-blue-600 hover:bg-blue-700 flex items-center gap-2 text-center text-white font-medium py-2 px-4 rounded hover:no-underline"
            >
              Edit GTM Client
              <FaEdit size={16} />
            </Link>
          </motion.button>

          <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
            <button
              onClick={() => navigate(-1)}
              className="bg-gray-500 hover:bg-gray-400 text-white font-bold py-2 px-4 rounded flex items-center gap-2 hover:no-underline"
            >
              <FaArrowLeft size={16} />
              Back
            </button>
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
                  "GTM Client Details",
                  "Client Agreement Details",
                  "Invoice Details",
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
                <div
                  id="card-type-tab-preview"
                  role="tabpanel"
                  className="mt-7"
                  aria-labelledby="card-type-tab-item-1"
                >
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {[
                      {
                        label: "Company Name",
                        name: "companyName",
                        value: gtmClientformData.companyName,
                      },
                      {
                        label: "Person Full Name",
                        name: "fullName",
                        value: gtmClientformData.fullName,
                      },
                      {
                        label: "Point Of Contact Name (POC)",
                        name: "pointOfContact",
                        value: gtmClientformData.pointOfContact,
                      },
                      {
                        label: "Company Email",
                        name: "companyEmail",
                        value: gtmClientformData.companyEmail,
                      },
                      {
                        label: "Company GST Number",
                        name: "companyGSTNumber",
                        value: gtmClientformData.companyGstNumber,
                      },
                      {
                        label: "Company Linkedin",
                        name: "companyLinkedin",
                        value: gtmClientformData.companyLinkedin,
                      },
                      {
                        label: "Company Website",
                        name: "companyWebsite",
                        value: gtmClientformData.companyWebsite,
                      },
                      {
                        label: "Person Email",
                        name: "personalEmail",
                        value: gtmClientformData.personalEmail,
                      },
                      {
                        label: "Pan Number",
                        name: "panCardNumber",
                        value: gtmClientformData.panCardNumber,
                      },
                      {
                        label: "Phone No.",
                        name: "phoneNumber",
                        value: gtmClientformData.phoneNumber,
                      },
                      {
                        label: "Person Linkedin",
                        name: "personalLinkedin",
                        value: gtmClientformData.personalLinkedin,
                      },
                      {
                        label: "Country",
                        name: "countryName",
                        value: gtmClientformData.countryName,
                      },
                      {
                        label: "State",
                        name: "stateName",
                        value: gtmClientformData.stateName,
                      },
                      {
                        label: "City",
                        name: "cityName",
                        value: gtmClientformData.cityName,
                      },
                      {
                        label: "Address",
                        name: "address",
                        value: gtmClientformData.address,
                      },
                    ].map((field, idx) => (
                      <div key={idx} className="w-full px-2">
                        <label className="font-semibold text-gray-700 me-2">
                          {field.label}:
                        </label>
                        {[
                          "companyLinkedin",
                          "personalLinkedin",
                          "companyWebsite",
                        ].includes(field.name) ? (
                          <a
                            href={
                              field.value?.startsWith("http")
                                ? field.value
                                : `https://${field.value}`
                            }
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 underline break-words hover:text-blue-800"
                          >
                            {field.value}
                          </a>
                        ) : (
                          <span className="text-gray-600">{field.value}</span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === 2 && <ViewAgreement />}
              {activeTab === 3 && <ViewInvoice />}
            </div>
          </div>
        </form>
      </section>
    </>
  );
  //#endregion

}

export default ViewGtmServiceClient
//#endregion


// //#region Import
// import React, { useEffect, useState } from "react";
// import { FaArrowLeft, FaEdit, FaPlus } from "react-icons/fa";
// import { Link, useNavigate, useParams } from "react-router-dom";
// import { motion } from "framer-motion"; // Import framer-motion
// import { InquiryPermissionService } from "../../service/InquiryPermissionService";
// import { InquiryService } from "../../service/InquiryService";
// import { DepartmentService } from "../../service/DepartmentService";
// import { EmployeeService } from "../../service/EmployeeService";
// import { InquiryFollowUpService } from "../../service/InquiryFollowUpService";
// import { toast } from "react-toastify";
// import { ClientCompanyService } from "../../service/ClientCompanyService";
// import { PartnerService } from "../../service/PartnerService";
// import { VendorService } from "../../service/VendorService";
// import { GtmClientService } from "../../service/GtmClientService";
// import { AgreementService } from "../../service/AgreementService";
// //#endregion

// //#region Component: ViewGtmServiceClient 
// const ViewGtmServiceClient = () => {

//     //#region State Variables
//     const [gtmClientformData, setGtmClientFormData] = useState({
//     gtmClientServiceId: '',
//     companyName: '',
//     companyGstNumber: '',
//     fullName: '',
//     panCardNumber: '',
//     companyLinkedin: '',
//     personalLinkedin: '',
//     companyWebsite: '',
//     pointOfContact: '',
//     phoneNumber: '',
//     companyEmail: '',
//     personalEmail: '',
//     address: '',
//     countryId: '',
//     stateId: '',  // Replaced reasonForClosure with specialNotes
//     cityId: '', // Store file here
//     countryName: '', 
//     stateName:'',
//     cityName:'',
//   });
//    const [agreementformData, setAgreementFormData] = useState({
//     gtmClientServiceId: '',
//     startDate: "",
//     endDate : "",
//     renewDate : "",
//     amount : "",
//     agreementDocument : "",
//   });
//   const [activeTab, setActiveTab] = useState(1);
//   const [departmentId, setDepartmentId] = useState("");
//   const { id } = useParams();
//   const navigate = useNavigate();
//   //#endregion
    
//    //#region Fetch Project Data
//    const fetchData = async () => {
//      try {
//        // Fetch Gtm Client
//        const GtmClient = await GtmClientService.getByIdGtmClient(id);
//        setGtmClientFormData(GtmClient.data);
 
//        // Fetch Inquiry
//        const GtmAgreement = await AgreementService.getByIdAgreement(id);
//        console.log(GtmAgreement.data);
//        setAgreementFormData(GtmAgreement.data);

//      } catch (error) {
//        console.error("Error fetching data:", error);
//        alert("Error fetching data, please try again.");
//      }
//    };

//      useEffect(() => {
//        fetchData();
//      }, [id, departmentId]);
//      //#endregion
   
//   //#region Function to handle tab change
//   // Function to handle tab change
//   const handleTabClick = (tabIndex) => {
//     setActiveTab(tabIndex);
//   };
//   //#endregion
  
//   // Format the date in DD-MM-YYYY
//     const formatDate = (dateString) => {
//     const date = new Date(dateString);
//     return date.toLocaleDateString('en-GB'); // 'en-GB' format is DD/MM/YYYY
//     };

//    //#region Render
//   return (
//     <> 
//       {/* Header Section + Button */}
//       <div className="flex flex-wrap justify-between items-center my-3 flex-col md:flex-row ">
//         <h1 className="font-semibold text-xl sm:text-2xl">View GTM Service Client</h1>
//         <div className="flex flex-wrap space-x-2 mt-2 sm:mt-0">
        
//           <motion.button
//             whileHover={{ scale: 1.1 }}
//             whileTap={{ scale: 0.9 }}
//           >
//             <Link
//               to={`/gtm-client/edit-gtm-client/${id}`}
//               className="bg-blue-600 hover:bg-blue-700 flex items-center gap-2 text-center text-white font-medium py-2 px-4 rounded hover:no-underline"
//             >
//               Edit GTM Client
//               <FaEdit size={16} />
//             </Link>
//           </motion.button>

//           <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
//             <button
//               onClick={() => navigate(-1)}
//               className="bg-gray-500 hover:bg-gray-400 text-white font-bold py-2 px-4 rounded flex items-center gap-2 hover:no-underline"
//             >
//               <FaArrowLeft size={16} />
//               Back
//             </button>
//           </motion.button>
//         </div>
//       </div>

//       <section className="bg-white rounded-lg shadow-lg m-1 p-4 sm:p-8">
//         <form className="container">
//           <div className="md:px-2 lg:px-2 px-7">
//             {/* Tab Navigation */}
//             <div className="border-b border-gray-200 dark:border-neutral-700">
//               <nav
//                 className="flex flex-wrap gap-1"
//                 aria-label="Tabs"
//                 role="tablist"
//                 aria-orientation="horizontal"
//               >
//                 {[
//                   "GTM Client Details",
//                   "Client Agreement Details",
//                 ].map((tab, index) => (
//                   <button
//                     key={index}
//                     type="button"
//                     className={`${
//                       activeTab === index + 1
//                         ? "bg-blue-600 text-white font-bold border-b-2 border-blue-600 dark:bg-blue-700 dark:border-blue-800 dark:text-white"
//                         : "bg-blue-100 text-blue-600 border-transparent hover:bg-blue-200 dark:bg-neutral-700 dark:text-blue-300 dark:hover:bg-neutral-600"
//                     } -mb-px py-3 px-4 inline-flex items-center gap-x-2 text-sm font-medium text-center border rounded-t-lg`}

//                     onClick={() => handleTabClick(index + 1)}
//                     role="tab"
//                     aria-selected={activeTab === index + 1}
//                   >
//                     {tab}
//                   </button>
//                 ))}
//               </nav>
//             </div>

//             {/* Tab Content */}
//             <div className="mt-3">
//               {activeTab === 1 && (
//                 <div
//                   id="card-type-tab-preview"
//                   role="tabpanel"
//                   className="mt-7"
//                   aria-labelledby="card-type-tab-item-1"
//                 >
//                   <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
//                     {[
//                       {
//                         label: "Company Name",
//                         name: "companyName",
//                         value: gtmClientformData.companyName,
//                       },
//                       {
//                         label: "Person Full Name",
//                         name: "fullName",
//                         value: gtmClientformData.fullName,
//                       },
//                       {
//                         label: "Point Of Contact Name (POC)",
//                         name: "pointOfContact",
//                         value: gtmClientformData.pointOfContact,
//                       },
//                       {
//                         label: "Company Email",
//                         name: "companyEmail",
//                         value: gtmClientformData.companyEmail,
//                       },
//                       {
//                         label: "Company GST Number",
//                         name: "companyGSTNumber",
//                         value: gtmClientformData.companyGstNumber,
//                       },
//                       {
//                         label: "Company Linkedin",
//                         name: "companyLinkedin",
//                         value: gtmClientformData.companyLinkedin,
//                       },
//                       {
//                         label: "Company Website",
//                         name: "companyWebsite",
//                         value: gtmClientformData.companyWebsite,
//                       },
//                       {
//                         label: "Person Email",
//                         name: "personalEmail",
//                         value: gtmClientformData.personalEmail,
//                       },
//                       // {
//                       //   label: "Project Document",
//                       //   name: "inquiryDocuments",
//                       //   value: formData.inquiryDocuments,
//                       // },
//                       {
//                         label: "Pan Number",
//                         name: "panCardNumber",
//                         value: gtmClientformData.panCardNumber,
//                       },
//                       {
//                         label: "Phone No.",
//                         name: "phoneNumber",
//                         value: gtmClientformData.phoneNumber,
//                       },
//                       {
//                         label: "Person Linkedin",
//                         name: "personalLinkedin",
//                         value: gtmClientformData.reasonForClosure,
//                       },
//                       {
//                         label: "Country",
//                         name: "countryName",
//                         value: gtmClientformData.countryName,
//                       },
//                       {
//                         label: "State",
//                         name: "stateName",
//                         value: gtmClientformData.stateName,
//                       },
//                       {
//                         label: "City",
//                         name: "cityName",
//                         value: gtmClientformData.cityName,
//                       },
//                       {
//                         label: "Address",
//                         name: "address",
//                         value: gtmClientformData.address,
//                       },
//                     ].map((field, idx) => (
//                       <div key={idx} className="w-full px-2">
//                         <label className="font-semibold text-gray-700 me-2">
//                           {field.label}:
//                         </label>
//                         <span className="text-gray-600">{field.value}</span>
//                       </div>
//                     ))}
//                   </div>
//                 </div>
//               )}

//              {activeTab === 2 && (
//                 <div
//                   id="card-type-tab-preview"
//                   role="tabpanel"
//                   className="mt-7"
//                   aria-labelledby="card-type-tab-item-1"
//                 >
//                   <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
//                     {[
//                       {
//                         label: "Start Date",
//                         name: "startDate",
//                         value: formatDate(agreementformData.startDate),
//                       },
//                       {
//                         label: "End Date",
//                         name: "endDate",
//                         value: formatDate(agreementformData.endDate),
//                       },
//                       {
//                         label: "Renew Date",
//                         name: "renewDate",
//                         value: formatDate(agreementformData.renewDate),
//                       },
//                       {
//                         label: "Amount",
//                         name: "amount",
//                         value: agreementformData.amount,
//                       },
                      
//                       {
//                         label: "Agreement Document", 
//                         value: agreementformData.agreementDocument ? (
//                           <a 
//                             href={agreementformData.agreementDocument} 
//                             target="_blank" 
//                             rel="noopener noreferrer" 
//                             className="text-blue-500 underline"
//                           >
//                             Open Agreement Document
//                           </a>
//                         ) : 'No document available'
//                       },
//                     ].map((field, idx) => (
//                       <div key={idx} className="w-full px-2">
//                         <label className="font-semibold text-gray-700 me-2">
//                           {field.label}:
//                         </label>
//                         <span className="text-gray-600">{field.value}</span>
//                       </div>
//                     ))}
//                   </div>
//                 </div>
//               )}
//             </div>
//           </div>
//         </form>
//       </section>
//     </>
//   );
//   //#endregion

// }

// export default ViewGtmServiceClient
// //#endregion
