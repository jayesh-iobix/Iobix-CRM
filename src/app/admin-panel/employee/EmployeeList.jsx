import React, { useEffect, useState } from "react";
import { FaEdit, FaPlus, FaTrash } from "react-icons/fa";
import { Link } from "react-router-dom";
import { EmployeeService } from "../../service/EmployeeService";

const EmployeeList = () => {

  const [employees, setEmployees] = useState([]);

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const result = await EmployeeService.getEmployees();
        setEmployees(result.data); // Set the 'data' array to the state
      } catch (error) {
        console.error("Error fetching employees:", error);
        setEmployees([]); // Fallback to an empty array in case of an error
      }
    };
    fetchEmployees();
  }, []);

  const deleteEmployee = async (taskId) => {
    try {
      const response = await EmployeeService.deleteEmployee(taskId);
      if (response.status === 1) {
        setEmployees((prevTasks) =>
          prevTasks.filter(
            (task) => task.taskId !== taskId
          )
        );
        alert(response.message);
      }
    } catch (error) {
      console.error("Error deleting employee:", error);
      alert("Failed to delete employee");
    }
  };

  return (
    <>
      <div className="flex justify-between items-center my-3">
        <h1 className="font-semibold text-2xl">Employee List</h1>
        <Link to='/employee-list/add-employee' className="bg-[#0296D6] hover:bg-[#0074BD] flex gap-2 text-center text-white font-medium py-2 px-4 rounded hover:no-underline">
          Add 
          <FaPlus className="mt-[3px]" size={14} />
        </Link>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-200 rounded-lg">
          <thead className="bg-gray-900 border-b">
            <tr>
              <th className="text-left py-3 px-4 uppercase font-semibold text-sm text-[#939393]">
                Full Name
              </th>
              <th className="text-left py-3 px-4 uppercase font-semibold text-sm text-[#939393]">
                Email
              </th>
              <th className="text-left py-3 px-4 uppercase font-semibold text-sm text-[#939393]">
                Mobile Number
              </th>
              <th className="text-left py-3 px-4 uppercase font-semibold text-sm text-[#939393]">
                Department
              </th>
              <th className="text-left py-3 px-4 uppercase font-semibold text-sm text-[#939393]">
                Designation
              </th>
              <th className="text-left py-3 px-4 uppercase font-semibold text-sm text-[#939393]">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {employees.map((item) => (
              <tr key={item.employeeId} className="border-b hover:bg-gray-50">
                <td className="py-3 px-4 text-gray-700">{item.name}</td>
                <td className="py-3 px-4 text-gray-700">{item.email}</td>
                <td className="py-3 px-4 text-gray-700">{item.mobileNumber}</td>
                <td className="py-3 px-4 text-gray-700">{item.departmentName}</td>
                <td className="py-3 px-4 text-gray-700">{item.designationName}</td>
                <td className="py-3 px-4">
                <div className="flex gap-2">
                <Link className="text-blue-500  hover:text-blue-700" to={`/employee-list/edit-employee/${item.employeeId}`}>
                  <FaEdit size={24} />
                </Link>
                <button
                 onClick={() => deleteEmployee(item.employeeId)}
                 className="text-red-500 hover:text-red-700">
                  <FaTrash size={24} />
                </button>
                </div>
              </td>
              </tr>
            ))}
{/*  
            <tr className="border-b hover:bg-gray-50">
              <td className="py-3 px-4 text-gray-700">Jane Smith</td>
              <td className="py-3 px-4 text-gray-700">janesmith@example.com</td>
              <td className="py-3 px-4 text-gray-700">1234567890</td>
              <td className="py-3 px-4 text-gray-700">BD</td>
              <td className="py-3 px-4 text-gray-700">Sales Executive</td>
              <td className="py-3 px-4">
                <button className="text-blue-500 pr-3">
                  <FaEdit size={24} />
                </button>
                <button className="text-red-500">
                  <FaTrash size={24} />
                </button>
              </td>
            </tr> */}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default EmployeeList;
