import './App.css';

import { BrowserRouter, Route, Routes } from "react-router-dom";
import EmployeeList from "./app/admin-panel/employee/EmployeeList";
import AddEmployee from "./app/admin-panel/employee/AddEmployee";
import Dashboard from "./app/admin-panel/dashboard/Dashboard";
import Layout from "./app/components/Layout";
import Department from "./app/admin-panel/master/department/Department";
import AddDepartment from "./app/admin-panel/master/department/AddDepartment";
import { ToastContainer } from "react-toastify";
import DesignationList from "./app/admin-panel/master/designation/DesignationList";
import AddDesignation from "./app/admin-panel/master/designation/AddDesignation";
import SignIn from "./app/admin-panel/auth/SignIn";
import EditDepartment from './app/admin-panel/master/department/EditDepartment';


function App() {
  return (
    <BrowserRouter>
          {/* <ToastContainer position="top-right" autoClose={3000} /> */}
            <Routes>
                <Route path="/" element={<Layout />}>
                    <Route index element={<Dashboard/>} />
                    <Route path="employee-list" element={<EmployeeList/>} />
                    <Route path="/employee-list/add-employee" element={<AddEmployee/>} />
                    <Route path="/master/department-list" element={<Department/>} />
                    <Route path="/master/department-list/add-department" element={<AddDepartment/>} />
                    <Route path="/master/department-list/edit-department/:id" element={<EditDepartment/>} />
                    <Route path="/master/designation-list" element={<DesignationList/>} />
                    <Route path="/master/designation-list/add-designation" element={<AddDesignation/>} />
                </Route>
                <Route path="/sign-in" element={<SignIn/>} />
            </Routes>
        </BrowserRouter>
  );
}

export default App;
