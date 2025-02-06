import './App.css';
import { Route, Routes, Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import EmployeeList from './app/admin-panel/employee/EmployeeList';
import AddEmployee from './app/admin-panel/employee/AddEmployee';
import Dashboard from './app/admin-panel/dashboard/Dashboard';
import Layout from './app/components/Layout';
import AddDepartment from './app/admin-panel/master/department/AddDepartment';
import DesignationList from './app/admin-panel/master/designation/DesignationList';
import AddDesignation from './app/admin-panel/master/designation/AddDesignation';
import SignIn from './app/admin-panel/auth/SignIn';
import EditDepartment from './app/admin-panel/master/department/EditDepartment';
import { jwtDecode } from 'jwt-decode';
import EditDesignation from './app/admin-panel/master/designation/EditDesignation';
import { RingLoader } from 'react-spinners';
import EditEmployee from './app/admin-panel/employee/EditEmployee';
import UserDashboard from './app/user-panel/dashboard/UserDashboard';
import TaskList from './app/admin-panel/task/task/TaskList';
import CreateTask from './app/admin-panel/task/task/CreateTask';
import EditTask from './app/admin-panel/task/task/EditTask';
import DepartmentList from './app/admin-panel/master/department/DepartmentList';
import AddEmployeePermission from './app/admin-panel/master/employee-permission/AddEmployeePermission';
import EmployeePermissionList from './app/admin-panel/master/employee-permission/EmployeePermissionList';
import EditEmployeePermission from './app/admin-panel/master/employee-permission/EditEmployeePermission';
// import TaskNoteList from './app/user-panel/task/TaskNoteList';
import CreateSubTask from './app/admin-panel/task/sub-task/CreateSubTask';
import EditSubTask from './app/admin-panel/task/sub-task/EditSubTask';
import { TaskNoteList } from './app/admin-panel/task/task-note/TaskNoteList';
import ForgotPassword from './app/admin-panel/auth/ForgotPassword';
import ResetPassowrd from './app/admin-panel/auth/ResetPassword';
// import TaskNoteList from './app/admin-panel/task/task-note/TaskNoteList';
import 'react-toastify/dist/ReactToastify.css';  // Don't forget to import the CSS
import { ToastContainer } from 'react-toastify';
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



function App() {

  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true); // Loading state to prevent rendering before authentication check
  const [userRole, setUserRole] = useState(null); // State to store user role


  useEffect(() => {
    // This code runs only once when the component mounts.
    const token = sessionStorage.getItem('token');
    //console.log(token)
    if (token) {
      try {
        const decodedToken = jwtDecode(token);
        // Check if the decoded token includes valid roles
        if (decodedToken?.Admin === 'IsAdmin') {
          setIsAuthenticated(true); // User is authenticated
          setUserRole('admin'); // Set the role to admin
        } else if (decodedToken?.Employee === 'IsEmployee') {
          setIsAuthenticated(true); // User is authenticated
          setUserRole('user'); // Set the role to user
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
      <RingLoader color='#3498db' size={600} className='loder'/>
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

    {/* Protected Routes */}
    <Route path="/" element={isAuthenticated ? <Layout /> : <Navigate to="/sign-in" />}>
      <Route index element={<Dashboard />} />
      <Route path="employee-list" element={<EmployeeList />} />
      <Route path="employee-list/add-employee" element={<AddEmployee />} />
      <Route path="employee-list/edit-employee/:id" element={<EditEmployee />} />
      <Route path="employee-list/view-employee/:id" element={<ViewEmployee />} />
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
      <Route path="task/task-list" element={<TaskList />} />
      <Route path="task/create-task" element={<CreateTask />} />
      <Route path="task/edit-task/:id" element={<EditTask/>} />
      <Route path="task/create-subtask/:id" element={<CreateSubTask/>} />
      <Route path="task/edit-subtask/:id" element={<EditSubTask/>} />
      <Route path="task/tasknote-list/:id" element={<TaskNoteList/>} />
      <Route path="leave" element={<LeaveList/>} />
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
    </Route>
  </Routes>
  </>
  );
}

export default App;













  //  <Routes>
  //       <Route path="/sign-in" element={<SignIn onLogin={() => setIsAuthenticated(true)} />} />
  //       {/* <Route path="/user-sign-in" element={<UserSignIn />} /> */}

  //       {/* Redirect based on role */}
  //       <Route
  //         path="/"
  //         element={isAuthenticated ? (
  //           userRole === 'admin' ? <Navigate to="/admin-dashboard" /> : <Navigate to="/user-dashboard" />
  //         ) : (
  //           <Navigate to="/sign-in" />
  //         )}
  //       />

  //        {/* Admin dashboard routes */}
  //        <Route path="/" element={<Layout />}>
  //         <Route index element={<Dashboard />} />
  //         <Route path="employee-list" element={<EmployeeList />} />
  //         <Route path="employee-list/add-employee" element={<AddEmployee />} />
  //         <Route path="employee-list/edit-employee/:id" element={<EditEmployee />} />
  //         <Route path="master/department-list" element={<Department />} />
  //         <Route path="master/department-list/add-department" element={<AddDepartment />} />
  //         <Route path="master/department-list/edit-department/:id" element={<EditDepartment />} />
  //         <Route path="master/designation-list" element={<DesignationList />} />
  //         <Route path="master/designation-list/add-designation" element={<AddDesignation />} />
  //         <Route path="master/designation-list/edit-designation/:id" element={<EditDesignation />} />
  //       </Route>

  //          {/* User dashboard route */}
  //       <Route path="/user-dashboard" element={isAuthenticated ? <Layout /> : <Navigate to="/sign-in" />}>
  //         {/* User-specific components go here */}
  //       </Route>
        
  //       {/* Protected routes */}
  //       {/* <Route path="/" element={isAuthenticated ? <Layout /> : <Navigate to="/sign-in" />}>
  //         <Route index element={<Dashboard />} />
  //         <Route path="employee-list" element={<EmployeeList />} />
  //         <Route path="employee-list/add-employee" element={<AddEmployee />} />
  //         <Route path="employee-list/edit-employee/:id" element={<EditEmployee />} />
  //         <Route path="master/department-list" element={<Department />} />
  //         <Route path="master/department-list/add-department" element={<AddDepartment />} />
  //         <Route path="master/department-list/edit-department/:id" element={<EditDepartment />} />
  //         <Route path="master/designation-list" element={<DesignationList />} />
  //         <Route path="master/designation-list/add-designation" element={<AddDesignation />} />
  //         <Route path="master/designation-list/edit-designation/:id" element={<EditDesignation />} />
  //       </Route> */}
  //     </Routes>
