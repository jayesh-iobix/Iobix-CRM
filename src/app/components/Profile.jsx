//#region Imports
import React, { useEffect, useState } from 'react';
// import profile from '../../assets/profilePic.jpg'
import { useNavigate } from 'react-router-dom';
import { IoClose } from 'react-icons/io5';
import { FaUser } from "react-icons/fa";
import { EmployeeService } from '../service/EmployeeService';
//#endregion

//#region Component: Profile
const Profile = () => {

  //#region State Variables
  const [userDetails, setUserDetails] = useState("");
  const navigate = useNavigate();
  //#endregion

  //#region Fetch Profile Details
  const fetchUserDetails = async () => {
    try {
      const result = await EmployeeService.getEmployeesProfileDetail();
      setUserDetails(result.data);

    } catch (error) {
      console.error("Error fetching tasks:", error);
    }
  };

  useEffect(() => {
    fetchUserDetails()
  },[])
  //#endregion

  //#region Function Format date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    
    // Get day, month, and year
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are zero-indexed
    const year = date.getFullYear();
  
    // Return formatted date in dd/mm/yyyy
    return `${day}/${month}/${year}`;
  };
  //#endregion

  //#region Render
  return (
    <div className="mx-auto bg-white rounded-lg shadow-lg p-6">
      {/* Container for Image and Name */}
      <div className="flex justify-between space-x-4 mb-6">
        <div className="flex items-start space-x-4">
        {/* User Image */}
        {/* <img
          src={profile}
          alt={<FaUser/>}
          className="w-12 h-12 rounded-full object-cover border-4 border-gray-500"
        /> */}
        <FaUser className="w-20 h-20 rounded-full object-cover p-1 border-4 border-gray-500"/>

        {/* User Name and Role */}
        <div>
          <h2 className="text-3xl mt-1 font-semibold text-gray-800">{userDetails.firstName +" "+ userDetails.lastName}</h2>
          <p className="text-gray-500 text-xl">{userDetails.role}</p>
        </div>
        </div>
        <div>
            {/* <FaCircleXmark onClick={()=> navigate(-1)} className='text-red-500 cursor-pointer' size={35}/> */}
            <IoClose onClick={()=> navigate(-1)} className='text-red-500 cursor-pointer' size={40}/>
        </div>
      </div>
    

      {/* User Details Section */}
        {/* <hr/> */}
      <div className="mt-10">
        <h3 className="text-xl font-semibold text-gray-800">User Details</h3>
        <ul className="mt-4 space-y-2">
          <li className="flex items-center space-x-2 text-gray-700">
            <label htmlFor="name" className="w-40 block text-base font-medium">Full Name:</label>
            <input
              id="name"
              type="text"
              value={userDetails.firstName +" "+ userDetails.lastName}
              readOnly
              className="w-1/2 mb-2 bg-transparent rounded-md border-b-2 py-[10px] px-4 text-dark outline-none"
            />
          </li>
          <li className="flex items-center space-x-2 text-gray-700">
            <label htmlFor="email" className="w-40 block text-base font-medium">Email:</label>
            <input
              id="email"
              type="email"
              value={userDetails.email}
              readOnly
              className="w-1/2 mb-2 bg-transparent rounded-md border-b-2 py-[10px] px-4 text-dark outline-none"
            />
          </li>
          <li className="flex items-center space-x-2 text-gray-700">
            <label htmlFor="role" className="w-40 block text-base font-medium">Employee Code:</label>
            <input
              id="role"
              type="text"
              value={userDetails.employeeCode}
              readOnly
              className="w-1/2 mb-2 bg-transparent rounded-md border-b-2 py-[10px] px-4 text-dark outline-none"
            />
          </li>
          <li className="flex items-center space-x-2 text-gray-700">
            <label htmlFor="role" className="w-40 block text-base font-medium">Department:</label>
            <input
              id="role"
              type="text"
              value={userDetails.departmentName}
              readOnly
              className="w-1/2 mb-2 bg-transparent rounded-md border-b-2 py-[10px] px-4 text-dark outline-none"
            />
          </li>
          <li className="flex items-center space-x-2 text-gray-700">
            <label htmlFor="role" className="w-40 block text-base font-medium">Designation:</label>
            <input
              id="role"
              type="text"
              value={userDetails.designationName}
              readOnly
              className="w-1/2 mb-2 bg-transparent rounded-md border-b-2 py-[10px] px-4 text-dark outline-none"
            />
          </li>
          <li className="flex items-center space-x-2 text-gray-700">
            <label htmlFor="role" className="w-40 block text-base font-medium">Mobile Number:</label>
            <input
              id="role"
              type="text"
              value={userDetails.mobileNumber}
              readOnly
              className="w-1/2 mb-2 bg-transparent rounded-md border-b-2 py-[10px] px-4 text-dark outline-none"
            />
          </li>
          <li className="flex items-center space-x-2 text-gray-700">
            <label htmlFor="role" className="w-40 block text-base font-medium">Date of Joining:</label>
            <input
              id="role"
              type="text"
              value={formatDate(userDetails.dateOfJoining)}
              readOnly
              className="w-1/2 mb-2 bg-transparent rounded-md border-b-2 py-[10px] px-4 text-dark outline-none"
            />
          </li>
          <li className="flex items-center space-x-2 text-gray-700">
            <label htmlFor="role" className="w-40 block text-base font-medium">Date of Birth:</label>
            <input
              id="role"
              type="text"
              value={formatDate(userDetails.birthDate)}
              readOnly
              className="w-1/2 mb-2 bg-transparent rounded-md border-b-2 py-[10px] px-4 text-dark outline-none"
            />
          </li>
          <li className="flex items-center space-x-2 text-gray-700">
            <label htmlFor="role" className="w-40 block text-base font-medium">Blood Group:</label>
            <input
              id="role"
              type="text"
              value={userDetails.bloodGroup}
              readOnly
              className="w-1/2 mb-2 bg-transparent rounded-md border-b-2 py-[10px] px-4 text-dark outline-none"
            />
          </li>
          <li className="flex items-center space-x-2 text-gray-700">
            <label htmlFor="role" className="w-40 block text-base font-medium">Address:</label>
            <input
              id="role"
              type="text"
              value={userDetails.address}
              readOnly
              className="w-1/2 mb-2 bg-transparent rounded-md border-b-2 py-[10px] px-4 text-dark outline-none"
            />
          </li>
          {/* Add more user details as needed */}
        </ul>
      </div>
    </div>
  );
  //#endregion
};

export default Profile;
//#endregion