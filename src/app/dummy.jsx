import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { HiOutlineLogout } from "react-icons/hi";
import classNames from "classnames";
import logo from '../../assets/iobix-technolabs.png';
import { DASHBOARD_SIDEBAR_BOTTOM_LINKS, DASHBOARD_SIDEBAR_LINKS, USER_DASHBOARD_SIDEBAR_LINKS } from "../../lib/constants";
import { IoIosArrowDown, IoIosArrowForward } from "react-icons/io";

const linkClass =
  "flex items-center gap-2 font-light px-3 py-2 hover:bg-[#042E45] hover:no-underline active:bg-[#042E45] rounded-lg text-base";

export default function Sidebar() {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const [decodedToken, setDecodedToken] = useState(null); // State for storing the decoded token
  const [isOpen, setIsOpen] = useState(false); // State to manage submenu visibility

  useEffect(() => {
    // Retrieve the decoded token (or user data) here (this is just a placeholder)
    const token = localStorage.getItem("token"); // Assuming the token is saved in localStorage
    if (token) {
      const decoded = JSON.parse(atob(token.split('.')[1])); // Decode the JWT token
      setDecodedToken(decoded);
      
      // Redirect to the appropriate dashboard based on user role
      if (decoded?.IsSuperAdmin === "1" || decoded?.IsAdmin === "1") {
        navigate("/"); // Redirect to the admin dashboard
      } else if (decoded?.IsSuperAdmin === "0" || decoded?.IsAdmin === "0") {
        navigate("/user-dashboard"); // Redirect to the user dashboard
      }
    }
  }, [navigate]);

  // Determine which sidebar links to show based on the user role
  const sidebarLinks = decodedToken?.IsSuperAdmin === "1" || decodedToken?.IsAdmin === "1"
    ? DASHBOARD_SIDEBAR_LINKS
    : USER_DASHBOARD_SIDEBAR_LINKS;

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
        {sidebarLinks.map((link) => (
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

  const toggleSubmenu = () => {
    if (link.submenu) {
      setIsOpen(!isOpen);
    }
  };

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
