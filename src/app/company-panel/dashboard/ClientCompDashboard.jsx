import React from 'react'
import CompanyDbStatsGrid from './CompanyDbStatsGrid'
// import RecentOrders from './RecentOrders'

export default function ClientCompDashboard() {
	return (
		<div className="flex flex-col gap-4">
			<div className="flex flex-row gap-4 w-full">
			<CompanyDbStatsGrid/>
			</div>
			<div className="grid">
			{/* <RecentOrders /> */}
			</div>
		</div>
	)
}