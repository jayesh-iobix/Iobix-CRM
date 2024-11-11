import React from "react";
import { IoAdd, IoAlbums, IoBagHandle, IoBarChart, IoCart, IoDesktop, IoPeople, IoPieChart } from "react-icons/io5";

export default function DashboardStatsGrid() {
  return (
    <div className="flex h-[150px] gap-4">
      <div className="bg-[#d0cefa] rounded-[20px] p-4 flex-1 border-[#908cdc] border-solid border-[3px] flex items-center">
        <div className="rounded-full h-12 w-12 flex items-center justify-center bg-[#908CDC]">
          <IoPeople className="text-2xl text-white" />
        </div>
        <div className="pl-4">
          <span className="text-sm text-gray-500 font-light">
            Total Employee
          </span>
          <div className="flex items-center">
            <strong className="text-xl text-gray-700 font-semibold">88</strong>
            {/* <span className="text-sm text-green-500 pl-2">+343</span> */}
          </div>
        </div>
      </div>
      <div className="bg-[#CEFADF] rounded-[20px] p-4 flex-1 border-[#71c589] border-solid border-[3px] flex items-center">
        <div className="rounded-full h-12 w-12 flex items-center justify-center bg-[#71c589]">
          <IoDesktop className="text-2xl text-white" />
        </div>
        <div className="pl-4">
          <span className="text-sm text-gray-500 font-light">
            Total Department
          </span>
          <div className="flex items-center">
            <strong className="text-xl text-gray-700 font-semibold">8</strong>
            {/* <span className="text-sm text-green-500 pl-2">-343</span> */}
          </div>
        </div>
      </div>
      <div className="bg-[#FFEDD5] rounded-[20px] p-4 flex-1 border-[#ceaa79] border-solid border-[3px] flex items-center">
        <div className="rounded-full h-12 w-12 flex items-center justify-center bg-[#ceaa79]">
          <IoBagHandle className="text-2xl text-white" />
        </div>
        <div className="pl-4">
          <span className="text-sm text-gray-500 font-light">
            Total Project
          </span>
          <div className="flex items-center">
            <strong className="text-xl text-gray-700 font-semibold">58</strong>
            {/* <span className="text-sm text-red-500 pl-2">-30</span> */}
          </div>
        </div>
      </div>
      <div className="bg-[#d5edff] rounded-[20px] p-4 flex-1 border-[#5dade9] border-solid border-[3px] flex items-center">
        <div className="rounded-full h-12 w-12 flex items-center justify-center bg-[#5dade9]">
          <IoBarChart className="text-2xl text-white" />
        </div>
        <div className="pl-4">
          <span className="text-sm text-gray-500 font-light">
            Active Project
          </span>
          <div className="flex items-center">
            <strong className="text-xl text-gray-700 font-semibold">4</strong>
            {/* <span className="text-sm text-red-500 pl-2">-43</span> */}
          </div>
        </div>
      </div>
    </div>
  );
}

function BoxWrapper({ children }) {
  return (
    <div className="bg-[#d0cefa] rounded-[20px] p-4 flex-1 border-[#908cdc] border-solid border-[3px] flex items-center">
      {children}
    </div>
  );
}
