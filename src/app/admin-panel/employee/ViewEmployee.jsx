import React, { useEffect, useState } from "react";
import { FaArrowLeft, FaEdit } from "react-icons/fa";
import { Link, useNavigate, useParams } from "react-router-dom";
import { EmployeeService } from "../../service/EmployeeService";
import { motion } from "framer-motion"; // Import framer-motion
import AttendanceList from "../attendanceList/AttendanceList";
import LeaveList from "../leave/LeaveList";
import UserTaskList from "../task/user-task/UserTaskList";

const ViewEmployee = () => {

  const [formData, setFormData] = useState({
    firstName: "",
    middleName: "",
    lastName: "",
    employeeCode: "",
    email: "",
    password: "",
    departmentId: "",
    designationId: "",
    departmentName: "",
    designationName: "",
    gender: "",
    mobileNumber: "",
    emergencyMobileNumber: "",
    birthDate: "",
    dateOfJoining: "",
    countryId: "",
    stateId: "",
    cityId: "",
    countryName: "",
    stateName: "",
    cityName: "",
    bloodGroup: "",
    address: "",
    keyResponsibility: "",
    reportingTo: "" 
  });

  const [activeTab, setActiveTab] = useState(1);

  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch Employee
        const employee = await EmployeeService.getByIdEmployee(id);
        const formattedEmployee = {
          ...employee.data,
          birthDate: employee.data.birthDate ? employee.data.birthDate.split("T")[0] : "",
          dateOfJoining: employee.data.dateOfJoining ? employee.data.dateOfJoining.split("T")[0] : "",
        };
        setFormData(formattedEmployee);
        // console.log(formattedEmployee)

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
        <h1 className="font-semibold text-xl sm:text-2xl">View Employee</h1>
        <div className="flex flex-wrap space-x-2 mt-2 sm:mt-0">
          <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
            <Link
              to={`/employee-list/edit-employee/${id}`}
              className="bg-blue-600 hover:bg-blue-700 flex items-center gap-2 text-center text-white font-medium py-2 px-4 rounded hover:no-underline"
            >
              Edit Employe
              <FaEdit size={16} /> 
            </Link>
          </motion.button>
          <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
            <button
              onClick={() => navigate(-1)}
              // to="/employee-list"
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
                  "Employee Details",
                  "Attendance List",
                  "Leave List",
                  "Task List",
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
                      { label: "First Name", name: "firstName", value: formData.firstName },
                      { label: "Middle Name", name: "middleName", value: formData.middleName },
                      { label: "Last Name", name: "lastName", value: formData.lastName },
                      { label: "Employee Code", name: "employeeCode", value: formData.employeeCode },
                      { label: "Department", name: "departmentName", value: formData.departmentName },
                      { label: "Designation", name: "designationName", value: formData.designationName },
                      { label: "Email", name: "email", value: formData.email },
                      { label: "Mobile Number", name: "mobileNumber",value: formData.mobileNumber },
                      { label: "Emergency Mobile Number", name: "emergencyMobileNumber", value: formData.emergencyMobileNumber},
                      { label: "Gender", name: "gender", value: formData.gender},
                      { label: "Date of Birth", name: "birthDate",  value: formData.birthDate },
                      { label: "Blood Group", name: "bloodGroup", value: formData.address },
                      { label: "Date of Joining", name: "dateOfJoining",  value: formData.dateOfJoining },
                      { label: "Country", name: "countryName",  value: formData.countryName },
                      { label: "State", name: "stateName",  value: formData.stateName },
                      { label: "City", name: "cityName",  value: formData.cityName },
                      { label: "Address", name: "address",  value: formData.address },
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
              {activeTab === 2 && <AttendanceList />}
              {activeTab === 3 && <LeaveList />}
              {activeTab === 4 && <UserTaskList />}
            </div>
          </div>
        </form>
      </section>

      
    </>
  );
};

export default ViewEmployee;