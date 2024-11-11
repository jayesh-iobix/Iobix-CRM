import { BiBox } from 'react-icons/bi'
import { BsPeople } from 'react-icons/bs'
import { GiMasterOfArms } from 'react-icons/gi'
import { GrMastercard } from 'react-icons/gr'
import {
	HiOutlineViewGrid,
	HiOutlineShoppingCart,
	HiOutlineUsers,
	HiOutlineDocumentText,
	HiOutlineAnnotation,
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
		key: 'employe',
		label: 'Employees',
		path: '/employee-list',
		icon: <BsPeople />
	},
	{
		key: 'master',
		label: 'Master',
		icon: <BiBox />,
		submenu: [
		  { label: 'Department', path: '/master/department-list' },
		  { label: 'Designation', path: '/master/designation-list'},
		  { label: 'Country', path: '/master/country' },
		  { label: 'State', path: '/master/state' },
		],
	  },
	// {
	// 	key: 'orders',
	// 	label: 'Orders',
	// 	path: '/orders',
	// 	icon: <HiOutlineShoppingCart />
	// },
	// {
	// 	key: 'customers',
	// 	label: 'Customers',
	// 	path: '/customers',
	// 	icon: <HiOutlineUsers />
	// },
	// {
	// 	key: 'transactions',
	// 	label: 'Transactions',
	// 	path: '/transactions',
	// 	icon: <HiOutlineDocumentText />
	// },
	// {
	// 	key: 'messages',
	// 	label: 'Messages',
	// 	path: '/messages',
	// 	icon: <HiOutlineAnnotation />
	// }
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