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

const Schedule = () => {
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
  const [departmentList, setDepartmentList] = useState([]);
  const [userId, setUserId] = useState(sessionStorage.getItem('LoginUserId'));

  const [manualNotification, setManualNotification] = useState(false); // Default to 'NO'
  const [manualNotificationTime, setManualNotificationTime] = useState(null); // to store the selected date-time
  const [notificationDateTimes, setNotificationDateTimes] = useState([]); // to store multiple selected date-times
  const [isSubmitting, setIsSubmitting] = useState(false);


  // const userIdForSchedule = sessionStorage.getItem('LoginUserId');

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
          const adminResult = await CommonService.getAdmin(departmentId);
          setAdminList(adminResult.data);
        } else if (departmentId) {
          // Call the API for employees when a valid department is selected
          const employeeResult = await EmployeeService.getEmployeeByDepartment(departmentId);
          setEmployeeList(employeeResult.data);
        } else {
          // If no department is selected, clear the employee list
          setEmployeeList([]);
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

  const formatTime = (time) => {
    if (!time) return '';
    const [hours, minutes] = time.split(":");
    return `${hours}:${minutes}`;
  };

  const formatEventDate = (date) => {
    if (!date) return '';
    const eventDate = new Date(date);
    return format(eventDate, 'EEE, MMM dd, yyyy');
  };

  const fetchEventDetails = async (scheduleId) => {
    try {
      // debugger;
      const response = await ScheduleCalService.getScheduleById(scheduleId);
      const scheduleData = response.data;
      // console.log(scheduleData)
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

  const isToday = (date) => {
    return isSameDay(new Date(), date);
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

  const addEvent = async () => {
    if (eventTitle === '') {
      toast.error('Please enter a title for the event!');
      return;
    }
    if (startTime === '') {
      toast.error('Please select a start time!');
      return;
    }

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
      manualNotification,
      reminderDateTimes: notificationDateTimes, // Store the selected date-times for reminders
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

  const getWeekRangeString = () => {
    const start = startOfWeek(currentWeek);
    const end = endOfWeek(currentWeek);
    return `${format(start, 'MMM dd, yyyy')} - ${format(end, 'MMM dd, yyyy')}`;
  };

  const showMoreEventsModal = (date) => {
    setMoreEventsDate(date.toDateString());
    setOpenMoreEventsModal(true); // Open the More Events modal
    console.log("More Events for date:", date);
  };
  
  return (
    <div className="antialiased sans-serif h-screen">
      <h1 className="font-semibold md:mb-[-12px] lg:mb-[-12px] text-2xl">
        Calendar
      </h1>

      {/* Department and User Selects */}
      <div className="container mx-auto py-2 md:py-6">
        <div className="flex flex-wrap items-center">
          {/* <label className="block text-base font-medium"> Department </label> */}
          {/* <div className="realative z-20"> */}
          <div className="w-full md:w-1/3 me-2">
            <select
              value={departmentId}
              onChange={(e) => setDepartmentId(e.target.value)}
              name="departmentId"
              className="w-full mb-2 md:mb-0 rounded-md border py-[10px] px-4 border-active"
            >
              <option value="">--Select Department--</option>
              {departmentList.length > 0 ? (
                departmentList.map((departmentItem) => (
                  <option
                    key={departmentItem.departmentId}
                    value={departmentItem.departmentId}
                  >
                    {departmentItem.departmentName}
                  </option>
                ))
              ) : (
                <option value="" disabled>
                  No Department available
                </option>
              )}
              <option value="Admin">Admin</option>
            </select>
          </div>

          {/* Conditionally render the Employee Select dropdown */}
          {departmentId !== "Admin" && (
            <div className="w-full md:w-1/3 me-2">
              <select
                value={userId}
                onChange={(e) => setUserId(e.target.value)}
                className="w-full rounded-md border py-[10px] px-4 border-active"
              >
                <option value="">--Select Employee--</option>
                {employeeList.map((employee) => (
                  <option key={employee.employeeId} value={employee.employeeId}>
                    {employee.firstName + " " + employee.lastName}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Conditionally render the Admin Select dropdown */}
          {departmentId === "Admin" && (
            <div className="w-full md:w-1/3 me-2">
              <select
                value={userId}
                onChange={(e) => setUserId(e.target.value)}
                className="w-full rounded-md border py-[10px] px-4 border-active"
              >
                <option value="">--Select Admin--</option>
                {adminList.map((admin) => (
                  <option key={admin.adminId} value={admin.adminId}>
                    {admin.firstName + " " + admin.lastName}
                  </option>
                ))}
              </select>
            </div>
          )}
          {/* </div> */}
        </div>
      </div>

      <div className="container mx-auto py-2 md:py-0">
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="flex items-center justify-between py-2 px-6">
            <div>
              <span className="text-lg font-bold text-gray-800">
                {MONTH_NAMES[month]}
              </span>
              <span className="ml-1 text-lg text-gray-600 font-normal">
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
                className="border border-gray-300 rounded-lg p-2 border-active"
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
                              {formatTime(event.startTime)} -{" "}
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
                {/* <button onClick={() => navigateWeek(-1)}>Previous</button> */}
                <div className="font-semibold">
                  {format(startOfWeek(currentDate), "MMM dd")} -{" "}
                  {format(endOfWeek(currentDate), "MMM dd, yyyy")}
                </div>
                {/* <button onClick={() => navigateWeek(1)}>Next</button> */}
              </div>

              {/* Fixed header row */}
              <div className="flex">
                <div className="w-16"></div> {/* Empty space for time column */}
                <div className="flex-1 grid grid-cols-7">
                  {noOfDays.map((day, i) => (
                    <div key={i} className="text-center py-2 border-b">
                      <div className="text-sm font-semibold cursor-pointer">
                        {DAYS[i]}
                      </div>
                      <div
                        onClick={() => showEventModal(day)}
                        className={`w-8 h-8 mx-auto flex items-center justify-center rounded-full cursor-pointer ${
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
                  {HOURS.map((hour, i) => (
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
                  {noOfDays.map((day, i) => (
                    <div key={i} className="border-r last:border-r-0 relative">
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

                        {/* Events positioned by time */}
                        {events
                          .filter((event) =>
                            isSameDay(new Date(event.eventDate), day)
                          )
                          .map((event) => {
                            const startHour =
                              parseInt(event.startTime?.split(":")[0]) || 0;
                            const startMinute =
                              parseInt(event.startTime?.split(":")[1]) || 0;
                            const endHour =
                              parseInt(event.endTime?.split(":")[0]) || 0;
                            const endMinute =
                              parseInt(event.endTime?.split(":")[1]) || 0;

                            const top = startHour * 48 + startMinute * 0.8;
                            const height =
                              (endHour - startHour) * 48 +
                              (endMinute - startMinute) * 0.8;

                            return (
                              <div
                                onClick={() => showEditModal(event)}
                                key={event.scheduleCalendarId}
                                className={`absolute left-1 right-1 rounded p-1 text-xs ${
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
                                style={{
                                  top: `${top}px`,
                                  height: `${height}px`,
                                }}
                              >
                                <div className="truncate font-medium">
                                  {event.eventTitle}
                                </div>
                                <div>
                                  {event.startTime} - {event.endTime}
                                </div>
                              </div>
                            );
                          })}
                      </div>
                    </div>
                  ))}
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

                  {/* Events positioned by time */}
                  {events
                    .filter((event) =>
                      isSameDay(new Date(event.eventDate), currentDate)
                    )
                    .map((event) => {
                      const startHour =
                        parseInt(event.startTime?.split(":")[0]) || 0;
                      const startMinute =
                        parseInt(event.startTime?.split(":")[1]) || 0;
                      const endHour =
                        parseInt(event.endTime?.split(":")[0]) || 0;
                      const endMinute =
                        parseInt(event.endTime?.split(":")[1]) || 0;

                      const top = startHour * 48 + startMinute * 0.8;
                      const height =
                        (endHour - startHour) * 48 +
                        (endMinute - startMinute) * 0.8;

                      return (
                        <div
                          key={event.scheduleCalendarId}
                          className={`absolute left-1 right-1 rounded p-1 text-xs ${
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
                          style={{
                            top: `${top}px`,
                            height: `${height}px`,
                          }}
                        >
                          <div className="truncate font-medium">
                            {event.eventTitle}
                          </div>
                          <div>
                            {event.startTime} - {event.endTime}
                          </div>
                        </div>
                      );
                    })}
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
                    onChange={(e) => setEventMeetingLink(e.target.value)}
                    placeholder="Zoom/Teams link (optional)"
                  />
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

              {/* Send Manual Notification Field */}
              <div className="mb-4">
                <label className="text-gray-800 block mb-1 font-bold text-sm tracking-wide">
                  Send Manual Notification?
                </label>
                <div className="flex items-center space-x-4">
                  <label className="flex items-center space-x-2">
                    <input
                      type="radio"
                      value="true"
                      checked={manualNotification === true}
                      onChange={() => setManualNotification(true)}
                      className="form-radio"
                    />
                    <span>YES</span>
                  </label>
                  <label className="flex items-center space-x-2">
                    <input
                      type="radio"
                      value="false"
                      checked={manualNotification === false}
                      onChange={() => setManualNotification(false)}
                      className="form-radio"
                    />
                    <span>NO</span>
                  </label>
                </div>
              </div>

              {/* Add Manual Notification Button (Visible when YES is selected) */}
              {manualNotification === true && (
                <div className="mb-4">
                  <button
                    onClick={() => setNotificationDateTimes([...notificationDateTimes, ''])}
                    className="flex items-center text-blue-500 hover:text-blue-700"
                  >
                    <FaPlus className="mr-2" />
                    Add Manual Notification
                  </button>
                </div>
              )}

              {/* Display Date-Time Picker Fields */}
             {notificationDateTimes.map((dateTime, index) => (
               <div key={index} className="flex items-center mb-4">
                 <input
                   type="datetime-local"
                   value={dateTime}
                   onChange={(e) => {
                     const updatedDateTimes = [...notificationDateTimes];
                     updatedDateTimes[index] = e.target.value;
                     setNotificationDateTimes(updatedDateTimes);
                   }}
                   className="bg-gray-200 appearance-none border-2 border-gray-200 rounded-lg w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-blue-500"
                 />
                 {/* Close Icon to Remove Date-Time Picker */}
                 <button
                   type="button"
                   onClick={() => {
                     const updatedDateTimes = notificationDateTimes.filter((_, i) => i !== index);
                     setNotificationDateTimes(updatedDateTimes);
                   }}
                   className="ml-2 text-red-500 hover:text-red-700"
                 >
                   <FaTimes />
                 </button>
               </div>
             ))}

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
                    isSubmitting ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                  disabled={isSubmitting}
                  onClick={editingEvent ? updateEvent : addEvent}
                >
                  {isSubmitting ? 'Submitting...' : editingEvent ? "Update Event" : "Add Event"}
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
                        {event.startTime} - {event.endTime}
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
};

export default Schedule;








// import React, { useState, useEffect } from 'react';

// const MONTH_NAMES = [
//   'January', 'February', 'March', 'April', 'May', 'June',
//   'July', 'August', 'September', 'October', 'November', 'December'
// ];

// const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

// const themes = [
//   { value: 'blue', label: 'Blue' },
//   { value: 'red', label: 'Red' },
//   { value: 'green', label: 'Green' },
//   { value: 'yellow', label: 'Yellow' },
//   { value: 'purple', label: 'Purple' },
// ];

// const Schedule = () => {
//   const [month, setMonth] = useState(new Date().getMonth());
//   const [year, setYear] = useState(new Date().getFullYear());
//   const [noOfDays, setNoOfDays] = useState([]);
//   const [blankDays, setBlankDays] = useState([]);
//   const [events, setEvents] = useState([
//     { id: 1, event_date: new Date(2020, 3, 1), event_title: "April Fool's Day", event_theme: "blue", start_time: "09:00", end_time: "12:00" },
//     { id: 2, event_date: new Date(2020, 3, 10), event_title: "Birthday", event_theme: "red", start_time: "14:00", end_time: "16:00" },
//     { id: 3, event_date: new Date(2020, 3, 16), event_title: "Upcoming Event", event_theme: "green", start_time: "10:00", end_time: "12:00" },
//   ]);
//   const [eventTitle, setEventTitle] = useState('');
//   const [eventDate, setEventDate] = useState('');
//   const [eventTheme, setEventTheme] = useState('blue');
//   const [startTime, setStartTime] = useState('09:00');
//   const [endTime, setEndTime] = useState('10:00');
//   const [openEventModal, setOpenEventModal] = useState(false);
//   const [editingEvent, setEditingEvent] = useState(null);

//   const [openMoreEventsModal, setOpenMoreEventsModal] = useState(false);
//   const [moreEventsDate, setMoreEventsDate] = useState(null);


//   useEffect(() => {
//     getNoOfDays();
//   }, [month, year]);

//   const isToday = (date) => {
//     const today = new Date();
//     const d = new Date(year, month, date);
//     return today.toDateString() === d.toDateString();
//   };

//   const getNoOfDays = () => {
//     const daysInMonth = new Date(year, month + 1, 0).getDate();
//     const dayOfWeek = new Date(year, month).getDay();
//     const blankdaysArray = Array(dayOfWeek).fill(null);
//     const daysArray = Array.from({ length: daysInMonth }, (_, index) => index + 1);
//     setBlankDays(blankdaysArray);
//     setNoOfDays(daysArray);
//   };

//   const showEventModal = (date) => {
//     setOpenEventModal(true);
//     setEventDate(new Date(year, month, date).toDateString());
//     setEditingEvent(null); // Reset the editing state when opening the modal
//   };

//   const showEditModal = (event) => {
//     setOpenEventModal(true);
//     setEventDate(new Date(event.event_date).toDateString());
//     setEventTitle(event.event_title);
//     setEventTheme(event.event_theme);
//     setStartTime(event.start_time);
//     setEndTime(event.end_time);
//     setEditingEvent(event); // Set the event to be edited
//   };

//   const addEvent = () => {
//     if (eventTitle === '') return;
//     const newEvent = {
//       id: events.length + 1, // Generate a simple ID (you can replace it with a better method in production)
//       event_date: eventDate,
//       event_title: eventTitle,
//       event_theme: eventTheme,
//       start_time: startTime,
//       end_time: endTime,
//     };
//     setEvents([...events, newEvent]);
//     clearEventForm();
//   };

//   const updateEvent = () => {
//     if (eventTitle === '') return;
//     const updatedEvent = {
//       ...editingEvent,
//       event_title: eventTitle,
//       event_theme: eventTheme,
//       start_time: startTime,
//       end_time: endTime,
//     };
//     setEvents(events.map(event => event.id === updatedEvent.id ? updatedEvent : event));
//     clearEventForm();
//   };

//   const deleteEvent = (id) => {
//     setEvents(events.filter(event => event.id !== id));
//   };

//   const clearEventForm = () => {
//     setEventTitle('');
//     setEventDate('');
//     setEventTheme('blue');
//     setStartTime('09:00');
//     setEndTime('10:00');
//     setOpenEventModal(false);
//     setEditingEvent(null);
//   };

// //   const showMoreEventsModal = (date) => {
// //     setOpenEventModal(true);
// //     setEventDate(new Date(year, month, date).toDateString()); // Store the date to display events for that date
// //     setEditingEvent(null); // Reset editing state
// //   };

// const showMoreEventsModal = (date) => {
//     setMoreEventsDate(new Date(year, month, date).toDateString());
//     setOpenMoreEventsModal(true); // Open the More Events modal
// };
  
  
//   return (
//     <div className="antialiased sans-serif h-screen">
//       <div className="container mx-auto px-4 py-2 md:py-24">
//         <div className="bg-white rounded-lg shadow overflow-hidden">
//           <div className="flex items-center justify-between py-2 px-6">
//             <div>
//               <span className="text-lg font-bold text-gray-800">{MONTH_NAMES[month]}</span>
//               <span className="ml-1 text-lg text-gray-600 font-normal">{year}</span>
//             </div>
//             <div className="border rounded-lg px-1" style={{ paddingTop: "2px" }}>
//               <button
//                 type="button"
//                 className="leading-none rounded-lg transition ease-in-out duration-100 inline-flex cursor-pointer hover:bg-gray-200 p-1 items-center"
//                 disabled={month === 0}
//                 onClick={() => { setMonth(month - 1); }}
//               >
//                 <svg className="h-6 w-6 text-gray-500 inline-flex leading-none" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
//                 </svg>
//               </button>
//               <div className="border-r inline-flex h-6"></div>
//               <button
//                 type="button"
//                 className="leading-none rounded-lg transition ease-in-out duration-100 inline-flex items-center cursor-pointer hover:bg-gray-200 p-1"
//                 disabled={month === 11}
//                 onClick={() => { setMonth(month + 1); }}
//               >
//                 <svg className="h-6 w-6 text-gray-500 inline-flex leading-none" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
//                 </svg>
//               </button>
//             </div>
//           </div>

//           <div className="-mx-1 -mb-1">
//             <div className="flex flex-wrap" style={{ marginBottom: "-40px" }}>
//               {DAYS.map((day, index) => (
//                 <div style={{ width: "14.28%" }} className="px-2 py-2" key={index}>
//                   <div className="text-gray-600 text-sm uppercase tracking-wide font-bold text-center">{day}</div>
//                 </div>
//               ))}
//             </div>

//             <div className="flex flex-wrap border-t border-l">
//   {blankDays.map((_, index) => (
//     <div style={{ width: "14.28%", height: "120px" }} className="text-center border-r border-b px-4 pt-2" key={index}></div>
//   ))}

//   {noOfDays.map((date, index) => (
//     <div style={{ width: "14.28%", height: "120px" }} className="px-4 pt-2 border-r border-b relative" key={index}>
//       <div
//         onClick={() => showEventModal(date)}
//         className={`inline-flex w-6 h-6 items-center justify-center cursor-pointer text-center leading-none rounded-full transition ease-in-out duration-100 ${isToday(date) ? "bg-blue-500 text-white" : "text-gray-700 hover:bg-blue-200"}`}
//       >
//         {date}
//       </div>

//       {/* Container for events */}
//       <div style={{ height: "calc(100% - 30px)", overflow: "hidden" }} className="mt-1 flex flex-col justify-between">
        
//         {/* Events */}
//         {events
//           .filter((event) => new Date(event.event_date).toDateString() === new Date(year, month, date).toDateString())
//           .slice(0, 1) // Show only the first event
//           .map((event, eventIndex) => (
//             <div key={eventIndex} className={`px-2 py-1 rounded-lg mt-1 overflow-hidden border ${event.event_theme === "blue" ? "border-blue-200 text-blue-800 bg-blue-100" : event.event_theme === "red" ? "border-red-200 text-red-800 bg-red-100" : event.event_theme === "yellow" ? "border-yellow-200 text-yellow-800 bg-yellow-100" : event.event_theme === "green" ? "border-green-200 text-green-800 bg-green-100" : "border-purple-200 text-purple-800 bg-purple-100"}`}>
//               <p className="text-sm truncate leading-tight">{event.event_title}</p>
//               <p className="text-xs">{event.start_time} - {event.end_time}</p>
//               <button onClick={() => showEditModal(event)} className="text-sm text-blue-600 hover:underline mt-1">Edit</button>
//               <button onClick={() => deleteEvent(event.id)} className="text-sm text-red-600 hover:underline mt-1 ml-2">Delete</button>
//             </div>
//           ))}
        
//         {/* Show More button */}
//         {events
//           .filter((event) => new Date(event.event_date).toDateString() === new Date(year, month, date).toDateString())
//           .length > 1 && (
//             <button
//               onClick={() => showMoreEventsModal(date)} // Open the modal to show all events for this date
//               className="text-sm flex flex-start px-2 py-1 rounded-lg border-gray-400 text-gray-600 bg-gray-300 hover:bg-gray-400 hover:text-white mt-2"
//             >
//               {events
//         .filter((event) => new Date(event.event_date).toDateString() === new Date(year, month, date).toDateString())
//         .length - 1} More..
//             </button>
//           )}
//       </div>
//     </div>
//   ))}
// </div>

//           </div>
//         </div>
//       </div>

//       {openEventModal && (
//         <div style={{ backgroundColor: "rgba(0, 0, 0, 0.8)" }} className="fixed z-40 top-0 right-0 left-0 bottom-0 h-full w-full">
//           <div className="p-4 max-w-xl mx-auto absolute left-0 right-0 overflow-hidden mt-24">
//             <div
//               className="shadow absolute right-0 top-0 w-10 h-10 rounded-full bg-white text-gray-500 hover:text-gray-800 inline-flex items-center justify-center cursor-pointer"
//               onClick={() => setOpenEventModal(false)}
//             >
//               <svg className="fill-current w-6 h-6" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
//                 <path
//                   d="M16.192 6.344L11.949 10.586 7.707 6.344 6.293 7.758 10.535 12 6.293 16.242 7.707 17.656 11.949 13.414 16.192 17.656 17.606 16.242 13.364 12 17.606 7.758z"
//                 />
//               </svg>
//             </div>

//             <div className="shadow rounded-lg bg-white overflow-hidden w-full block p-8">
//               <h2 className="font-bold text-2xl mb-6 text-gray-800 border-b pb-2">{editingEvent ? 'Edit Event' : 'Add Event Details'}</h2>

//               <div className="mb-4">
//                 <label className="text-gray-800 block mb-1 font-bold text-sm tracking-wide">Event title</label>
//                 <input
//                   className="bg-gray-200 appearance-none border-2 border-gray-200 rounded-lg w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-blue-500"
//                   type="text"
//                   value={eventTitle}
//                   onChange={(e) => setEventTitle(e.target.value)}
//                 />
//               </div>

//               <div className="mb-4">
//                 <label className="text-gray-800 block mb-1 font-bold text-sm tracking-wide">Event date</label>
//                 <input
//                   className="bg-gray-200 appearance-none border-2 border-gray-200 rounded-lg w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-blue-500"
//                   type="text"
//                   value={eventDate}
//                   readOnly
//                 />
//               </div>

//               <div className="inline-block w-64 mb-4">
//                 <label className="text-gray-800 block mb-1 font-bold text-sm tracking-wide">Select a theme</label>
//                 <div className="relative">
//                   <select
//                     onChange={(e) => setEventTheme(e.target.value)}
//                     value={eventTheme}
//                     className="block appearance-none w-full bg-gray-200 border-2 border-gray-200 hover:border-gray-500 px-4 py-2 pr-8 rounded-lg leading-tight focus:outline-none focus:bg-white focus:border-blue-500 text-gray-700"
//                   >
//                     {themes.map((theme) => (
//                       <option key={theme.value} value={theme.value}>
//                         {theme.label}
//                       </option>
//                     ))}
//                   </select>
//                   <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
//                     <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
//                       <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
//                     </svg>
//                   </div>
//                 </div>
//               </div>

//               <div className="mb-4">
//                 <label className="text-gray-800 block mb-1 font-bold text-sm tracking-wide">Start Time</label>
//                 <input
//                   type="time"
//                   value={startTime}
//                   onChange={(e) => setStartTime(e.target.value)}
//                   className="bg-gray-200 appearance-none border-2 border-gray-200 rounded-lg w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-blue-500"
//                 />
//               </div>

//               <div className="mb-4">
//                 <label className="text-gray-800 block mb-1 font-bold text-sm tracking-wide">End Time</label>
//                 <input
//                   type="time"
//                   value={endTime}
//                   onChange={(e) => setEndTime(e.target.value)}
//                   className="bg-gray-200 appearance-none border-2 border-gray-200 rounded-lg w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-blue-500"
//                 />
//               </div>

//               <div className="mt-8 text-right">
//                 <button
//                   type="button"
//                   className="bg-white hover:bg-gray-100 text-gray-700 font-semibold py-2 px-4 border border-gray-300 rounded-lg shadow-sm mr-2"
//                   onClick={() => setOpenEventModal(false)}
//                 >
//                   Cancel
//                 </button>
//                 <button
//                   type="button"
//                   className="bg-gray-800 hover:bg-gray-700 text-white font-semibold py-2 px-4 border border-gray-700 rounded-lg shadow-sm"
//                   onClick={editingEvent ? updateEvent : addEvent}
//                 >
//                   {editingEvent ? 'Save Changes' : 'Save Event'}
//                 </button>
//               </div>
//             </div>
//           </div>
//         </div>
//       )}

// {openMoreEventsModal && moreEventsDate && (
//   <div style={{ backgroundColor: "rgba(0, 0, 0, 0.8)" }} className="fixed z-40 top-0 right-0 left-0 bottom-0 h-full w-full">
//     <div className="p-4 max-w-xl mx-auto absolute left-0 right-0 overflow-hidden mt-24">
//       <div className="shadow rounded-lg bg-white overflow-hidden w-full block p-8">
//         <h2 className="font-bold text-2xl mb-6 text-gray-800 border-b pb-2">All Events for {moreEventsDate}</h2>

//         <div>
//           {events
//             .filter((event) => new Date(event.event_date).toDateString() === moreEventsDate)
//             .map((event, eventIndex) => (
//               <div
//                 key={eventIndex}
//                 className={`px-2 py-1 rounded-lg mt-1 overflow-hidden border ${event.event_theme === "blue" ? "border-blue-200 text-blue-800 bg-blue-100" : event.event_theme === "red" ? "border-red-200 text-red-800 bg-red-100" : event.event_theme === "yellow" ? "border-yellow-200 text-yellow-800 bg-yellow-100" : event.event_theme === "green" ? "border-green-200 text-green-800 bg-green-100" : "border-purple-200 text-purple-800 bg-purple-100"}`}
//               >
//                 <p className="text-sm truncate leading-tight">{event.event_title}</p>
//                 <p className="text-xs">{event.start_time} - {event.end_time}</p>
//                 <button onClick={() => showEditModal(event)} className="text-sm text-blue-600 hover:underline mt-1">Edit</button>
//                 <button onClick={() => deleteEvent(event.id)} className="text-sm text-red-600 hover:underline mt-1 ml-2">Delete</button>
//               </div>
//             ))}
//         </div>

//         <div className="mt-8 text-right">
//           <button
//             type="button"
//             className="bg-white hover:bg-gray-100 text-gray-700 font-semibold py-2 px-4 border border-gray-300 rounded-lg shadow-sm mr-2"
//             onClick={() => setOpenMoreEventsModal(false)} // Close the modal
//           >
//             Close
//           </button>
//         </div>
//       </div>
//     </div>
//   </div>
// )}


//     </div>
//   );
// };

// export default Schedule;
