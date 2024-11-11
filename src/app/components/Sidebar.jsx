import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { HiOutlineLogout } from "react-icons/hi";
import classNames from "classnames";
import logo from '../../assets/iobix-technolabs.png';
import { DASHBOARD_SIDEBAR_BOTTOM_LINKS, DASHBOARD_SIDEBAR_LINKS } from "../../lib/constants";
import { IoIosArrowDown, IoIosArrowForward } from "react-icons/io";

// Base styles for sidebar links
const linkClass =
  "flex items-center gap-2 font-light px-3 py-2 hover:bg-[#042E45] hover:no-underline active:bg-[#042E45] rounded-lg text-base";

export default function Sidebar() {
  return (
    <div className="bg-[#031B29] w-60 p-3 flex flex-col">
      {/* Logo Section */}
      <div className="flex items-center gap-2 px-1 py-3">
        <span className="text-neutral-200 text-lg cursor-pointer">
          <img className="w-44" src={logo} alt="Logo" />
        </span>
      </div>
      
      {/* Main Sidebar Links */}
      <div className="py-8 flex flex-1 flex-col gap-0.5">
        {DASHBOARD_SIDEBAR_LINKS.map((link) => (
          <SidebarLink key={link.key} link={link} />
        ))}
      </div>

      {/* Bottom Sidebar Links */}
      <div className="flex flex-col gap-0.5 pt-2 border-t border-neutral-700">
        {DASHBOARD_SIDEBAR_BOTTOM_LINKS.map((link) => (
          <SidebarLink key={link.key} link={link} />
        ))}
        
        {/* Logout Button */}
        <div className={classNames(linkClass, "cursor-pointer text-red-500")}>
          <span className="text-xl">
            <HiOutlineLogout />
          </span>
          Logout
        </div>
      </div>
    </div>
  );
}

function SidebarLink({ link }) {
  const { pathname } = useLocation();
  const [isOpen, setIsOpen] = useState(false); // State to manage the submenu visibility

  // Handle submenu toggle when a parent link (like 'Master') is clicked
  const toggleSubmenu = () => {
    if (link.submenu) {
      setIsOpen(!isOpen);
    }
  };

  // Check if the current path matches the link path or any submenu path
  const isActive = pathname === link.path || (link.submenu && link.submenu.some(sub => pathname === sub.path));

  return (
    <div>
      {/* Sidebar link */}
      <Link
        to={link.path}
        className={classNames(
          isActive ? "bg-[#042E45] border-l-2 border-l-[#5ec8f2] border-solid text-white" : "text-neutral-400",
          linkClass,
          link.submenu && "cursor-pointer" // Add cursor-pointer to links with submenus
        )}
        onClick={toggleSubmenu} // Toggle submenu on click
      >
        <span className="text-xl">{link.icon}</span>
        {link.label}
          {/* Arrow icon for Master link with submenu */}
          {link.submenu && (
          <span className="ml-auto text-xl transform transition-transform duration-300">
            {isOpen ? <IoIosArrowDown /> : <IoIosArrowForward />}
          </span>
        )}
      </Link>

      {/* Submenu: Display only when the link has a submenu and is open */}
      {link.submenu && isOpen && (
        <div className="pl-6 mt-2">
          {link.submenu.map((sub, index) => (
            <Link
              key={index}
              to={sub.path}
              className={classNames(
                pathname === sub.path ? "bg-[#042E45] text-white" : "text-neutral-400",
                "flex items-center gap-2 px-3 py-2 hover:bg-[#042E45]  rounded-lg text-sm hover:no-underline"
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