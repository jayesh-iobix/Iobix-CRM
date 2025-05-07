//#region Imports
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";
import { motion } from "framer-motion";
import { AnnouncementService } from "../../service/AnnouncementService";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";
//#endregion

//#region Component: ViewAnnouncement
const ViewAnnouncement = () => {
  //#region State variables
  const { id } = useParams(); // Get the announcementId from the URL
  const [announcement, setAnnouncement] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  //#endregion

  //#region Fetch Announcement Data
  useEffect(() => {
    const fetchAnnouncementDetails = async () => {
      try {
        const result = await AnnouncementService.getAnnouncementById(id);
        setAnnouncement(result.data);
        console.log(result.data)
      } catch (error) {
        console.error("Error fetching announcement:", error);
        toast.error("Failed to fetch announcement details");
      } finally {
        setIsLoading(false);
      }
    };

    fetchAnnouncementDetails();
  }, [id]);
  //#endregion

  //#region Format Date
  const formatDate = (dateString) => {
    if (!dateString) return "";
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

  //#region Render: Loading / Error
  if (isLoading) {
    return (
      <div className="text-center">
        <p>Loading...</p>
      </div>
    );
  }

  if (!announcement) {
    return (
      <div className="text-center">
        <p>No announcement found!</p>
      </div>
    );
  }
  //#endregion

  //#region Render
  return (
    <div className="p-6 mx-auto">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        {/* Header */}
        <div className="flex justify-between items-center my-3">
          <h2 className="font-semibold text-2xl">View Announcement</h2>
          <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
            <Link
              onClick={() => navigate(-1)}
              className="text-blue-600 hover:text-blue-700 flex items-center gap-2"
            >
              <FaArrowLeft size={16} />
              <span>Back to List</span>
            </Link>
          </motion.button>
        </div>
        {/* <div className="mb-4 flex justify-between items-center">
        <Link onClick={() => navigate(-1)} className="text-blue-600 hover:text-blue-700 flex items-center gap-2">
          <FaArrowLeft size={18} />
          <span>Back to List</span>
        </Link>
      </div> */}

        {/* Content */}
        <div className="bg-white shadow-lg rounded-lg p-6">
          <h2 className="text-3xl font-semibold mb-4">{announcement.title}</h2>
          <p className="text-gray-700 text-lg mb-4">{announcement.message}</p>

          {/* Metadata */}
          <div className="flex items-center justify-between mb-4">
            <span className="text-gray-500 text-sm">
              <strong>Announcement Date: </strong>
              {formatDate(announcement.announcementDateTime)}
            </span>
            <span className="text-gray-500 text-sm">
              <strong>Department: </strong>
              {announcement.departmentName}
            </span>
          </div>

          {/* User List */}
          <div className="mt-4">
            <strong className="text-lg">Users: </strong>
            <div className="flex flex-wrap gap-2 mt-2">
              {announcement.userName.split(",").map((user, index) => (
                <div
                  key={index}
                  className="bg-gray-100 p-2 rounded-lg text-sm text-gray-700"
                >
                  {user.trim()} {/* Trim spaces from the usernames */}
                </div>
              ))}
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
  //#endregion
};

export default ViewAnnouncement;
//#endregion
