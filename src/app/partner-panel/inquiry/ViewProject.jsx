import React, { useEffect, useState } from "react";
import { FaArrowLeft, FaEdit, FaPlus } from "react-icons/fa";
import { Link, useNavigate, useParams } from "react-router-dom";
import { motion } from "framer-motion"; // Import framer-motion
import { InquiryService } from "../../service/InquiryService";
import Chat from "./Chat";
import InquiryChat from "../../admin-panel/inquiry/InquiryChat";

import PartnerInquiryTaskList from "../inquiry-task/PartnerInquiryTaskList";
import CompanyInquiryChat from "../../company-panel/inquiry-chat/CompanyInquiryChat";
import CreateInquiryTaskList from "../inquiry-task/CreateInquiryTaskList";

const ViewProject = () => {

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
  const [inquiryRegistrationId, setInquiryRegistrationId] = useState(1);

  const { id } = useParams();
  const navigate = useNavigate();
  const role = sessionStorage.getItem("role");

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

  return (
    <>
      <div className="flex flex-wrap justify-between items-center my-3">
        <h1 className="font-semibold text-xl sm:text-2xl">View Project</h1>
        <div className="flex flex-wrap space-x-2 mt-2 sm:mt-0">
          {formData.inquiryStatus !== 3 && formData.inquiryStatus !== 4 && (
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <Link
                to={`/partner/project-list/edit-project/${id}`}
                className="bg-blue-600 hover:bg-blue-700 flex items-center gap-2 text-center text-white font-medium py-2 px-4 rounded hover:no-underline"
              >
                Edit Project
                <FaEdit size={16} />
              </Link>
            </motion.button>
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
              {activeTab === 2 && <PartnerInquiryTaskList/>} 
              {activeTab === 3 && <CreateInquiryTaskList/>} 
              {activeTab === 4 && role === "partner" && <Chat />}
              {activeTab === 4 && role === "company" && <CompanyInquiryChat />}
            </div>
          </div>
        </form>
      </section>

      {/* <PartnerInquiryChat 
      chatPersoneName={formData.senderName}
      senderId='3FA85F64-5717-4562-B3FC-2C963F66AFA6'
      inquiryId='648b3f95-6699-4e60-bb25-ec4b8ba59894' /> */}
    </>
  );
};

export default ViewProject;