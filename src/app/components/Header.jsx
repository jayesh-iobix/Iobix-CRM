import React, { Fragment, useState } from "react";
import { Menu, Popover, Transition } from "@headlessui/react";
import {
  HiOutlineBell,
  HiOutlineChatAlt,
} from "react-icons/hi";
import { useNavigate } from "react-router-dom";
import { BiUser } from "react-icons/bi";
import { jwtDecode } from "jwt-decode";
import classNames from "classnames";
import { motion } from "framer-motion"; // Import framer-motion
import { AttendanceService } from "../service/AttendanceService";
import { toast } from "react-toastify";

export default function Header() {
  // State to handle modal visibility, task input, and button visibility
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [workNote, setWorkNote] = useState("");
  const [isInTimeVisible, setIsInTimeVisible] = useState(true); // State to control "In Time" button visibility
  const [isInTimeDisabled, setIsInTimeDisabled] = useState(false); // State to control "In Time" button visibility
  const [isOutTimeVisible, setIsOutTimeVisible] = useState(true); // State to control "In Time" button visibility

  const navigate = useNavigate();

  const role = sessionStorage.getItem("role");
  const userName = sessionStorage.getItem("UserName");
  const loginId = sessionStorage.getItem("LoginUserId");

  const[attendanceId, setAttendanceId] = useState("");

  const handleLogout = () => {
    const token = sessionStorage.getItem("token");
    if (token) {
      try {
        const decodedToken = jwtDecode(token);
        sessionStorage.clear();
        navigate("/sign-in");
      } catch {
        alert("Token is not decoded");
      }
    }
  };

  const handleOutTimeClick = async() => {
    // Show modal when clicking Out Time button
    setIsModalOpen(true);
    setIsInTimeVisible(true); // Show the "In Time" button again when Out Time is clicked

  };

  const handleInTimeClick = async () => {
    // Hide the "In Time" button when clicked
    setIsInTimeVisible(false); // Hide the In Time button

    // const attendanceData = {
    //   inDateTime,
    //   outDateTime,
    //   totalTime: totalTimeFormatted,
    //   status,
    //   remarks,
    // };

    try {
      const response = await AttendanceService.addAttendance();
      if (response.status === 1) {
        toast.success("In Time Add Successfully"); // Toast on success
        setIsInTimeDisabled(true); // Disable the In Time button
        setIsInTimeVisible(false); 
        setIsOutTimeVisible(false);
        // toast.success(response.message); // Toast on success
      }
    } catch (error) {
      console.error("Error adding attendance:", error);
      toast.error("Failed to add attendance.");
    }

    // Add any additional logic for handling In Time
  };

  const handleCloseModal = () => {
    // Close modal
    setIsModalOpen(false);
  };

  const handleWorkNoteChange = (e) => {
    // Handle textarea input change
    setWorkNote(e.target.value);
  };

  const handleSubmitWorkNote = async(e) => {

    e.preventDefault(); // Prevent the default form submission behavior

    // Handle workNote submission logic
    const attendanceData = {
      employeeId: loginId,
      workNote
    };

    try {
      debugger;
      const response = await AttendanceService.updateAttendance(attendanceData);
      if (response.status === 1) {
        toast.success("Out Time Add Successfully"); // Toast on success
        setIsInTimeDisabled(false); // Enable the In Time button
        setIsInTimeVisible(true); 
        setIsOutTimeVisible(true);
        // toast.success(response.message); // Toast on success
      }
    } catch (error) {
      console.error("Error adding attendance:", error);
      toast.error("Failed to add attendance.");
    }

    // alert("WorkNote submitted: " + workNote);
    setIsModalOpen(false); // Close modal after submission
    setWorkNote(""); // Clear the workNote input
  };

  return (
    <div className="bg-white h-16 px-4 flex items-center border-b m-2 rounded-full border-gray-200 shadow-sm shadow-[#d0ecfc] justify-between">
      <div className="relative">
        {/* <HiOutlineSearch
          fontSize={20}
          className="text-gray-400 absolute top-1/2 left-3 -translate-y-1/2"
        />
        <input
          type="text"
          placeholder="Search..."
          className="text-sm focus:outline-none active:outline-none border border-gray-300  w-[24rem] h-10 pl-11 pr-4 rounded-full"
        /> */}
      </div>
      <div className="flex items-center gap-2 mr-2">
        {role === "user" && (
          <>
            {/* Conditionally render the "In Time" button */}
            {isInTimeVisible && (
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className={`bg-green-600 hover:bg-green-700 flex gap-2 text-center text-white font-medium py-2 px-4 rounded hover:no-underline me-2 ${isInTimeDisabled ? 'pointer-events-none opacity-50' : ''}`}
              onClick={handleInTimeClick} // In Time button click handler
              disabled={isInTimeDisabled} // Optional, for semantic purposes
            >
              In Time
            </motion.button>
             )}

            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className={`bg-red-600 hover:bg-red-700 flex gap-2 text-center text-white font-medium py-2 px-4 rounded hover:no-underline me-2 ${isOutTimeVisible ? 'pointer-events-none opacity-50' : ''}`}
              onClick={handleOutTimeClick} // Show modal on Out Time button click
              disabled={isOutTimeVisible}
            >
              Out Time
            </motion.button>

          </>
        )}

        {/* Modal for WorkNote */}
        {isModalOpen && (
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-1/3 shadow-lg">
              <h2 className="text-xl font-semibold mb-4">Enter WorkNote</h2>
              <textarea
                className="w-full h-32 p-2 border border-gray-300 rounded-md"
                value={workNote}
                onChange={handleWorkNoteChange}
                placeholder="Describe the workNote..."
              ></textarea>
              <div className="mt-4 flex justify-end gap-2">
                <button
                  className="bg-gray-300 px-4 py-2 rounded-md"
                  onClick={handleCloseModal} // Close modal
                >
                  Cancel
                </button>
                <button
                  className="bg-blue-600 text-white px-4 py-2 rounded-md"
                  onClick={(e) => handleSubmitWorkNote(e)} // Submit workNote
                >
                  Submit
                </button>
              </div>
            </div>
          </div>
        )}

        <Popover className="relative">
          {({ open }) => (
            <>
              <Popover.Button
                className={classNames(
                  open && "bg-gray-100",
                  "group inline-flex items-center rounded-sm p-1.5 text-gray-700 hover:text-opacity-100 focus:outline-none active:bg-gray-100"
                )}
              >
                <HiOutlineChatAlt fontSize={24} />
              </Popover.Button>
              <Transition
                as={Fragment}
                enter="transition ease-out duration-200"
                enterFrom="opacity-0 translate-y-1"
                enterTo="opacity-100 translate-y-0"
                leave="transition ease-in duration-150"
                leaveFrom="opacity-100 translate-y-0"
                leaveTo="opacity-0 translate-y-1"
              >
                <Popover.Panel className="absolute right-0 z-10 mt-2.5 transform w-80">
                  <div className="bg-white rounded-sm shadow-md ring-1 ring-black ring-opacity-5 px-2 py-2.5">
                    <strong className="text-gray-700 font-medium">
                      Messages
                    </strong>
                    <div className="mt-2 py-1 text-sm">
                      This is messages panel.
                    </div>
                  </div>
                </Popover.Panel>
              </Transition>
            </>
          )}
        </Popover>
        <Popover className="relative">
          {({ open }) => (
            <>
              <Popover.Button
                className={classNames(
                  open && "bg-gray-100",
                  "group inline-flex items-center rounded-sm p-1.5 text-gray-700 hover:text-opacity-100 focus:outline-none active:bg-gray-100"
                )}
              >
                <HiOutlineBell fontSize={24} />
              </Popover.Button>
              <Transition
                as={Fragment}
                enter="transition ease-out duration-200"
                enterFrom="opacity-0 translate-y-1"
                enterTo="opacity-100 translate-y-0"
                leave="transition ease-in duration-150"
                leaveFrom="opacity-100 translate-y-0"
                leaveTo="opacity-0 translate-y-1"
              >
                <Popover.Panel className="absolute right-0 z-10 mt-2.5 transform w-80">
                  <div className="bg-white rounded-sm shadow-md ring-1 ring-black ring-opacity-5 px-2 py-2.5">
                    <strong className="text-gray-700 font-medium">
                      Notifications
                    </strong>
                    <div className="mt-2 py-1 text-sm">
                      This is notification panel.
                    </div>
                  </div>
                </Popover.Panel>
              </Transition>
            </>
          )}
        </Popover>
        <Menu as="div" className="relative border-l-[1px] border-gray-400">
          <div className="flex">
            <Menu.Button className="ml-3 bg-gray-800 flex text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-neutral-400">
              <span className="sr-only">Open user menu</span>
              <div className="h-10 w-10 rounded-full bg-slate-100 bg-cover bg-no-repeat bg-center">
                <BiUser className="h-10 w-10 rounded-full " />
              </div>
            </Menu.Button>
            <span className="mt-[10px] ml-3 text-black">{userName}</span>
          </div>
          <Transition
            as={Fragment}
            enter="transition ease-out duration-100"
            enterFrom="transform opacity-0 scale-95"
            enterTo="transform opacity-100 scale-100"
            leave="transition ease-in duration-75"
            leaveFrom="transform opacity-100 scale-100"
            leaveTo="transform opacity-0 scale-95"
          >
            <Menu.Items className="origin-top-right z-10 absolute right-0 mt-2 w-48 rounded-sm shadow-md p-1 bg-white ring-1 ring-black ring-opacity-5 focus:outline-none">
              <Menu.Item>
                {({ active }) => (
                  role === "admin" ? (
                    <div
                      className={classNames(
                        active && "bg-gray-100",
                        "active:bg-gray-200 rounded-sm px-4 py-2 text-gray-700 cursor-pointer focus:bg-gray-200"
                      )}
                    >
                      Your Profile
                    </div>
                  ) : (
                    <div
                      onClick={() => navigate("/user/user-profile")}
                      className={classNames(
                        active && "bg-gray-100",
                        "active:bg-gray-200 rounded-sm px-4 py-2 text-gray-700 cursor-pointer focus:bg-gray-200"
                      )}
                    >
                      Your Profile
                    </div>
                  )
                )}
              </Menu.Item>
              <Menu.Item>
                {({ active }) => (
                  <div
                    className={classNames(
                      active && "bg-gray-100",
                      "active:bg-gray-200 rounded-sm px-4 py-2 text-gray-700 cursor-pointer focus:bg-gray-200"
                    )}
                    onClick={handleLogout}
                  >
                    Sign out
                  </div>
                )}
              </Menu.Item>
            </Menu.Items>
          </Transition>
        </Menu>
      </div>
    </div>
  );
}















// import React, { Fragment, useState } from "react";
// // import * as jwt_decode from "jwt-decode";
// import { Menu, Popover, Transition } from "@headlessui/react";
// import {
//   HiOutlineBell,
//   HiOutlineSearch,
//   HiOutlineChatAlt,
// } from "react-icons/hi";
// import { useNavigate } from "react-router-dom";
// // import classNames from "classnames";
// import { BiUser } from "react-icons/bi";
// import { jwtDecode } from "jwt-decode";
// import classNames from "classnames";
// import { motion } from "framer-motion"; // Import framer-motion

// export default function Header() {
//   // State to handle modal visibility and task input
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [task, setTask] = useState("");
//   const [isInTimeDisabled, setIsInTimeDisabled] = useState(false); // Added state for disabling InTime button

//   const navigate = useNavigate();

//   const role = sessionStorage.getItem("role");
//   const userName = sessionStorage.getItem("UserName");

//   const handleLogout = () => {
//     const token = sessionStorage.getItem("token");
//     if (token) {
//       try {
//         const decodedToken = jwtDecode(token);
//         sessionStorage.clear();
//         navigate("/sign-in");
//       } catch {
//         alert("Token is not decoded");
//       }
//     }
//   };

//   const handleOutTimeClick = () => {
//     // Show modal when clicking Out Time button
//     setIsModalOpen(true);
//     setIsInTimeDisabled(false); // Enable the In Time button when Out Time is clicked
//   };

//   const handleInTimeClick = () => {
//     // Disable the In Time button when clicked
//     setIsInTimeDisabled(true); // Disable the In Time button
//     // Add any additional logic for handling In Time
//   };

//   const handleCloseModal = () => {
//     // Close modal
//     setIsModalOpen(false);
//   };

//   const handleTaskChange = (e) => {
//     // Handle textarea input change
//     setTask(e.target.value);
//   };

//   const handleSubmitTask = () => {
//     // Handle task submission logic
//     alert("Task submitted: " + task);
//     setIsModalOpen(false); // Close modal after submission
//     setTask(""); // Clear the task input
//   };

//   return (
//     <div className="bg-white h-16 px-4 flex items-center border-b m-2 rounded-full border-gray-200 shadow-sm shadow-[#d0ecfc] justify-between">
//       <div className="relative">
//         {/* <HiOutlineSearch
//           fontSize={20}
//           className="text-gray-400 absolute top-1/2 left-3 -translate-y-1/2"
//         />
//         <input
//           type="text"
//           placeholder="Search..."
//           className="text-sm focus:outline-none active:outline-none border border-gray-300  w-[24rem] h-10 pl-11 pr-4 rounded-full"
//         /> */}
//       </div>
//       <div className="flex items-center gap-2 mr-2">
//         {role === "user" && (
//           <>
//             <motion.button
//               whileHover={{ scale: 1.1 }}
//               whileTap={{ scale: 0.9 }}
//               className="bg-green-600 hover:bg-green-700 flex gap-2 text-center text-white font-medium py-2 px-4 rounded hover:no-underline me-2"
//               onClick={handleInTimeClick} // In Time button click handler
//               disabled={isInTimeDisabled} // Disable the In Time button if isInTimeDisabled is true
//             >
//               In Time
//             </motion.button>

//             <motion.button
//               whileHover={{ scale: 1.1 }}
//               whileTap={{ scale: 0.9 }}
//               onClick={handleOutTimeClick} // Show modal on Out Time button click
//               className="bg-red-600 hover:bg-red-700 flex gap-2 text-center text-white font-medium py-2 px-4 rounded hover:no-underline"
//             >
//               Out Time
//             </motion.button>
//           </>
//         )}

//         {/* Modal for Task */}
//         {isModalOpen && (
//           <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50">
//             <div className="bg-white rounded-lg p-6 w-1/3 shadow-lg">
//               <h2 className="text-xl font-semibold mb-4">Enter Task</h2>
//               <textarea
//                 className="w-full h-32 p-2 border border-gray-300 rounded-md"
//                 value={task}
//                 onChange={handleTaskChange}
//                 placeholder="Describe the task..."
//               ></textarea>
//               <div className="mt-4 flex justify-end gap-2">
//                 <button
//                   className="bg-gray-300 px-4 py-2 rounded-md"
//                   onClick={handleCloseModal} // Close modal
//                 >
//                   Cancel
//                 </button>
//                 <button
//                   className="bg-blue-600 text-white px-4 py-2 rounded-md"
//                   onClick={handleSubmitTask} // Submit task
//                 >
//                   Submit
//                 </button>
//               </div>
//             </div>
//           </div>
//         )}

//         <Popover className="relative">
//           {({ open }) => (
//             <>
//               <Popover.Button
//                 className={classNames(
//                   open && "bg-gray-100",
//                   "group inline-flex items-center rounded-sm p-1.5 text-gray-700 hover:text-opacity-100 focus:outline-none active:bg-gray-100"
//                 )}
//               >
//                 <HiOutlineChatAlt fontSize={24} />
//               </Popover.Button>
//               <Transition
//                 as={Fragment}
//                 enter="transition ease-out duration-200"
//                 enterFrom="opacity-0 translate-y-1"
//                 enterTo="opacity-100 translate-y-0"
//                 leave="transition ease-in duration-150"
//                 leaveFrom="opacity-100 translate-y-0"
//                 leaveTo="opacity-0 translate-y-1"
//               >
//                 <Popover.Panel className="absolute right-0 z-10 mt-2.5 transform w-80">
//                   <div className="bg-white rounded-sm shadow-md ring-1 ring-black ring-opacity-5 px-2 py-2.5">
//                     <strong className="text-gray-700 font-medium">
//                       Messages
//                     </strong>
//                     <div className="mt-2 py-1 text-sm">
//                       This is messages panel.
//                     </div>
//                   </div>
//                 </Popover.Panel>
//               </Transition>
//             </>
//           )}
//         </Popover>
//         <Popover className="relative">
//           {({ open }) => (
//             <>
//               <Popover.Button
//                 className={classNames(
//                   open && "bg-gray-100",
//                   "group inline-flex items-center rounded-sm p-1.5 text-gray-700 hover:text-opacity-100 focus:outline-none active:bg-gray-100"
//                 )}
//               >
//                 <HiOutlineBell fontSize={24} />
//               </Popover.Button>
//               <Transition
//                 as={Fragment}
//                 enter="transition ease-out duration-200"
//                 enterFrom="opacity-0 translate-y-1"
//                 enterTo="opacity-100 translate-y-0"
//                 leave="transition ease-in duration-150"
//                 leaveFrom="opacity-100 translate-y-0"
//                 leaveTo="opacity-0 translate-y-1"
//               >
//                 <Popover.Panel className="absolute right-0 z-10 mt-2.5 transform w-80">
//                   <div className="bg-white rounded-sm shadow-md ring-1 ring-black ring-opacity-5 px-2 py-2.5">
//                     <strong className="text-gray-700 font-medium">
//                       Notifications
//                     </strong>
//                     <div className="mt-2 py-1 text-sm">
//                       This is notification panel.
//                     </div>
//                   </div>
//                 </Popover.Panel>
//               </Transition>
//             </>
//           )}
//         </Popover>
//         <Menu as="div" className="relative border-l-[1px] border-gray-400">
//           <div className="flex">
//             <Menu.Button className="ml-3 bg-gray-800 flex text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-neutral-400">
//               <span className="sr-only">Open user menu</span>
//               <div className="h-10 w-10 rounded-full bg-slate-100 bg-cover bg-no-repeat bg-center">
//                 <BiUser className="h-10 w-10 rounded-full " />
//               </div>
//             </Menu.Button>
//             <span className="mt-[10px] ml-3 text-black">{userName}</span>
//           </div>
//           <Transition
//             as={Fragment}
//             enter="transition ease-out duration-100"
//             enterFrom="transform opacity-0 scale-95"
//             enterTo="transform opacity-100 scale-100"
//             leave="transition ease-in duration-75"
//             leaveFrom="transform opacity-100 scale-100"
//             leaveTo="transform opacity-0 scale-95"
//           >
//             <Menu.Items className="origin-top-right z-10 absolute right-0 mt-2 w-48 rounded-sm shadow-md p-1 bg-white ring-1 ring-black ring-opacity-5 focus:outline-none">
//               <Menu.Item>
//                 {({ active }) => (
//                   role === "admin" ? (
//                     <div
//                       className={classNames(
//                         active && "bg-gray-100",
//                         "active:bg-gray-200 rounded-sm px-4 py-2 text-gray-700 cursor-pointer focus:bg-gray-200"
//                       )}
//                     >
//                       Your Profile
//                     </div>
//                   ) : (
//                     <div
//                       onClick={() => navigate("/user/user-profile")}
//                       className={classNames(
//                         active && "bg-gray-100",
//                         "active:bg-gray-200 rounded-sm px-4 py-2 text-gray-700 cursor-pointer focus:bg-gray-200"
//                       )}
//                     >
//                       Your Profile
//                     </div>
//                   )
//                 )}
//               </Menu.Item>
//               <Menu.Item>
//                 {({ active }) => (
//                   <div
//                     className={classNames(
//                       active && "bg-gray-100",
//                       "active:bg-gray-200 rounded-sm px-4 py-2 text-gray-700 cursor-pointer focus:bg-gray-200"
//                     )}
//                     onClick={handleLogout}
//                   >
//                     Sign out
//                   </div>
//                 )}
//               </Menu.Item>
//             </Menu.Items>
//           </Transition>
//         </Menu>
//       </div>
//     </div>
//   );
// }


