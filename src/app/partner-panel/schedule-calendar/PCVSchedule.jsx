//#region Imports
import React, { useState, useEffect } from 'react';
import { ScheduleCalService } from '../../service/ScheduleCalService';
import { format, addDays, startOfWeek, endOfWeek, isSameDay, getMonth, getYear, getDate } from 'date-fns';
import { toast } from 'react-toastify';
import { set } from 'lodash';
import CreatableSelect from 'react-select/creatable';
import { DepartmentService } from '../../service/DepartmentService';
import { EmployeeService } from '../../service/EmployeeService';
import { CommonService } from '../../service/CommonService';
import { FaPlus, FaTimes } from 'react-icons/fa';
import { PartnerService } from '../../service/PartnerService';
import { ClientCompanyService } from '../../service/ClientCompanyService';
import { VendorService } from '../../service/VendorService';
//#endregion

//#region Moths, Days Names, Hours, and Themes
const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

// Add this constant at the top of your file
const HOURS = [
  '12 AM', '1 AM', '2 AM', '3 AM', '4 AM', '5 AM', '6 AM', 
  '7 AM', '8 AM', '9 AM', '10 AM', '11 AM', '12 PM',
  '1 PM', '2 PM', '3 PM', '4 PM', '5 PM', '6 PM',
  '7 PM', '8 PM', '9 PM', '10 PM', '11 PM'
];

const themes = [
  { value: 'blue', label: 'Blue' },
  { value: 'red', label: 'Red' },
  { value: 'green', label: 'Green' },
  { value: 'yellow', label: 'Yellow' },
  { value: 'purple', label: 'Purple' },
];
//#endregion

//#region Component: PCVSchedule
const PCVSchedule = () => {
  //#region State Variables
  const [currentDate, setCurrentDate] = useState(new Date()); // Single source of truth for current date
  const [month, setMonth] = useState(getMonth(new Date()));
  const [year, setYear] = useState(getYear(new Date()));
  const [noOfDays, setNoOfDays] = useState([]);
  const [blankDays, setBlankDays] = useState([]);
  const [events, setEvents] = useState([]);
  const [allEmails, setAllEmails] = useState([]);
  const [eventTitle, setEventTitle] = useState('');
  const [eventDate, setEventDate] = useState('');
  const [eventTheme, setEventTheme] = useState('blue');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [eventLocation, setEventLocation] = useState('');
  const [eventMeetingLink, setEventMeetingLink] = useState('');
  const [eventGuest, setEventGuest] = useState('');
  const [openEventModal, setOpenEventModal] = useState(false);
  const [openViewEventModal, setOpenViewEventModal] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);
  const [viewMode, setViewMode] = useState('month');
  const [currentWeek, setCurrentWeek] = useState(new Date());

  const [openMoreEventsModal, setOpenMoreEventsModal] = useState(false);
  const [moreEventsDate, setMoreEventsDate] = useState(null);
  const [selectedGuests, setSelectedGuests] = useState([]);

  const [departmentId, setDepartmentId] = useState("");
  const [employeeList, setEmployeeList] = useState([]);
  const [adminList, setAdminList] = useState([]);
  const [partnerList, setPartnerList] = useState([]);
  const [companyList, setCompanyList] = useState([]);
  const [vendorList, setVendorList] = useState([]);
  const [departmentList, setDepartmentList] = useState([]);

  const [userId, setUserId] = useState(sessionStorage.getItem('LoginUserId'));

  const [manualNotification, setManualNotification] = useState(false); // Default to 'NO'
  const [notificationDateTimes, setNotificationDateTimes] = useState([]); // to store multiple selected date-times
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [meetingLinkError, setMeetingLinkError] = useState('');
  const urlRegex = /^(https?:\/\/(?:www\.)?(?:zoom\.us|teams\.microsoft\.com|meet\.google\.com)\/.*)$/;
  //#endregion

  // const userIdForSchedule = sessionStorage.getItem('LoginUserId');

  //#region Event Data
  // Fetch events from the server when the component mounts
  const fetchEvents = async () => {
    try {
      const response = await ScheduleCalService.getScheduleByUserId(userId);
      // const response = await ScheduleCalService.getSchedules();
      setEvents(response.data);
      setSelectedGuests(response.data.eventGuest);
      // console.log(response.data);

      const responseEmail = await ScheduleCalService.getAllEmail();
      const formattedEmails = responseEmail.data.map((user) => ({
        value: user.email,
        label: user.email,
      }));
      setAllEmails(formattedEmails);

    } catch (error) {
      console.error('Error fetching events:', error);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, [userId]);
  //#endregion

  //#region Fetch Department, Admin, Partner, Company, and Vendor Lists
  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const departmentResult = await DepartmentService.getDepartments();
        const activeDepartments = departmentResult.data.filter(
          (department) => department.isActive === true
        );
        setDepartmentList(activeDepartments);

        if (departmentId === "Admin") {
          // Call the API for Admin when "Admin" is selected
          const adminResult = await CommonService.getAdmin();
          setAdminList(adminResult.data);
        } else if (departmentId === "Partner") {
          const partnerResult = await PartnerService.getPartner();
          setPartnerList(partnerResult.data);
        } else if (departmentId === "Company") {
          const companyResult = await ClientCompanyService.getClientCompany();
          setCompanyList(companyResult.data);
        } else if (departmentId === "Vendor") {
          const vendorResult = await VendorService.getVendor();
          setVendorList(vendorResult.data);
        } else if (departmentId === "Employee") {
          const employeeResult = await EmployeeService.getBDEmployees();
          setEmployeeList(employeeResult.data);
        // } else if (departmentId) {
        //   const employeeResult = await EmployeeService.getEmployeeByDepartment(departmentId);
        //   setEmployeeList(employeeResult.data);
        } else {
          // If no department is selected, clear the employee list
          setEmployeeList([]);
          setAdminList([]);
        }

        // if (departmentId) {
        //   const employeeResult = await EmployeeService.getEmployeeByDepartment(
        //     departmentId
        //   );
        //   setEmployeeList(employeeResult.data);
        // }
      } catch (error) {
        console.error("Error fetching employee list:", error);
      }
    };

    fetchEmployees();
  }, [departmentId]);
  //#endregion

  //#region Fetch Month, Year, Week, and Days
  useEffect(() => {
    setMonth(getMonth(currentDate));
    setYear(getYear(currentDate));
  }, [currentDate]);

  // Generate days for the current view mode
  useEffect(() => {
    const getDays = () => {
      if (viewMode === 'month') {
        // Generate whole month (store just day numbers 1-31)
        const daysInMonth = new Date(year, month + 1, 0).getDate();
        const dayOfWeek = new Date(year, month).getDay();
        setBlankDays(Array(dayOfWeek).fill(null));
        // setNoOfDays(Array.from({ length: daysInMonth }, (_, index) => index + 1));
        setNoOfDays(Array.from({ length: daysInMonth }, (_, index) => ({
          day: index + 1,
          date: new Date(year, month, index + 1)
        })));
        } else if (viewMode === 'week') {
        // Generate current week (store Date objects)
        const start = startOfWeek(currentDate);
        const days = [];
        
        for (let i = 0; i < 7; i++) {
          days.push(addDays(start, i));
        }
        
        setBlankDays([]);
        setNoOfDays(days);
      } else if (viewMode === 'day') {
        // Display only current day (store Date object)
        setBlankDays([]);
        setNoOfDays([currentDate]);
      }
    };
  
    getDays();
  }, [viewMode, currentDate, month, year]);
  //#endregion

  //#region Event Handlers
  const fetchEventDetails = async (scheduleId) => {
    try {
      // debugger;
      const response = await ScheduleCalService.getScheduleById(scheduleId);
      const scheduleData = response.data;
      // console.log(scheduleData)

      // const responseReminder = await ScheduleCalService.getScheduleReminderById(scheduleId);
      // const scheduleReminderData = responseReminder.data;
      setEventTitle(scheduleData.eventTitle);
      setEventDate(scheduleData.eventDate);
      setEventTheme(scheduleData.eventTheme);
      setStartTime(scheduleData.startTime);
      setEndTime(scheduleData.endTime);
      setEventLocation(scheduleData.eventLocation);
      setEventMeetingLink(scheduleData.eventMeetingLink);
      setEventGuest(scheduleData.eventGuest);
      setEditingEvent(scheduleData);
      // setSelectedGuests(scheduleData.eventGuest.map((email) => ({ value: email, label: email })));
      if (scheduleData.eventGuest && scheduleData.eventGuest.length > 0) {
        setSelectedGuests(scheduleData.eventGuest.map((email) => ({ value: email, label: email })));
      } else {
        setSelectedGuests([]);
      }
    } catch (error) {
      console.error('Error fetching schedule by ID:', error);
    }
  };

  const showEventModal = (date) => {
    // Get the userId from sessionStorage
    const loggedInUserId = sessionStorage.getItem("LoginUserId");
    // Check if the selected userId is the same as the logged-in userId
    if (userId !== loggedInUserId) {
      setOpenEventModal(false);
      // setOpenViewEventModal(true);
    } else {
    setOpenEventModal(true);
    setEventDate(date.toISOString());
    setEditingEvent(null);
    }
  };

  const showEditModal = (event) => {
    // Get the userId from sessionStorage
    const loggedInUserId = sessionStorage.getItem("LoginUserId");
    
    if (userId !== loggedInUserId) {
      setOpenEventModal(false);
      setOpenViewEventModal(true);
      setEventDate(event.eventDate);
      fetchEventDetails(event.scheduleCalendarId);
    } else {
    setOpenEventModal(true);
    setEventDate(event.eventDate);
    fetchEventDetails(event.scheduleCalendarId);
    }
  };

  const showMoreEventsModal = (date) => {
    setMoreEventsDate(date.toDateString());
    setOpenMoreEventsModal(true); // Open the More Events modal
    // console.log("More Events for date:", date);
  };

  const handleMeetingLinkChange = (e) => {
    const value = e.target.value;
    setEventMeetingLink(value);
  
    // Validate URL format
    if (value && !urlRegex.test(value)) {
      setMeetingLinkError('Please enter a valid Google Meet/Zoom link');
    } else {
      setMeetingLinkError('');
    }
  };

  const formatTime = (time) => {
    if (!time) return '';
    const [hours, minutes] = time.split(":");
    return `${hours}:${minutes}`;
  };
  //#endregion

  //#region Add Event, Update Event, Delete Event, Clear Event Form, and View Mode Change
  const addEvent = async () => {

    // Validate meeting link before proceeding
    // if (eventMeetingLink && !urlRegex.test(eventMeetingLink)) {
    //   toast.error('Please enter a valid Google Meet/Zoom link!');
    //   return; // Prevent submission
    // }

    if (eventTitle === '') {
      toast.error('Please enter a title for the event!');
      return;
    }
    if (startTime === '') {
      toast.error('Please select a start time!');
      return;
    }
    // if (endTime === '') {
    //   toast.error('Please select a end time!');
    //   return;
    // }

    const formattedEventDate = format(new Date(eventDate), 'yyyy-MM-dd');

    // Ensure selectedGuests is initialized as an empty array if it's undefined
    const guestEmails = (selectedGuests || []).map((guest) => guest.value);
    // const guestEmails = selectedGuests.map((guest) => guest.value);

    // debugger;
    const scheduleData = {
        eventDate: formattedEventDate,
        eventTitle,
        eventTheme,
        startTime,
        endTime: endTime === '' ? null : endTime,
        eventLocation,
        eventMeetingLink,
        eventGuest: guestEmails, // ✅ use array of emails
        // eventGuest,
      
    };

    console.log(scheduleData);

    setIsSubmitting(true);
    try {
      const response = await ScheduleCalService.addSchedule(scheduleData);
      if (response.status === 1) {
        toast.success("Event added successfully!");
        fetchEvents();
      } else {
        toast.error('Failed to add event:');
      }
    } catch (error) {
      console.error('Error adding event:', error);
    } finally {
      setIsSubmitting(false);
    }
    clearEventForm();
  };

  const updateEvent = async () => {
    if (!eventTitle) return;

    const guestEmails = selectedGuests.map((guest) => guest.value);

    const updatedEvent = {
      ...editingEvent,
      eventTitle,
      eventTheme,
      startTime,
      endTime,
      eventLocation,
      eventMeetingLink,
      eventGuest: guestEmails, // ✅ use array of emails
      // eventGuest,
    };

    try {
      const updatedData = await ScheduleCalService.updateSchedule(editingEvent.scheduleCalendarId, updatedEvent);
      if (updatedData.status === 1) {
        toast.success("Event updated successfully!");
        fetchEvents();
      } else {
        toast.error('Failed to update event:');
      }
    } catch (error) {
      console.error('Error updating event:', error);
    }

    clearEventForm();
  };

  const deleteEvent = async () => {
    try {
      const response = await ScheduleCalService.deleteSchedule(editingEvent.scheduleCalendarId);
      if (response.status === 1) {
        toast.success("Event deleted successfully!");
        setOpenEventModal(false);
        fetchEvents();
      } else {
        toast.error('Failed to delete event:');
      }
    } catch (error) {
      console.error('Error deleting event:', error);
    }
  };

  const clearEventForm = () => {
    setEventTitle('');
    setEventDate('');
    setEventTheme('blue');
    setStartTime('');
    setEndTime('');
    setEventLocation('');
    setEventMeetingLink('');
    setEventGuest('');
    setSelectedGuests('');
    setManualNotification(false);
    setNotificationDateTimes([]); // Reset the selected date-times
    // setAllEmails([]);
    setOpenEventModal(false);
    setOpenViewEventModal(false);
    setEditingEvent(null);
  };

  const handleViewModeChange = (e) => {
    const newViewMode = e.target.value;
    setViewMode(newViewMode);
    
    // Reset to current date when switching views
    // if (newViewMode === 'month') {
    //   setCurrentDate(new Date(year, month, 1));
    // } 

    // Only update month/year for month view display purposes
    if (newViewMode === 'month') {
      const updatedMonth = getMonth(currentDate);
      const updatedYear = getYear(currentDate);
      setMonth(updatedMonth);
      setYear(updatedYear);
    }

    // else if (newViewMode === 'week') {
    //   setCurrentDate(startOfWeek(currentDate));
    // }
    // else if(newViewMode === 'day' ) {
    //   setCurrentDate(currentDate); // For day view, we keep the current date
    // }
    // For day view, we keep the current date
  };
  //#endregion

  //#region Navigation Functions
  const navigateMonth = (direction) => {
    const newMonth = month + direction;
    const newYear = getYear(new Date(year, newMonth, 1));
    const today = new Date();
    const newDate = new Date(newYear, newMonth, 1); // default to 1st of new month
  
    const isGoingToCurrentMonth =
      getMonth(today) === newMonth && getYear(today) === newYear;
  
    if (isGoingToCurrentMonth) {
      setCurrentDate(today); // Back to current month → go to today
    } else {
      setCurrentDate(newDate); // Other months → go to 1st of that month
    }
  };

  const navigateWeek = (direction) => {
    setCurrentDate(addDays(currentDate, direction * 7));
  };

  const navigateDay = (direction) => {
    const newDate = new Date(currentDate);
    newDate.setDate(currentDate.getDate() + direction); // Adjust the date by direction (+1 or -1)

    const today = new Date();
  
    const isGoingToCurrentDay = newDate.toDateString() === today.toDateString();
  
    if (isGoingToCurrentDay) {
      setCurrentDate(today); // If going to today, set to current date
    } else {
      setCurrentDate(newDate); // Otherwise, go to the new date
    }
  };
  //#endregion
  
  //#region Render
  return (
    <div className="antialiased sans-serif h-screen">
      <h1 className="font-semibold md:mb-[-12px] lg:mb-[-12px] text-2xl">
        Calendar
      </h1>

      {/* <div className="container mx-auto py-2 md:py-6"> */}
      {/* </div> */}

      <div className="container mx-auto py-2 md:py-8">
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="flex flex-col sm:flex-row items-center justify-between py-2 px-6">
            <div className="flex items-center mb-4 sm:mb-0">
              <span className="text-lg sm:text-xl font-bold text-gray-800">
                {MONTH_NAMES[month]}
              </span>
              <span className="ml-1 text-lg sm:text-xl text-gray-600 font-normal">
                {year}
              </span>
            </div>

            <div className="flex items-center space-x-4">
              <div
                className="border rounded-lg px-1"
                style={{ paddingTop: "2px" }}
              >
                {/* <div className="flex items-center space-x-4">
                User Select Dropdown
                <select
                  onChange={handleUserChange} 
                  value={selectedUser} 
                  className="border border-gray-300 rounded-lg p-2 border-active"
                >
                  <option value="">Select User</option>
                  {users.map(user => (
                    <option key={user.id} value={user.id}>
                      {user.name}
                    </option>
                  ))}
                </select>
      
                View Mode Dropdown
                <select
                  onChange={handleViewModeChange}
                  value={viewMode}
                  className="border border-gray-300 rounded-lg p-2 border-active"
                >
                  <option value="month">Monthly View</option>
                  <option value="week">Weekly View</option>
                  <option value="day">Day View</option>
                </select>
                </div> */}

                {viewMode === "month" && (
                  <>
                    <button
                      type="button"
                      className="leading-none rounded-lg transition ease-in-out duration-100 inline-flex cursor-pointer hover:bg-gray-200 p-1 items-center"
                      onClick={() => navigateMonth(-1)}
                    >
                      <svg
                        className="h-6 w-6 text-gray-500 inline-flex leading-none"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M15 19l-7-7 7-7"
                        />
                      </svg>
                    </button>
                    <div className="border-r inline-flex h-6"></div>
                    <button
                      type="button"
                      className="leading-none rounded-lg transition ease-in-out duration-100 inline-flex items-center cursor-pointer hover:bg-gray-200 p-1"
                      onClick={() => navigateMonth(1)}
                    >
                      <svg
                        className="h-6 w-6 text-gray-500 inline-flex leading-none"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M9 5l7 7-7 7"
                        />
                      </svg>
                    </button>
                  </>
                )}

                {viewMode === "week" && (
                  <>
                    <button
                      type="button"
                      className="leading-none rounded-lg transition ease-in-out duration-100 inline-flex cursor-pointer hover:bg-gray-200 p-1 items-center"
                      onClick={() => navigateWeek(-1)}
                    >
                      <svg
                        className="h-6 w-6 text-gray-500 inline-flex leading-none"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M15 19l-7-7 7-7"
                        />
                      </svg>
                    </button>
                    <div className="border-r inline-flex h-6"></div>
                    <button
                      type="button"
                      className="leading-none rounded-lg transition ease-in-out duration-100 inline-flex items-center cursor-pointer hover:bg-gray-200 p-1"
                      onClick={() => navigateWeek(1)}
                    >
                      <svg
                        className="h-6 w-6 text-gray-500 inline-flex leading-none"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M9 5l7 7-7 7"
                        />
                      </svg>
                    </button>
                  </>
                )}

                {viewMode === "day" && (
                  <>
                    <button
                      type="button"
                      className="leading-none rounded-lg transition ease-in-out duration-100 inline-flex cursor-pointer hover:bg-gray-200 p-1 items-center"
                      onClick={() => navigateDay(-1)}
                    >
                      <svg
                        className="h-6 w-6 text-gray-500 inline-flex leading-none"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M15 19l-7-7 7-7"
                        />
                      </svg>
                    </button>
                    <div className="border-r inline-flex h-6"></div>
                    <button
                      type="button"
                      className="leading-none rounded-lg transition ease-in-out duration-100 inline-flex items-center cursor-pointer hover:bg-gray-200 p-1"
                      onClick={() => navigateDay(1)}
                    >
                      <svg
                        className="h-6 w-6 text-gray-500 inline-flex leading-none"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M9 5l7 7-7 7"
                        />
                      </svg>
                    </button>
                  </>
                )}
              </div>
              <select
                onChange={handleViewModeChange}
                value={viewMode}
                className="border border-gray-300 rounded-lg p-2 text-sm sm:text-base border-active"
              >
                <option value="month">Monthly View</option>
                <option value="week">Weekly View</option>
                <option value="day">Day View</option>
              </select>
            </div>
          </div>

          {/* Scrollable sections for month, week, and day */}
          {viewMode === "month" && (
            <div className="-mx-1 -mb-1">
              <div className="flex flex-wrap">
                {DAYS.map((day) => (
                  <div key={day} className="w-[14.28%] px-2 py-2">
                    <div className="text-gray-600 text-sm uppercase tracking-wide font-bold text-center">
                      {day}
                    </div>
                  </div>
                ))}
              </div>
              <div className="flex flex-wrap border-t border-l">
                {blankDays.map((_, i) => (
                  <div
                    key={`blank-${i}`}
                    className="w-[14.28%] h-32 border-r border-b"
                  ></div>
                ))}
                {noOfDays.map(({ day, date }) => (
                  <div
                    key={day}
                    className="w-[14.28%] h-32 border-r border-b p-1 relative"
                  >
                    <div
                      onClick={() => showEventModal(date)}
                      className={`w-6 h-6 flex items-center justify-center rounded-full mx-auto cursor-pointer ${
                        isSameDay(date, new Date())
                          ? "bg-blue-500 text-white"
                          : "text-gray-700 hover:bg-blue-200"
                      }`}
                    >
                      {day}
                    </div>
                    <div
                      style={{
                        height: "calc(100% - 30px)",
                        overflow: "hidden",
                      }}
                      className="mt-1 flex flex-col gap-2"
                    >
                      {/* <div className="overflow-y-auto h-24 mt-1"> */}
                      {events
                        .filter((event) =>
                          isSameDay(new Date(event.eventDate), date)
                        )
                        .slice(0, 1)
                        .map((event) => (
                          <div
                            key={event.scheduleCalendarId}
                            onClick={() => showEditModal(event)}
                            className={`px-2 py-1 rounded-lg mt-1 overflow-hidden border text-xs cursor-pointer ${
                              event.eventTheme === "blue"
                                ? "bg-blue-100 text-blue-800"
                                : event.eventTheme === "red"
                                ? "bg-red-100 text-red-800"
                                : event.eventTheme === "yellow"
                                ? "bg-yellow-100 text-yellow-800"
                                : event.eventTheme === "green"
                                ? "bg-green-100 text-green-800"
                                : "bg-purple-100 text-purple-800"
                            }`}
                          >
                            <div className="truncate">{event.eventTitle}</div>
                            <div>
                              {formatTime(event.startTime)} - {" "}
                              {formatTime(event.endTime)}
                            </div>
                          </div>
                        ))}

                      {/* Show More button */}
                      {events.filter((event) =>
                        isSameDay(new Date(event.eventDate), date)
                      ).length > 1 && (
                        <button
                          onClick={() => showMoreEventsModal(date)}
                          className="text-sm flex flex-start px-2 py-1 rounded-lg border-gray-400 text-gray-600 bg-gray-300 hover:bg-gray-400 hover:text-white"
                        >
                          {events.filter((event) =>
                            isSameDay(new Date(event.eventDate), date)
                          ).length - 1}{" "}
                          More..
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/*  Update your week view rendering code: */}
          {viewMode === "week" && (
            <div className="p-4">
              <div className="flex justify-center mb-4">
                <div className="font-semibold">
                  {format(startOfWeek(currentDate), "MMM dd")} - {" "}
                  {format(endOfWeek(currentDate), "MMM dd, yyyy")}
                </div>
              </div>

              {/* Fixed header row */}
              <div className="flex">
                <div className="w-16"></div>
                <div className="flex-1 grid grid-cols-7">
                  {noOfDays.map((day, i) => (
                    <div key={i} className="text-center py-2 border-b">
                      <div className="text-sm font-semibold">{DAYS[i]}</div>
                      <div
                        onClick={() => showEventModal(day)}
                        className={`w-8 h-8 mx-auto cursor-pointer flex items-center justify-center rounded-full ${
                          isSameDay(day, new Date())
                            ? "bg-blue-500 text-white"
                            : "text-gray-700"
                        }`}
                      >
                        {getDate(day)}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Scrollable time area */}
              <div
                className="flex overflow-y-auto"
                style={{ maxHeight: "calc(100vh - 200px)" }}
              >
                {/* Time column */}
                <div className="w-16">
                  {HOURS.map((hour) => (
                    <div
                      key={hour}
                      className="h-12 flex items-center pr-2 justify-end"
                    >
                      <span className="text-xs text-gray-500">{hour}</span>
                    </div>
                  ))}
                </div>

                {/* Days columns */}
                <div className="flex-1 grid grid-cols-7">
                  {noOfDays.map((day, dayIndex) => {
                    const dayEvents = events
                      .filter((event) =>
                        isSameDay(new Date(event.eventDate), day)
                      )
                      .sort((a, b) => {
                        const aStart = a.startTime?.split(":").map(Number) || [
                          0, 0,
                        ];
                        const bStart = b.startTime?.split(":").map(Number) || [
                          0, 0,
                        ];
                        return (
                          aStart[0] * 60 +
                          aStart[1] -
                          (bStart[0] * 60 + bStart[1])
                        );
                      });

                    // Group overlapping events
                    const eventGroups = [];
                    let currentGroup = [];

                    dayEvents.forEach((event, i) => {
                      if (i === 0) {
                        currentGroup.push(event);
                        return;
                      }

                      const prevEvent = dayEvents[i - 1];
                      const prevEnd = prevEvent.endTime
                        ?.split(":")
                        .map(Number) || [0, 0];
                      const currentStart = event.startTime
                        ?.split(":")
                        .map(Number) || [0, 0];

                      if (
                        prevEnd[0] * 60 + prevEnd[1] >
                        currentStart[0] * 60 + currentStart[1]
                      ) {
                        // Events overlap
                        currentGroup.push(event);
                      } else {
                        // No overlap, start new group
                        eventGroups.push(currentGroup);
                        currentGroup = [event];
                      }
                    });

                    if (currentGroup.length > 0) {
                      eventGroups.push(currentGroup);
                    }

                    return (
                      <div
                        key={dayIndex}
                        className="border-r last:border-r-0 relative"
                      >
                        <div
                          className="relative"
                          style={{ height: `${HOURS.length * 48}px` }}
                        >
                          {/* Time slots background */}
                          {HOURS.map((_, idx) => (
                            <div
                              key={idx}
                              className="h-12 border-b border-gray-100"
                            ></div>
                          ))}

                          {/* Render event groups */}
                          {eventGroups.map((group, groupIndex) => {
                            return group.map((event, eventIndex) => {
                              const startTime = event.startTime
                                ?.split(":")
                                .map(Number) || [0, 0];
                              const endTime = event.endTime
                                ?.split(":")
                                .map(Number) || [0, 0];
                              const top =
                                startTime[0] * 48 + startTime[1] * 0.8;
                              const height =
                                (endTime[0] - startTime[0]) * 48 +
                                (endTime[1] - startTime[1]) * 0.8;

                              // Calculate width and left position based on group
                              const widthPercent = 100 / group.length;
                              const leftPercent = widthPercent * eventIndex;

                              return (
                                <div
                                  onClick={() => showEditModal(event)}
                                  key={event.scheduleCalendarId}
                                  className={`absolute rounded p-1 text-xs group transition-all duration-200 ease-in-out ${
                                    event.eventTheme === "blue"
                                      ? "bg-blue-100 hover:bg-blue-200 text-blue-800 border-l-4 border-blue-500 cursor-pointer"
                                      : event.eventTheme === "red"
                                      ? "bg-red-100 hover:bg-red-200 text-red-800 border-l-4 border-red-500 cursor-pointer"
                                      : event.eventTheme === "yellow"
                                      ? "bg-yellow-100 hover:bg-yellow-200 text-yellow-800 border-l-4 border-yellow-500 cursor-pointer"
                                      : event.eventTheme === "green"
                                      ? "bg-green-100 hover:bg-green-200 text-green-800 border-l-4 border-green-500 cursor-pointer"
                                      : "bg-purple-100 hover:bg-purple-200 text-purple-800 border-l-4 border-purple-500 cursor-pointer"
                                  }`}
                                  style={{
                                    top: `${top}px`,
                                    height: `${height}px`,
                                    width: `${widthPercent}%`,
                                    left: `${leftPercent}%`,
                                  }}
                                >
                                  <div className="font-medium truncate">
                                    {event.eventTitle}
                                  </div>
                                  <div className="text-gray-600 truncate">
                                    {formatTime(event.startTime)} - {" "}
                                    {formatTime(event.endTime)}
                                  </div>
                                </div>
                              );
                            });
                          })}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* Update your day view rendering code: */}
          {viewMode === "day" && (
            <div className="p-4">
              <div className="mb-4">
                <div
                  className="text-lg font-bold cursor-pointer"
                  onClick={() => showEventModal(currentDate)}
                >
                  {format(currentDate, "EEEE, MMMM dd, yyyy")}
                </div>
              </div>
              <div className="flex">
                {/* Time column */}
                <div className="w-16">
                  {HOURS.map((hour, i) => (
                    <div
                      key={hour}
                      className="h-12 flex items-center pr-2 justify-end"
                    >
                      <span className="text-xs text-gray-500">{hour}</span>
                    </div>
                  ))}
                </div>

                {/* Events column */}
                <div
                  className="flex-1 relative"
                  style={{ height: `${HOURS.length * 48}px` }}
                >
                  {/* Time slots background */}
                  {HOURS.map((_, idx) => (
                    <div
                      key={idx}
                      className="h-12 border-b border-gray-100"
                    ></div>
                  ))}

                  {/* Process and display events */}
                  {(() => {
                    const dayEvents = events
                      .filter((event) =>
                        isSameDay(new Date(event.eventDate), currentDate)
                      )
                      .sort((a, b) => {
                        const aStart = a.startTime?.split(":").map(Number) || [
                          0, 0,
                        ];
                        const bStart = b.startTime?.split(":").map(Number) || [
                          0, 0,
                        ];
                        return (
                          aStart[0] * 60 +
                          aStart[1] -
                          (bStart[0] * 60 + bStart[1])
                        );
                      });

                    // Group overlapping events
                    const eventGroups = [];
                    let currentGroup = [];

                    dayEvents.forEach((event, i) => {
                      if (i === 0) {
                        currentGroup.push(event);
                        return;
                      }

                      const prevEvent = dayEvents[i - 1];
                      const prevEnd = prevEvent.endTime
                        ?.split(":")
                        .map(Number) || [0, 0];
                      const currentStart = event.startTime
                        ?.split(":")
                        .map(Number) || [0, 0];

                      if (
                        prevEnd[0] * 60 + prevEnd[1] >
                        currentStart[0] * 60 + currentStart[1]
                      ) {
                        // Events overlap
                        currentGroup.push(event);
                      } else {
                        // No overlap, start new group
                        eventGroups.push(currentGroup);
                        currentGroup = [event];
                      }
                    });

                    if (currentGroup.length > 0) {
                      eventGroups.push(currentGroup);
                    }

                    // Render event groups
                    return eventGroups.map((group, groupIndex) => {
                      return group.map((event, eventIndex) => {
                        const startTime = event.startTime
                          ?.split(":")
                          .map(Number) || [0, 0];
                        const endTime = event.endTime
                          ?.split(":")
                          .map(Number) || [0, 0];
                        const top = startTime[0] * 48 + startTime[1] * 0.8;
                        const height =
                          (endTime[0] - startTime[0]) * 48 +
                          (endTime[1] - startTime[1]) * 0.8;

                        // Calculate width and left position based on group
                        const widthPercent = 100 / group.length;
                        const leftPercent = widthPercent * eventIndex;

                        return (
                          <div
                            onClick={() => showEditModal(event)}
                            key={event.scheduleCalendarId}
                            className={`absolute rounded p-1 text-xs group transition-all duration-200 ease-in-out ${
                              event.eventTheme === "blue"
                                ? "bg-blue-100 hover:bg-blue-200 text-blue-800 border-l-4 border-blue-500 cursor-pointer"
                                : event.eventTheme === "red"
                                ? "bg-red-100 hover:bg-red-200 text-red-800 border-l-4 border-red-500 cursor-pointer"
                                : event.eventTheme === "yellow"
                                ? "bg-yellow-100 hover:bg-yellow-200 text-yellow-800 border-l-4 border-yellow-500 cursor-pointer"
                                : event.eventTheme === "green"
                                ? "bg-green-100 hover:bg-green-200 text-green-800 border-l-4 border-green-500 cursor-pointer"
                                : "bg-purple-100 hover:bg-purple-200 text-purple-800 border-l-4 border-purple-500 cursor-pointer"
                            }`}
                            style={{
                              top: `${top}px`,
                              height: `${height}px`,
                              width: `${widthPercent}%`,
                              left: `${leftPercent}%`,
                            }}
                          >
                            <div className="font-medium truncate">
                              {event.eventTitle}
                            </div>
                            <div className="text-gray-600 truncate">
                              {formatTime(event.startTime)} - {" "}
                              {formatTime(event.endTime)}
                            </div>
                          </div>
                        );
                      });
                    });
                  })()}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Event Modal (same as before) */}
      {openEventModal && (
        <div
          style={{ backgroundColor: "rgba(0, 0, 0, 0.8)", zIndex: 50 }}
          className="fixed z-40 top-0 right-0 left-0 bottom-0 h-full w-full"
        >
          <div className="p-4 max-w-2xl mx-auto absolute left-0 right-0 overflow-hidden mt-5 sm:mt-2 md:mt-2">
            <div
              className="shadow absolute right-0 top-0 w-10 h-10 rounded-full bg-white text-gray-500 hover:text-gray-800 inline-flex items-center justify-center cursor-pointer"
              onClick={() => clearEventForm()}
            >
              <svg
                className="fill-current w-6 h-6"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
              >
                <path d="M16.192 6.344L11.949 10.586 7.707 6.344 6.293 7.758 10.535 12 6.293 16.242 7.707 17.656 11.949 13.414 16.192 17.656 17.606 16.242 13.364 12 17.606 7.758z" />
              </svg>
            </div>

            <div
              style={{ maxHeight: "90vh", overflowY: "auto" }}
              className="shadow rounded-lg bg-white overflow-hidden w-full block p-8"
            >
              <h2 className="font-bold text-2xl mb-6 text-gray-800 border-b pb-2">
                {editingEvent ? "Edit Event" : "Add Event Details"}
              </h2>

              {/* Two Column Layout */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                {/* Event Title Field */}
                <div className="mb-4">
                  <label className="text-gray-800 block mb-1 font-bold text-sm tracking-wide">
                    Event title
                  </label>
                  <input
                    className="bg-gray-200 appearance-none border-2 border-gray-200 rounded-lg w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-blue-500"
                    type="text"
                    value={eventTitle}
                    onChange={(e) => setEventTitle(e.target.value)}
                    placeholder="Event title"
                  />
                </div>

                {/* Event Date Field */}
                <div className="mb-4">
                  <label className="text-gray-800 block mb-1 font-bold text-sm tracking-wide">
                    Event Date
                  </label>
                  <input
                    className="bg-gray-200 appearance-none border-2 border-gray-200 rounded-lg w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-blue-500"
                    type="date"
                    value={format(new Date(eventDate), "yyyy-MM-dd")}
                    onChange={(e) => setEventDate(e.target.value)}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                {/* Start Time Field */}
                <div className="mb-4">
                  <label className="text-gray-800 block mb-1 font-bold text-sm tracking-wide">
                    Start Time
                  </label>
                  <input
                    className="bg-gray-200 appearance-none border-2 border-gray-200 rounded-lg w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-blue-500"
                    type="time"
                    value={startTime}
                    onChange={(e) => setStartTime(e.target.value)}
                  />
                </div>

                {/* End Time Field */}
                <div className="mb-4">
                  <label className="text-gray-800 block mb-1 font-bold text-sm tracking-wide">
                    End Time
                  </label>
                  <input
                    className="bg-gray-200 appearance-none border-2 border-gray-200 rounded-lg w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-blue-500"
                    type="time"
                    value={endTime}
                    onChange={(e) => setEndTime(e.target.value)}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                {/* Event Theme Field */}
                <div className="mb-4">
                  <label className="text-gray-800 block mb-1 font-bold text-sm tracking-wide">
                    Event Theme
                  </label>
                  <select
                    className="bg-gray-200 appearance-none border-2 border-gray-200 rounded-lg w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-blue-500"
                    value={eventTheme}
                    onChange={(e) => setEventTheme(e.target.value)}
                  >
                    {themes.map((theme) => (
                      <option key={theme.value} value={theme.value}>
                        {theme.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Event Location Field */}
                <div className="mb-4">
                  <label className="text-gray-800 block mb-1 font-bold text-sm tracking-wide">
                    Event Location
                  </label>
                  <input
                    className="bg-gray-200 appearance-none border-2 border-gray-200 rounded-lg w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-blue-500"
                    type="text"
                    value={eventLocation}
                    onChange={(e) => setEventLocation(e.target.value)}
                    placeholder="Event location (optional)"
                  />
                </div>
              </div>

              {/* Meeting Link Field */}
              <div className="grid grid-cols-1 sm:grid-cols-1 gap-4 mb-4">
                <div className="mb-4">
                  <label className="text-gray-800 block mb-1 font-bold text-sm tracking-wide">
                    Meeting Link
                  </label>
                  <input
                    className="bg-gray-200 appearance-none border-2 border-gray-200 rounded-lg w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-blue-500"
                    type="url"
                    value={eventMeetingLink}
                    onChange={handleMeetingLinkChange}
                    // onChange={(e) => setEventMeetingLink(e.target.value)}
                    placeholder="Google Meet/Zoom link (optional)"
                  />
                  {meetingLinkError && (
                    <p className="text-red-500 text-xs mt-1">{meetingLinkError}</p>
                  )}
                </div>

                {/* Add Guest Field */}
                {/* <div className="mb-4">
                 <label className="text-gray-800 block mb-1 font-bold text-sm tracking-wide">
                   Add Guest
                 </label>
                 <CreatableSelect
                   isMulti
                   options={allEmails}
                   value={selectedGuests}
                   onChange={setSelectedGuests}
                   placeholder="Add guest (select or type email)"
                   className="react-select-container"
                   classNamePrefix="react-select"
                 />
                </div> */}
              </div>

              {/* Add Guest Field */}
              <div className="grid grid-cols-1 gap-4 mb-4">
                <div className="mb-4">
                  <label className="text-gray-800 block mb-1 font-bold text-sm tracking-wide">
                    Add Guest
                  </label>
                  <CreatableSelect
                    isMulti
                    options={allEmails}
                    value={selectedGuests}
                    onChange={setSelectedGuests}
                    placeholder="Add guest (select or type email)"
                    className="react-select-container"
                    classNamePrefix="react-select"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 mt-8">
                {editingEvent && (
                  <button
                    className="bg-red-500 text-white py-2 px-4 rounded-lg hover:bg-red-700"
                    onClick={deleteEvent}
                  >
                    Delete Event
                  </button>
                )}
                <button
                  className={`bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-700 ${
                    isSubmitting || meetingLinkError || !eventTitle ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                  disabled={isSubmitting || meetingLinkError || !eventTitle}
                  onClick={editingEvent ? updateEvent : addEvent}
                >
                  {isSubmitting
                    ? "Submitting..."
                    : editingEvent
                    ? "Update Event"
                    : "Add Event"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* View Event Modal */}
      {openViewEventModal && (
        <div
          style={{ backgroundColor: "rgba(0, 0, 0, 0.8)", zIndex: 50 }}
          className="fixed z-40 top-0 right-0 left-0 bottom-0 h-full w-full"
        >
          <div className="p-4 max-w-xl mx-auto absolute left-0 right-0 overflow-hidden mt-5 sm:mt-2 md:mt-2">
            <div
              className="shadow absolute right-0 top-0 w-10 h-10 rounded-full bg-white text-gray-500 hover:text-gray-800 inline-flex items-center justify-center cursor-pointer"
              onClick={() => clearEventForm()}
            >
              <svg
                className="fill-current w-6 h-6"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
              >
                <path d="M16.192 6.344L11.949 10.586 7.707 6.344 6.293 7.758 10.535 12 6.293 16.242 7.707 17.656 11.949 13.414 16.192 17.656 17.606 16.242 13.364 12 17.606 7.758z" />
              </svg>
            </div>

            <div
              style={{ maxHeight: "90vh", overflowY: "auto" }}
              className="shadow rounded-lg bg-white overflow-hidden w-full block p-8"
            >
              <h2 className="font-bold text-2xl mb-6 text-gray-800 border-b pb-2">
                View Event Details
              </h2>

              <div className="mb-4">
                <label className="text-gray-800 block mb-1 font-bold text-sm tracking-wide">
                  Event Title
                </label>
                <p className="bg-gray-200 py-2 px-4 rounded-lg text-gray-700">
                  {eventTitle}
                </p>
              </div>

              <div className="mb-4">
                <label className="text-gray-800 block mb-1 font-bold text-sm tracking-wide">
                  Event Date
                </label>
                <p className="bg-gray-200 py-2 px-4 rounded-lg text-gray-700">
                  {format(new Date(eventDate), "EEE, MMM dd, yyyy")}
                </p>
              </div>

              <div className="mb-4">
                <label className="text-gray-800 block mb-1 font-bold text-sm tracking-wide">
                  Start Time
                </label>
                <p className="bg-gray-200 py-2 px-4 rounded-lg text-gray-700">
                  {startTime}
                </p>
              </div>

              <div className="mb-4">
                <label className="text-gray-800 block mb-1 font-bold text-sm tracking-wide">
                  End Time
                </label>
                <p className="bg-gray-200 py-2 px-4 rounded-lg text-gray-700">
                  {endTime}
                </p>
              </div>

              <div className="mb-4">
                <label className="text-gray-800 block mb-1 font-bold text-sm tracking-wide">
                  Event Theme
                </label>
                <p className="bg-gray-200 py-2 px-4 rounded-lg text-gray-700">
                  {themes.find((theme) => theme.value === eventTheme)?.label}
                </p>
              </div>

              <div className="mb-4">
                <label className="text-gray-800 block mb-1 font-bold text-sm tracking-wide">
                  Event Location
                </label>
                <p className="bg-gray-200 py-2 px-4 rounded-lg text-gray-700">
                  {eventLocation || "Not provided"}
                </p>
              </div>

              <div className="mb-4">
                <label className="text-gray-800 block mb-1 font-bold text-sm tracking-wide">
                  Meeting Link
                </label>
                <p className="bg-gray-200 py-2 px-4 rounded-lg text-gray-700">
                  {eventMeetingLink || "Not provided"}
                </p>
              </div>

              <div className="mb-4">
                <label className="text-gray-800 block mb-1 font-bold text-sm tracking-wide">
                  Guests
                </label>
                <div className="bg-gray-200 py-2 px-4 rounded-lg text-gray-700">
                  {selectedGuests && selectedGuests.length > 0
                    ? selectedGuests.map((guest) => guest.label).join(", ")
                    : "No guests added"}
                </div>
              </div>

              <div className="flex justify-end gap-2 mt-8">
                <button
                  className="bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-700"
                  onClick={() => setOpenViewEventModal(false)}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {openMoreEventsModal && moreEventsDate && (
        <div
          style={{ backgroundColor: "rgba(0, 0, 0, 0.8)", zIndex: 40 }}
          className="fixed z-40 top-0 right-0 left-0 bottom-0 h-full w-full "
        >
          <div className="p-4 max-w-xl mx-auto absolute left-0 right-0 overflow-hidden mt-24 ">
            <div className="shadow relative rounded-lg bg-white overflow-hidden w-full block p-8">
              <h2 className="font-bold text-2xl mb-6 text-gray-800 border-b pb-2">
                All Events for {moreEventsDate}
              </h2>

              <div
                style={{ maxHeight: "50vh", overflowY: "auto" }} // Set max height and enable vertical scroll
              >
                {events
                  .filter(
                    (event) =>
                      new Date(event.eventDate).toDateString() ===
                      moreEventsDate
                  )
                  .map((event, eventIndex) => (
                    <div
                      key={eventIndex}
                      onClick={() => showEditModal(event)}
                      className={`px-2 py-1 rounded-lg mt-1 overflow-hidden border cursor-pointer ${
                        event.eventTheme === "blue"
                          ? "border-blue-200 text-blue-800 bg-blue-100"
                          : event.eventTheme === "red"
                          ? "border-red-200 text-red-800 bg-red-100"
                          : event.eventTheme === "yellow"
                          ? "border-yellow-200 text-yellow-800 bg-yellow-100"
                          : event.eventTheme === "green"
                          ? "border-green-200 text-green-800 bg-green-100"
                          : "border-purple-200 text-purple-800 bg-purple-100"
                      }`}
                    >
                      <p className="text-sm truncate leading-tight">
                        {event.eventTitle}
                      </p>
                      <p className="text-xs">
                        {formatTime(event.startTime)} - {" "}
                        {formatTime(event.endTime)}
                      </p>
                    </div>
                  ))}
              </div>

              <div className="mt-8 text-right">
                <button
                  type="button"
                  className="bg-white hover:bg-gray-100 text-gray-700 font-semibold py-2 px-4 border border-gray-300 rounded-lg shadow-sm mr-2"
                  onClick={() => setOpenMoreEventsModal(false)} // Close the modal
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
  //#region Render
};

export default PCVSchedule;
//#region Render