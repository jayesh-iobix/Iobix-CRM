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
import TaskList from './app/admin-panel/task/TaskList';
import CreateTask from './app/admin-panel/task/CreateTask';
import EditTask from './app/admin-panel/task/EditTask';
import DepartmentList from './app/admin-panel/master/department/DepartmentList';


function App() {

  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true); // Loading state to prevent rendering before authentication check
  const [userRole, setUserRole] = useState(null); // State to store user role


  useEffect(() => {
    // This code runs only once when the component mounts.
    const token = sessionStorage.getItem('token');
    if (token) {
      try {
        const decodedToken = jwtDecode(token);
        // Check if the decoded token includes valid roles
        if (decodedToken?.IsSuperAdmin === '1' || decodedToken?.IsAdmin === '1') {
          setIsAuthenticated(true); // User is authenticated
          setUserRole('admin'); // Set the role to admin
        } else if (decodedToken?.IsSuperAdmin === '0' || decodedToken?.IsAdmin === '0') {
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
    setTimeout(() => setLoading(false), 900); // 900ms delay
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

    <Routes>
    {/* Redirect to SignIn by default if not authenticated */}
    <Route path="/" element={<Navigate to={isAuthenticated ? "/" : "/sign-in"} />} />

    {/* Sign-In Route */}
    <Route path="/sign-in" element={<SignIn onLogin={() => setIsAuthenticated(true)} />} />

    {/* Protected Routes */}
    <Route path="/" element={isAuthenticated ? <Layout /> : <Navigate to="/sign-in" />}>
      <Route index element={<Dashboard />} />
      <Route path="employee-list" element={<EmployeeList />} />
      <Route path="employee-list/add-employee" element={<AddEmployee />} />
      <Route path="employee-list/edit-employee/:id" element={<EditEmployee />} />
      <Route path="master/department-list" element={<DepartmentList />} />
      <Route path="master/department-list/add-department" element={<AddDepartment />} />
      <Route path="master/department-list/edit-department/:id" element={<EditDepartment />} />
      <Route path="master/designation-list" element={<DesignationList />} />
      <Route path="master/designation-list/add-designation" element={<AddDesignation />} />
      <Route path="master/designation-list/edit-designation/:id" element={<EditDesignation />} />
      <Route path="task/task-list" element={<TaskList />} />
      <Route path="task/create-task" element={<CreateTask />} />
      <Route path="task/edit-task/:id" element={<EditTask/>} />
    </Route>

    {/* User dashboard route */}
    <Route path="/" element={isAuthenticated ? <Layout /> : <Navigate to="/sign-in" />}>
    <Route index element={<UserDashboard />} />
    {/* <Route path="task" element={<TaskManagement/>} /> */}
    </Route>
    
  </Routes>


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
