//#region Import
import React, { useEffect, useState } from "react";
import { FaArrowLeft, FaEdit, FaPlus } from "react-icons/fa";
import { Link, useNavigate, useParams } from "react-router-dom";
import { motion } from "framer-motion"; // Import framer-motion
import { InquiryPermissionService } from "../../service/InquiryPermissionService";
import { InquiryService } from "../../service/InquiryService";
import { DepartmentService } from "../../service/DepartmentService";
import { EmployeeService } from "../../service/EmployeeService";
import { InquiryFollowUpService } from "../../service/InquiryFollowUpService";
import { ClientCompanyService } from "../../service/ClientCompanyService";
import { PartnerService } from "../../service/PartnerService";
// import ApprovedClientInqry from "../approved-inquiry/ApprovedClientInqry";
// import ApprovedPartnerInqry from "../approved-inquiry/ApprovedPartnerInqry";
import UserInquiryTaskList from "../user-inquiry-task/UserInquiryTaskList";
import EmpInquiryChat from "../inquiry/EmpInquiryChat";
import EmpInquiryChatCreated from "../inquiry/EmpInquiryChatCreated";
// import InquiryChat from "../inquiry/InquiryChat";
// import InquiryTaskList from "../inquiry-task/InquiryTaskList";
// import ChatInquiry from "./ChatInquiry";
//#endregion

//#region Component: UserViewTaskProject 
const UserViewTaskProject = () => {

  //#region State Variables
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

  // const [inquiryHideShow, setInquiryHideShow] = useState(false);
  const [activeTab, setActiveTab] = useState(1);
  const [inquiryHideShow, setInquiryHideShow] = useState(false);
  const [forwardPopupVisible, setForwardPopupVisible] = useState(false);
  const [transferPopupVisible, setTransferPopupVisible] = useState(false);
  const [selectedOption, setSelectedOption] = useState("")
  const [clientDropdownHideShow, setClientDropdownHideShow] = useState(false);
  const [partnerDropdownHideShow, setPartnerDropdownHideShow] = useState(false);
  const [inquiryForwadedeData, setInquiryForwadedeData] = useState(""); 
  const [inquiryTransferdData, setInquiryTransferdData] = useState("");
  

  const [departments, setDepartments] = useState([]);
  const [clients, setClients] = useState([]);
  const [partners, setPartners] = useState([]);
  const [employeeList, setEmployeeList] = useState([]);
  const [departmentId, setDepartmentId] = useState("");

  const { id } = useParams();
  const navigate = useNavigate();

  const role = sessionStorage.getItem("role");
  const userId = sessionStorage.getItem("LoginUserId");
  const [isCreatedAdmin, setIsCreatedAdmin] = useState(false);
  //#endregion

  //#region Fetch Project Data
  const fetchData = async () => {
    try {
      // Fetch Inquiry Permission
      const inquiryPermission = await InquiryPermissionService.getAccessOfInquiryInAdmin(id);
      setInquiryHideShow(inquiryPermission.data);

      // Fetch Inquiry
      const inquiry = await InquiryService.getByIdInquiry(id);
      const inquiryData = inquiry.data;
      setFormData(inquiryData);
      setIsCreatedAdmin(inquiryData.isCreatedAdmin);
    //   console.log(inquiryData);

      if (inquiryData.inquiryStatus === 4) {
        setSelectedOption("employee");
      }
      else(
        setSelectedOption("client")
      )
      // console.log(inquiry.data);

      // Fetch Client Company
      const clientCompany = await ClientCompanyService.getClientCompany();
      setClients(clientCompany.data);
      // console.log(clientCompany.data);

      // Fetch Partner 
      const partnerCompany = await PartnerService.getPartner();
      setPartners(partnerCompany.data);
      // console.log(partnerCompany.data);

      // Fetch Inquiry Permission for Client Dropdown
      const inquiryPermissionforClient = await InquiryPermissionService.accessOfGetClientInAdminEmp(id);
      setClientDropdownHideShow(inquiryPermissionforClient.data);
     
      // Fetch Inquiry Permission Partner Dropdown
      const inquiryPermissionforPartner = await InquiryPermissionService.accessOfGetPartnerInAdminEmp(id);
      setPartnerDropdownHideShow(inquiryPermissionforPartner.data);

      // Fetch Inquiry FollowUp Details
      const inquiryResult = await InquiryFollowUpService.getInquiryFollowUp(id);

      // Map over the array and extract 'inquiryTransferDetails' from each object
      const transferDetails = inquiryResult.data.map(item => item.inquiryTransferDetails);
      const forwardDetails = inquiryResult.data.map(item => item.inquiryForwardedDetais);
      setInquiryForwadedeData(forwardDetails);
      setInquiryTransferdData(transferDetails);

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
  //#endregion

  //#region Function to handle tab change
  // Function to handle tab change
  const handleTabClick = (tabIndex) => {
    setActiveTab(tabIndex);
  };
  //#endregion

  //#region Render
  return (
    <>
      {/* Header Section + Button */}
      <div className="flex flex-wrap justify-between items-center my-3">
        <h1 className="font-semibold text-xl sm:text-2xl">View Project</h1>
        <div className="flex flex-wrap space-x-2 mt-2 sm:mt-0">
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
                  "Inquiry Task",
                  "Chat",
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
              {activeTab === 1 && <UserInquiryTaskList />}
              {activeTab === 2 && (
                isCreatedAdmin ? (
                  <EmpInquiryChatCreated />
                ) : (
                  <EmpInquiryChat />
                )
              )}
            </div>
          </div>
        </form>
      </section>


      {/* Chat Component */}
      {/* <InquiryChat
        chatPersoneName={formData.senderName}
        senderId={formData.senderId}
      /> */}
    </>
  );
  //#endregion
};

export default UserViewTaskProject;
//#endregion