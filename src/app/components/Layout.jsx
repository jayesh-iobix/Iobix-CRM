//#region Imports
import React from 'react'
import { Outlet } from 'react-router-dom'
import Sidebar from './Sidebar'
import Header from './Header'
//#endregion

//#region  Component: Layout
const Layout = () => {
  //#region  Get Background colour role vise 
  const role = sessionStorage.getItem('role');
  const getBgColor = (role) => {
    switch (role) {
      case 'admin':
        return '#F0FAFE'; // Color for admin
      case 'user':
        return '#F0FAFE'; // Color for user
      default:
        return '#EDF4F8'; // Default color
    }
  };
  //#endregion

  //#region Render
  return (

     <div 
      className={`flex flex-row h-screen w-screen overflow-hidden`}
      style={{ backgroundColor: getBgColor(role) }}
    >
        <Sidebar />
        <div className="flex flex-col flex-1">
				<Header />
				<div className="flex-1 p-5 min-h-0 overflow-auto">
					<Outlet />
				</div>
			</div>
    </div>
  );
  //#endregion
}

export default Layout
//#endregion