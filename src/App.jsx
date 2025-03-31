import './App.css';
import { Route, Routes, Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { generateToken, messaging } from './firebase/firebase';
import { onMessage } from 'firebase/messaging';
import 'react-toastify/dist/ReactToastify.css';  // Don't forget to import the CSS
import { jwtDecode } from 'jwt-decode';
import { RingLoader } from 'react-spinners';
import SignIn from './app/auth/SignIn';
import ForgotPassword from './app/auth/ForgotPassword';
import ResetPassowrd from './app/auth/ResetPassword';
import EmployeeList from './app/admin-panel/employee/EmployeeList';
import AddEmployee from './app/admin-panel/employee/AddEmployee';
import Dashboard from './app/admin-panel/dashboard/Dashboard';
import Layout from './app/components/Layout';
import AddDepartment from './app/admin-panel/master/department/AddDepartment';
import DesignationList from './app/admin-panel/master/designation/DesignationList';
import AddDesignation from './app/admin-panel/master/designation/AddDesignation';
// import SignIn from './app/admin-panel/auth/SignIn';
import EditDepartment from './app/admin-panel/master/department/EditDepartment';
import EditDesignation from './app/admin-panel/master/designation/EditDesignation';
import EditEmployee from './app/admin-panel/employee/EditEmployee';
import UserDashboard from './app/user-panel/dashboard/UserDashboard';
import TaskList from './app/admin-panel/task/task/TaskList';
import CreateTask from './app/admin-panel/task/task/CreateTask';
import EditTask from './app/admin-panel/task/task/EditTask';
import DepartmentList from './app/admin-panel/master/department/DepartmentList';
import AddEmployeePermission from './app/admin-panel/master/employee-permission/AddEmployeePermission';
import EmployeePermissionList from './app/admin-panel/master/employee-permission/EmployeePermissionList';
import EditEmployeePermission from './app/admin-panel/master/employee-permission/EditEmployeePermission';
import CreateSubTask from './app/admin-panel/task/sub-task/CreateSubTask';
import EditSubTask from './app/admin-panel/task/sub-task/EditSubTask';
import { TaskNoteList } from './app/admin-panel/task/task-note/TaskNoteList';
import UserProfile from './app/user-panel/user-profile/UserProfile';
import UserTaskList from './app/user-panel/task/user-task/UserTaskList';
import TaskDetails from './app/user-panel/task/user-task/TaskDetails';
import EditAssignTask from './app/user-panel/task/assign-task/EditAssignTask';
import AssignTask from './app/user-panel/task/assign-task/AssignTask';
import AssignTaskList from './app/user-panel/task/assign-task/AssignTaskList';
import AssignSubTask from './app/user-panel/task/assign-sub-task/AssignSubTask';
import EditAssignSubTask from './app/user-panel/task/assign-sub-task/EditAssignSubTask';
import UserSubTaskList from './app/user-panel/task/user-sub-task/UserSubTaskList';
import UserTaskNoteList from './app/user-panel/task/user-task-note/UserTaskNoteList';
import ViewEmployee from './app/admin-panel/employee/ViewEmployee';
import AttendanceList from './app/user-panel/attendance/AttendanceList';
import ViewAssignTask from './app/user-panel/task/assign-task/ViewAssignTask';
import LeaveModule from './app/user-panel/leave/LeaveModule';
import ViewAssignSubTask from './app/user-panel/task/assign-sub-task/ViewAssignSubTask';
import LeaveList from './app/admin-panel/leave/LeaveList';
import LeaveTypeList from './app/admin-panel/master/leave-type/LeaveTypeList';
import EmployeeLeaveTypeList from './app/admin-panel/master/employee-leave-type/EmployeeLeaveTypeList';
import AddLeaveType from './app/admin-panel/master/leave-type/AddLeaveType';
import EditLeaveType from './app/admin-panel/master/leave-type/EditLeaveType';
import AddEmployeeLeaveType from './app/admin-panel/master/employee-leave-type/AddEmployeeLeaveType';
import EditEmployeeLeaveType from './app/admin-panel/master/employee-leave-type/EditEmployeeLeaveType';
import HolidayList from './app/admin-panel/master/holiday/HolidayList';
import AddHoliday from './app/admin-panel/master/holiday/AddHoliday';
import EditHoliday from './app/admin-panel/master/holiday/EditHoliday';
import CompanyForm from './app/components/CompanyForm';
import InquiryTypeList from './app/admin-panel/master/inquiry-type/InquiryTypeList';
import AddInquiryType from './app/admin-panel/master/inquiry-type/AddInquiryType';
import CompanyRegistration from './app/components/CompanyRegistration';
import EditInquiryType from './app/admin-panel/master/inquiry-type/EditInquiryType';
import InquirySourceList from './app/admin-panel/master/inquiry-source/InquirySourceList';
import AddInquirySource from './app/admin-panel/master/inquiry-source/AddInquirySource';
import EditInquirySource from './app/admin-panel/master/inquiry-source/EditInquirySource';
import PartnerRegistration from './app/components/PartnerRegistration';
import ClientCompanyList from './app/admin-panel/client-company/ClientCompanyList';
import ViewClientCompany from './app/admin-panel/client-company/ViewClientCompany';
import AddClientCompany from './app/admin-panel/client-company/AddClientCompany';
import EditClientCompany from './app/admin-panel/client-company/EditClientCompany';
import PartnerList from './app/admin-panel/partner/PartnerList';
import AddPartner from './app/admin-panel/partner/AddPartner';
import ViewPartner from './app/admin-panel/partner/ViewPartner';
import EditPartner from './app/admin-panel/partner/EditPartner';
import InquiryModuleList from './app/company-panel/company-information/InquiryModuleList';
import InquiryModule from './app/company-panel/company-information/InquiryModule';
import ViewIquiryModule from './app/company-panel/company-information/ViewIquiryModule';
import ClientCompDashboard from './app/company-panel/dashboard/ClientCompDashboard';
import PartnerDashboard from './app/partner-panel/dashboard/PartnerDashboard';
import AddInquiry from './app/partner-panel/inquiry/AddInquiry';
import InquiryList from './app/partner-panel/inquiry/InquiryList';
import PartnerViewInquiry from './app/admin-panel/inquiry/ViewInquiry';
// import InquiryListInAdmin from './app/admin-panel/partner-inquiry/InquiryList';
import AddPartnerInquiry from './app/admin-panel/partner-inquiry/AddPartnerInquiry';
import InquiryOriginList from './app/admin-panel/master/inquiry-origin/InquiryOriginList';
import AddInquiryOrigin from './app/admin-panel/master/inquiry-origin/AddInquiryOrigin';
import EditInquiryOrigin from './app/admin-panel/master/inquiry-origin/EditInquiryOrigin';
import AddInquiryPermission from './app/admin-panel/master/inquiry-permission/AddInquiryPermission';
import InquiryPermissionList from './app/admin-panel/master/inquiry-permission/InquiryPermissionList';
import EditInquiryPermission from './app/admin-panel/master/inquiry-permission/EditInquiryPermission';
import ViewInquiry from './app/partner-panel/inquiry/ViewInquiry';
import GetInquiryList from './app/partner-panel/inquiry/GetInquiryList';
import AdminInqryPermiList from './app/admin-panel/master/admin-inqry-permission/AdminInqryPermiList';
import AddAdminInqryPermi from './app/admin-panel/master/admin-inqry-permission/AddAdminInqryPermi';
import EditAdminInqryPermi from './app/admin-panel/master/admin-inqry-permission/EditAdminInqryPermi';
import PartnerInquiryList from './app/admin-panel/partner-inquiry/PartnerInquiryList';
import ClientInquiryList from './app/admin-panel/client-inquiry/ClientInquiryList';
import AddClientInquiry from './app/admin-panel/client-inquiry/AddClientInquiry';
import ClientViewInquiry from './app/admin-panel/inquiry/ViewInquiry';
import CreatePartnerInqryList from './app/admin-panel/create-partner-inquiry/CreatePartnerInqryList';
import CreatePartnerInqry from './app/admin-panel/create-partner-inquiry/CreatePartnerInqry';
import ViewCreatePartnerInqry from './app/admin-panel/inquiry/ViewInquiry';
import CreateClientInqryList from './app/admin-panel/create-client-inquiry/CreateClientInqryList';
import CreateClientInqry from './app/admin-panel/create-client-inquiry/CreateClientInqry';
import ViewCreateClientInqry from './app/admin-panel/inquiry/ViewInquiry';
import UserInquiryList from './app/user-panel/inquiry/InquiryList';
import CreateInquiryList from './app/user-panel/inquiry/CreateInquiryList';
import ForwardPartnerInqryList from './app/user-panel/inquiry/ForwardPartnerInqryList';
import ForwardClientInqryList from './app/user-panel/inquiry/ForwardClientInqryList';
import UserViewInquiry from './app/user-panel/inquiry/UserViewInquiry';
import GetViewInquiry from './app/partner-panel/inquiry/GetViewInquiry';
import ChatInquiry from './app/admin-panel/inquiry/ChatInquiry';
import EditInquiry from './app/partner-panel/inquiry/EditInquiry';
import AddInquiryTask from './app/admin-panel/inquiry-task/AddInquiryTask';
import ProjectList from './app/admin-panel/project/recived-project/ProjectList';
import CreatedProjectList from './app/admin-panel/project/created-project/CreatedProjectList';
import ViewPartnerProject from './app/partner-panel/inquiry/ViewProject';
import ViewProject from './app/admin-panel/project/ViewProject';
import AddProject from './app/admin-panel/project/AddProject';
import Chat from './app/partner-panel/inquiry/Chat';
import InquiryTaskList from './app/admin-panel/inquiry-task/InquiryTaskList';
import PartnerInquiryTaskList from './app/partner-panel/inquiry-task/PartnerInquiryTaskList';
import ViewInquiryTask from './app/admin-panel/inquiry-task/ViewInquiryTask';
import AddInquirySubTask from './app/admin-panel/inquiry-subtask/AddInquirySubTask';
import EditInquiryTask from './app/admin-panel/inquiry-task/EditInquiryTask';
import { InquiryTaskNoteList } from './app/admin-panel/inquiry-tasknote/InquiryTaskNoteList';
import PartnerViewInquiryTask from './app/partner-panel/inquiry-task/PartnerViewInquiryTask';
import UserProjectList from './app/user-panel/user-project/UserProjectList';
import UserViewProject from './app/user-panel/user-project/UserViewProject';
import UserInquiryTaskList from './app/user-panel/user-inquiry-task/UserInquiryTaskList';
import AddPartnerInquiryTask from './app/partner-panel/inquiry-task/AddPartnerInquiryTask';
import EditPartnerInquiryTask from './app/partner-panel/inquiry-task/EditPartnerInquiryTask';
import EditInquirySubTask from './app/admin-panel/inquiry-subtask/EditInquirySubTask';
import ViewInquirySubTask from './app/admin-panel/inquiry-task/ViewInquirySubTask';
import EditInquiryModule from './app/company-panel/company-information/EditInquiryModule';
import VendorDashboard from './app/vendor-panel/dashboard/VendorDashboard';
import VendorList from './app/admin-panel/vendor/VendorList';
import AddVendor from './app/admin-panel/vendor/AddVendor';
import EditVendor from './app/admin-panel/vendor/EditVendor';
import ViewVendor from './app/admin-panel/vendor/ViewVendor';
import ViewTask from './app/admin-panel/task/task/ViewTask';
import ViewSubTask from './app/admin-panel/task/sub-task/ViewSubTask';
import VendorProjectList from './app/vendor-panel/vendor-project/VendorProjectList';
import VendorGetProjectList from './app/vendor-panel/vendor-project/VendorGetProjectList';
import EditProject from './app/admin-panel/project/EditProject';
import ViewVendorProject from './app/vendor-panel/vendor-project/ViewVendorProject';
import UserViewTaskProject from './app/user-panel/user-project/UserViewTaskProject';
import VendorRegistration from './app/components/VendorRegistration';


function App() {

  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true); // Loading state to prevent rendering before authentication check
  const [userRole, setUserRole] = useState(null); // State to store user role


  useEffect(() => {
    // This code runs only once when the component mounts.
    const token = sessionStorage.getItem('token');

    // debugger;
    generateToken();
    onMessage(messaging, (payload) => { 
     // Listen for foreground messages (optional)      
    //  console.log('Message received in foreground: ', payload);
    //  toast.success(payload.notification.body)
    }); 

    //console.log(token)
    if (token) {
      try {
        const decodedToken = jwtDecode(token);
        // Check if the decoded token includes valid roles
        if (decodedToken?.Admin === 'IsAdmin' || decodedToken.Admin === 'IsAdminIT' || decodedToken.Admin === 'IsAdminBD') {
          setIsAuthenticated(true); // User is authenticated
          setUserRole('admin'); // Set the role to admin
        // } else if (decodedToken?.Admin === 'IsAdminIT') {
        //   setIsAuthenticated(true); // User is authenticated
        //   setUserRole('ITadmin'); // Set the role to employee
        // } else if (decodedToken?.Admin === 'IsAdminBD') {
        //   setIsAuthenticated(true); // User is authenticated
        //   setUserRole('BDadmin'); // Set the role to employee
        } else if (decodedToken?.Employee === 'IsEmployee') {
          setUserRole('user'); // Set the role to employee
          setIsAuthenticated(true); // User is authenticated
        } else if (decodedToken?.Partner === 'IsPartner') {
          setIsAuthenticated(true); // User is authenticated
          setUserRole('partner'); // Set the role to partner
        } else if (decodedToken?.Client === 'IsClient') {
          setIsAuthenticated(true); // User is authenticated
          setUserRole('company'); // Set the role to company
        } else if (decodedToken?.Vendor === 'IsVendor') {
          setIsAuthenticated(true); // User is authenticated
          setUserRole('vendor'); // Set the role to company
        } else {
          sessionStorage.clear();
          setIsAuthenticated(false);
        }
      } catch (error) {
        sessionStorage.clear(); // Clear session if JWT is invalid or cannot be decoded
        setIsAuthenticated(false); // Update state
      }
    } else {
      setIsAuthenticated(false); // No token, set unauthenticated
    }
    setTimeout(() => setLoading(false), 1500); // 1500ms delay
  }, []); // Empty dependency array ensures this effect runs only once, on mount


  if (loading) {
    // Optionally render a loading spinner or nothing while the auth state is being determined
    return (
      <div className="loader-container">
      {/* <div className="loader"> */}
      <RingLoader color='#3498db' size={400} className='loder'/>
      {/* </div> */}
    </div>
    );
  }

  return (

    <>
    <Routes>
    {/* Redirect to SignIn by default if not authenticated */}
    <Route path="/" element={<Navigate to={isAuthenticated ? "/" : "/sign-in"} />} />

    {/* Sign-In Route */}
    <Route path="/sign-in" element={<SignIn onLogin={() => setIsAuthenticated(true)} setLoading={setLoading} />} />
    <Route path="/forgot-password" element={<ForgotPassword/>} />
    <Route path="/reset-password/:token" element={<ResetPassowrd/>} />
    {/* <Route path="/inquiry" element={<InquiryModule/>} /> */}
    <Route path="/company-form" element={<CompanyForm/>} />
    <Route path="/company-registration" element={<CompanyRegistration/>} />
    <Route path="/partner-registration" element={<PartnerRegistration/>} />
    <Route path="/vendor-registration" element={<VendorRegistration/>} />

    {/* Admin dashboard Routes */}
    <Route path="/" element={isAuthenticated ? <Layout /> : <Navigate to="/sign-in" />}>
      <Route index element={<Dashboard />} />
      <Route path="master/department-list" element={<DepartmentList />} />
      <Route path="master/department-list/add-department" element={<AddDepartment />} />
      <Route path="master/department-list/edit-department/:id" element={<EditDepartment />} />
      <Route path="master/designation-list" element={<DesignationList />} />
      <Route path="master/designation-list/add-designation" element={<AddDesignation />} />
      <Route path="master/designation-list/edit-designation/:id" element={<EditDesignation />} />
      <Route path="master/employeepermission-list" element={<EmployeePermissionList />} />
      <Route path="master/employeepermission-list/add-employeepermission" element={<AddEmployeePermission />} />
      <Route path="master/employeepermission-list/edit-employeepermission/:id" element={<EditEmployeePermission />} />
      <Route path="master/leave-type-list" element={<LeaveTypeList />} />
      <Route path="master/leave-type-list/add-leave-type" element={<AddLeaveType />} />
      <Route path="master/leave-type-list/edit-leave-type/:id" element={<EditLeaveType/>} />
      <Route path="master/employee-leavetype-list" element={<EmployeeLeaveTypeList />} />
      <Route path="master/employee-leavetype-list/add-employee-leavetype" element={<AddEmployeeLeaveType />} />
      <Route path="master/employee-leavetype-list/edit-employee-leavetype/:id" element={<EditEmployeeLeaveType />} />
      <Route path="master/holiday-list" element={<HolidayList />} />
      <Route path="master/holiday-list/add-holiday" element={<AddHoliday />} />
      <Route path="master/holiday-list/edit-holiday/:id" element={<EditHoliday />} />
      <Route path="master/inquirytype-list" element={<InquiryTypeList />} />
      <Route path="master/inquirytype-list/add-inquirytype" element={<AddInquiryType />} />
      <Route path="master/inquirytype-list/edit-inquirytype/:id" element={<EditInquiryType />} />
      <Route path="master/inquirysource-list" element={<InquirySourceList />} />
      <Route path="master/inquirysource-list/add-inquirysource" element={<AddInquirySource />} />
      <Route path="master/inquirysource-list/edit-inquirysource/:id" element={<EditInquirySource />} />
      <Route path="master/inquiryorigin-list" element={<InquiryOriginList />} />
      <Route path="master/inquiryorigin-list/add-inquiryorigin" element={<AddInquiryOrigin />} />
      <Route path="master/inquiryorigin-list/edit-inquiryorigin/:id" element={<EditInquiryOrigin />} />
      <Route path="master/userinquirypermission-list" element={<InquiryPermissionList />} />
      <Route path="master/userinquirypermission-list/add-userinquirypermission" element={<AddInquiryPermission />} />
      <Route path="master/userinquirypermission-list/edit-userinquirypermission/:id" element={<EditInquiryPermission />} />
      <Route path="master/inquirypermission-list" element={<AdminInqryPermiList />} />
      <Route path="master/inquirypermission-list/add-inquirypermission" element={<AddAdminInqryPermi />} />
      <Route path="master/inquirypermission-list/edit-inquirypermission/:id" element={<EditAdminInqryPermi />} />
      <Route path="employee-list" element={<EmployeeList />} />
      <Route path="employee-list/add-employee" element={<AddEmployee />} />
      <Route path="employee-list/edit-employee/:id" element={<EditEmployee />} />
      <Route path="employee-list/view-employee/:id" element={<ViewEmployee />} />
      <Route path="leave" element={<LeaveList/>} />
      <Route path="task/task-list" element={<TaskList />} />
      <Route path="task/create-task" element={<CreateTask />} />
      <Route path="task/edit-task/:id" element={<EditTask/>} />
      <Route path="task/view-task/:id" element={<ViewTask/>} />
      <Route path="task/create-subtask/:id" element={<CreateSubTask/>} />
      <Route path="task/edit-subtask/:id" element={<EditSubTask/>} />
      <Route path="task/view-subtask/:id" element={<ViewSubTask/>} />
      <Route path="task/tasknote-list/:id" element={<TaskNoteList/>} />
      <Route path="partnerinquiry-list" element={<PartnerInquiryList />} />
      <Route path="partnerinquiry-list/add-partnerinquiry" element={<AddPartnerInquiry />} />
      <Route path="partnerinquiry-list/view-partnerinquiry/:id" element={<PartnerViewInquiry hideTab={true}/>} />
      <Route path="clientinquiry-list" element={<ClientInquiryList />} />
      <Route path="clientinquiry-list/add-clientinquiry" element={<AddClientInquiry />} />
      <Route path="clientinquiry-list/view-clientinquiry/:id" element={<ClientViewInquiry/>} />
      <Route path="create-partnerinquiry-list" element={<CreatePartnerInqryList />} />
      <Route path="create-partnerinquiry-list/add-partnerinquiry" element={<CreatePartnerInqry />} />
      <Route path="create-partnerinquiry-list/view-partnerinquiry/:id" element={<ViewCreatePartnerInqry />} />
      <Route path="create-clientinquiry-list" element={<CreateClientInqryList />} />
      <Route path="create-clientinquiry-list/add-clientinquiry" element={<CreateClientInqry />} />
      <Route path="create-clientinquiry-list/view-clientinquiry/:id" element={<ViewCreateClientInqry />} />
      {/* <Route path="inquiry-list/edit-inquiry/:id" element={<EditPartner />} /> */}
      {/* <Route path="inquiry-list/view-inquiry/:id" element={<ViewPartner />} /> */}
      <Route path="partner-list" element={<PartnerList />} />
      <Route path="partner-list/add-partner" element={<AddPartner />} />
      <Route path="partner-list/edit-partner/:id" element={<EditPartner />} />
      <Route path="partner-list/view-partner/:id" element={<ViewPartner />} />
      <Route path="clientcompany-list" element={<ClientCompanyList />} />
      <Route path="clientcompany-list/add-clientcompany" element={<AddClientCompany />} />
      <Route path="clientcompany-list/edit-clientcompany/:id" element={<EditClientCompany />} />
      <Route path="clientcompany-list/view-clientcompany/:id" element={<ViewClientCompany />} />
      <Route path="vendor-list" element={<VendorList />} />
      <Route path="vendor-list/add-vendor" element={<AddVendor />} />
      <Route path="vendor-list/edit-vendor/:id" element={<EditVendor />} />
      <Route path="vendor-list/view-vendor/:id" element={<ViewVendor />} />
      <Route path="inquiry-chat" element={<ChatInquiry />} />
      <Route path="inquiry-tasknote-list/:id" element={<InquiryTaskNoteList />} />
      <Route path="inquiry-subtasknote-list/:id" element={<InquiryTaskNoteList />} />
      <Route path="inquiry-task-list/:id" element={<InquiryTaskList />} />
      <Route path="create-inquiry-task/:id" element={<AddInquiryTask />} />
      <Route path="edit-inquiry-task/:id" element={<EditInquiryTask />} />
      <Route path="create-inquiry-subtask/:id" element={<AddInquirySubTask />} />
      <Route path="edit-inquiry-subtask/:id" element={<EditInquirySubTask />} />
      <Route path="received-project-list" element={<ProjectList />} />
      <Route path="created-project-list" element={<CreatedProjectList />} />
      <Route path="created-project-list/create-project" element={<AddProject />} />
      <Route path="created-project-list/edit-project/:id" element={<EditProject />} />
      <Route path="view-project/:id" element={<ViewProject />} />
      <Route path="view-inquiry-task/:id" element={<ViewInquiryTask />} />
      <Route path="view-inquiry-subtask/:id" element={<ViewInquirySubTask />} />
      {/* <Route path="/profile" element={<Profile/>} /> */}
    </Route>

    {/* User dashboard route */}
    <Route path="/user" element={isAuthenticated ? <Layout /> : <Navigate to="/sign-in" />}>
    <Route index element={<UserDashboard />} />
    <Route path="/user/task-list" element={<UserTaskList/>} />
    <Route path="/user/sub-task-list" element={<UserSubTaskList/>} />
    <Route path="/user/tasknote-list/:id" element={<UserTaskNoteList/>} />
    <Route path="/user/assign-task-list" element={<AssignTaskList/>} />
    <Route path="/user/assign-task" element={<AssignTask/>} />
    <Route path="/user/edit-assign-task/:id" element={<EditAssignTask/>} />
    <Route path="/user/view-assign-task/:id" element={<ViewAssignTask/>} />
    <Route path="/user/view-assign-subtask/:id" element={<ViewAssignSubTask/>} />
    {/* <Route path="/user/task-list/tasknote-list/:id" element={<TaskNoteList/>} /> */}
    <Route path="/user/task-list/:id" element={<TaskDetails/>} />
    <Route path="/user/task/create-subtask/:id" element={<AssignSubTask/>} />
    <Route path="/user/task/edit-assign-subtask/:id" element={<EditAssignSubTask/>} />
    <Route path="/user/user-profile" element={<UserProfile/>} />
    <Route path="/user/attendance" element={<AttendanceList/>} />
    <Route path="/user/leave" element={<LeaveModule/>} />
    {/* <Route path="/user/project-list" element={<UserInquiryList/>} /> */}
    <Route path="/user/forwarded-partnerinquiry-list" element={<ForwardPartnerInqryList/>} />
    <Route path="/user/forwarded-clientinquiry-list" element={<ForwardClientInqryList/>} />
    <Route path="/user/clientinquiry-list" element={<ClientInquiryList />} />
    <Route path="/user/partnerinquiry-list" element={<PartnerInquiryList />} />
    <Route path="/user/create-inquiry-list" element={<CreateInquiryList />} />
    <Route path="/user/partneproject-list/view-partneproject/:id" element={<UserViewInquiry />} />
    <Route path="/user/clientproject-list/view-clientproject/:id" element={<UserViewInquiry />} />
    <Route path="/user/create-partnerinquiry-list" element={<CreatePartnerInqryList />} />
    <Route path="/user/create-partnerinquiry-list/add-partnerinquiry" element={<CreatePartnerInqry />} />
    <Route path="/user/create-partnerinquiry-list/view-partnerinquiry/:id" element={<UserViewInquiry />} />
    {/* <Route path="/user/create-partnerinquiry-list/view-partnerinquiry/:id" element={<ViewCreatePartnerInqry />} /> */}
    <Route path="/user/create-clientinquiry-list" element={<CreateClientInqryList />} />
    <Route path="/user/create-clientinquiry-list/add-clientinquiry" element={<CreateClientInqry />} />
    <Route path="/user/create-partnerinquiry-list/view-partnerinquiry/:id" element={<UserViewInquiry />} />
    {/* <Route path="/user/create-clientinquiry-list/view-clientinquiry/:id" element={<ViewCreateClientInqry />} /> */}
    <Route path="/user/project-list" element={<UserProjectList/>} />
    <Route path="/user/inquiry-task-list" element={<UserInquiryTaskList/>} />
    <Route path="/user/inquiry-tasknote-list/:id" element={<InquiryTaskNoteList />} />
    <Route path="/user/inquiry-subtasknote-list/:id" element={<InquiryTaskNoteList />} />
    <Route path="/user/project-list/view-project/:id" element={<UserViewProject />} />
    <Route path="/user/project-list/view-assigntask-project/:id" element={<UserViewTaskProject />} />
    <Route path="/user/create-inquiry-task/:id" element={<AddInquiryTask />} />
    <Route path="/user/edit-inquiry-task/:id" element={<EditInquiryTask />} />
    <Route path="/user/create-inquiry-subtask/:id" element={<AddInquirySubTask />} />
    <Route path="/user/edit-inquiry-subtask/:id" element={<EditInquirySubTask />} />
    <Route path="/user/view-inquiry-task/:id" element={<ViewInquiryTask/>} />
    <Route path="/user/view-inquiry-subtask/:id" element={<ViewInquirySubTask/>} />
    </Route>

    {/* Company dashboard route */}
    <Route path="/company" element={isAuthenticated ? <Layout /> : <Navigate to="/sign-in" />}>
    <Route index element={<ClientCompDashboard />} />
    <Route path="/company/icp-list" element={<InquiryModuleList/>} />
    <Route path="/company/add-icp" element={<InquiryModule/>} />
    <Route path="/company/edit-icp/:id" element={<EditInquiryModule/>} />
    <Route path="/company/view-icp/:id" element={<ViewIquiryModule/>} />
    <Route path="/company/project-list" element={<InquiryList/>} />
    <Route path="/company/project-list/add-project" element={<AddInquiry/>} />
    <Route path="/company/project-list/view-project/:id" element={<ViewInquiry/>} />
    <Route path="/company/get-project-list" element={<GetInquiryList/>} />
    <Route path="/company/get-project-list/view-project/:id" element={<GetViewInquiry/>} />
    <Route path="/company/companyinquiry-list/create-inquiry-task/:id" element={<AddPartnerInquiryTask />} />
    <Route path="/company/companyinquiry-list/edit-inquiry-task/:id" element={<EditPartnerInquiryTask />} />
    <Route path="/company/companyinquiry-list/create-inquiry-sub-task/:id" element={<AddInquirySubTask />} />
    <Route path="/company/view-inquiry-task/:id" element={<PartnerViewInquiryTask/>} />
    <Route path="/company/view-inquiry-subtask/:id" element={<PartnerViewInquiryTask/>} />
    {/* <Route path="/company/inquiry-list" element={<InquiryListInCompany />} />
    <Route path="/company/inquiry-list/add-inquiry" element={<AddInquiryInCompany />} /> */}
    {/* <Route path="/company/task-list" element={<UserTaskList/>} /> */}
    </Route>

    {/* Partner dashboard route */}
    <Route path="/partner" element={isAuthenticated ? <Layout /> : <Navigate to="/sign-in" />}>
    <Route index element={<PartnerDashboard />} />
    <Route path="/partner/project-list" element={<InquiryList/>} />
    <Route path="/partner/get-project-list" element={<GetInquiryList/>} />
    <Route path="/partner/get-project-list/view-project/:id" element={<GetViewInquiry/>} />
    <Route path="/partner/project-list/add-project" element={<AddInquiry/>} />
    {/* <Route path="/partner/view-inquiry-task/:id" element={<ViewInquiryTask/>} /> */}
    {/* <Route path="/partner/inquiry-list/view-inquiry/:id" element={<ViewInquiry/>} /> */}
    <Route path="/partner/project-list/view-project/:id" element={<ViewPartnerProject/>} />
    <Route path="/partner/project-list/edit-project/:id" element={<EditInquiry/>} />
    <Route path="/partner/project-list" element={<InquiryList/>} />
    <Route path="/partner/inquiry-task-list" element={<PartnerInquiryTaskList/>} />
    <Route path="/partner/view-inquiry-task/:id" element={<PartnerViewInquiryTask/>} />
    <Route path="/partner/view-inquiry-subtask/:id" element={<PartnerViewInquiryTask/>} />
    <Route path="/partner/partnerinquiry-task-list/create-inquiry-task/:id" element={<AddPartnerInquiryTask />} />
    <Route path="/partner/partnerinquiry-task-list/edit-inquiry-task/:id" element={<EditPartnerInquiryTask />} />
    <Route path="/partner/partnerinquiry-task-list/create-inquiry-sub-task/:id" element={<AddInquirySubTask />} />
    <Route path="/partner/inquiry-tasknote-list/:id" element={<InquiryTaskNoteList />} />
    <Route path="/partner/inquiry-subtasknote-list/:id" element={<InquiryTaskNoteList />} />
    </Route>

    {/* Vendor dashboard route */}
    <Route path="/vendor" element={isAuthenticated ? <Layout /> : <Navigate to="/sign-in" />}>
    <Route index element={<VendorDashboard />} />
    <Route path="/vendor/icp-list" element={<InquiryModuleList/>} />
    <Route path="/vendor/add-icp" element={<InquiryModule/>} />
    <Route path="/vendor/edit-icp/:id" element={<EditInquiryModule/>} />
    <Route path="/vendor/view-icp/:id" element={<ViewIquiryModule/>} />
    <Route path="/vendor/project-list" element={<VendorProjectList/>} />
    <Route path="/vendor/project-list/add-project" element={<AddInquiry/>} />
    <Route path="/vendor/project-list/view-project/:id" element={<ViewInquiry/>} />
    <Route path="/vendor/project-list/view-assigntask-project/:id" element={<UserViewTaskProject />} />
    <Route path="/vendor/get-project-list" element={<VendorGetProjectList/>} />
    <Route path="/vendor/get-project-list/view-project/:id" element={<ViewVendorProject/>} />
    <Route path="/vendor/vendorinquiry-list/create-inquiry-task/:id" element={<AddPartnerInquiryTask />} />
    <Route path="/vendor/vendorinquiry-list/edit-inquiry-task/:id" element={<EditPartnerInquiryTask />} />
    <Route path="/vendor/vendorinquiry-list/create-inquiry-sub-task/:id" element={<AddInquirySubTask />} />
    <Route path="/vendor/view-inquiry-task/:id" element={<PartnerViewInquiryTask/>} />
    <Route path="/vendor/view-inquiry-subtask/:id" element={<PartnerViewInquiryTask/>} />
    </Route>
  
    </Routes>
  </>
  );
}

export default App;