//#region Imports
import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { HiOutlineLogout } from "react-icons/hi";
import { IoIosArrowDown, IoIosArrowForward } from "react-icons/io";
import { FiMenu, FiX } from "react-icons/fi";
import classNames from "classnames";
import logo from "../../assets/iobix-technolabs.png";
import { jwtDecode } from "jwt-decode";
import { DASHBOARD_SIDEBAR_BOTTOM_LINKS, DASHBOARD_SIDEBAR_LINKS, USER_DASHBOARD_SIDEBAR_LINKS, COMPANY_DASHBOARD_SIDEBAR_LINKS, PARTNER_DASHBOARD_SIDEBAR_LINKS, IT_EMPLOYEE_DASHBOARD_SIDEBAR_LINKS, BD_EMPLOYEE_DASHBOARD_SIDEBAR_LINKS, VENDOR_DASHBOARD_SIDEBAR_LINKS, HR_DASHBOARD_SIDEBAR_LINKS } from "../sidebar-links";
import { DepartmentService } from "../service/DepartmentService";
import { AuthService } from "../service/AuthService";
import '../../../src/App.css';
//#endregion

//#region Styles and Variables
const linkClass =
  "flex items-center gap-2 font-light px-3 py-2 hover:bg-[#134141] hover:no-underline active:bg-[#134141] rounded-lg text-base";

const adminLinkClass =
  "flex items-center gap-2 font-light px-3 py-2 hover:bg-[#042E45] hover:no-underline active:bg-[#042E45] rounded-lg text-base";
//#endregion

//#region Component: Sidebar
export default function Sidebar() {
  //#region State Variables
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false); // State to manage sidebar visibility
  const role = sessionStorage.getItem("role");
  const departmentName = sessionStorage.getItem("DepartmentName")
  //#endregion
  
  //#region Sidebar Links Logic
  const sidebarLinks =
    role === "admin"
      ? DASHBOARD_SIDEBAR_LINKS
      : role === "user"
      ? (departmentName === "IT"
        ? IT_EMPLOYEE_DASHBOARD_SIDEBAR_LINKS
        : departmentName === "BD"
        ? BD_EMPLOYEE_DASHBOARD_SIDEBAR_LINKS
        : departmentName === "HR"
        ? HR_DASHBOARD_SIDEBAR_LINKS
        : USER_DASHBOARD_SIDEBAR_LINKS) // Default links for users who are neither IT nor BD
      : role === "partner"
      ? PARTNER_DASHBOARD_SIDEBAR_LINKS
      : role === "company"
      ? COMPANY_DASHBOARD_SIDEBAR_LINKS
      : role === "vendor"
      ? VENDOR_DASHBOARD_SIDEBAR_LINKS
      : USER_DASHBOARD_SIDEBAR_LINKS; // Default links for other users
  //#endregion
  
  //#region Sidebar Toggle Logic
  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };
  //#endregion

  //#region Handle Logout
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
        console.log("Token is not decoded");
      }
    }
  };
  //#endregion

  //#region Render
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
      <div>
        {/* Sidebar for admin and user roles */}
        {(role === "admin" || role === "user") && (
          <div
            className={classNames(
              "fixed inset-y-0 left-0 z-40 bg-[#031B29] w-62 p-3 flex flex-col h-screen lg:static lg:translate-x-0 overflow-x-auto sidebar-container transition-transform duration-300 ease-in-out",
              isSidebarOpen ? "translate-x-0" : "-translate-x-full"
            )}
          >
            {/* Logo Section */}
            <div className="flex items-center gap-2 px-1 py-3">
              <a
                href="/" // Replace with your actual sign-in URL
                onClick={(e) => e.preventDefault()} // prevent normal clicks
                draggable="true"
                className="text-neutral-200 text-lg cursor-pointer"
              >
                <img className="w-44" src={logo} alt="Logo" draggable="true" />
              </a>
            </div>

            {/* Sidebar Links */}
            <div className="py-8 flex flex-1 flex-col gap-0.5">
              {sidebarLinks.map((link) => (
                <SidebarLink key={link.key} link={link} />
              ))}
            </div>

            {/* Bottom Sidebar Links */}
            <div className="flex flex-col gap-0.5 pt-2 pb-4 border-t border-neutral-700">
              {/* {getDashboardSidebarBottomLinks(role).map((link) => (
                <SidebarLink key={link.key} link={link} />
              ))} */}
              {DASHBOARD_SIDEBAR_BOTTOM_LINKS.map((link) => (
                <SidebarLink key={link.key} link={link} />
              ))}
              {/* Logout Link */}
              <div
                className={classNames(
                  adminLinkClass,
                  "cursor-pointer text-red-500"
                )}
                onClick={handleLogout}
              >
                <span className="text-xl">
                  <HiOutlineLogout />
                </span>
                Logout
              </div>
            </div>
          </div>
        )}

        {/* Sidebar for other roles (non-admin/user) */}
        {role !== "admin" && role !== "user" && (
          <div
            className={classNames(
              "fixed inset-y-0 left-0 z-40 bg-[#0b3030] w-62 p-3 flex flex-col h-screen lg:static lg:translate-x-0 overflow-x-auto sidebar-container1 transition-transform duration-300 ease-in-out", // Add transition
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
            <div className="flex flex-col gap-0.5 pt-2 pb-4 border-t border-neutral-800">
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
        )}

        {/* Overlay for smaller screens */}
        {isSidebarOpen && (
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-30 md:hidden"
            onClick={toggleSidebar}
          ></div>
        )}
      </div>
    </div>
  );
  //#endregion
}
//#endregion

//#region Component: SidebarLink
function SidebarLink({ link }) {
  //#region State Variables
  const role = sessionStorage.getItem("role");
  const { pathname } = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  //#endregion

  //#region Sidebar Submenu Toggle Logic
  const toggleSubmenu = () => {
    if (link.submenu) {
      setIsOpen(!isOpen);
    }
  };
  //#endregion

  //#region isActive menu
  const isActive =
    pathname === link.path ||
    (link.submenu && link.submenu.some((sub) => pathname === sub.path));
  //#endregion

  //#region Render
  return (
    <div>
      <Link
        to={link.path}
        className={classNames(
          isActive
            ? role === "admin" || role === "user"
              ? "bg-[#042E45] border-l-2 border-l-[#5ec8f2] border-solid text-white" // Default color for admin and user
              : "bg-[#134141] text-[#dbfefe] border-x-2 border-x-[#5ef2dc] border-solid" // Color for other roles like partner, company, vendor
            : role === "admin" || role === "user"
            ? "text-neutral-400" // Default inactive color for admin and user
            : "text-[#8ba5a6]", // Color for other roles when inactive
          role === "admin" || role === "user" ? adminLinkClass : linkClass,
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
                  ? role === "admin" || role === "user"
                    ? "bg-[#042E45] text-white" // Active link color for admin and user
                    : "bg-[#134141] text-[#dbfefe] border-l-2 border-l-[#5ef2dc] border-solid" // Active link color for other roles
                  : role === "admin" || role === "user"
                  ? "text-neutral-400" // Inactive link color for admin and user
                  : "text-[#8ba5a6]", // Inactive link color for other roles
                role === "admin" || role === "user"
                  ? "flex items-center gap-2 px-3 py-2 hover:bg-[#042E45] rounded-lg text-sm hover:no-underline"
                  : "flex items-center gap-2 px-3 py-2 hover:bg-[#134141] rounded-lg text-sm hover:no-underline"
              )}
            >
              {sub.label}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
  //#endregion
}
//#endregion








// //#region Imports
// import React, { useEffect, useState } from "react";
// import { Link, useLocation, useNavigate } from "react-router-dom";
// import { HiOutlineLogout } from "react-icons/hi";
// import { IoIosArrowDown, IoIosArrowForward } from "react-icons/io";
// import { FiMenu, FiX } from "react-icons/fi";
// import classNames from "classnames";
// import logo from "../../assets/iobix-technolabs.png";
// import { jwtDecode } from "jwt-decode";
// import { DASHBOARD_SIDEBAR_BOTTOM_LINKS, DASHBOARD_SIDEBAR_LINKS, USER_DASHBOARD_SIDEBAR_LINKS, COMPANY_DASHBOARD_SIDEBAR_LINKS, PARTNER_DASHBOARD_SIDEBAR_LINKS, IT_EMPLOYEE_DASHBOARD_SIDEBAR_LINKS, BD_EMPLOYEE_DASHBOARD_SIDEBAR_LINKS, VENDOR_DASHBOARD_SIDEBAR_LINKS, HR_DASHBOARD_SIDEBAR_LINKS } from "../sidebar-links";
// import { DepartmentService } from "../service/DepartmentService";
// import { AuthService } from "../service/AuthService";
// import '../../../src/App.css';
// //#endregion

// //#region Styles and Variables
// const linkClass =
//   "flex items-center gap-2 font-light px-3 py-2 hover:bg-[#558989] hover:no-underline active:bg-[#558989] rounded-lg text-base";

// const adminLinkClass =
//   "flex items-center gap-2 font-light px-3 py-2 hover:bg-[#042E45] hover:no-underline active:bg-[#042E45] rounded-lg text-base";
// //#endregion

// //#region Component: Sidebar
// export default function Sidebar() {
//   //#region State Variables
//   const navigate = useNavigate();
//   const [isSidebarOpen, setIsSidebarOpen] = useState(false); // State to manage sidebar visibility
//   const role = sessionStorage.getItem("role");
//   const departmentName = sessionStorage.getItem("DepartmentName")
//   //#endregion
  
//   //#region Sidebar Links Logic
//   const sidebarLinks =
//     role === "admin"
//       ? DASHBOARD_SIDEBAR_LINKS
//       : role === "user"
//       ? (departmentName === "IT"
//         ? IT_EMPLOYEE_DASHBOARD_SIDEBAR_LINKS
//         : departmentName === "BD"
//         ? BD_EMPLOYEE_DASHBOARD_SIDEBAR_LINKS
//         : departmentName === "HR"
//         ? HR_DASHBOARD_SIDEBAR_LINKS
//         : USER_DASHBOARD_SIDEBAR_LINKS) // Default links for users who are neither IT nor BD
//       : role === "partner"
//       ? PARTNER_DASHBOARD_SIDEBAR_LINKS
//       : role === "company"
//       ? COMPANY_DASHBOARD_SIDEBAR_LINKS
//       : role === "vendor"
//       ? VENDOR_DASHBOARD_SIDEBAR_LINKS
//       : USER_DASHBOARD_SIDEBAR_LINKS; // Default links for other users
//   //#endregion
  
//   //#region Sidebar Toggle Logic
//   const toggleSidebar = () => {
//     setIsSidebarOpen(!isSidebarOpen);
//   };
//   //#endregion

//   //#region Handle Logout
//   const handleLogout = () => {
//     // debugger;
//     const token = sessionStorage.getItem("token");
//     if (token) {
//       try {
//         const decodedToken = jwtDecode(token);
//         sessionStorage.clear();
//         // if (
//         //   decodedToken?.IsSuperAdmin === "1" ||
//         //   decodedToken?.IsAdmin === "1"
//         // ) {
//         navigate("/sign-in");
//         // }
//         // else(
//         //   navigate("sign-in")
//         // )
//       } catch {
//         console.log("Token is not decoded");
//       }
//     }
//   };
//   //#endregion

//   //#region Render
//   return (
//     <div>
//       {/* Hamburger Menu Button */}
//       <div className="fixed top-5 left-5 z-50 lg:hidden">
//         <button
//           onClick={toggleSidebar}
//           className="p-2 rounded-md bg-[#042E45] text-white focus:outline-none"
//         >
//           {isSidebarOpen ? <FiX size={24} /> : <FiMenu size={24} />}
//         </button>
//       </div>

//       {/* Sidebar */}
//       <div>
//         {/* Sidebar for admin and user roles */}
//         {(role === "admin" || role === "user") && (
//           <div
//             className={classNames(
//               "fixed inset-y-0 left-0 z-40 bg-[#031B29] w-62 p-3 flex flex-col h-screen lg:static lg:translate-x-0 overflow-x-auto sidebar-container transition-transform duration-300 ease-in-out",
//               isSidebarOpen ? "translate-x-0" : "-translate-x-full"
//             )}
//           >
//             {/* Logo Section */}
//             <div className="flex items-center gap-2 px-1 py-3">
//               <a
//                 href="/" // Replace with your actual sign-in URL
//                 onClick={(e) => e.preventDefault()} // prevent normal clicks
//                 draggable="true"
//                 className="text-neutral-200 text-lg cursor-pointer"
//               >
//                 <img className="w-44" src={logo} alt="Logo" draggable="true" />
//               </a>
//             </div>

//             {/* Sidebar Links */}
//             <div className="py-8 flex flex-1 flex-col gap-0.5">
//               {sidebarLinks.map((link) => (
//                 <SidebarLink key={link.key} link={link} />
//               ))}
//             </div>

//             {/* Bottom Sidebar Links */}
//             <div className="flex flex-col gap-0.5 pt-2 pb-4 border-t border-neutral-700">
//               {/* {getDashboardSidebarBottomLinks(role).map((link) => (
//                 <SidebarLink key={link.key} link={link} />
//               ))} */}
//               {DASHBOARD_SIDEBAR_BOTTOM_LINKS.map((link) => (
//                 <SidebarLink key={link.key} link={link} />
//               ))}
//               {/* Logout Link */}
//               <div
//                 className={classNames(
//                   adminLinkClass,
//                   "cursor-pointer text-red-500"
//                 )}
//                 onClick={handleLogout}
//               >
//                 <span className="text-xl">
//                   <HiOutlineLogout />
//                 </span>
//                 Logout
//               </div>
//             </div>
//           </div>
//         )}

//         {/* Sidebar for other roles (non-admin/user) */}
//         {role !== "admin" && role !== "user" && (
//           <div
//             className={classNames(
//               "fixed inset-y-0 left-0 z-40 bg-[#0b3030] w-62 p-3 flex flex-col h-screen lg:static lg:translate-x-0 overflow-x-auto sidebar-container transition-transform duration-300 ease-in-out", // Add transition
//               isSidebarOpen ? "translate-x-0" : "-translate-x-full"
//             )}
//           >
//             {/* Logo Section */}
//             <div className="flex items-center gap-2 px-1 py-3">
//               <span className="text-neutral-200 text-lg cursor-pointer">
//                 <img className="w-44" src={logo} alt="Logo" />
//               </span>
//             </div>

//             {/* Sidebar Links */}
//             <div className="py-8 flex flex-1 flex-col gap-0.5">
//               {sidebarLinks.map((link) => (
//                 <SidebarLink key={link.key} link={link} />
//               ))}
//             </div>

//             {/* Bottom Sidebar Links */}
//             <div className="flex flex-col gap-0.5 pt-2 pb-4 border-t border-neutral-800">
//               <div
//                 className={classNames(linkClass, "cursor-pointer text-red-500")}
//                 onClick={handleLogout}
//               >
//                 <span className="text-xl">
//                   <HiOutlineLogout />
//                 </span>
//                 Logout
//               </div>
//             </div>
//           </div>
//         )}

//         {/* Overlay for smaller screens */}
//         {isSidebarOpen && (
//           <div
//             className="fixed inset-0 bg-black bg-opacity-50 z-30 md:hidden"
//             onClick={toggleSidebar}
//           ></div>
//         )}
//       </div>
//     </div>
//   );
//   //#endregion
// }
// //#endregion

// //#region Component: SidebarLink
// function SidebarLink({ link }) {
//   //#region State Variables
//   const role = sessionStorage.getItem("role");
//   const { pathname } = useLocation();
//   const [isOpen, setIsOpen] = useState(false);
//   //#endregion

//   //#region Sidebar Submenu Toggle Logic
//   const toggleSubmenu = () => {
//     if (link.submenu) {
//       setIsOpen(!isOpen);
//     }
//   };
//   //#endregion

//   //#region isActive menu
//   const isActive =
//     pathname === link.path ||
//     (link.submenu && link.submenu.some((sub) => pathname === sub.path));
//   //#endregion

//   //#region Render
//   return (
//     <div>
//       <Link
//         to={link.path}
//         className={classNames(
//           isActive
//             ? role === "admin" || role === "user"
//               ? "bg-[#042E45] border-l-2 border-l-[#5ec8f2] border-solid text-white" // Default color for admin and user
//               : "bg-[#558989] text-[#0a2323] font-semibold" // Color for other roles like partner, company, vendor
//             : role === "admin" || role === "user"
//             ? "text-neutral-400" // Default inactive color for admin and user
//             : "text-neutral-100", // Color for other roles when inactive
//           role === "admin" || role === "user" ? adminLinkClass : linkClass,
//           link.submenu && "cursor-pointer"
//         )}
//         onClick={toggleSubmenu}
//       >
//         <span className="text-xl">{link.icon}</span>
//         {link.label}
//         {link.submenu && (
//           <span className="ml-auto text-xl transform transition-transform duration-300">
//             {isOpen ? <IoIosArrowDown /> : <IoIosArrowForward />}
//           </span>
//         )}
//       </Link>

//       {link.submenu && isOpen && (
//         <div className="pl-6 mt-2">
//           {link.submenu.map((sub, index) => (
//             <Link
//               key={index}
//               to={sub.path}
//               className={classNames(
//                 pathname === sub.path
//                   ? role === "admin" || role === "user"
//                     ? "bg-[#042E45] text-white" // Active link color for admin and user
//                     : "bg-[#558989] text-[#0a2323] font-semibold" // Active link color for other roles
//                   : role === "admin" || role === "user"
//                   ? "text-neutral-400" // Inactive link color for admin and user
//                   : "text-white", // Inactive link color for other roles
//                 role === "admin" || role === "user"
//                   ? "flex items-center gap-2 px-3 py-2 hover:bg-[#042E45] rounded-lg text-sm hover:no-underline"
//                   : "flex items-center gap-2 px-3 py-2 hover:bg-[#558989] rounded-lg text-sm hover:no-underline"
//               )}
//             >
//               {sub.label}
//             </Link>
//           ))}
//         </div>
//       )}
//     </div>
//   );
//   //#endregion
// }
// //#endregion