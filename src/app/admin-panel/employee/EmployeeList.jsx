import React from "react";
import { FaEdit, FaPlus, FaTrash } from "react-icons/fa";
import { Link } from "react-router-dom";

const EmployeeList = () => {
  return (
    <>
      <div className="flex justify-between items-center my-3">
        <h1 className="font-semibold text-2xl">Employee List</h1>
        <Link to='/employee-list/add-employee' className="bg-[#0296D6] hover:bg-[#0074BD] flex gap-2 text-center text-white font-medium py-2 px-4 rounded hover:no-underline">
          Add 
          <FaPlus className="mt-[3px]" size={14} />
        </Link>
      </div>

      {/* <h1 className="font-semibold text-2xl my-3">Employee List</h1>

      <div className="flex justify-end mb-3">
        <button className="bg-[#0296D6] hover:bg-[#0074BD] text-white  py-2 px-4 rounded">
          Add +
        </button>
      </div> */}

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
            <tr className="border-b hover:bg-gray-50">
              <td className="py-3 px-4 text-gray-700">John Doe</td>
              <td className="py-3 px-4 text-gray-700">johndoe@example.com</td>
              <td className="py-3 px-4 text-gray-700">1234567890</td>
              <td className="py-3 px-4 text-gray-700">IT</td>
              <td className="py-3 px-4 text-gray-700">
                Full Stack Development
              </td>
              <td className="py-3 px-4">
                <button className="text-blue-500 pr-3">
                  <FaEdit size={24} />
                </button>
                <button className="text-red-500">
                  <FaTrash size={24} />
                </button>
              </td>
            </tr>
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
            </tr>
          </tbody>
        </table>
      </div>
    </>
  );
};

export default EmployeeList;
