import React, { useEffect, useState } from 'react'
import { FaEdit, FaPlus, FaTrash } from 'react-icons/fa'
import { Link, useNavigate } from 'react-router-dom'
import { DepartmentService } from '../../../service/DepartmentService';

const Department = () => {

  const [departments, setDepartments] = useState([]);

  // const navigate = useNavigate();

  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        const result = await DepartmentService.getDepartments();
          setDepartments(result.data);  // Set the 'data' array to the state
      } catch (error) {
        console.error('Error fetching departments:', error);
        setDepartments([]);  // Fallback to an empty array in case of an error
      }
    };
    fetchDepartments();
  }, []);

  // const handleEdit = (departmentId) => {
  //   navigate(`/master/department-list/edit-department/${departmentId}`); // Replace with your actual route
  // }

  return (
    <>
     <div className="flex justify-between items-center my-3">
        <h1 className="font-semibold text-2xl">Department List</h1>
        <Link to='/master/department-list/add-department' className="bg-[#0296D6] hover:bg-[#0074BD] flex gap-2 text-center text-white font-medium py-2 px-4 rounded hover:no-underline">
          Add 
          <FaPlus className="mt-[3px]" size={14} />
        </Link>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-200 rounded-lg">
          <thead className="bg-gray-900 border-b">
            <tr>

              <th className="text-left py-3 pl-7 uppercase font-semibold text-sm text-[#939393]">
                Department
              </th>
              <th className="text-right py-3 pr-8 uppercase font-semibold text-sm text-[#939393]">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {departments.map((item) => (
               <tr key={item.departmentName} className="border-b hover:bg-gray-50">
               <td className="py-3 pl-8 text-gray-700">{item.departmentName}</td>
               <td className="py-3 pr-8 text-right">
                 <button className="text-blue-500 pr-3">
                   <Link to={`/master/department-list/edit-department/${item.departmentId}`} >
                   <FaEdit size={24} />
                   </Link>
                 </button>
                 <button className="text-red-500">
                   <FaTrash size={24} />
                 </button>
               </td>
             </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  )
}

export default Department