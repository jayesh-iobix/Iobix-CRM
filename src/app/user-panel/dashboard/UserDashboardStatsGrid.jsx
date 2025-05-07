//#region Imports
import React, { useEffect, useState } from "react";
import { IoTime } from "react-icons/io5";
import { FaClipboardCheck, FaList } from "react-icons/fa";
import { FaRightToBracket } from "react-icons/fa6";
import { DashboardService } from "../../service/DashboardService ";
//#endregion

//#region Component: UserDashboardStatsGrid
export default function UserDashboardStatsGrid() {

  //#region State Variables
  const [totalTaskCount, setTotalTaskCount] = useState("");
  const [pendingTaskCount, setPendingTaskCount] = useState("");
  const [inProgressTaskCount, setInProgressTaskCount] = useState("");
  const [completedTaskCount, setCompletedTaskCount] = useState("");
  //#endregion

  //#region Fetch Dashboard Data
  useEffect(() => {
    const fetchDashbordCount = async () => {
      try {
        const result = await DashboardService.getDashboardCount();
        // setTotalEmployeeCount(result.data.totalEmployeeCount);
        // setTotalDepartmentCount(result.data.totalDepartmentCount);
        setTotalTaskCount(result.data.totalTaskCount);
        setPendingTaskCount(result.data.pendingTaskCount);
        setInProgressTaskCount(result.data.inProgressTaskCount);
        setCompletedTaskCount(result.data.completedTaskCount);
      } catch (error) {
        console.error("Error fetching Count:", error);
      }
    };
    fetchDashbordCount();
  }, []);
  //#endregion

  //#region Render Dashboard Stats Grid
  return (
    <div className="flex flex-col md:flex-row w-full md:h-[150px] md:w-full gap-4">
      {/* Total Tasks Count */}
      <div className="bg-[#d0cefa] rounded-[20px] p-4 flex-1 border-[#908cdc] border-solid border-[3px] flex items-center animated-box">
        <div className="rounded-full h-12 w-12 flex items-center justify-center bg-[#908CDC]">
          <FaList className="text-2xl text-white" />
        </div>
        <div className="pl-4">
          <span className="text-sm text-gray-500 font-light">
            Total Tasks
          </span>
          <div className="flex items-center">
            <strong className="text-xl text-gray-700 font-semibold">{totalTaskCount}</strong>
            {/* <span className="text-sm text-green-500 pl-2">+343</span> */}
          </div>
        </div>
      </div>

      {/* Total Pending Tasks Count */}
      <div className="bg-[#ffd5d5] rounded-[20px] p-4 flex-1 border-[#fd7373f1] border-solid border-[3px] flex items-center animated-box">
        <div className="rounded-full h-12 w-12 flex items-center justify-center bg-[#e95d5d]">
          <IoTime className="text-2xl text-white" />
        </div>
        <div className="pl-4">
          <span className="text-sm text-gray-500 font-light">
            Pending Task
          </span>
          <div className="flex items-center">
            <strong className="text-xl text-gray-700 font-semibold">{pendingTaskCount}</strong>
            {/* <span className="text-sm text-red-500 pl-2">-43</span> */}
          </div>
        </div>
      </div>

      {/* Total Completed Tasks Count */}
      <div className="bg-[#CEFADF] rounded-[20px] p-4 flex-1 border-[#71c589] border-solid border-[3px] flex items-center animated-box">
        <div className="rounded-full h-12 w-12 flex items-center justify-center bg-[#71c589]">
          <FaClipboardCheck className="text-2xl text-white" />
        </div>
        <div className="pl-4">
          <span className="text-sm text-gray-500 font-light">
            Completed Task
          </span>
          <div className="flex items-center">
            <strong className="text-xl text-gray-700 font-semibold">{completedTaskCount}</strong>
            {/* <span className="text-sm text-green-500 pl-2">-343</span> */}
          </div>
        </div>
      </div>

      {/* Total In Progress Tasks Count */}
      <div className="bg-[#FFEDD5] rounded-[20px] p-4 flex-1 border-[#ceaa79] border-solid border-[3px] flex items-center animated-box">
        <div className="rounded-full h-12 w-12 flex items-center justify-center bg-[#ceaa79]">
          <FaRightToBracket className="text-2xl text-white" />
        </div>
        <div className="pl-4">
          <span className="text-sm text-gray-500 font-light">
            In Progress Task
          </span>
          <div className="flex items-center">
            <strong className="text-xl text-gray-700 font-semibold">{inProgressTaskCount}</strong>
            {/* <span className="text-sm text-red-500 pl-2">-30</span> */}
          </div>
        </div>
      </div>
    </div>
  );
}

// function BoxWrapper({ children }) {
//   return (
//     <div className="bg-[#d0cefa] rounded-[20px] p-4 flex-1 border-[#908cdc] border-solid border-[3px] flex items-center">
//       {children}
//     </div>
//   );
// }