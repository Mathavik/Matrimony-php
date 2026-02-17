import React, { useState, useEffect } from "react";
import { Bell, Paintbrush, LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAdmin } from "../../../context/AdminContext";
import { useTheme } from "../../../context/ThemeContext";
import logoWhite from "../../../components/assets/logowhite.png";
import logoBlack from "../../../components/assets/logoblack.png";

const AdminHeader: React.FC = () => {
  const { adminName } = useAdmin();
  const { themeColor, setThemeColor, isLightTheme } = useTheme();
  const [showPalette, setShowPalette] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    localStorage.removeItem("isAdmin");
    navigate("/admin/login");
  };

  // ✅ Define colors with their properties
  const colors = [
    // Dark themes - White text
    { name: "blue", bg: "bg-blue-600", text: "text-white", light: false },
    { name: "pink", bg: "bg-pink-600", text: "text-white", light: false },
    { name: "black", bg: "bg-black", text: "text-white", light: false },
    { name: "green", bg: "bg-green-600", text: "text-white", light: false },
    { name: "orange", bg: "bg-orange-600", text: "text-white", light: false },
    { name: "red", bg: "bg-red-600", text: "text-white", light: false },
    { name: "teal", bg: "bg-teal-600", text: "text-white", light: false },
    { name: "indigo", bg: "bg-indigo-600", text: "text-white", light: false },
    { name: "cyan", bg: "bg-cyan-600", text: "text-white", light: false },
    { name: "rose", bg: "bg-rose-600", text: "text-white", light: false },
    { name: "emerald", bg: "bg-emerald-600", text: "text-white", light: false },
    { name: "violet", bg: "bg-violet-600", text: "text-white", light: false },
    { name: "sky", bg: "bg-sky-600", text: "text-white", light: false },
    { name: "fuchsia", bg: "bg-fuchsia-600", text: "text-white", light: false },
    { name: "slate", bg: "bg-slate-600", text: "text-white", light: false },
    
    // Light theme - Black text
    { name: "white", bg: "bg-white", text: "text-black", light: true },
  ];

  // ✅ Get current color config
  const currentColor = colors.find(c => c.name === themeColor) || colors[0];

  // ✅ Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest('.palette-container') && !target.closest('.profile-container')) {
        setShowPalette(false);
        setShowProfileMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className={`${currentColor.bg} ${currentColor.text} shadow-lg relative transition-colors duration-300`}>
      <div className="px-4 sm:px-6 py-4 flex items-center justify-between">
        {/* ✅ Logo Only - Bigger Size */}
        <div className="flex items-center">
          <div className="h-12 w-auto flex items-center">
            <img 
              src={isLightTheme ? logoBlack : logoWhite} 
              alt="WedAura Logo" 
              className="h-full w-auto object-contain"
              style={{ maxHeight: '48px' }}
            />
          </div>
        </div>

        {/* Right Section */}
        <div className="flex items-center gap-3 sm:gap-5">
          {/* 🎨 Theme Palette Button */}
          <div className="relative palette-container">
            <button
              onClick={() => {
                setShowPalette(!showPalette);
                setShowProfileMenu(false);
              }}
              className={`p-2 rounded-lg transition-all ${
                isLightTheme
                  ? "hover:bg-gray-900 hover:bg-opacity-10"
                  : "hover:bg-white hover:bg-opacity-20"
              }`}
              title="Change Theme Color"
            >
              <Paintbrush className="w-5 h-5" />
            </button>

            {showPalette && (
              <div
                className="absolute right-0 mt-3 bg-white text-gray-800 shadow-2xl rounded-xl p-4 
                grid grid-cols-6 gap-2 z-50 border border-gray-200"
                style={{ width: "240px" }}
              >
                <div className="col-span-6 mb-2 text-xs font-semibold text-gray-600 border-b pb-2">
                  Choose Theme Color
                </div>
                {colors.map((color) => (
                  <button
                    key={color.name}
                    className={`${color.bg} w-8 h-8 rounded-lg border-2 ${
                      themeColor === color.name 
                        ? "border-gray-800 ring-2 ring-gray-400 scale-110" 
                        : "border-gray-300 hover:border-gray-400"
                    } hover:scale-110 hover:shadow-lg transition-all duration-200 ${
                      color.name === "white" ? "shadow-md" : ""
                    }`}
                    onClick={() => {
                      setThemeColor(color.name);
                      setShowPalette(false);
                    }}
                    title={color.name.charAt(0).toUpperCase() + color.name.slice(1)}
                  />
                ))}
              </div>
            )}
          </div>

          {/* 🔔 Notification */}
          <button 
            className={`relative p-2 rounded-lg transition-all ${
              isLightTheme
                ? "hover:bg-gray-900 hover:bg-opacity-10"
                : "hover:bg-white hover:bg-opacity-20"
            }`}
            title="Notifications"
          >
            <Bell className="w-5 h-5" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full ring-2 ring-white"></span>
          </button>

          {/* 👤 Profile with Logout */}
          <div className="relative profile-container">
            <button
              onClick={() => {
                setShowProfileMenu(!showProfileMenu);
                setShowPalette(false);
              }}
              className={`flex items-center gap-2 px-2 py-1 rounded-lg transition-all ${
                isLightTheme
                  ? "hover:bg-gray-900 hover:bg-opacity-10"
                  : "hover:bg-white hover:bg-opacity-20"
              } focus:outline-none`}
            >
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold shadow-md ${
                  isLightTheme
                    ? "bg-gray-900 bg-opacity-15 text-gray-900"
                    : "bg-white bg-opacity-25 text-white"
                }`}
              >
                {adminName ? adminName.charAt(0).toUpperCase() : "A"}
              </div>
              <span className="text-sm font-medium hidden sm:inline">
                {adminName || "Admin"}
              </span>
            </button>

            {/* 🔻 Dropdown menu */}
            {showProfileMenu && (
              <div className="absolute right-0 mt-2 w-44 bg-white text-gray-800 rounded-lg shadow-2xl z-50 border border-gray-200 overflow-hidden">
                <div className="px-4 py-3 border-b border-gray-200 bg-gray-50">
                  <p className="text-xs text-gray-500">Signed in as</p>
                  <p className="text-sm font-semibold text-gray-900 truncate">
                    {adminName || "Admin"}
                  </p>
                </div>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-3 w-full px-4 py-3 text-left hover:bg-red-50 transition-colors text-red-600 font-medium"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Logout</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default AdminHeader;
