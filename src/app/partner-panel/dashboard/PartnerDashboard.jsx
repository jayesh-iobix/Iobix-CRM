import React from 'react'
import PartnerDbStatsGrid from './PartnerDbStatsGrid'
// import RecentOrders from './RecentOrders'

export default function PartnerDashboard() {
	return (
		<div className="flex flex-col gap-4">
			<div className="flex flex-row gap-4 w-full">
			<PartnerDbStatsGrid/>
			</div>
			<div className="grid">
			{/* <RecentOrders /> */}
			</div>
		</div>
	)
}