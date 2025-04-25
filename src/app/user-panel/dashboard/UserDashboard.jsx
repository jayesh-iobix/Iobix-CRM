import React from 'react'
import UserDashboardStatsGrid from './UserDashboardStatsGrid'
import Announcement from './Announcement'

const UserDashboard = () => {
  return (
    <div className="flex flex-col gap-4">
			<UserDashboardStatsGrid/>
			<div className="flex flex-row gap-4 w-full">
			</div>
			<div className="grid">
			<Announcement />
			</div>
		</div>
  )
}

export default UserDashboard