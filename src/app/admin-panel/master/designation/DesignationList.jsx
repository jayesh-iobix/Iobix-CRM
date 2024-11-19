import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { DesignationService } from "../../../service/DesignationService";
import { FaEdit, FaPlus, FaTrash } from "react-icons/fa";

const DesignationList = () => {
  const [designation, setDesignation] = useState([]);
  const [filteredDesignation, setFilteredDesignation] = useState([]);
  const [departmentFilter, setDepartmentFilter] = useState("");

  useEffect(() => {
    const fetchDesignations = async () => {
      try {
        const result = await DesignationService.getDesignation();
        setDesignation(result.data);
        setFilteredDesignation(result.data); // Set initial data without filtering
        // toast.success('Departments loaded successfully!');
      } catch (error) {
        console.error("Error fetching designations:", error);
        // toast.error('Failed to load departments.');
      }
    };
    fetchDesignations();
  }, []);

  const deleteDesignation = async (designationId) => {
    try {
      const response = await DesignationService.deleteDesignation(designationId);
      if (response.status === 1) {
        setDesignation((prevDesignation) =>
          prevDesignation.filter(
            (designation) => designation.designationId !== designationId
          )
        );
        alert(response.message);
      }
    } catch (error) {
      console.error("Error deleting designation:", error);
      alert("Failed to delete designation");
    }
  };

  // Handle department filter change
  const handleDepartmentChange = (event) => {
    const selectedDepartment = event.target.value;
    setDepartmentFilter(selectedDepartment);

    // Filter designations based on the selected department
    if (selectedDepartment) {
      const filteredData = designation.filter(
        (item) => item.departmentName === selectedDepartment
      );
      setFilteredDesignation(filteredData);
    } else {
      setFilteredDesignation(designation); // Reset filter
    }
  };

  return (
    <>
      <div className="flex justify-between items-center my-3">
        <h1 className="font-semibold text-2xl">Designation List</h1>
        <Link
          to="/master/designation-list/add-designation"
          className="bg-[#0296D6] hover:bg-[#0074BD] flex gap-2 text-center text-white font-medium py-2 px-4 rounded hover:no-underline"
        >
          Add
          <FaPlus className="mt-[3px]" size={14} />
        </Link>
      </div>

      {/* Department Filter Dropdown */}
      <div className="my-3">
        <select
          value={departmentFilter}
          onChange={handleDepartmentChange}
          className="border border-gray-300 rounded p-2"
        >
          <option value="">All Departments</option>
          <option value="IT">IT</option>
          <option value="BD">BD</option>
          {/* Add more departments as needed */}
        </select>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-200 rounded-lg">
          <thead className="bg-gray-900 border-b">
            <tr>
              <th className="text-left py-3 pl-7 uppercase font-semibold text-sm text-[#939393]">
                Designation Name
              </th>
              <th className="text-left py-3 pl-7 uppercase font-semibold text-sm text-[#939393]">
                Department Name
              </th>
              <th className="text-right py-3 pr-8 uppercase font-semibold text-sm text-[#939393]">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredDesignation.map((item) => (
              <tr
                key={item.designationId}
                className="border-b hover:bg-gray-50"
              >
                <td className="py-3 pl-8 text-gray-700">
                  {item.designationName}
                </td>
                <td className="py-3 pl-8 text-gray-700">
                  {item.departmentName}
                </td>
                <td className="py-3 pr-8 text-right">
                  <button className="text-blue-500 hover:text-blue-700 pr-3">
                    <Link
                      to={`/master/designation-list/edit-designation/${item.designationId}`}
                    >
                      <FaEdit size={24} />
                    </Link>
                  </button>
                  <button
                    className="text-red-500 hover:text-red-700"
                    onClick={() => deleteDesignation(item.designationId)}
                  >
                    <FaTrash size={24} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default DesignationList;

