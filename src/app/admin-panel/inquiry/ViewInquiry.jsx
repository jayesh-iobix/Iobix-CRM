import React, { useEffect, useState } from "react";
import { FaArrowLeft, FaEdit } from "react-icons/fa";
import { Link, useNavigate, useParams } from "react-router-dom";
import { motion } from "framer-motion"; // Import framer-motion
import { InquiryService } from "../../service/InquiryService";
import { DepartmentService } from "../../service/DepartmentService";
import { EmployeeService } from "../../service/EmployeeService";
import { InquiryFollowUpService } from "../../service/InquiryFollowUpService";
import { toast } from "react-toastify";
import { InquiryPermissionService } from "../../service/InquiryPermissionService";
import { ClientCompanyService } from "../../service/ClientCompanyService";
import ApprovedPartnerInqry from "../approved-inquiry/ApprovedPartnerInqry";
import ApprovedClientInqry from "../approved-inquiry/ApprovedClientInqry";

const ViewInquiry = () => {

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

  // const [inquiryHideShow, setInquiryHideShow] = useState(false);
  const [activeTab, setActiveTab] = useState(1);
  const [inquiryHideShow, setInquiryHideShow] = useState(false);
  const [forwardPopupVisible, setForwardPopupVisible] = useState(false);
  const [transferPopupVisible, setTransferPopupVisible] = useState(false);
  const [selectedOption, setSelectedOption] = useState('employee')

  const [departments, setDepartments] = useState([]);
  const [clients, setClients] = useState([]);
  const [employeeList, setEmployeeList] = useState([]);
  const [clientId, setClientId] = useState("");
  const [departmentId, setDepartmentId] = useState("");
  const [inquiryForwardedTo, setInquiryForwardedTo] = useState("");  
  const [inquiryTransferTo, setInquiryTransferTo] = useState("");  
  const [inquiryFollowUpDescription, setInquiryFollowUpDescription] = useState(""); 

  const { id } = useParams();
  const navigate = useNavigate();

  const role = sessionStorage.getItem("role");

  const fetchData = async () => {
    try {
      // Fetch Inquiry Permission
      const inquiryPermission = await InquiryPermissionService.getAccessOfInquiryInAdmin(id);
      setInquiryHideShow(inquiryPermission.data);

      // Fetch Inquiry
      const inquiry = await InquiryService.getByIdInquiry(id);
      setFormData(inquiry.data);

      // Fetch Client Company
      const clientCompany = await ClientCompanyService.getClientCompany();
      setClients(clientCompany.data);
      console.log(clientCompany.data);

      // const inquiryToggle = await InquiryFollowUpService.hideInquirybutton(id);
      // debugger;
      // setInquiryHideShow(inquiryToggle.data);

      const departmentResult = await DepartmentService.getDepartments();
      setDepartments(departmentResult.data); // Set the 'data' array to the state\
      // console.log(departmentId);
      if (departmentId) {
        // debugger;
        const employeeResult = await EmployeeService.getEmployeeByDepartment(
          departmentId
        );
        setEmployeeList(employeeResult.data);
      }

    } catch (error) {
      console.error("Error fetching data:", error);
      alert("Error fetching data, please try again.");
    }
  };

  useEffect(() => {
    fetchData();
  }, [id, departmentId]);

  // Function to handle tab change
  const handleTabClick = (tabIndex) => {
    setActiveTab(tabIndex);
  };

  const handleTakeInquiry = async () => {

    // debugger;

    try {
      // debugger;
      // Call the API to add the task note
      const response = await InquiryService.takeInquiry(id);
      if (response.status === 1) {
        toast.success("Inquiry has Taken Successfully."); // Toast on success
        // toast.success(response.message); // Toast on success
        fetchData();
      }
      if (response.status === 2) {
        toast.error("Inquiry has already Taken."); // Toast on success
        // toast.success(response.message); // Toast on success
        // fetchData();
      }
      // console.log("Inquiry has Taken successfully:", response);

      // Optionally, you can update the task state or show a success message here
    } catch (error) {
      console.error(
        "Error taking inquiry:",
        error.response?.data || error.message
      );
      if (error.response?.data?.errors) {
        console.log("Validation Errors:", error.response.data.errors); // This will help pinpoint specific fields causing the issue
      }
    }

    // Close the popup after submission
    // setIsPopupVisible(false);
  };

  // Function to handle opening the popup and setting the current task
  // const handleTransferInquiry = (inquiry) => {
  //   setInquiryRegistrationId(inquiry.inquiryRegistrationId); // Set the selected task data
  //   setTransferPopupVisible(true); // Show the popup
  // };

  //Function to forward submit the api
  const handleInquirySubmit = async (event) => {
    event.preventDefault();

    debugger;

    const inquiryData = {
      inquiryRegistrationId: id,
      inquiryForwardedTo: 
      (inquiryForwardedTo === "" && clientId !== "") ? clientId : 
      (clientId === "" && inquiryForwardedTo !== "") ? inquiryForwardedTo : 
      (inquiryForwardedTo === "" && clientId === "" ? null : inquiryForwardedTo),
      // inquiryForwardedTo: inquiryForwardedTo === "" ? null : inquiryForwardedTo,
      inquiryFollowUpDescription,
      inquiryTransferTo: null
      // inquiryTransferTo: inquiryTransferTo === "" ? null : inquiryTransferTo,
      // taskTransferTo,
    };

    //console.log("Submitting task transfer data:", taskTransferData); // Log the data before submitting

    try {
      // Call the API to add the task note
      const response = await InquiryFollowUpService.addInquiryFollowUp(inquiryData);
      if (response.status === 1) {
         toast.success("Inquiry Forwarded Successfully."); // Toast on success
        // if(inquiryForwardedTo === null || "") {
        //   toast.success("Inquiry Transfer Successfully."); // Toast on success
        // }
        // toast.success(response.message); // Toast on success
        // fetchInquiries();
        setInquiryFollowUpDescription("");
        setInquiryForwardedTo("");
        setInquiryTransferTo("");
        setDepartmentId("")
      } 
      else {
        setInquiryFollowUpDescription("");
        setInquiryForwardedTo("");
        setInquiryTransferTo("");
        setDepartmentId("")
      }
      // console.log("task transfer added successfully:", response);

      // Optionally, you can update the task state or show a success message here
      setForwardPopupVisible(false); // Close the popup
      setTransferPopupVisible(false); // Close the popup
    } catch (error) {
      console.error(
        "Error forwarding a inquiry:",
        error.response?.data || error.message
      );
      if (error.response?.data?.errors) {
        console.log("Validation Errors:", error.response.data.errors); // This will help pinpoint specific fields causing the issue
      }
    }
  
      // Close the popup after submission
      // setIsPopupVisible(false);
  };

  //Function to transfer submit the api
  const handleTransferInquirySubmit = async (event) => {
    event.preventDefault();

    debugger;

    const inquiryData = {
      inquiryRegistrationId: id,
      inquiryForwardedTo:null,
      // inquiryForwardedTo: inquiryForwardedTo === "" ? null : inquiryForwardedTo,
      inquiryFollowUpDescription,
      inquiryTransferTo,
    };

    //console.log("Submitting task transfer data:", taskTransferData); // Log the data before submitting

    try {
      // Call the API to add the task note
      const response = await InquiryFollowUpService.addInquiryFollowUp(inquiryData);
      if (response.status === 1) {
          toast.success("Inquiry Transfer Successfully."); // Toast on success
        // toast.success(response.message); // Toast on success
        // fetchInquiries();
        setInquiryFollowUpDescription("");
        setInquiryForwardedTo("");
        setInquiryTransferTo("");
        setDepartmentId("")
      } 
      else {
        setInquiryFollowUpDescription("");
        setInquiryForwardedTo("");
        setInquiryTransferTo("");
        setDepartmentId("")
      }
      // console.log("task transfer added successfully:", response);

      // Optionally, you can update the task state or show a success message here
      setForwardPopupVisible(false); // Close the popup
      setTransferPopupVisible(false); // Close the popup
    } catch (error) {
      console.error(
        "Error transfering a inquiry:",
        error.response?.data || error.message
      );
      if (error.response?.data?.errors) {
        console.log("Validation Errors:", error.response.data.errors); // This will help pinpoint specific fields causing the issue
      }
    }
  
      // Close the popup after submission
      // setIsPopupVisible(false);
  };

  // const handleForwardSubmit = async (event) => {
  //   event.preventDefault();

  //   // debugger;

  //   const inquiryForwardData = {
  //     inquiryRegistrationId: id,
  //     inquiryForwardedTo,
  //     inquiryFollowUpDescription,
  //     // taskTransferTo,
  //   };
  //   //console.log("Submitting task transfer data:", taskTransferData); // Log the data before submitting

  //   try {
  //     // Call the API to add the task note
  //     const response = await InquiryFollowUpService.addInquiryFollowUp(
  //       inquiryForwardData
  //     );
  //     if (response.status === 1) {
  //       toast.success("Inquiry Forwarded Successfully."); // Toast on success
  //       // toast.success(response.message); // Toast on success
  //       fetchData();
  //     }
  //     console.log("Inquiry Forwarded Successfully:", response);

  //     // Optionally, you can update the task state or show a success message here
  //     setForwardPopupVisible(false); // Close the popup
  //   } catch (error) {
  //     console.error(
  //       "Error forwarding inquiry:",
  //       error.response?.data || error.message
  //     );
  //     if (error.response?.data?.errors) {
  //       console.log("Validation Errors:", error.response.data.errors); // This will help pinpoint specific fields causing the issue
  //     }
  //   }

  //   // Close the popup after submission
  //   // setIsPopupVisible(false);
  // };

  return (
    <>
      <div className="flex flex-wrap justify-between items-center my-3">
        <h1 className="font-semibold text-xl sm:text-2xl">View Inquiry</h1>
        <div className="flex flex-wrap space-x-2 mt-2 sm:mt-0">
          {/* Forward Inquiry Button placed above the edit and back buttons */}
          <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
            <button
              onClick={() => setForwardPopupVisible(true)} // Show the popup
              className="bg-yellow-500 hover:bg-yellow-600 flex items-center gap-2 text-center text-white font-medium py-2 px-4 rounded hover:no-underline"
            >
              Forward Inquiry
            </button>
          </motion.button>

          {inquiryHideShow === true && (
            <>
              {/* Trabsfer Inquiry Button placed above the edit and back buttons  */}
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                type="button"
                onClick={() => setTransferPopupVisible(true)} // Show the popup
                className="bg-orange-600 hover:bg-orange-700 flex items-center gap-2 text-center text-white font-medium py-2 px-4 rounded hover:no-underline"
              >
                Transfer Inquiry
              </motion.button>

              {/* Take Inquiry Button placed above the edit and back buttons */}
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                type="button"
                onClick={handleTakeInquiry}
                className="bg-green-600 hover:bg-green-700 flex items-center gap-2 text-center text-white font-medium py-2 px-4 rounded hover:no-underline"
              >
                Take Inquiry
              </motion.button>

              {/* Edit Inquiry */}
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <Link
                  to={`/inquiry-list/edit-inquiry/${id}`}
                  className="bg-blue-600 hover:bg-blue-700 flex items-center gap-2 text-center text-white font-medium py-2 px-4 rounded hover:no-underline"
                >
                  Edit Inquiry
                  <FaEdit size={16} />
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

      {/* Forward Inquiry Popup */}
      {forwardPopupVisible && (
        <div className="fixed inset-0 bg-gray-700 bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg md:w-1/3 xl:w-1/3">
            <h2 className="text-xl font-semibold mb-4">Forward Inquiry</h2>

            <form>
              {/* Radio buttons for selecting Client or Employee */}
              <div className="mb-4 flex gap-4">
                
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="selectionOption"
                    value="employee"
                    checked={selectedOption === "employee"}
                    onChange={() => setSelectedOption("employee")}
                    className="mr-2"
                  />
                  Select Employee
                </label>

                {inquiryHideShow === true && (
                  <>
                  <label className="flex items-center">
                  <input
                    type="radio"
                    name="selectionOption"
                    value="client"
                    checked={selectedOption === "client"}
                    onChange={() => setSelectedOption("client")}
                    className="mr-2"
                  />
                  Select Client
                </label>
                  </>)}
              </div>

              {/* Client selection (visible when "Client" is selected) */}
              {selectedOption === "client" && (
                <>
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700">
                      Select Client
                    </label>
                    <select
                      value={clientId}
                      onChange={(e) => setClientId(e.target.value)}
                      className="w-full mt-1 px-3 py-2 rounded-md border border-active"
                    >
                      <option value="">--Select Client--</option>
                      {clients.map((client) => (
                        <option key={client.clientRegistrationId} value={client.clientRegistrationId}>
                          {client.companyName}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Description Field */}
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700">
                      FollowUp Description
                    </label>
                    <textarea
                      value={inquiryFollowUpDescription}
                      onChange={(e) =>
                        setInquiryFollowUpDescription(e.target.value)
                      }
                      className="w-full mt-1 px-3 py-2 rounded-md border border-active"
                      rows="4"
                    />
                  </div>
                </>
              )}

              {/* Employee selection (visible when "Employee" is selected) */}
              {selectedOption === "employee" && (
                <>
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700">
                      Select Department
                    </label>
                    <select
                      value={departmentId}
                      onChange={(e) => setDepartmentId(e.target.value)}
                      className="w-full mt-1 px-3 py-2 rounded-md border border-active"
                    >
                      <option value="">--Select Department--</option>
                      {departments.map((department) => (
                        <option
                          key={department.departmentId}
                          value={department.departmentId}
                        >
                          {department.departmentName}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700">
                      Forward to:
                    </label>
                    <select
                      value={inquiryForwardedTo}
                      onChange={(e) => setInquiryForwardedTo(e.target.value)}
                      className="w-full mt-1 px-3 py-2 rounded-md border border-active"
                    >
                      <option value="">--Select Employee--</option>
                      {employeeList.map((employee) => (
                        <option
                          key={employee.employeeId}
                          value={employee.employeeId}
                        >
                          {employee.firstName + " " + employee.lastName}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Description Field */}
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700">
                      FollowUp Description
                    </label>
                    <textarea
                      value={inquiryFollowUpDescription}
                      onChange={(e) =>
                        setInquiryFollowUpDescription(e.target.value)
                      }
                      className="w-full mt-1 px-3 py-2 rounded-md border border-active"
                      rows="4"
                    />
                  </div>
                </>
              )}

              <div className="flex flex-col md:flex-row justify-end gap-4">
                <button
                  type="button"
                  onClick={() => setForwardPopupVisible(false)}
                  className="px-7 py-2 bg-gray-300 text-black rounded border-active"
                >
                  Cancel
                </button>
                <button
                  onClick={handleInquirySubmit}
                  className="px-4 py-2 bg-blue-500 text-white rounded border-active"
                >
                  Forward
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Transfer Inquiry Popup */}
      {transferPopupVisible && (
        <div className="fixed inset-0 bg-gray-700 bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg md:w-1/3 xl:w-1/3">
            <h2 className="text-xl font-semibold mb-4">Transfer Inquiry</h2>
            <form>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">
                  Select Department
                </label>
                <select
                  value={departmentId}
                  onChange={(e) => setDepartmentId(e.target.value)}
                  className="w-full mt-1 px-3 py-2 rounded-md border border-active"
                >
                  <option value="">--Select Department--</option>
                  {departments.map((department) => (
                    <option
                      key={department.departmentId}
                      value={department.departmentId}
                    >
                      {department.departmentName}
                    </option>
                  ))}
                </select>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">
                  Trafser to:
                </label>

                <select
                  value={inquiryTransferTo}
                  onChange={(e) => setInquiryTransferTo(e.target.value)}
                  className="w-full mt-1 px-3 py-2 rounded-md border border-active"
                >
                  <option value="">--Select Employee--</option>
                  {employeeList.map((employee) => (
                    <option
                      key={employee.employeeId}
                      value={employee.employeeId}
                    >
                      {employee.firstName + " " + employee.lastName}
                    </option>
                  ))}
                </select>
              </div>

              {/* Description Field */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">
                  Transfer Reason
                </label>
                <textarea
                  value={inquiryFollowUpDescription}
                  onChange={(e) =>
                    setInquiryFollowUpDescription(e.target.value)
                  }
                  className="w-full mt-1 px-3 py-2 rounded-md border border-active"
                  rows="4"
                />
              </div>

              <div className="flex flex-col md:flex-row justify-end gap-4">
                <button
                  type="button"
                  onClick={() => setTransferPopupVisible(false)}
                  className="px-7 py-2 bg-gray-300 text-black rounded border-active"
                >
                  Cancel
                </button>
                <button
                  onClick={handleTransferInquirySubmit}
                  className="px-4 py-2 bg-blue-500 text-white rounded border-active"
                >
                  Transfer
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

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
                  "Partner Details",
                  "Approved Inquiry By Partner",
                  "Approved Inquiry By Client",
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

              {activeTab === 2 && <ApprovedPartnerInqry/>}
              {activeTab === 3 && <ApprovedClientInqry/>}
              {/* {activeTab === 3 && "Leave List"}  */}
            </div>
          </div>
        </form>
      </section>
    </>
  );
};

export default ViewInquiry;