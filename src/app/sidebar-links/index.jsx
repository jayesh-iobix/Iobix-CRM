import { BiAbacus, BiBox, BiGrid, BiGridSmall, BiGridVertical, BiListUl, BiTask } from 'react-icons/bi'
import { BsChat, BsFillGrid1X2Fill, BsFillGridFill, BsHandThumbsUp, BsPeople, BsPersonRaisedHand } from 'react-icons/bs'
import { FaBuilding, FaBusinessTime, FaHandshake, FaHandshakeAltSlash, FaRegHandshake, FaVenusDouble } from 'react-icons/fa';
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
      { label: "Employee Permission", path: "/master/employeepermission-list" },
      { label: "Holiday", path: "/master/holiday-list" },
      { label: "Inquiry Type", path: "/master/inquirytype-list" },
      { label: "Inquiry Source", path: "/master/inquirysource-list" },
      { label: "Inquiry Origin", path: "/master/inquiryorigin-list" },
      { label: "User Inquiry Permission", path: "/master/userinquirypermission-list" },
      { label: "Admin Inquiry Permissi", path: "/master/inquirypermission-list" },
    ],
  },
  // {
  //   key: "master",
  //   label: "Master",
  //   icon: <BiBox />,
  //   submenu: [
  //     // { label: "Partner", path: "/master/partner-list" },
  //     { label: "Department", path: "/master/department-list" },
  //     { label: "Designation", path: "/master/designation-list" },
  //     { label: "Leave Type", path: "/master/leave-type-list" },
  //     { label: "Employee Leave Type", path: "/master/employee-leavetype-list" },
  //     { label: "Employee Permission", path: "/master/employeepermission-list" },
  //     { label: "Holiday", path: "/master/holiday-list" },
  //     { label: "Inquiry Type", path: "/master/inquirytype-list" },
  //     { label: "Inquiry Source", path: "/master/inquirysource-list" },
  //     { label: "Inquiry Origin", path: "/master/inquiryorigin-list" },
  //     {
  //       icon: <HiOutlineQuestionMarkCircle />, // Uncomment if you want an icon
  //       label: "Inquiry Permission", // Parent label with a submenu
  //       submenu: [
  //         { label: "Employee Inquiry Permission", path: "/master/employee-inquiry-permission" },
  //         { label: "Admin Inquiry Permission", path: "/master/admin-inquiry-permission" },
  //       ]
  //     },
  //   ],
  // },   
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
      //   { label: 'Create Task', path: '/task/create-tas/k'},
    ],
  },
  // {
  //   key: "inquiry",
  //   label: "Inquiry",
  //   path: "/inquiry-list",
  //   icon: <HiOutlineQuestionMarkCircle />,
  // },
  {
    key: "project",
    label: "Project",
    icon: <HiOutlineQuestionMarkCircle />,
    submenu: [
      { label: "Received Project", path: "/received-project-list" },
      { label: "Created Project", path: "/created-project-list" },
    ],
  },
  // {
  //   key: "inquiry",
  //   label: "Project",
  //   icon: <HiOutlineQuestionMarkCircle />,
  //   submenu: [
  //     { label: "Recived Partner Project", path: "/partnerinquiry-list" },
  //     { label: "Recived Client Project", path: "/clientinquiry-list" },
  //   ],
  // },
  // {
  //   key: "createinquiry",
  //   label: "Create Project",
  //   icon: <HiOutlineQuestionMarkCircle />,
  //   submenu: [
  //     { label: "Create Partner Project", path: "/create-partnerinquiry-list" },
  //     { label: "Create Client Project", path: "/create-clientinquiry-list" },
  //   ],
  // },
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
  // {
  //   key: "vendor",
  //   label: "Vendors",
  //   path: "/vendor-list",
  //   icon: <FaVenusDouble />,
  // },

  // {
  //   key: "inquiry-chat",
  //   label: "Inquiry Chat",
  //   path: "/inquiry-chat",
  //   icon: <BsChat />,
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
    key: "leave",
    label: "Leave",
    path: "/user/leave",
    icon: <BsFillGridFill />,
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
  // {
  //   key: "inquiry",
  //   label: "Inquiry",
  //   path: "/partner/inquiry-list",
  //   icon: <HiOutlineQuestionMarkCircle />,
  // },
  // {
  //   key: "getinquiry",
  //   label: "Get Inquiry Iobix",
  //   path: "/partner/get-inquiry-list",
  //   icon: <HiOutlineQuestionMarkCircle />,
  // },
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
  // {
  //   key: "inquiry",
  //   label: "Send Inquiry",
  //   path: "/company/inquiry-list",
  //   icon: <HiOutlineQuestionMarkCircle />,
  // },
  // {
  //   key: "recivedinquiry",
  //   label: "Recived Inquiry",
  //   path: "/company/get-inquiry-list",
  //   icon: <HiOutlineQuestionMarkCircle />,
  // },

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

//Bottom Dashboard Sidebar Links
export const DASHBOARD_SIDEBAR_BOTTOM_LINKS = [
	{
		key: 'settings',
		label: 'Settings',
		// path: '/settings',
		icon: <HiOutlineCog />
	},
	{
		key: 'support',
		label: 'Help & Support',
		// path: '/support',
		icon: <HiOutlineQuestionMarkCircle />
	}
]