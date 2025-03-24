import React, { useEffect, useState } from "react";
import { FaArrowLeft, FaEdit, FaPlus } from "react-icons/fa";
import { Link, useNavigate, useParams } from "react-router-dom";
import { motion } from "framer-motion"; // Import framer-motion
import { InquiryService } from "../../service/InquiryService";
import { toast } from "react-toastify";
import { InquiryApproveRejectService } from "../../service/InquiryApproveRejectService";
import Chat from "./Chat";
import CompanyInquiryChat from "../../company-panel/inquiry-chat/CompanyInquiryChat";
import PartnerInquiryList from "../../admin-panel/partner-inquiry/PartnerInquiryList";
import PartnerInquiryTaskList from "../inquiry-task/PartnerInquiryTaskList";
import CreateInquiryTaskList from "../inquiry-task/CreateInquiryTaskList";

const GetViewInquiry = () => {

  const [formData, setFormData] = useState({
    inquiryTitle: '',
    inquiryLocation: '',
    inquiryTypeId: '',
    inquiryTypeName: '',
    inquirySourceId: '',
    inquirySourceName: '',
    customerName: '',
    customerContactInfo: '',
    estimatedValue: '',
    inquiryDescription: '',
    priorityLevel: '',
    priorityLevelName: '',
    inquiryStatus: '',
    inquiryStatusName: '',
    specialNotes: '',  // Replaced reasonForClosure with specialNotes
    inquiryDocuments: '', // Store file here
    reasonForClosure: '', 
  });

  const [activeTab, setActiveTab] = useState(1);
  const role = sessionStorage.getItem("role");
  
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch Inquiry
        const inquiry = await InquiryService.getByIdInquiry(id);
        // const formattedClientCompany = {
        //   ...clientCompany.data,
        //   birthDate: clientCompany.data.birthDate ? clientCompany.data.birthDate.split("T")[0] : "",
        //   dateOfJoining: clientCompany.data.dateOfJoining ? clientCompany.data.dateOfJoining.split("T")[0] : "",
        // };
        setFormData(inquiry.data);
        // setFormData(formattedClientCompany);
        // console.log(inquiry)

      } catch (error) {
        console.error("Error fetching data:", error);
        alert("Error fetching data, please try again.");
      }
    };

    fetchData();
  }, [id]);

  // Function to handle tab change
  const handleTabClick = (tabIndex) => {
    setActiveTab(tabIndex);
  };

   const handleApproveReject = async (status) => {
      // Add your approval logic here
  
      // debugger;
      const inquiryApproveRejectData = {
        inquiryRegistrationId: id,
        clientApprovedReject: role === 'company' ? status : null,  // Store status if the role is 'client'
        partnerApprovedReject: role === 'partner' ? status : null, // Store status if the role is 'partner'
        // clientApprovedReject : status,
        // partnerApprovedReject: status,
      };
      try {
        // Call the API to add the task note
        const response = await InquiryApproveRejectService.addInquiryApproveReject(inquiryApproveRejectData);
        if (response.status === 1 || response.status === 3 ) {
          toast.success(response.message); // Toast on success
          // fetchInquiries();
        }
        else if (response.status === 2 || response.status === 4 || response.status === 5 || response.status === 6) {
          toast.error(response.message); // Toast on success
          // fetchInquiries();
        }
        else {
          toast.error(response.message); // Toast on error
        }
  
      } catch (error) {
        console.error(
          "Error:",
          error.response?.data || error.message
        );
        if (error.response?.data?.errors) {
          console.log("Validation Errors:", error.response.data.errors); // This will help pinpoint specific fields causing the issue
        }
      }
   };
    
  return (
    <>
      <div className="flex flex-wrap justify-between items-center my-3">
        <h1 className="font-semibold text-xl sm:text-2xl">View Project</h1>
        <div className="flex flex-wrap space-x-2 mt-2 sm:mt-0">

          {formData.inquiryStatus !== 4 && (
            <>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => handleApproveReject(1)} // Replace with your actual function for approval
                className="bg-green-600 hover:bg-green-700 flex items-center gap-2 text-center text-white font-medium py-2 px-4 rounded hover:no-underline"
              >
                Accept Project
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => handleApproveReject(2)} // Replace with your actual function for rejection
                className="bg-red-600
               hover:bg-red-700 flex items-center gap-2 text-center text-white font-medium py-2 px-4 rounded hover:no-underline"
              >
                Reject Project
              </motion.button>
            </>
          )}

          {(formData.inquiryStatus === 4) && (
              <>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <Link
                to={
                  role === 'partner'
                    ? `/partner/partnerinquiry-task-list/create-inquiry-task/${id}`
                    : role === 'company'
                    ? `/company/companyinquiry-list/create-inquiry-task/${id}`
                    : null
                }
                className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded flex items-center gap-2 hover:no-underline"
              >
              {/* <Link
                to={`/partnerinquiry-list/create-inquiry-task/${id}`}
                className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded flex items-center gap-2 hover:no-underline"
              > */}
                Add Inquiry Task
                <FaPlus size={16} />
              </Link>
            </motion.button>
            </>
            
          )}

          {/* <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
            <Link
              to={/inquiry-list/edit-inquiry/${id}}
              className="bg-blue-600 hover:bg-blue-700 flex items-center gap-2 text-center text-white font-medium py-2 px-4 rounded hover:no-underline"
            >
              Edit Inquiry
              <FaEdit size={16} /> 
            </Link>
          </motion.button> */}
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
                  "Project Details",
                  "Inquiry Task",
                  "Create Inquiry Task",
                  "Chat",
                  //   "Leave List",
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
                        label: "Project Title",
                        name: "inquiryTitle",
                        value: formData.inquiryTitle,
                      },
                      {
                        label: "Project Location",
                        name: "inquiryLocation",
                        value: formData.inquiryLocation,
                      },
                      {
                        label: "Project Type",
                        name: "inquiryTypeName",
                        value: formData.inquiryTypeName,
                      },
                      {
                        label: "Project Source",
                        name: "inquirySourceName",
                        value: formData.inquirySourceName,
                      },
                      {
                        label: "Customer Name",
                        name: "customerName",
                        value: formData.customerName,
                      },
                      {
                        label: "Customer Contact Info",
                        name: "customerContactInfo",
                        value: formData.customerContactInfo,
                      },
                      {
                        label: "Estimated Value",
                        name: "estimatedValue",
                        value: formData.estimatedValue,
                      },
                      {
                        label: "Priority Level",
                        name: "priorityLevelName",
                        value: formData.priorityLevelName,
                      },
                      // {
                      //   label: "Project Document",
                      //   name: "inquiryDocuments",
                      //   value: formData.inquiryDocuments,
                      // },
                      {
                        label: "Project Description",
                        name: "inquiryDescription",
                        value: formData.inquiryDescription,
                      },
                      {
                        label: "Special Notes",
                        name: "specialNotes",
                        value: formData.specialNotes,
                      },
                      {
                        label: "Reason For Closure",
                        name: "reasonForClosure",
                        value: formData.reasonForClosure,
                      },
                      {
                        label: "Project Status",
                        name: "inquiryStatusName",
                        value: formData.inquiryStatusName,
                      },
                      // { label: "Key Responsibility", name: "keyResponsibility", value: formData.keyResponsibility },
                    ].map((field, idx) => (
                      <div key={idx} className="w-full px-2">
                        <label className="font-semibold text-gray-700 me-2">
                          {field.label}:
                        </label>
                        <span className="text-gray-600">{field.value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              {activeTab === 2 && <PartnerInquiryTaskList />}
              {activeTab === 3 && <CreateInquiryTaskList/>} 
              {activeTab === 4 && role === "partner" && <Chat />}
              {activeTab === 4 && role === "company" && <CompanyInquiryChat />}
              {/* {activeTab === 3 && "Leave List"}  */}
            </div>
          </div>
        </form>
      </section>
    </>
  );
};

export default GetViewInquiry;
