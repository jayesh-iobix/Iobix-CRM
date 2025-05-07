import React from 'react'
import DashboardStatsGrid from './DashboardStatsGrid'
import RecentOrders from './RecentOrders'

export default function Dashboard() {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-row gap-4 w-full">
        <DashboardStatsGrid />
      </div>
      <div className="grid">
        <RecentOrders />
      </div>
    </div>
  );
}