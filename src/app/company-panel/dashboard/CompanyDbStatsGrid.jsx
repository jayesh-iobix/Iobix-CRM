//#region Imports
import React, { useEffect, useState } from "react";
import {IoDesktop, IoPeople } from "react-icons/io5";
import { FaList } from "react-icons/fa";
import { FaRightToBracket } from "react-icons/fa6";
import { Link } from "react-router-dom";
import { DashboardService } from "../../service/DashboardService ";
//#endregion

//#region Component: CompanyDbStatsGrid
const CompanyDbStatsGrid = () => {
  //#region State Variables
  const [totalReceiveProjectCount, setTotalReceiveProjectCount] = useState("");
  const [totalCreateProjectCount, setTotalCreateProjectCount] = useState("");
  const [totalProjectCount, setTotalProjectCount] = useState("");
  const [totalTaskCount, setTotalTaskCount] = useState("");
  //#endregion

  //#region Fetch Dashboard Data
  useEffect(() => {
    const fetchDashbordCount = async () => {
      try {
        const result = await DashboardService.getDashboardCount();
        // console.log(result.data);
        const dashboardCount = result.data;

        setTotalReceiveProjectCount(dashboardCount.receiveProjectCount);
        setTotalCreateProjectCount(dashboardCount.sentProjectCount);
        setTotalProjectCount(dashboardCount.totalProjectCount);
        setTotalTaskCount(dashboardCount.totalTaskCount);

        // setTotalTaskCount(dashboardCount.totalTaskCount);
        // setPendingTaskCount(dashboardCount.pendingTaskCount);
        // setInProgressTaskCount(dashboardCount.inProgressTaskCount);
        // setCompletedTaskCount(dashboardCount.completedTaskCount);
      } catch (error) {
        console.error("Error fetching Count:", error);
      }
    };
    fetchDashbordCount();
  }, []);
  //#endregion

  //#region Render
  return (
    <div className="flex flex-col md:flex-row w-full md:h-[150px] md:w-full gap-4">
      {/* Total Projects Count */}
      <div className="bg-[#CEFADF] rounded-[20px] p-4 flex-1 border-[#71c589] border-solid border-[3px] flex items-center hover:no-underline animated-box">
        <div className="rounded-full h-12 w-12 flex items-center justify-center bg-[#71c589]">
          <IoDesktop className="text-2xl text-white" />
        </div>
        <div className="pl-4">
          <span className="text-sm text-gray-500 font-light">
            Total Projects
          </span>
          <div className="flex items-center">
            <strong className="text-xl text-gray-700 font-semibold">
              {totalProjectCount}
            </strong>
            {/* <strong className="text-xl text-gray-700 font-semibold">18</strong> */}
          </div>
        </div>
      </div>

      {/* Total Created Count */}
      <Link
        to="/company/project-list"
        className="bg-[#d5edff] rounded-[20px] p-4 flex-1 border-[#5dade9] border-solid border-[3px] flex items-center hover:no-underline animated-box"
      >
        <div className="rounded-full h-12 w-12 flex items-center justify-center bg-[#5dade9]">
          <FaList className="text-2xl text-white" />
        </div>
        <div className="pl-4">
          <span className="text-sm text-gray-500 font-light">
            Total Created Projects
          </span>
          <div className="flex items-center">
            <strong className="text-xl text-gray-700 font-semibold">
              {totalCreateProjectCount}
            </strong>
            {/* <strong className="text-xl text-gray-700 font-semibold">28</strong> */}
          </div>
        </div>
      </Link>

      {/* Total Received Count */}
      <Link
        to="/company/get-project-list"
        className="bg-[#FFEDD5] rounded-[20px] p-4 flex-1 border-[#ceaa79] border-solid border-[3px] flex items-center hover:no-underline animated-box"
      >
        <div className="rounded-full h-12 w-12 flex items-center justify-center bg-[#ceaa79]">
          <FaRightToBracket className="text-2xl text-white" />
        </div>
        <div className="pl-4">
          <span className="text-sm text-gray-500 font-light">
            Total Received Projects
          </span>
          <div className="flex items-center">
            <strong className="text-xl text-gray-700 font-semibold">
              {totalReceiveProjectCount}
            </strong>
            {/* <strong className="text-xl text-gray-700 font-semibold">28</strong> */}
          </div>
        </div>
      </Link>

      {/* Total Tasks Count */}
      <div className="bg-[#d0cefa] rounded-[20px] p-4 flex-1 border-[#908cdc] border-solid border-[3px] flex items-center hover:no-underline animated-box">
        <div className="rounded-full h-12 w-12 flex items-center justify-center bg-[#908CDC]">
          <IoPeople className="text-2xl text-white" />
        </div>
        <div className="pl-4">
          <span className="text-sm text-gray-500 font-light">Total Tasks</span>
          <div className="flex items-center">
            <strong className="text-xl text-gray-700 font-semibold">
              {totalTaskCount}
            </strong>
            {/* <strong className="text-xl text-gray-700 font-semibold">10</strong> */}
          </div>
        </div>
      </div>
    </div>
  );
  //#endregion
};

export default CompanyDbStatsGrid;
//#endregion
