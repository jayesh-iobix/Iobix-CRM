import React from 'react'
import { Outlet } from 'react-router-dom'
import Sidebar from './Sidebar'
import Header from './Header'

const Layout = () => {
  // debugger;
  
  return (
    <div className='flex flex-row bg-[#F0FAFE] h-screen w-screen overflow-hidden'>
        <Sidebar />
        <div className="flex flex-col flex-1">
				<Header />
				<div className="flex-1 p-5 min-h-0 overflow-auto">
					<Outlet />
				</div>
			</div>
    </div>
  )
}

export default Layout