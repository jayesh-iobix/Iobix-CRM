import { BiAbacus, BiBox, BiCalendar, BiGrid, BiGridSmall, BiGridVertical, BiListUl, BiMicrophone, BiSolidMicrophone, BiTask } from 'react-icons/bi'
import { BsChat, BsFillGrid1X2Fill, BsFillGridFill, BsFillMegaphoneFill, BsHandThumbsUp, BsMegaphone, BsPeople, BsPersonRaisedHand } from 'react-icons/bs'
import { FaBuilding, FaBusinessTime, FaCalendar, FaFileInvoice, FaHandshake, FaHandshakeAltSlash, FaRegHandshake, FaVenusDouble } from 'react-icons/fa';
import { FaUserGear, FaUsersGear } from 'react-icons/fa6';
import {
	HiOutlineViewGrid,
	HiOutlineQuestionMarkCircle,
	HiOutlineCog
} from 'react-icons/hi'

//Admin Dashboard Sidebar Links
export const DASHBOARD_SIDEBAR_LINKS = [
  {
    key: "dashboard",
    label: "Dashboard",
    path: "/",
    icon: <HiOutlineViewGrid />,
  },
  {
    key: "master",
    label: "Master",
    icon: <BiBox />,
    submenu: [
      // { label: "Partner", path: "/master/partner-list" },
      { label: "Department", path: "/master/department-list" },
      { label: "Designation", path: "/master/designation-list" },
      { label: "Leave Type", path: "/master/leave-type-list" },
      { label: "Employee Leave Type", path: "/master/employee-leavetype-list" },
      // { label: "Employee Permission", path: "/master/employeepermission-list" },
      { label: "Holiday", path: "/master/holiday-list" },
      { label: "Inquiry Type", path: "/master/inquirytype-list" },
      { label: "Inquiry Source", path: "/master/inquirysource-list" },
      // { label: "Inquiry Origin", path: "/master/inquiryorigin-list" },
      // { label: "User Inquiry Permission", path: "/master/userinquirypermission-list" },
      { label: "Admin Inquiry Permissi", path: "/master/inquirypermission-list" },
      { label: "Tax Details", path: "/master/tax-detail-list" },
      { label: "Invoice Details", path: "/master/invoice-detail-list" },
    ],
  },  
  {
    key: "employee",
    label: "Employees",
    path: "/employee-list",
    icon: <BsPeople />,
  },
  {
    key: "task",
    label: "Task",
    icon: <BiTask />,
    submenu: [
      { label: "Task List", path: "/task/task-list" },
    ],
  },
  {
    key: "calendar",
    label: "Schedule Calendar",
    path: "/calendar",
    icon: <BiCalendar />,
  },
  {
    key: "announcement",
    label: "Announcement",
    path: "/announcement-list",
    icon: <BsMegaphone />,
  },
  {
    key: "project",
    label: "Project",
    icon: <HiOutlineQuestionMarkCircle />,
    submenu: [
      { label: "Received Project", path: "/received-project-list" },
      { label: "Created Project", path: "/created-project-list" },
    ],
  },
  {
    key: "partner",
    label: "Partners",
    path: "/partner-list",
    icon: <FaRegHandshake />,
  },

  {
    key: "client company",
    label: "Client Company",
    path: "/clientcompany-list",
    icon: <FaBusinessTime />,
  },
  {
    key: "vendor",
    label: "Vendors",
    path: "/vendor-list",
    icon: <FaVenusDouble />,
  },
  {
    key: "gmServiceClient",
    label: "GTM Service Client",
    path: "/gtm-client",
    icon: <FaUsersGear />,
  },
  {
    key: "invoice",
    label: "Invoice",
    icon: <FaFileInvoice />,
    submenu: [
      { label: "Invoive History", path: "/invoice/invoice-history" },
      // { label: "Invoive Payment", path: "/invoice/invoice-payment" },
  ],
  },
];

//HR Dashboard Sidebar Links
export const HR_DASHBOARD_SIDEBAR_LINKS = [
  {
    key: "dashboard",
    label: "Dashboard",
    path: "/user",
    icon: <HiOutlineViewGrid />,
  },
  {
    key: "master",
    label: "Master",
    icon: <BiBox />,
    submenu: [
      // { label: "Partner", path: "/master/partner-list" },
      // { label: "Department", path: "/master/department-list" },
      // { label: "Designation", path: "/master/designation-list" },
      { label: "Leave Type", path: "/master/leave-type-list" },
      { label: "Employee Leave Type", path: "/master/employee-leavetype-list" },
      // { label: "Employee Permission", path: "/master/employeepermission-list" },
      { label: "Holiday", path: "/master/holiday-list" },
      { label: "Inquiry Type", path: "/master/inquirytype-list" },
      { label: "Inquiry Source", path: "/master/inquirysource-list" },
      // { label: "User Inquiry Permission", path: "/master/userinquirypermission-list" },
      // { label: "Admin Inquiry Permissi", path: "/master/inquirypermission-list" },
    ],
  },  
  {
    key: "task",
    label: "Task",
    icon: <BiTask />,
    submenu: [
      { label: "User Tasks", path: "/user/task-list" },
      { label: "Assign Tasks", path: "/user/assign-task-list" },
    ],
  },
  {
    key: "employee",
    label: "Employees",
    path: "/user/employee-list",
    icon: <BsPeople />,
  },
  {
    key: "calendar",
    label: "Schedule Calendar",
    path: "/user/calendar",
    icon: <BiCalendar />,
  },
  {
    key: "announcement",
    label: "Announcement",
    path: "/user/announcement-list",
    icon: <BsMegaphone />,
  },
  // {
  //   key: "project",
  //   label: "Project",
  //   icon: <HiOutlineQuestionMarkCircle />,
  //   submenu: [
  //     { label: "Received Project", path: "/received-project-list" },
  //     { label: "Created Project", path: "/created-project-list" },
  //   ],
  // },
  // {
  //   key: "partner",
  //   label: "Partners",
  //   path: "/partner-list",
  //   icon: <FaRegHandshake />,
  // },
  // {
  //   key: "client company",
  //   label: "Client Company",
  //   path: "/clientcompany-list",
  //   icon: <FaBusinessTime />,
  // },
  // {
  //   key: "vendor",
  //   label: "Vendors",
  //   path: "/vendor-list",
  //   icon: <FaVenusDouble />,
  // },


];

//IT Employee Dashboard Sidebar Links
export const IT_EMPLOYEE_DASHBOARD_SIDEBAR_LINKS = [
  {
    key: "dashboard",
    label: "Dashboard",
    path: "/user",
    icon: <HiOutlineViewGrid />,
  },
  {
    key: "task",
    label: "Task",
    // path: '/user/task-list',
    icon: <BiTask />,
    submenu: [
      { label: "User Tasks", path: "/user/task-list" },
      // { label: 'User Sub Tasks', path: '/user/sub-task-list' },
      { label: "Assign Tasks", path: "/user/assign-task-list" },
    ],
  },
  {
    key: "attendance",
    label: "Attendance",
    path: "/user/attendance",
    icon: <BiListUl />,
  },
  {
    key: "leave",
    label: "Leave",
    path: "/user/leave",
    icon: <BsFillGridFill />,
  },
  // {
  //   key: "inquiry",
  //   label: "Inquiry",
  //   icon: <HiOutlineQuestionMarkCircle />,
  //   submenu: [
  //     { label: "Inquiry List", path: "/user/inquiry-list" },
  //     { label: "Create Inquiry", path: "/user/create-inquiry-list" },
  //     // { label: "Recived Partner Inquiry", path: "/partnerinquiry-list" },
  //     // { label: "Recived Client Inquiry", path: "/clientinquiry-list" },
  //   ],
  // },
  // {
  //   key: "inquiry",
  //   label: "Inquiry",
  //   path: "/user/inquiry-list",
  //   icon: <HiOutlineQuestionMarkCircle />,
  // },
];

//BD Employee Dashboard Sidebar Links
export const BD_EMPLOYEE_DASHBOARD_SIDEBAR_LINKS = [
  {
    key: "dashboard",
    label: "Dashboard",
    path: "/user",
    icon: <HiOutlineViewGrid />,
  },
  {
    key: "task",
    label: "Task",
    // path: '/user/task-list',
    icon: <BiTask />,
    submenu: [
      { label: "User Tasks", path: "/user/task-list" },
      // { label: 'User Sub Tasks', path: '/user/sub-task-list' },
      { label: "Assign Tasks", path: "/user/assign-task-list" },
    ],
  },
  {
    key: "attendance",
    label: "Attendance",
    path: "/user/attendance",
    icon: <BiListUl />,
  },
  {
    key: "calendar",
    label: "Schedule Calendar",
    path: "/user/calendar",
    icon: <BiCalendar />,
  },
  {
    key: "project",
    label: "Project",
    icon: <HiOutlineQuestionMarkCircle />,
    submenu: [
      { label: "Project List", path: "/user/project-list" },
      // { label: "Create project", path: "/user/create-project-list" },
      // { label: "Recived Partner Inquiry", path: "/partnerinquiry-list" },
      // { label: "Recived Client Inquiry", path: "/clientinquiry-list" },
    ],
  },
  {
    key: "leave",
    label: "Leave",
    path: "/user/leave",
    icon: <BsFillGridFill />,
  },

  // {
  //   key: "inquiry",
  //   label: "Inquiry",
  //   path: "/user/inquiry-list",
  //   icon: <HiOutlineQuestionMarkCircle />,
  // },
];

//User Dashboard Sidebar Links
export const USER_DASHBOARD_SIDEBAR_LINKS = [
  {
    key: "dashboard",
    label: "Dashboard",
    path: "/user",
    icon: <HiOutlineViewGrid />,
  },
  {
    key: "task",
    label: "Task",
    // path: '/user/task-list',
    icon: <BiTask />,
    submenu: [
      { label: "User Tasks", path: "/user/task-list" },
      // { label: 'User Sub Tasks', path: '/user/sub-task-list' },
      { label: "Assign Tasks", path: "/user/assign-task-list" },
    ],
  },
  {
    key: "attendance",
    label: "Attendance",
    path: "/user/attendance",
    icon: <BiListUl />,
  },
  {
    key: "leave",
    label: "Leave",
    path: "/user/leave",
    icon: <BsFillGridFill />,
  },
  // {
  //   key: "inquiry",
  //   label: "Inquiry",
  //   icon: <HiOutlineQuestionMarkCircle />,
  //   submenu: [
  //     { label: "Inquiry List", path: "/user/inquiry-list" },
  //     { label: "Create Inquiry", path: "/user/create-inquiry-list" },
  //     // { label: "Recived Partner Inquiry", path: "/partnerinquiry-list" },
  //     // { label: "Recived Client Inquiry", path: "/clientinquiry-list" },
  //   ],
  // },
  // {
  //   key: "inquiry",
  //   label: "Inquiry",
  //   path: "/user/inquiry-list",
  //   icon: <HiOutlineQuestionMarkCircle />,
  // },
];

//Partner Dashboard Sidebar Links
export const PARTNER_DASHBOARD_SIDEBAR_LINKS = [
  {
    key: "dashboard",
    label: "Dashboard",
    path: "/partner",
    icon: <HiOutlineViewGrid />,
  },
  {
    key: "project",
    label: "Project",
    icon: <HiOutlineQuestionMarkCircle />,
    submenu: [
      { label: "Send Project", path: "/partner/project-list" },
      { label: "Recived Project", path:"/partner/get-project-list" },
    ],
  },
  {
    key: "calendar",
    label: "Schedule Calendar",
    path: "/partner/calendar",
    icon: <BiCalendar />,
  },
];

//Company Dashboard Sidebar Links
export const COMPANY_DASHBOARD_SIDEBAR_LINKS = [
  {
    key: "dashboard",
    label: "Dashboard",
    path: "/company",
    icon: <HiOutlineViewGrid />,
  },
  {
    key: "icp",
    label: "ICP form",
	  path: "/company/icp-list",
    icon: <BiTask />,
  },
  {
    key: "project",
    label: "Project",
    icon: <HiOutlineQuestionMarkCircle />,
    submenu: [
      { label: "Recived Project", path:"/company/get-project-list" },
      { label: "Send Project", path: "/company/project-list" },
    ],
  },
  {
    key: "calendar",
    label: "Schedule Calendar",
    path: "/company/calendar",
    icon: <BiCalendar />,
  },
  // {
  //   key: "form to fill",
  //   label: "Form to Fill",
  //   icon: <BiTask />,
  //   submenu: [
  //     { label: "ICP form", path: "/company/inquiry-list" },
  //     { label: "Company Information", path: "/company-information/company-information-list" },
  //   ],
  // },
];

//Vendor Dashboard Sidebar Links
export const VENDOR_DASHBOARD_SIDEBAR_LINKS = [
  {
    key: "dashboard",
    label: "Dashboard",
    path: "/vendor",
    icon: <HiOutlineViewGrid />,
  },
  {
    key: "project",
    label: "Project",
    icon: <HiOutlineQuestionMarkCircle />,
    submenu: [
      { label: "Send Project", path: "/vendor/project-list" },
      { label: "Recived Project", path:"/vendor/get-project-list" },
    ],
  },
  {
    key: "calendar",
    label: "Schedule Calendar",
    path: "/vendor/calendar",
    icon: <BiCalendar />,
  },
];

//Bottom Dashboard Sidebar Links
export const DASHBOARD_SIDEBAR_BOTTOM_LINKS = [
	// {
	// 	key: 'settings',
	// 	label: 'Settings',
	// 	// path: '/settings',
	// 	icon: <HiOutlineCog />
	// },
	{
		key: 'support',
		label: 'Help & Support',
		path: '/help-support',
		icon: <HiOutlineQuestionMarkCircle />
	}
]

// Function to return sidebar links based on the user role
export const getDashboardSidebarBottomLinks = (role) => {
	return [
		{
			key: 'support',
			label: 'Help & Support',
			path: `/${role}/help-support`,
			icon: <HiOutlineQuestionMarkCircle />
		}
	];
};