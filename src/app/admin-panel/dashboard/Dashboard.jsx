import React from 'react'
import DashboardStatsGrid from './DashboardStatsGrid'
import RecentOrders from './RecentOrders'
import Announcement from '../../user-panel/dashboard/Announcement';

export default function Dashboard() {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-row gap-4 w-full">
        <DashboardStatsGrid />
      </div>
      <div className="grid gap-6">
        {/* <Announcement /> */}
        <RecentOrders />
      </div>
    </div>
  );
}