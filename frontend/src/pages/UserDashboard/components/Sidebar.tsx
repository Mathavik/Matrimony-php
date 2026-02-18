import React from 'react';
import Logo from '../../../components/assets/logoblack.png';
import { Link } from "react-router-dom";
interface SidebarProps {
  activeSection: string;
  onSectionChange: (section: string) => void;
  menuItems: { id: string; label: string; icon: React.ReactNode }[];
}

const UserDashboardSidebar: React.FC<SidebarProps> = ({
  activeSection,
  onSectionChange,
  menuItems,
}) => {
  const baseLinkStyle =
    "flex items-center p-3 rounded-lg transition-colors text-gray-700 hover:bg-red-50 hover:text-red-600";
  const activeLinkStyle = "font-semibold bg-red-100 text-red-600";

  return (
    <div className="w-64 bg-white border-r border-gray-200 flex flex-col py-6 px-4 flex-shrink-0 shadow-lg">

      {/* LOGO SECTION */}
      <div className="mb-1 flex items-center gap-2">
        <Link to="/">                       {/* <-- Wrap the image */}
          <img
            src={Logo}
            alt="Logo"
            className="h-20 w-auto object-contain cursor-pointer"
          />
        </Link>
      </div>

      {/* MENU SECTION */}
      <nav className="space-y-1">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => onSectionChange(item.id)}
            className={`${baseLinkStyle} ${
              activeSection === item.id ? activeLinkStyle : ""
            } w-full`}
          >
            <span className="mr-3">{item.icon}</span>
            {item.label}
          </button>
        ))}
      </nav>

    </div>
  );
};

export default UserDashboardSidebar;
