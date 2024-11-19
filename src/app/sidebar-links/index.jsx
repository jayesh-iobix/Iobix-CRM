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
		],
	},
	{
		key: 'Task',
		label: 'Task',
		icon: <BiBox />,
		submenu: [
		  { label: 'TaskList', path: '/task/task-list' },
		//   { label: 'Create Task', path: '/task/create-task'},
		],
	},
	{
		key: 'employe',
		label: 'Employees',
		path: '/employee-list',
		icon: <BsPeople />
	},
]

export const USER_DASHBOARD_SIDEBAR_LINKS = [
	{
		key: 'dashboard',
		label: 'Dashboard',
		path: '/',
		icon: <HiOutlineViewGrid />
	},
	{
		key: 'task',
		label: 'Task',
		path: '/task',
		icon: <BiTask />
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