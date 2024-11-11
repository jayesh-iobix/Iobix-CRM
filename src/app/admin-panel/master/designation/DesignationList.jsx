import React, { useEffect, useState } from 'react'
import { FaEdit, FaPlus, FaTrash } from 'react-icons/fa'
import { Link } from 'react-router-dom'
import { DesignationService } from '../../../service/DesignationService';

const DesignationList = () => {
  const [designation, setDesignation] = useState([]);

  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        const result = await DesignationService.getDesignation();
        setDesignation(result.data);
        // console.log(data)
        // toast.success('Departments loaded successfully!');
      } catch (error) {
        console.error('Error fetching departments:', error);
        // toast.error('Failed to load departments.');
      }
    };
    fetchDepartments();
  }, []);
  
  return (
    <>
     <div className="flex justify-between items-center my-3">
        <h1 className="font-semibold text-2xl">Designation List</h1>
        <Link to='/master/designation-list/add-designation' className="bg-[#0296D6] hover:bg-[#0074BD] flex gap-2 text-center text-white font-medium py-2 px-4 rounded hover:no-underline">
          Add 
          <FaPlus className="mt-[3px]" size={14} />
        </Link>
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
            {
            designation.map((item)=> 
                <tr key={item.departmentName} className="border-b hover:bg-gray-50">
                <td className="py-3 pl-8 text-gray-700">{item.designationName}</td>
                <td className="py-3 pl-8 text-gray-700">{item.departmentId}</td>
                <td className="py-3 pr-8 text-right">
                  <button className="text-blue-500 pr-3">
                    <FaEdit size={24} />
                  </button>
                  <button className="text-red-500">
                    <FaTrash size={24} />
                  </button>
                </td>
              </tr>
            )
            }
          </tbody>
        </table>
      </div>
    </>
  )
}

export default DesignationList