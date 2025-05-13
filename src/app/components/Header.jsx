//#region Imports
import React, { Fragment, useEffect, useState } from "react";
import { Menu, Popover, Transition } from "@headlessui/react";
import {
  HiOutlineBell,
  HiOutlineChatAlt,
} from "react-icons/hi";
import { useNavigate } from "react-router-dom";
import { BiUser } from "react-icons/bi";
// import { jwtDecode } from "jwt-decode";
import classNames from "classnames";
import { motion } from "framer-motion"; // Import framer-motion
import { AttendanceService } from "../service/AttendanceService";
import { toast } from "react-toastify";
import { AuthService } from "../service/AuthService";
import { messaging } from "../../firebase/firebase";
import { onMessage } from "firebase/messaging";
//#endregion

//#region Component: Header
export default function Header() {
  //#region State Variables
  // State to handle modal visibility, task input, and button visibility
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [workNote, setWorkNote] = useState("");
  const [outDateTime, setOutDateTime] = useState(""); // Out DateTime
  const [isForgot, setIsForgot] = useState(false); // Out DateTime
  const [isOutTimeButtonVisible, setIsOutTimeButtomVisible] = useState(Boolean); // State to control "In Time" and "Out Time" button visibility

  // State for managing notifications and unread count
  const [notifications, setNotifications] = useState([]);
  const [notificationLength, setNotificationLength] = useState(0);
  //#endregion
  
  //#region Variables
  const navigate = useNavigate();
  const role = sessionStorage.getItem("role");
  const userName = sessionStorage.getItem("UserName");
  const loginId = sessionStorage.getItem("LoginUserId");
  //#endregion

  //#region Effects
  useEffect(() => {
    // debugger;
    onMessage(messaging, (payload) => {

      const notificationSound = new Audio("/notification-sound.mp3"); // Sound file from public folder

      // Check if the audio is supported in the current environment
      // notificationSound.load();
      // notificationSound.onerror = () => {
      //   console.error("Failed to load audio file");
      // };

      // Listen for foreground messages
      const notification = payload.notification;
      // console.log(notification);

      // Play the notification sound
      notificationSound.play();

      // Ensure notifications is an array, and add the 'read' property
      setNotifications((prevNotifications) => [
        ...prevNotifications,
        { ...notification, read: false } // Adding 'read' property to each notification
      ]);

      // Calculate the number of notifications (or length of notifications)
      setNotificationLength(prevLength => prevLength + 1);

      // console.log('Notification Length:', notificationLength);
    });
  }, [notificationLength]); // Re-run effect when notificationLength changes

  useEffect(() => {
    fetchIsOutTime();
  }, []);
  //#endregion

  //#region Helper Functions

  // Fetch out-time button visibility
  const fetchIsOutTime = async () => {
    try {
      const res = await AuthService.getBasicDetail();
      setIsOutTimeButtomVisible(res.data.isOutTime)
      // console.log(res.data.isOutTime)
      // console.log(res.data);
    } catch (error) {
      console.error("Error fetching IsOutTime data:", error);
      alert("Error fetching IsOutTime, please try again.");
    }
  };

  // Mark a notification as read
  const handleMarkAsRead = (index) => {
    setNotifications((prevNotifications) =>
      prevNotifications.map((notif, i) =>
        i === index ? { ...notif, read: true } : notif
      )
    );
    // Optionally, update notificationLength
    setNotificationLength(prevLength => prevLength - 1);
  };
  
  // Logout Function
  const handleLogout = () => {
    const token = sessionStorage.getItem("token");
    if (token) {
      try {
        // const decodedToken = jwtDecode(token);
        sessionStorage.clear();
        navigate("/sign-in");
      } catch {
        alert("Token is not decoded");
      }
    }
  };

  // OutTime Click
  const handleOutTimeClick = async() => {
    // Show modal when clicking Out Time button
    setIsModalOpen(true);

  };

  // InTime Click
  const handleInTimeClick = async () => {

    try {
      const response = await AttendanceService.addAttendance();
      if (response.status === 1) {
        toast.success("In Time Add Successfully"); // Toast on success
        fetchIsOutTime();
        // toast.success(response.message); // Toast on success
      }
    } catch (error) {
      console.error("Error adding attendance:", error);
      toast.error("Failed to add attendance.");
    }

    // Add any additional logic for handling In Time
  };

  // handle Close Modal Click
  const handleCloseModal = () => {
    // Close modal
    setIsModalOpen(false);
  };

  // Handle WorkNote Change
  const handleWorkNoteChange = (e) => {
    // Handle textarea input change
    setWorkNote(e.target.value);
  };

  // Submit Worknote
  const handleSubmitWorkNote = async(e) => {

    e.preventDefault(); // Prevent the default form submission behavior

    // Handle workNote submission logic
    const attendanceData = {
      employeeId: loginId,
      workNote,
      isForgot,
      outDateTime: outDateTime === "" ? null : outDateTime,
    };

    // console.log(attendanceData)

    try {
      // debugger;
      const response = await AttendanceService.updateAttendance(attendanceData);
      if (response.status === 1) {
        toast.success("Out Time Add Successfully"); // Toast on success
        fetchIsOutTime();
        // toast.success(response.message); // Toast on success
      }
    } catch (error) {
      console.error("Error adding attendance:", error);
      toast.error("Failed to add attendance.");
    }

    // alert("WorkNote submitted: " + workNote);
    setIsModalOpen(false); // Close modal after submission
    setWorkNote(""); // Clear the workNote input
    setOutDateTime(""); // Clear the outDateTime  input
  };
  //#endregion

  //#region Render JSX
  return (
    <div className="bg-white h-16 px-4 flex items-center border-b m-2 rounded-full border-gray-200 shadow-sm shadow-[#d0ecfc] justify-between">
      <div className="relative">
        {/* Search Bar (Commented Out) */}
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

            {isOutTimeButtonVisible === true ? (
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className={`bg-green-600 hover:bg-green-700  gap-2 text-center text-white font-medium py-2 px-4 rounded hover:no-underline me-2 w-full sm:w-auto sm:block hidden`}
                // className="bg-green-600 hover:bg-green-700 flex gap-2 text-center text-white font-medium py-2 px-4 rounded hover:no-underline me-2 w-full sm:w-auto"
                onClick={handleInTimeClick} // Show modal or handle In Time logic
              >
                In Time
              </motion.button>
            ) : (
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="bg-red-600 hover:bg-red-700 gap-2 text-center text-white font-medium py-2 px-4 rounded hover:no-underline me-2 w-full sm:w-auto sm:block hidden"
                onClick={handleOutTimeClick} // Show modal or handle Out Time logic
              >
                Out Time
              </motion.button>
            )}
          </>
        )}

        {/* Modal for WorkNote */}
        {isModalOpen && (
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-4 sm:p-6 w-full sm:w-1/3 md:w-1/4 lg:w-1/3 shadow-lg">
              <h2 className="text-xl font-semibold mb-4">Enter WorkNote</h2>
              <textarea
                className="w-full h-32 p-2 border border-gray-300 rounded-md border-active"
                value={workNote}
                onChange={handleWorkNoteChange}
                placeholder="Describe the workNote..."
              ></textarea>

              <label className="mb-[10px] mt-2 text-base font-medium text-dark dark:text-white">
                Did you forget to add your out time? If so, check this box to
                add the out time for that day.
              </label>
              <input
                type="checkbox"
                checked={isForgot}
                onChange={() => setIsForgot((prevState) => !prevState)} // Toggling the state on change
                className="w-5 h-5 ml-1"
              />

              {/* <label className="mb-[10px] mt-2 block text-base font-medium text-dark dark:text-white">
                Are you forgot add out time? Then click this check box and add out time of that day 
                <input 
                  type="checkbox" 
                  value={isForgot} 
                  onChange={setIsForgot(true)}  
                  className="w-4 items-center h-4" 
                  />
              </label> */}

              {/* You forgot to add out time for tomorrow, please enter it! <input className="w-4 items-center h-4" type="checkbox" /> */}
              {isForgot === true && (
                <input
                  type="datetime-local"
                  value={outDateTime}
                  onChange={(e) => {
                    setOutDateTime(e.target.value);
                  }}
                  className="mt-1 block w-full p-2 border border-gray-300 rounded-md border-active"
                />
              )}
              <div className="mt-4 flex flex-col sm:flex-row justify-end gap-2">
                <button
                  className="bg-gray-300 px-4 py-2 rounded-md w-full sm:w-auto"
                  onClick={handleCloseModal} // Close modal
                >
                  Cancel
                </button>
                <button
                  className="bg-blue-600 text-white px-4 py-2 rounded-md w-full sm:w-auto"
                  onClick={(e) => handleSubmitWorkNote(e)} // Submit workNote
                >
                  Submit
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Chat Popover */}
        {/* <Popover className="relative">
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
                <Popover.Panel className="absolute right-0 z-10 mt-2.5 transform w-60 sm:w-64 md:w-72 lg:w-80 xl:w-96">
                  <div className="bg-white rounded-sm shadow-md ring-1 ring-black ring-opacity-5 px-4 py-4 sm:px-3 sm:py-3 md:px-4 md:py-4">
                    <strong className="text-gray-700 font-medium text-sm sm:text-base">
                      Messages
                    </strong>
                    <div className="mt-2 py-1 text-sm sm:text-base">
                      This is messages panel.
                    </div>
                  </div>
                </Popover.Panel>
              </Transition>
            </>
          )}
        </Popover> */}

        {/* Notifications Popover */}
        <Popover className="relative">
          {({ open }) => (
            <>
              <Popover.Button
                className={classNames(
                  open && "bg-gray-100",
                  "group inline-flex items-center rounded-sm p-1.5 text-gray-700 hover:text-opacity-100 focus:outline-none active:bg-gray-100"
                )}
              >
                <div className="relative">
                  <HiOutlineBell fontSize={24} />
                  {notificationLength > 0 && (
                    <span className="absolute left-2 bottom-3 right-0 inline-flex items-center justify-center w-5 h-5 text-xs font-semibold text-white bg-red-500 rounded-full">
                      {notificationLength}
                    </span>
                  )}
                </div>
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
                <Popover.Panel className="absolute right-2 z-10 mt-2.5 transform w-60 sm:w-64 md:w-72 lg:w-80 xl:w-96">
                  <div className="bg-white rounded-sm shadow-md ring-1 ring-black ring-opacity-5 px-4 py-4 sm:px-3 sm:py-3 md:px-4 md:py-4">
                    <strong className="text-gray-700 font-medium text-sm sm:text-base">
                      Notifications
                    </strong>
                    <div className="mt-2 py-1 text-sm sm:text-base max-h-96 overflow-y-auto">
                    {notifications.length > 0 ? (
                        notifications.map((notification, index) => (
                          <div
                            key={index} // Using index as the key
                            className={classNames(
                              "bg-gray-50",
                              "p-2 rounded-lg my-1 border border-gray-200",
                              notification.read ? "bg-gray-200" : "bg-white"
                            )}
                          >
                            <span className="font-semibold">{notification.title}</span>
                            <p>{notification.body}</p>
                            {!notification.read && (
                              <button
                                onClick={() => handleMarkAsRead(index)}
                                className="ml-2 text-xs text-blue-500"
                              >
                                Mark as Read
                              </button>
                            )}
                          </div>
                        ))
                      ) : (
                        <div>No new notifications</div>
                      )}
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
            <span className="mt-[10px] ml-3 text-black hidden sm:block">
              {userName}
            </span>
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
                {({ active }) =>
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
                    onClick={() => {
                      // Get the user's role (this can be from state, context, or props)
                    
                      // Conditionally navigate based on the role
                      if (role === 'user') {
                        navigate("/user/user-profile");
                      } else if (role === 'partner') {
                        navigate("/partner/partner-profile");
                      } else if (role === 'company') {
                        navigate("/company/company-profile");
                      } else if (role === 'vendor') {
                        navigate("/vendor/vendor-profile");
                      } else {
                        // Default navigation or error handling (optional)
                        console.log("Unknown role");
                      }
                    }}
                    
                      className={classNames(
                        active && "bg-gray-100",
                        "active:bg-gray-200 rounded-sm px-4 py-2 text-gray-700 cursor-pointer focus:bg-gray-200"
                      )}
                    >
                      Your Profile
                    </div>
                  )
                }
              </Menu.Item>

              {role === "user" && (
                <>
                  {/* Conditionally render "In Time" or "Out Time" Button inside Menu */}
                  <Menu.Item>
                    {({ active }) => (
                      <div
                        onClick={
                          isOutTimeButtonVisible
                            ? handleInTimeClick
                            : handleOutTimeClick
                        }
                        className={classNames(
                          active && "bg-gray-100",
                          "active:bg-gray-200 rounded-sm px-4 py-2 text-gray-700 cursor-pointer focus:bg-gray-200 block sm:hidden"
                        )}
                      >
                        {isOutTimeButtonVisible ? "In Time" : "Out Time"}
                      </div>
                    )}
                  </Menu.Item>
                </>
              )}

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