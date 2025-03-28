import React, { useEffect, useState } from "react";
import {IoDesktop, IoPeople } from "react-icons/io5";
import { FaList } from "react-icons/fa";
import { FaRightToBracket } from "react-icons/fa6";
import { Link } from "react-router-dom";
import { DashboardService } from "../../service/DashboardService ";
// import { DashboardService } from "../../service/DashboardService ";

const CompanyDbStatsGrid = () => {
  const [totalEmployeeCount, setTotalEmployeeCount] = useState("");
  const [totalDepartmentCount, setTotalDepartmentCount] = useState("");
  const [totalTaskCount, setTotalTaskCount] = useState("");
  const [pendingTaskCount, setPendingTaskCount] = useState("");
  const [inProgressTaskCount, setInProgressTaskCount] = useState("");
  const [completedTaskCount, setCompletedTaskCount] = useState("");

  // useEffect(() => {
  //   const fetchDashbordCount = async () => {
  //     try {
  //       const result = await DashboardService.getDashboardCount();
  //       setTotalEmployeeCount(result.data.totalEmployeeCount);
  //       setTotalDepartmentCount(result.data.totalDepartmentCount);
  //       setTotalTaskCount(result.data.totalTaskCount);
  //       setPendingTaskCount(result.data.pendingTaskCount);
  //       setInProgressTaskCount(result.data.inProgressTaskCount);
  //       setCompletedTaskCount(result.data.completedTaskCount);
  //     } catch (error) {
  //       console.error("Error fetching Count:", error);
  //     }
  //   };
  //   fetchDashbordCount();
  // }, []);

  return (
        <div className="flex flex-col md:flex-row w-full md:h-[150px] md:w-full gap-4">
          {/* <Link to="/employee-list" className="bg-[#d0cefa] rounded-[20px] p-4 flex-1 border-[#908cdc] border-solid border-[3px] flex items-center hover:no-underline animated-box">
            <div className="rounded-full h-12 w-12 flex items-center justify-center bg-[#908CDC]">
              <IoPeople className="text-2xl text-white" />
            </div>
            <div className="pl-4">
              <span className="text-sm text-gray-500 font-light">
                Total Employee
              </span>
              <div className="flex items-center">
                <strong className="text-xl text-gray-700 font-semibold">10</strong>
              </div>
            </div>
          </Link> */}
    
          <div className="bg-[#CEFADF] rounded-[20px] p-4 flex-1 border-[#71c589] border-solid border-[3px] flex items-center hover:no-underline animated-box">
            <div className="rounded-full h-12 w-12 flex items-center justify-center bg-[#71c589]">
              <IoDesktop className="text-2xl text-white" />
            </div>
            <div className="pl-4">
              <span className="text-sm text-gray-500 font-light">
                Total Projects
              </span>
              <div className="flex items-center">
                <strong className="text-xl text-gray-700 font-semibold">18</strong>
                {/* <strong className="text-xl text-gray-700 font-semibold">{totalDepartmentCount}</strong> */}
              </div>
            </div>
          </div>
    
          <div className="bg-[#d5edff] rounded-[20px] p-4 flex-1 border-[#5dade9] border-solid border-[3px] flex items-center hover:no-underline animated-box">
            <div className="rounded-full h-12 w-12 flex items-center justify-center bg-[#5dade9]">
              <FaList className="text-2xl text-white" />
            </div>
            <div className="pl-4">
              <span className="text-sm text-gray-500 font-light">
                 Total Created Projects
              </span>
              <div className="flex items-center">
                <strong className="text-xl text-gray-700 font-semibold">28</strong>
                {/* <strong className="text-xl text-gray-700 font-semibold">{totalTaskCount}</strong> */}
              </div>
            </div>
          </div>
    
          <div className="bg-[#FFEDD5] rounded-[20px] p-4 flex-1 border-[#ceaa79] border-solid border-[3px] flex items-center hover:no-underline animated-box">
            <div className="rounded-full h-12 w-12 flex items-center justify-center bg-[#ceaa79]">
              <FaRightToBracket className="text-2xl text-white" />
            </div>
            <div className="pl-4">
              <span className="text-sm text-gray-500 font-light">
              Total Received Projects
              </span>
              <div className="flex items-center">
                <strong className="text-xl text-gray-700 font-semibold">28</strong>
                {/* <strong className="text-xl text-gray-700 font-semibold">{inProgressTaskCount}</strong> */}
              </div>
            </div>
          </div>
        </div>
      );
}

export default CompanyDbStatsGrid;

// function BoxWrapper({ children }) {
//   return (
//     <div className="bg-[#d0cefa] rounded-[20px] p-4 flex-1 border-[#908cdc] border-solid border-[3px] flex items-center">
//       {children}
//     </div>
//   );
// }