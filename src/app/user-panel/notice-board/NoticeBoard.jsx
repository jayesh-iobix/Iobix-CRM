import React, { useEffect, useState } from 'react';
import { AnnouncementService } from '../../service/AnnouncementService';
import { HolidayService } from '../../service/HolidayService';

// Sample Data
// const announcements = [
//   {
//     id: 1,
//     date: '2025-06-01',
//     title: 'PTM Schedule',
//     message: 'Parent-teacher meeting will be held on Friday at 5 PM in the auditorium.',
//   },
//   {
//     id: 2,
//     date: '2025-06-03',
//     title: 'Cafeteria Menu Update',
//     message: 'The new cafeteria menu will be implemented starting next Monday.',
//   },
//   {
//     id: 3,
//     date: '2025-06-05',
//     title: 'Annual Sports Meet',
//     message: 'Preparations for the Annual Sports Meet begin next week. Stay tuned!',
//   },
//   {
//     id: 4,
//     date: '2025-06-07',
//     title: 'New Library Hours',
//     message: 'Library will open at 8:00 AM starting Monday.',
//   },
//   {
//     id: 5,
//     date: '2025-06-09',
//     title: 'Exam Schedule',
//     message: 'Final exams start June 20. Check the portal for your schedule.',
//   },
//   {
//     id: 6,
//     date: '2025-06-09',
//     title: 'Exam Schedule',
//     message: 'Final exams start June 20. Check the portal for your schedule.',
//   },
// ];

// const holidays = [
//   { id: 1, name: 'Founders Day', startDate: '2025-06-10', endDate: '2025-06-10' },
//   { id: 2, name: 'Summer Vacation', startDate: '2025-06-15', endDate: '2025-07-01' },
//   { id: 3, name: 'Independence Day', startDate: '2025-07-04', endDate: '2025-07-04' },
//   { id: 4, name: 'Teachers Workshop', startDate: '2025-07-10', endDate: '2025-07-12' },
//   { id: 4, name: 'Teachers Workshop', startDate: '2025-07-10', endDate: '2025-07-12' },
//   { id: 4, name: 'Teachers Workshop', startDate: '2025-07-10', endDate: '2025-07-12' },
// ];

const NoticeBoard = () => {

  //#region State Variables
  const [announcements, setAnnouncements] = useState([]);
  const [holidays, setHolidays] = useState([]);
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

    const fetchHolidays = async () => {
      try {
        const result = await HolidayService.getHolidays();
        setHolidays(result.data); // Set the 'data' array to the state
      } catch (error) {
        console.error("Error fetching holidays:", error);
        setHolidays([]); // Fallback to an empty array in case of an error
      }
    };

    fetchHolidays();
    fetchAnnouncements();
  }, []);
  //#endregion
  
  return (
    <div className="container mx-auto flex-wrap">
      {/* Header */}
      <div className="text-gray-800 py-2 text-2xl font-semibold">
        Notice Board
      </div>
      <div className="h-[calc(78vh-2rem)] flex flex-col bg-white rounded-xl shadow overflow-hidden">
        {/* Content */}
        <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-white overflow-auto">
          {/* Announcements Section */}
          <div className="bg-white rounded-lg border border-gray-200 flex flex-col hover:shadow-md overflow-y-auto mb-2 md:mb-0 lg:mb-0">
            <h2 className="text-orange-500 text-xl font-bold p-4 border-b bg-orange-100">
              📢 Announcements
            </h2>
            <div className="flex-1 p-4 space-y-4 overflow-y-auto noticeboard-scrollbar">
              {announcements.map(
                ({ announcementId, announcementDateTime, title, message }) => (
                  <div
                    key={announcementId}
                    className="bg-blue-50 p-3 rounded hover:bg-blue-100 transition shadow-sm"
                  >
                    <div className="text-sm text-gray-500">
                      {new Date(announcementDateTime).toDateString()}
                    </div>
                    <div className="font-semibold text-blue-900">{title}</div>
                    <div className="text-gray-700 text-sm mt-1">{message}</div>
                  </div>
                )
              )}
            </div>
          </div>

          {/* Holidays Section */}
          <div className="bg-white rounded-lg border border-gray-200 flex flex-col hover:shadow-md overflow-y-auto">
            <h2 className="text-orange-500 text-xl font-bold p-4 border-b bg-orange-100">
              🎉 Holidays
            </h2>
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {holidays.map(
                ({
                  holidayId,
                  holidayName,
                  holidayStartDate,
                  holidayEndDate,
                }) => (
                  <div
                    key={holidayId}
                    className="bg-blue-50 p-3 rounded hover:bg-blue-100 transition shadow-sm"
                  >
                    <div className="font-semibold text-blue-900">
                      {holidayName}
                    </div>
                    <div className="text-sm text-gray-600">
                      {new Date(holidayStartDate).toDateString()}
                      {holidayStartDate !== holidayEndDate &&
                        ` → ${new Date(holidayEndDate).toDateString()}`}
                    </div>
                  </div>
                )
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NoticeBoard;
