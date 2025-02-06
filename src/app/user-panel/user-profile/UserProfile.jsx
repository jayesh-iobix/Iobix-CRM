import React, { useEffect, useState } from 'react';
// import profile from '../../../assets/profilePic2.jpg'
import { useNavigate } from 'react-router-dom';
import { IoClose } from 'react-icons/io5';
import { FaUser } from "react-icons/fa";
import { EmployeeService } from '../../service/EmployeeService';
import { motion } from "framer-motion"; // Import framer-motion


const UserProfile = () => {

    const [userDetails, setUserDetails] = useState("");
    const navigate = useNavigate();

  const fetchUserDetails = async () => {
    try {
      const result = await EmployeeService.getEmployeesProfileDetail();
      setUserDetails(result.data);

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
    fetchUserDetails()
  },[])

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
        <motion.button
          whileHover={{ scale: 1.2 }}
          whileTap={{ scale: 0.9 }}
        >
            {/* <FaCircleXmark onClick={()=> navigate(-1)} className='text-red-500 cursor-pointer' size={35}/> */}
            <IoClose onClick={()=> navigate(-1)} className='text-red-500 cursor-pointer' size={40}/>
            </motion.button>
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

    // <div className="mx-auto bg-white rounded-lg shadow-lg p-6">
    //   {/* Container for Image and Name */}
    //   <div className="flex justify-between space-x-4 mb-6">
    //     <div className="flex items-start space-x-4">
    //     {/* User Image */}
    //     <img
    //       src={profile}
    //       alt="user-image"
    //       className="w-20 h-20 rounded-full object-cover border-4 border-gray-500"
    //     />
    //     {/* <FaUser className="w-20 h-20 rounded-full object-cover p-1 border-4 border-gray-500"/> */}

    //     {/* User Name and Role */}
    //     <div>
    //       <h2 className="text-3xl mt-1 font-semibold text-gray-800">{userDetails.firstName +" "+ userDetails.lastName}</h2>
    //       <p className="text-gray-500 text-xl">{userDetails.departmentName}</p>
    //     </div>
    //     </div>
    //     <div>
    //         {/* <FaCircleXmark onClick={()=> navigate(-1)} className='text-red-500 cursor-pointer' size={35}/> */}
    //         <IoClose onClick={()=> navigate(-1)} className='text-red-500 cursor-pointer' size={40}/>
    //     </div>
    //   </div>

    //   {/* User Details Section */}
    //     {/* <hr/> */}
    //   <div className="mt-10">
    //     <h3 className="text-xl font-semibold text-gray-800">User Details</h3>
    //   <div className='flex justify-between'>
    //     <ul className="w-full mt-4 space-y-2">
    //       <li className="flex items-center space-x-2 text-gray-700">
    //         <label htmlFor="name" className="w-40 block text-base font-medium">Full Name:</label>
    //         <input
    //           id="name"
    //           type="text"
    //           value={userDetails.firstName +" "+ userDetails.lastName}
    //           readOnly
    //           className="w-1/2 mb-2 bg-transparent rounded-md border-b-2 py-[10px] px-4 text-dark outline-none"
    //         />
    //       </li>
    //       <li className="flex items-center space-x-2 text-gray-700">
    //         <label htmlFor="email" className="w-40 block text-base font-medium">Email:</label>
    //         <input
    //           id="email"
    //           type="email"
    //           value={userDetails.email}
    //           readOnly
    //           className="w-1/2 mb-2 bg-transparent rounded-md border-b-2 py-[10px] px-4 text-dark outline-none"
    //         />
    //       </li>
    //       <li className="flex items-center space-x-2 text-gray-700">
    //         <label htmlFor="role" className="w-40 block text-base font-medium">Employee Code:</label>
    //         <input
    //           id="role"
    //           type="text"
    //           value={userDetails.employeeCode}
    //           readOnly
    //           className="w-1/2 mb-2 bg-transparent rounded-md border-b-2 py-[10px] px-4 text-dark outline-none"
    //         />
    //       </li>
    //       <li className="flex items-center space-x-2 text-gray-700">
    //         <label htmlFor="role" className="w-40 block text-base font-medium">Department:</label>
    //         <input
    //           id="role"
    //           type="text"
    //           value={userDetails.departmentName}
    //           readOnly
    //           className="w-1/2 mb-2 bg-transparent rounded-md border-b-2 py-[10px] px-4 text-dark outline-none"
    //         />
    //       </li>
    //       <li className="flex items-center space-x-2 text-gray-700">
    //         <label htmlFor="role" className="w-40 block text-base font-medium">Designation:</label>
    //         <input
    //           id="role"
    //           type="text"
    //           value={userDetails.designationName}
    //           readOnly
    //           className="w-1/2 mb-2 bg-transparent rounded-md border-b-2 py-[10px] px-4 text-dark outline-none"
    //         />
    //       </li>
    //       <li className="flex items-center space-x-2 text-gray-700">
    //         <label htmlFor="role" className="w-40 block text-base font-medium">Mobile Number:</label>
    //         <input
    //           id="role"
    //           type="text"
    //           value={userDetails.mobileNumber}
    //           readOnly
    //           className="w-1/2 mb-2 bg-transparent rounded-md border-b-2 py-[10px] px-4 text-dark outline-none"
    //         />
    //       </li>
    //       <li className="flex items-center space-x-2 text-gray-700">
    //         <label htmlFor="role" className="w-40 block text-base font-medium">Date of Joining:</label>
    //         <input
    //           id="role"
    //           type="text"
    //           value={formatDate(userDetails.dateOfJoining)}
    //           readOnly
    //           className="w-1/2 mb-2 bg-transparent rounded-md border-b-2 py-[10px] px-4 text-dark outline-none"
    //         />
    //       </li>
    //       <li className="flex items-center space-x-2 text-gray-700">
    //         <label htmlFor="role" className="w-40 block text-base font-medium">Date of Birth:</label>
    //         <input
    //           id="role"
    //           type="text"
    //           value={formatDate(userDetails.birthDate)}
    //           readOnly
    //           className="w-1/2 mb-2 bg-transparent rounded-md border-b-2 py-[10px] px-4 text-dark outline-none"
    //         />
    //       </li>
    //       <li className="flex items-center space-x-2 text-gray-700">
    //         <label htmlFor="role" className="w-40 block text-base font-medium">Blood Group:</label>
    //         <input
    //           id="role"
    //           type="text"
    //           value={userDetails.bloodGroup}
    //           readOnly
    //           className="w-1/2 mb-2 bg-transparent rounded-md border-b-2 py-[10px] px-4 text-dark outline-none"
    //         />
    //       </li>
    //       <li className="flex items-center space-x-2 text-gray-700">
    //         <label htmlFor="role" className="w-40 block text-base font-medium">Address:</label>
    //         <textarea
    //           id="role"
    //           type="text"
    //           value={userDetails.address}
    //           readOnly
    //           className="w-1/2 mb-2 bg-transparent rounded-md border-b-2 py-[10px] px-4 text-dark outline-none"
    //         />
    //       </li>
    //       {/* Add more user details as needed */}
    //     </ul>
    //     <div className='w-1/2'>
    //         <div className='bg-[#E2E2FF] flex justify-around h-full'>
    //             <div className="w-[200px] h-48 mt-16 object-cover rounded-md p-1 border-4 border-gray-500">
    //             {/* <FaUser/> */}
    //             <img className="h-full w-full" src={profile}
    //             alt = "profile-pic"
    //             />
    //             <button className=' mt-5 px-5 py-3 w-full bg-blue-600 text-white font-medium rounded-md hover:bg-[#2564ebdb] active:border-[#a8adf4] outline-none active:border-2 focus:ring-2 ring-blue-300 '>
    //                 Change Image
    //             </button>
    //             </div>
    //         </div>
    //     </div>
    //     </div>
    //   </div>
    // </div>
  );
};

export default UserProfile;
















// import React, { useState } from 'react';
// import profile from '../../assets/profilePic2.jpg';
// import { IoClose } from 'react-icons/io5';

// const Profile = () => {
//   // Example user data (can be fetched from an API or context)
//   const user = {
//     name: 'John Doe',
//     email: 'johndoe@example.com',
//     role: 'Admin',
//   };

//   const [image, setImage] = useState(profile); // state to hold the profile image

//   const handleImageUpload = (e) => {
//     const file = e.target.files[0];
//     if (file) {
//       const reader = new FileReader();
//       reader.onloadend = () => {
//         setImage(reader.result); // update the image state with the new image
//       };
//       reader.readAsDataURL(file); // read the file as a data URL
//     }
//   };

//   return (
//     <div className="mx-auto bg-white rounded-lg shadow-lg p-6">
//       {/* Container for Image and Name */}
//       <div className="flex justify-between space-x-4 mb-6">
//         <div className="flex items-start space-x-4">
//           {/* User Image */}
//           <img
//             className="w-20 h-20 rounded-full object-cover border-4 border-gray-500"
//             src={image}
//             alt="profile"
//           />
//           {/* User Name and Role */}
//           <div>
//             <h2 className="text-3xl mt-1 font-semibold text-gray-800">{user.name}</h2>
//             <p className="text-gray-500 text-xl">{user.role}</p>
//           </div>
//         </div>
//         <div>
//           <IoClose  className="text-red-500 cursor-pointer" size={40} />
//         </div>
//       </div>

//       {/* User Details Section */}
//       <div className="mt-10">
//         <h3 className="text-xl font-semibold text-gray-800">User Details</h3>
//         <div className="flex justify-between">
//           <ul className="w-full mt-4 space-y-2">
//             <li className="flex items-center space-x-2 text-gray-700">
//               <label htmlFor="name" className="w-40 block text-base font-medium">Full Name:</label>
//               <input
//                 id="name"
//                 type="text"
//                 value={user.name}
//                 readOnly
//                 className="w-1/2 mb-2 bg-transparent rounded-md border-b-2 py-[10px] px-4 text-dark outline-none"
//               />
//             </li>
//             <li className="flex items-center space-x-2 text-gray-700">
//               <label htmlFor="email" className="w-40 block text-base font-medium">Email:</label>
//               <input
//                 id="email"
//                 type="email"
//                 value={user.email}
//                 readOnly
//                 className="w-1/2 mb-2 bg-transparent rounded-md border-b-2 py-[10px] px-4 text-dark outline-none"
//               />
//             </li>
//             <li className="flex items-center space-x-2 text-gray-700">
//               <label htmlFor="role" className="w-40 block text-base font-medium">Employee Code:</label>
//               <input
//                 id="role"
//                 type="text"
//                 value={user.role}
//                 readOnly
//                 className="w-1/2 mb-2 bg-transparent rounded-md border-b-2 py-[10px] px-4 text-dark outline-none"
//               />
//             </li>
//             {/* Additional user details can go here */}
//           </ul>

//           {/* Upload Image Section */}
//           <div className="w-1/2 mt-4">
//             <div className="flex flex-col items-center">
//               <img
//                 className="h-48 w-48 object-cover rounded-md border-2 border-gray-300"
//                 src={image}
//                 alt="profile-pic"
//               />
//               <label htmlFor="upload-image" className="mt-4 cursor-pointer text-blue-500 font-semibold">
//                 Upload New Image
//               </label>
//               <input
//                 id="upload-image"
//                 type="file"
//                 accept="image/*"
//                 onChange={handleImageUpload}
//                 className="hidden" // hide the default file input
//               />
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default UserProfile;
