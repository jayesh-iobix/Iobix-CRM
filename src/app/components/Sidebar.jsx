import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { HiOutlineLogout } from "react-icons/hi";
import { IoIosArrowDown, IoIosArrowForward } from "react-icons/io";
import { FiMenu, FiX } from "react-icons/fi";
import classNames from "classnames";
import logo from "../../assets/iobix-technolabs.png";
import { jwtDecode } from "jwt-decode";
import { DASHBOARD_SIDEBAR_BOTTOM_LINKS, DASHBOARD_SIDEBAR_LINKS, USER_DASHBOARD_SIDEBAR_LINKS, COMPANY_DASHBOARD_SIDEBAR_LINKS, PARTNER_DASHBOARD_SIDEBAR_LINKS, IT_EMPLOYEE_DASHBOARD_SIDEBAR_LINKS, BD_EMPLOYEE_DASHBOARD_SIDEBAR_LINKS, VENDOR_DASHBOARD_SIDEBAR_LINKS } from "../sidebar-links";
import { DepartmentService } from "../service/DepartmentService";
import { AuthService } from "../service/AuthService";
// import {
//   DASHBOARD_SIDEBAR_BOTTOM_LINKS,
//   DASHBOARD_SIDEBAR_LINKS,
//   USER_DASHBOARD_SIDEBAR_LINKS,
// } from "../../lib/constants";

const linkClass =
  "flex items-center gap-2 font-light px-3 py-2 hover:bg-[#042E45] hover:no-underline active:bg-[#042E45] rounded-lg text-base";

export default function Sidebar() {
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false); // State to manage sidebar visibility
  const [departmentName, setDepartmentName] = useState(""); // State to manage sidebar visibility
  const role = sessionStorage.getItem("role");

  // debugger;
  const sidebarLinks =
    // role === "admin" || role ==="ITadmin" || role ==="BDadmin"
    role === "admin"
      ? DASHBOARD_SIDEBAR_LINKS
      : role === "user"
      ? (departmentName === "IT"
        ? IT_EMPLOYEE_DASHBOARD_SIDEBAR_LINKS
        : departmentName === "BD"
        ? BD_EMPLOYEE_DASHBOARD_SIDEBAR_LINKS
        : USER_DASHBOARD_SIDEBAR_LINKS) // Default links for users who are neither IT nor BD
      : role === "partner"
      ? PARTNER_DASHBOARD_SIDEBAR_LINKS
      : role === "company"
      ? COMPANY_DASHBOARD_SIDEBAR_LINKS
      : role === "vendor"
      ? VENDOR_DASHBOARD_SIDEBAR_LINKS
      : USER_DASHBOARD_SIDEBAR_LINKS; // Default links for other users
      
  // const sidebarLinks =
  //   // role === "admin" || role ==="ITadmin" || role ==="BDadmin"
  //   role === "admin"
  //     ? DASHBOARD_SIDEBAR_LINKS
  //     : role === "user"
  //     ? USER_DASHBOARD_SIDEBAR_LINKS
  //     : role === "partner"
  //     ? PARTNER_DASHBOARD_SIDEBAR_LINKS
  //     : role === "company"
  //     ? COMPANY_DASHBOARD_SIDEBAR_LINKS
  //     : USER_DASHBOARD_SIDEBAR_LINKS; // Default links for other users

  // const sidebarLinks =
  //   role === "admin" || role ==="ITadmin" || role ==="ITadmin"
  //     ? DASHBOARD_SIDEBAR_LINKS
  //     : role === "userIT"
  //     ? IT_EMPLOYEE_DASHBOARD_SIDEBAR_LINKS
  //     : role === "userBD"
  //     ? BD_EMPLOYEE_DASHBOARD_SIDEBAR_LINKS
  //     : role === "partner"
  //     ? PARTNER_DASHBOARD_SIDEBAR_LINKS
  //     : role === "company"
  //     ? COMPANY_DASHBOARD_SIDEBAR_LINKS
  //     : USER_DASHBOARD_SIDEBAR_LINKS; // Default links for other users

  // role === "admin" ? DASHBOARD_SIDEBAR_LINKS : USER_DASHBOARD_SIDEBAR_LINKS;


  useEffect(() => {
    const fetchDepartment = async () => {
      // debugger;
      const depatment = await AuthService.getBasicDetail();
      setDepartmentName(depatment.data.departmentName)
      // console.log(depatment.data)
    }
    fetchDepartment();  
    }, []);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handleLogout = () => {
    // debugger;
    const token = sessionStorage.getItem("token");
    if (token) {
      try {
        const decodedToken = jwtDecode(token);
        sessionStorage.clear();
        // if (
        //   decodedToken?.IsSuperAdmin === "1" ||
        //   decodedToken?.IsAdmin === "1"
        // ) {
        navigate("/sign-in");
        // }
        // else(
        //   navigate("sign-in")
        // )
      } catch {
        alert("Token is not decoded");
      }
    }
  };

  return (
    <div>
      {/* Hamburger Menu Button */}
      <div className="fixed top-5 left-5 z-50 lg:hidden">
        <button
          onClick={toggleSidebar}
          className="p-2 rounded-md bg-[#042E45] text-white focus:outline-none"
        >
          {isSidebarOpen ? <FiX size={24} /> : <FiMenu size={24} />}
        </button>
      </div>

      {/* Sidebar */}
      <div
        className={classNames(
          "fixed inset-y-0 left-0 z-40 bg-[#031B29] w-60 p-3 flex flex-col h-screen lg:static lg:translate-x-0",
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        {/* Logo Section */}
        <div className="flex items-center gap-2 px-1 py-3">
          <span className="text-neutral-200 text-lg cursor-pointer">
            <img className="w-44" src={logo} alt="Logo" />
          </span>
        </div>

        {/* Sidebar Links */}
        <div className="py-8 flex flex-1 flex-col gap-0.5">
          {sidebarLinks.map((link) => (
            <SidebarLink key={link.key} link={link} />
          ))}
        </div>

        {/* Bottom Sidebar Links */}
        <div className="flex flex-col gap-0.5 pt-2 pb-4 border-t border-neutral-700">
          {DASHBOARD_SIDEBAR_BOTTOM_LINKS.map((link) => (
            <SidebarLink key={link.key} link={link} />
          ))}
          <div
            className={classNames(linkClass, "cursor-pointer text-red-500")}
            onClick={handleLogout}
          >
            <span className="text-xl">
              <HiOutlineLogout />
            </span>
            Logout
          </div>
        </div>
      </div>

      {/* Overlay for smaller screens */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-30 md:hidden"
          onClick={toggleSidebar}
        ></div>
      )}
    </div>
  );
}

function SidebarLink({ link }) {
  const { pathname } = useLocation();
  const [isOpen, setIsOpen] = useState(false);

  const toggleSubmenu = () => {
    if (link.submenu) {
      setIsOpen(!isOpen);
    }
  };

  const isActive =
    pathname === link.path ||
    (link.submenu && link.submenu.some((sub) => pathname === sub.path));

  return (
    <div>
      <Link
        to={link.path}
        className={classNames(
          isActive
            ? "bg-[#042E45] border-l-2 border-l-[#5ec8f2] border-solid text-white"
            : "text-neutral-400",
          linkClass,
          link.submenu && "cursor-pointer"
        )}
        onClick={toggleSubmenu}
      >
        <span className="text-xl">{link.icon}</span>
        {link.label}
        {link.submenu && (
          <span className="ml-auto text-xl transform transition-transform duration-300">
            {isOpen ? <IoIosArrowDown /> : <IoIosArrowForward />}
          </span>
        )}
      </Link>

      {link.submenu && isOpen && (
        <div className="pl-6 mt-2">
          {link.submenu.map((sub, index) => (
            <Link
              key={index}
              to={sub.path}
              className={classNames(
                pathname === sub.path
                  ? "bg-[#042E45] text-white"
                  : "text-neutral-400",
                "flex items-center gap-2 px-3 py-2 hover:bg-[#042E45] rounded-lg text-sm hover:no-underline"
              )}
            >
              {sub.label}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}




// import React from "react";
// import { Link, useLocation } from "react-router-dom";
// import { FcBullish } from "react-icons/fc";
// import { HiOutlineLogout } from "react-icons/hi";
// import classNames from "classnames";
// // import logo from '../../assets/iobix.jpg';
// import logo from '../../assets/iobix-technolabs.png';
// import { DASHBOARD_SIDEBAR_BOTTOM_LINKS, DASHBOARD_SIDEBAR_LINKS } from "../../lib/constants";

// const linkClass =
//   "flex items-center gap-2 font-light px-3 py-2 hover:bg-[#042E45] hover:no-underline active:bg-[#042E45]  rounded-sm text-base";

// export default function Sidebar() {
//   return (
//     <div className="bg-[#021E2E] w-60 p-3 flex flex-col">
//       <div className="flex items-center gap-2 px-1 py-3">
//         {/* <FcBullish fontSize={24} /> */}
//         <span className="text-neutral-200 text-lg cursor-pointer">
//         <img className="w-44" src={logo} alt="Logo" />
//         </span>
//       </div>
//       <div className="py-8 flex flex-1 flex-col gap-0.5">
//         {DASHBOARD_SIDEBAR_LINKS.map((link) => (
//           <SidebarLink key={link.key} link={link} />
//         ))}
//       </div>
//       <div className="flex flex-col gap-0.5 pt-2 border-t border-[#042E45]">
//         {DASHBOARD_SIDEBAR_BOTTOM_LINKS.map((link) => (
//           <SidebarLink key={link.key} link={link} />
//         ))}
//         <div className={classNames(linkClass, "cursor-pointer text-red-500")}>
//           <span className="text-xl">
//             <HiOutlineLogout />
//           </span>
//           Logout
//         </div>
//       </div>
//     </div>
//   );
// }

// function SidebarLink({ link }) {
//   const { pathname } = useLocation();

//   return (
//     <Link
//       to={link.path}
//       className={classNames(
//         pathname === link.path
//           ? "bg-[#042E45] text-white active:border-x-white active:border-solid active:border-l-4"
//           : "text-neutral-400",
//         linkClass
//       )}
//     >
//       <span className="text-xl">{link.icon}</span>
//       {link.label}
//     </Link>
//   );
// }
