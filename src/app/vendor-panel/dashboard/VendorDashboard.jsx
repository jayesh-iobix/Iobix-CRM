import React from 'react'
import VendorDbStatsGrid from './VendorDbStatsGrid'
// import RecentOrders from './RecentOrders'

export default function VendorDashboard() {
	return (
		<div className="flex flex-col gap-4">
			<div className="flex flex-row gap-4 w-full">
			<VendorDbStatsGrid/>
			</div>
			<div className="grid">
			{/* <RecentOrders /> */}
			</div>
		</div>
	)
}