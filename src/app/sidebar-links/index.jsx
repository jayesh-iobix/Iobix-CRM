import { BiBox, BiTask } from 'react-icons/bi'
import { BsPeople } from 'react-icons/bs'
import {
	HiOutlineViewGrid,
	HiOutlineQuestionMarkCircle,
	HiOutlineCog
} from 'react-icons/hi'

export const DASHBOARD_SIDEBAR_LINKS = [
	{
		key: 'dashboard',
		label: 'Dashboard',
		path: '/',
		icon: <HiOutlineViewGrid />
	},
	{
		key: 'master',
		label: 'Master',
		icon: <BiBox />,
		submenu: [
		  { label: 'Department', path: '/master/department-list' },
		  { label: 'Designation', path: '/master/designation-list'},
		  { label: 'Employee Permission', path: '/master/employeepermission-list'},
		],
	},
	{
		key: 'employe',
		label: 'Employees',
		path: '/employee-list',
		icon: <BsPeople />
	},
	{
		key: 'task',
		label: 'Task',
		icon: <BiTask />,
		submenu: [
		  { label: 'Task List', path: '/task/task-list' },
	    //   { label: 'Create Task', path: '/task/create-tas/k'},
		],
	},
]

export const USER_DASHBOARD_SIDEBAR_LINKS = [
	{
		key: 'dashboard',
		label: 'Dashboard',
		path: '/user',
		icon: <HiOutlineViewGrid />
	},
	{
		key: 'task',
		label: 'Task',
		// path: '/user/task-list',
		icon: <BiTask />,
		submenu: [
			{ label: 'User Tasks', path: '/user/task-list' },
		    { label: 'Assign Tasks', path: '/user/assign-task-list'},
		  ],
	},	
]

export const DASHBOARD_SIDEBAR_BOTTOM_LINKS = [
	{
		key: 'settings',
		label: 'Settings',
		path: '/settings',
		icon: <HiOutlineCog />
	},
	{
		key: 'support',
		label: 'Help & Support',
		path: '/support',
		icon: <HiOutlineQuestionMarkCircle />
	}
]