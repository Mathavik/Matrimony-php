import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Search, Sun, Moon, LogOut, Bell } from 'lucide-react';

interface HeaderProps {
  isDark: boolean;
  onThemeToggle: () => void;
}
const handleLogout = () => {
  // Clear user data and the request count
  localStorage.removeItem("pendingRequestCount");
  localStorage.removeItem("token");
  localStorage.removeItem("userId");
  localStorage.removeItem("userName");
  window.location.href = "/login";
};
const UserDashboardHeader: React.FC<HeaderProps> = ({ isDark, onThemeToggle }) => {

  const [pendingCount, setPendingCount] = useState(0);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const updateCount = () => {

      const count = localStorage.getItem('pendingRequestCount');

      setPendingCount(count ? parseInt(count) : 0);
    };
    updateCount();

    window.addEventListener('requestCountUpdated', updateCount);
    // ⭐⭐⭐
    return () => {
      window.removeEventListener('requestCountUpdated', updateCount);
    };
  }, []);

  return (
    <header className="bg-white border-b border-gray-200 px-6 py-4 flex-shrink-0 shadow-sm">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-8 flex-1">
          <div className="flex-1 max-w-md">
            <div className="relative">
              <input
                type="text"
                placeholder=""
                className="w-full pl-10 pr-4 py-2 bg-gray-50 text-gray-800 rounded-full border border-gray-200 focus:ring-2 focus:ring-red-400 focus:border-red-400 placeholder-gray-500"
              />
              <Search size={20} className="absolute left-3 top-2.5 text-gray-500" />
            </div>
          </div>
        </div>

        <div className="flex items-center gap-4">

          <button
            type="button"
            title={`Notifications (${pendingCount} pending)`}
            className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors relative"
            onClick={() => {
              // If already on the dashboard, dispatch an event so the dashboard updates its active section.
              if (location.pathname === '/UserDashboard') {
                window.dispatchEvent(new CustomEvent('navigateToSection', { detail: { section: 'UserRequests' } }));
              } else {
                // Otherwise navigate to the dashboard and pass desired section in navigation state.
                navigate('/UserDashboard', { state: { section: 'UserRequests' } });
              }
            }}
          >
            <Bell size={20} className="text-gray-600" />
            {pendingCount > 0 && (
              <span
                className="absolute top-0 right-0 h-5 w-5 rounded-full bg-red-500 text-white text-xs font-bold flex items-center justify-center ring-2 ring-white transform translate-x-1 -translate-y-1"
                style={{ fontSize: '10px' }}
              >
                {pendingCount > 9 ? '9+' : pendingCount}
              </span>
            )}
          </button>


          <button
            onClick={onThemeToggle}
            className="w-10 h-10 rounded-full bg-pink-500 text-white flex items-center justify-center hover:bg-pink-600 transition-colors"
          >
            {isDark ? <Moon size={20} /> : <Sun size={20} />}
          </button>

          <button
            onClick={handleLogout}
            title="Logout"
            className="w-10 h-10 rounded-full bg-red-100 text-red-600 flex items-center justify-center hover:bg-red-200 transition-colors"
          >
            <LogOut size={20} />
          </button>

        </div>
      </div>
    </header>
  );
};
export default UserDashboardHeader;