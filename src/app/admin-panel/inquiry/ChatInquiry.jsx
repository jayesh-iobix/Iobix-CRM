//#region Import
import React, { useState, useEffect } from "react";
import InquiryChat from "./InquiryChat";
import { InquiryService } from "../../service/InquiryService";
import { InquiryChatService } from "../../service/InquiryChatService";
import { motion } from "framer-motion"; // Import framer-motion
import { FaEye } from "react-icons/fa";
import { Link } from "react-router-dom";
import { InquiryFollowUpService } from "../../service/InquiryFollowUpService";
//#endregion

//#region Component: ChatInquiry
const ChatInquiry = () => {

  //#region State Initialization
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
    senderName:'',
    senderId:'',
  });
  const [inquiryForwadedeData, setInquiryForwadedeData] = useState(""); 
  const [inquiryTransferdData, setInquiryTransferdData] = useState("");
  const [isViewInquiryPopUp, setIsViewInquiryPopUp] = useState(false);
  // const [viewInquiryId, setViewInquiryId] = useState(""); // State for the selected inquiry
  const [inquiryFilter, setInquiryFilter] = useState(""); // Filter for inquiry category
  const [partnerClientEmployeeList, setPartnerClientEmployeeList] = useState([]); // State for second dropdown
  const [selectedPerson, setSelectedPerson] = useState(null); // State for the selected partner/client/employee
  const [selectedPersonName, setSelectedPersonName] = useState(null); // State for the selected partner/client/employee NAme
  const [selectedPersonId, setSelectedPersonId] = useState(null); // State for the selected partner/client/employee Id
  const [inquiries, setInquiries] = useState([]); // State for storing inquiries
  const [selectedInquiry, setSelectedInquiry] = useState(null); // State for the selected inquiry
  //#endregion

  //#region Fetch Inquiry Data
  const fetchData = async (id) => {
    try {

      // Fetch Inquiry
      const inquiry = await InquiryService.getByIdInquiry(id);
      setFormData(inquiry.data);

      // Fetch Inquiry FollowUp Details
      const inquiryResult = await InquiryFollowUpService.getInquiryFollowUp(id);

      // Map over the array and extract 'inquiryTransferDetails' from each object
      const transferDetails = inquiryResult.data.map(item => item.inquiryTransferDetails);
      const forwardDetails = inquiryResult.data.map(item => item.inquiryForwardedDetais);
      setInquiryForwadedeData(forwardDetails);
      setInquiryTransferdData(transferDetails);

    } catch (error) {
      console.error("Error fetching data:", error);
      alert("Error fetching data, please try again.");
    }
  };
  //#endregion

  //#region Fetch Inquiry List
  const handleIsViewInquiryPopUp = (inquiryRegistrationId) => {
    // setDeleteId(designationId);
    fetchData(inquiryRegistrationId);
    setIsViewInquiryPopUp(true); // Open popup
  };

  const handleInquiryFilterChange = (event) => {
    const selectedInquiryType = event.target.value;
    setInquiryFilter(selectedInquiryType);
    setSelectedPerson(null); // Reset selected person when inquiry type changes
    setInquiries([]); // Clear inquiries on inquiry type change
    
    const fetchInquiries = async () => {
      try {
        const response = await InquiryChatService.getPartnerClientEmployeeList(selectedInquiryType);
        // console.log(response.data);
        // Store the response data (assuming it's an array of objects containing 'name' and 'userId')
        setPartnerClientEmployeeList(response.data); // Update the list with full person objects
      } catch (error) {
        console.error("Error fetching inquiries:", error);
      }
    };

    fetchInquiries();
  };
  //#endregion

  //#region Person Select
  const handlePersonSelect = async (person) => {

    setSelectedPerson(person);

    // Extract userId from the selected person object
    const selectedUserId = person.userId;
    const selectedUserName = person.name;

    setSelectedPersonId(selectedUserId);
    setSelectedPersonName(selectedUserName);
    // console.log(selectedPersonName);

    // Check if an inquiry type is selected
    if (!inquiryFilter) {
      console.error("Please select an inquiry type.");
      return; // Optionally show an error message if inquiry type is not selected
    }

    // Now pass the userId to the backend to fetch inquiries
    const fetchInquiriesForSender = async () => {
      try {
        const response = await InquiryChatService.getPartnerClientEmployeeInquiry(inquiryFilter,selectedUserId); // Pass userId here
        console.log(response.data);  // Assuming the response contains the inquiries of the selected person
        setInquiries(response.data);  // Set inquiries in the state
      } catch (error) {
        console.error("Error fetching inquiries:", error);
      }
    };

    fetchInquiriesForSender();
  };
  //#endregion

  //#region Inquiry Select
  const handleInquirySelect = (inquiry) => {
    setSelectedInquiry(inquiry);
    // setId(inquiry.inquiryRegistrationId);
  };
  //#endregion

  //#region render
  return (
    <div className="mt-4">
      {/* Header Section */}
      <div className="flex justify-between items-center my-3">
        <h1 className="font-semibold text-2xl sm:text-3xl">Inquiry Chat</h1>
      </div>

      {/* Card for Inquiry Type and Partner/Client/Employee Dropdown */}
      <div className="bg-white shadow-lg rounded-lg p-4">
        <div className="-mx-4 px-10 flex flex-wrap">
          {/* Inquiry Type Dropdown */}
          <div className="w-full mb-2 px-3 md:w-1/2 lg:w-1/2">
            <label htmlFor="inquiryType" className="mr-2">
              Select Type of Inquiry:
            </label>
            <select
              value={inquiryFilter}
              onChange={handleInquiryFilterChange}
              className="w-full relative sm:w-1/2 border p-2 rounded border-active"
            >
              <option value="">--Select Inquiry Type--</option>
              <option value="createdByPartner">Created By Partner</option>
              <option value="createdByClient">Created By Client</option>
              <option value="forwardedToPartner">Forwarded To Partner</option>
              <option value="forwardedToClient">Forwarded To Client</option>
              <option value="createdForPartner">Created For Partner</option>
              <option value="createdForClient">Created For Client</option>
              <option value="forwardedToEmployee">Forwarded to Employee</option>
            </select>
          </div>

          {/* Partner/Client/Employee Dropdown */}
          {inquiryFilter && (
            <div className="w-full mb-2 px-3 md:w-1/2 lg:w-1/2">
              <label htmlFor="partnerClientEmployee" className="mr-2">
                Select{" "}
                {inquiryFilter.includes("Partner")
                  ? "Partner"
                  : inquiryFilter.includes("Client")
                  ? "Client"
                  : "Employee"}
                :
              </label>
              <select
                className="w-full relative sm:w-1/2 border p-2 rounded border-active"
                value={selectedPerson ? selectedPerson.name : ""}
                onChange={(e) => {
                  const selectedPerson = partnerClientEmployeeList.find(
                    (person) => person.name === e.target.value
                  );
                  handlePersonSelect(selectedPerson);
                }}
              >
                <option value="">
                  --Select{" "}
                  {inquiryFilter.includes("Partner")
                    ? "Partner"
                    : inquiryFilter.includes("Client")
                    ? "Client"
                    : "Employee"}
                  --
                </option>
                {partnerClientEmployeeList.map((person, index) => (
                  <option key={index} value={person.name}>
                    {person.name}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>
      </div>

      {/* Layout for Inquiries and Chat */}
      <div className="flex mt-6">
        {/* Left side: List of inquiries */}
        <div className="w-1/3 bg-white p-4 border-r">
          <h2 className="font-semibold mb-2">Inquiries</h2>
          {inquiries.map((inquiry) => (
            <div
              key={inquiry.inquiryRegistrationId}
              className="flex justify-between"
            >
              <div
                // key={inquiry.inquiryRegistrationId}
                onClick={() => handleInquirySelect(inquiry)}
                className="cursor-pointer item-center w-full p-2 border-b"
              >
                {inquiry.inquiryTitle}
              </div>

              <div className="mt-2">
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() =>
                    handleIsViewInquiryPopUp(inquiry.inquiryRegistrationId)
                  }
                  className="text-green-500 hover:text-green-700"
                >
                  <FaEye size={24} />
                </motion.button>
              </div>
            </div>
          ))}
        </div>

        {/* Right side: Chat */}
        <div className="w-2/3 p-4">
          {selectedInquiry ? (
            <div>
              <h2 className="font-semibold mb-2">
                Chat for {selectedInquiry.inquiryTitle}
              </h2>
              <InquiryChat
                senderId={selectedPersonId}
                chatPersoneName={selectedPersonName}
                inquiryId={selectedInquiry.inquiryRegistrationId}
              />
            </div>
          ) : (
            <p>Please select an inquiry to start the chat.</p>
          )}
        </div>
      </div>

      {/* View Inquiry Details Popup */}
      {isViewInquiryPopUp && (
        <div className="fixed inset-0 flex justify-center items-center bg-gray-600 bg-opacity-50 z-50">
          <div className="bg-white p-3 rounded-lg shadow-lg max-w-[90%] sm:max-w-[90%] md:max-w-[90%] lg:max-w-[90%] xl:max-w-[90%] w-full h-auto max-h-[80vh] overflow-auto relative">
            {/* Close button at the top-right */}
            <button
              onClick={() => setIsViewInquiryPopUp(false)} // This assumes you have a state like this to toggle the popup
              className="absolute me-3 top-2 right-2 text-5xl text-red-500 hover:text-red-700"
            >
              &times; {/* This is the "X" symbol */}
            </button>

            <section className="m-1 p-4 sm:p-8">
              <form className="container mb-6">
                <div className="md:px-2 lg:px-2 px-7">
                  <div className="mt-3">
                    <div
                      id="card-type-tab-preview"
                      role="tabpanel"
                      className="mt-7"
                      aria-labelledby="card-type-tab-item-1"
                    >
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {[
                          {
                            label: "Inquiry Title",
                            name: "inquiryTitle",
                            value: formData.inquiryTitle,
                          },
                          {
                            label: "Inquiry Location",
                            name: "inquiryLocation",
                            value: formData.inquiryLocation,
                          },
                          {
                            label: "Inquiry Type",
                            name: "inquiryTypeName",
                            value: formData.inquiryTypeName,
                          },
                          {
                            label: "Inquiry Source",
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
                          {
                            label: "Inquiry Document",
                            name: "inquiryDocuments",
                            value: formData.inquiryDocuments,
                          },
                          {
                            label: "Inquiry Description",
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
                            label: "Inquiry Status",
                            name: "inquiryStatusName",
                            value: formData.inquiryStatusName,
                          },
                        ].map((field, idx) => (
                          <div key={idx} className="w-full px-2">
                            <label className="font-semibold text-gray-700 me-2">
                              {field.label}:
                            </label>
                            {/* If the field is "inquiryDocuments", make it clickable */}
                            {field.name === "inquiryDocuments" ? (
                              <a
                                href={field.value} // Assuming field.value is the document URL or path
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-500 hover:text-blue-700"
                              >
                                Open Document
                              </a>
                            ) : (
                              <span className="text-gray-600">
                                {field.value}
                              </span>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </form>
              <hr style={{ borderTop: "1px solid #aaa" }} />
              <div className="md:px-2 lg:px-2 px-7 mt-6">
                <div className="flex">
                  <div className="text-base me-2 text-l">
                    Inquiry Forwarded:
                  </div>
                  <div className="text-red-500">
                    {inquiryForwadedeData && inquiryForwadedeData.length > 0 ? (
                      inquiryForwadedeData.map((data, index) => (
                        <div key={index}>{data}</div> // Each item will be rendered in a new line
                      ))
                    ) : (
                      <span>No data available</span> // Fallback if there's no data
                    )}
                  </div>
                </div>
              </div>
              <div className="md:px-2 lg:px-2 px-7">
                <div className="flex">
                  <div className="text-base me-2 text-l">
                    Inquiry Transferred:
                  </div>
                  <div className="text-red-500">
                    {inquiryTransferdData && inquiryTransferdData.length > 0 ? (
                      inquiryTransferdData.map((data, index) => (
                        <div key={index}>{data}</div> // Each item will be rendered in a new line
                      ))
                    ) : (
                      <span>No data available</span> // Fallback if there's no data
                    )}
                  </div>
                </div>
              </div>
            </section>
          </div>
        </div>
      )}
    </div>
  );
  //#endregion
};

export default ChatInquiry;
//#endregion
