//#region Imports
import React, { useEffect, useState } from "react";
import { FaEye } from "react-icons/fa";
import { AnnouncementService } from "../../service/AnnouncementService"; // Assuming this service is already set
import { motion } from "framer-motion"; // For smooth animations
//#endregion

//#region Component: AttendanceList
const Announcement = () => {
  //#region State Variables
  const [announcements, setAnnouncements] = useState([]);
  //#endregion
  
  //#region useEffect: Fetch Attendance Data
  useEffect(() => {
    const fetchAnnouncements = async () => {
      try {
        const result = await AnnouncementService.getAnnouncement(); // Fetch announcements from the service
        setAnnouncements(result.data); // Store the announcements in state
      } catch (error) {
        console.error("Error fetching announcements:", error);
      }
    };

    fetchAnnouncements();
  }, []);
  //#endregion

  //#region Format Date
  // Function to format the date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString("en-US", {
      weekday: "short",
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: true,
    });
  };
  //#endregion

  //#region Render
  return (
    <div className="overflow-x-auto bg-white px-4 pt-3 pb-4 rounded-sm border border-gray-200 grid">
      <strong className="text-gray-700 font-medium">Recent Announcements</strong>
      <div className="border-x border-gray-200 rounded-sm mt-3">
        <table className="w-full text-gray-700">
          <thead>
            <tr>
              <th className="py-2 px-3 text-left">Title</th>
              <th className="py-2 px-3 text-left">Message</th>
              <th className="py-2 px-3 text-left">Date</th>
              {/* <th className="py-2 px-3 text-left">Actions</th> */}
            </tr>
          </thead>
          <tbody>
            {announcements.length === 0 ? (
              <tr>
                <td colSpan="4" className="text-center py-3 px-4 text-gray-700">
                  No announcements found.
                </td>
              </tr>
            ) : (
              announcements.map((announcement, index) => (
                <motion.tr
                  key={announcement.announcementId}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="border-b hover:bg-gray-50"
                >
                  <td className="py-3 px-4">{announcement.title}</td>
                  <td className="py-3 px-4">{announcement.message}</td>
                  <td className="py-3 px-4">{formatDate(announcement.announcementDateTime)}</td>
                  {/* <td className="py-3 px-4">
                    <div className="flex gap-2 justify-center">
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        className="text-green-500 hover:text-green-700"
                      >
                        <FaEye size={20} />
                      </motion.button>
                    </div>
                  </td> */}
                </motion.tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
  //#endregion
};

export default Announcement;
//#endregion
