//#region Imports
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { IoClose } from 'react-icons/io5';
import { FaUser } from "react-icons/fa";
import { EmployeeService } from '../../service/EmployeeService';
import { motion } from "framer-motion"; // Import framer-motion
import { ProfileService } from '../../service/ProfileService';
//#endregion

//#region Component: PartnerProfile
const PartnerProfile = () => {

 //#region State Variables
 const [partnerDetails, setPartnerDetails] = useState("");
 const navigate = useNavigate();
 //#endregion
 
 //#region Fetch Profile Details Role vise
 const role = sessionStorage.getItem("role");

  const fetchPartnerDetails = async () => {
    try {
        let result;

        // Call API based on the user role
        if (role === 'partner') {
          result = await ProfileService.getPartnerProfileDetail();
        } else if (role === 'company') {
          result = await ProfileService.getClientProfileDetail();
        } else if (role === 'vendor') {
          result = await ProfileService.getVendorProfileDetail();
        } else {
          throw new Error('Unknown role');
        }
    
        // Set the details based on the response
        if (result && result.data) {
          setPartnerDetails(result.data); // You can rename `setPartnerDetails` to something more general like `setProfileDetails` if you want.
        }

    } catch (error) {
      console.error("Error fetching tasks:", error);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    
    // Get day, month, and year
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are zero-indexed
    const year = date.getFullYear();
  
    // Return formatted date in dd/mm/yyyy
    return `${day}/${month}/${year}`;
  };
  
  useEffect(() => {
    fetchPartnerDetails()
  },[])
  //#endregion

  //#region Render
  return (
    <div className="mx-auto bg-white rounded-lg shadow-lg p-6 max-w-full w-full">
      {/* Container for Image and Name */}
      <div className="flex flex-col sm:flex-row justify-between space-x-4 mb-6">
        <div className="flex items-start space-x-4">
        {/* User Image */}
        <FaUser className="w-20 h-20 rounded-full object-cover p-1 border-4 border-gray-500"/>

        {/* User Name and Role */}
        <div>
          <h2 className="text-3xl mt-1 font-semibold text-gray-800">{partnerDetails.contactPersonName}</h2>
          <p className="text-gray-500 text-xl">{partnerDetails.companyName}</p>
        </div>
        </div>
        <div>
        <motion.button
          whileHover={{ scale: 1.2 }}
          whileTap={{ scale: 0.9 }}
        >
            <IoClose onClick={()=> navigate(-1)} className='text-red-500 cursor-pointer' size={40}/>
        </motion.button>
        </div>
      </div>

      {/* Partner Details Section */}
      <div className="mt-10">
        <h3 className="text-xl font-semibold text-gray-800">
        {role === 'company' ? 'Company Details' : 
         role === 'partner' ? 'Partner Details' : 
         role === 'vendor' ? 'Vendor Details' : 'Other Role Details'
        }
        </h3>
        <ul className="mt-4 space-y-2">
          <li className="flex flex-col sm:flex-row items-center space-x-2 text-gray-700">
            <label htmlFor="name" className="w-full sm:w-40 block text-base font-medium">Company Name:</label>
            <input
              id="name"
              type="text"
              value={partnerDetails.companyName}
              readOnly
              className="w-full sm:w-1/2 mb-2 bg-transparent rounded-md border-b-2 py-[10px] px-4 text-dark outline-none"
            />
          </li>
          <li className="flex flex-col sm:flex-row items-center space-x-2 text-gray-700">
            <label htmlFor="email" className="w-full sm:w-40 block text-base font-medium">Email:</label>
            <input
              id="email"
              type="email"
              value={partnerDetails.email}
              readOnly
              className="w-full sm:w-1/2 mb-2 bg-transparent rounded-md border-b-2 py-[10px] px-4 text-dark outline-none"
            />
          </li>
          <li className="flex flex-col sm:flex-row items-center space-x-2 text-gray-700">
            <label htmlFor="email" className="w-full sm:w-40 block text-base font-medium">Contact Person Name:</label>
            <input
              id="email"
              type="email"
              value={partnerDetails.contactPersonName}
              readOnly
              className="w-full sm:w-1/2 mb-2 bg-transparent rounded-md border-b-2 py-[10px] px-4 text-dark outline-none"
            />
          </li>
          <li className="flex flex-col sm:flex-row items-center space-x-2 text-gray-700">
            <label htmlFor="role" className="w-full sm:w-40 block text-base font-medium">Company Registration No:</label>
            <input
              id="role"
              type="text"
              value={partnerDetails.companyRegistrationNumber}
              readOnly
              className="w-full sm:w-1/2 mb-2 bg-transparent rounded-md border-b-2 py-[10px] px-4 text-dark outline-none"
            />
          </li>
          <li className="flex flex-col sm:flex-row items-center space-x-2 text-gray-700">
            <label htmlFor="role" className="w-full sm:w-40 block text-base font-medium">Company GST No:</label>
            <input
              id="role"
              type="text"
              value={partnerDetails.companyGSTNumber}
              readOnly
              className="w-full sm:w-1/2 mb-2 bg-transparent rounded-md border-b-2 py-[10px] px-4 text-dark outline-none"
            />
          </li>
          <li className="flex flex-col sm:flex-row items-center space-x-2 text-gray-700">
            <label htmlFor="role" className="w-full sm:w-40 block text-base font-medium">Company Linkedin:</label>
            <input
              id="role"
              type="text"
              value={partnerDetails.companyLinkedin}
              readOnly
              className="w-full sm:w-1/2 mb-2 bg-transparent rounded-md border-b-2 py-[10px] px-4 text-dark outline-none"
            />
          </li>
          <li className="flex flex-col sm:flex-row items-center space-x-2 text-gray-700">
            <label htmlFor="role" className="w-full sm:w-40 block text-base font-medium">Phone Number:</label>
            <input
              id="role"
              type="text"
              value={partnerDetails.phoneNumber}
              readOnly
              className="w-full sm:w-1/2 mb-2 bg-transparent rounded-md border-b-2 py-[10px] px-4 text-dark outline-none"
            />
          </li>
          <li className="flex flex-col sm:flex-row items-center space-x-2 text-gray-700">
            <label htmlFor="role" className="w-full sm:w-40 block text-base font-medium">WhatsApp Number:</label>
            <input
              id="role"
              type="text"
              value={partnerDetails.whatsAppNumber}
              readOnly
              className="w-full sm:w-1/2 mb-2 bg-transparent rounded-md border-b-2 py-[10px] px-4 text-dark outline-none"
            />
          </li>
          <li className="flex flex-col sm:flex-row items-center space-x-2 text-gray-700">
            <label htmlFor="role" className="w-full sm:w-40 block text-base font-medium">Contact Person Linkedin:</label>
            <input
              id="role"
              type="text"
              value={partnerDetails.contactPersonLinkedin}
              readOnly
              className="w-full sm:w-1/2 mb-2 bg-transparent rounded-md border-b-2 py-[10px] px-4 text-dark outline-none"
            />
          </li>
          <li className="flex flex-col sm:flex-row items-center space-x-2 text-gray-700">
            <label htmlFor="role" className="w-full sm:w-40 block text-base font-medium">Address:</label>
            <input
              id="role"
              type="text"
              value={partnerDetails.address}
              readOnly
              className="w-full sm:w-1/2 mb-2 bg-transparent rounded-md border-b-2 py-[10px] px-4 text-dark outline-none"
            />
          </li>
        </ul>
      </div>
    </div>
  );
  //#region Render
};

export default PartnerProfile;
//#region Render
