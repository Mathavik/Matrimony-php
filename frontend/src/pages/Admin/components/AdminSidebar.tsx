import React from 'react';
import { BarChart3, Users, Heart, Settings } from 'lucide-react';
import { useTheme } from '../../../context/ThemeContext';
import { CreditCard, FileText, Bell } from 'lucide-react';

interface AdminSidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const AdminSidebar: React.FC<AdminSidebarProps> = ({ activeTab, setActiveTab }) => {
  const { bgColor, isLightTheme } = useTheme();

  const navItems = [
    { id: 'dashboard', icon: BarChart3, label: 'Dashboard' },
    { id: 'users', icon: Users, label: 'Users' },
    // { id: 'matches', icon: Heart, label: 'Matches' },
    { id: 'settings', icon: Settings, label: 'Settings' },
    { id: 'interestRequestsPage', icon: Bell, label: 'Interest Requests' },
    { id: 'helpRequestsPage', icon: FileText, label: 'Help Requests' },
    { id: 'adminStoryList', icon: CreditCard, label: 'Success Stories' },
  ];

  return (
    <aside
      className={`w-64 ${bgColor} ${isLightTheme ? "text-black" : "text-white"} min-h-screen shadow-lg`}
    >
      <nav className="p-4">
        {navItems.map(({ id, icon: Icon, label }) => (
          <button
            key={id}
            onClick={() => setActiveTab(id)}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg mb-2 transition-colors ${
              activeTab === id 
                ? isLightTheme 
                  ? 'bg-black bg-opacity-10' 
                  : 'bg-white bg-opacity-20'
                : isLightTheme
                  ? 'hover:bg-black hover:bg-opacity-5'
                  : 'hover:bg-white hover:bg-opacity-10'
            }`}
          >
            <Icon className="w-5 h-5" />
            <span className="font-medium">{label}</span>
          </button>
        ))}
      </nav>
    </aside>
  );
};

export default AdminSidebar;
