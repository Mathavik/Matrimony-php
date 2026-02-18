import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import AdminHeader from './components/AdminHeader';
import AdminSidebar from './components/AdminSidebar';
import Dashboard from './components/Dashboard';
import UserManagement from './components/UserManagement';
import MatchManagement from './components/MatchManagement';
import Settings from './components/Settings';
import InterestRequests from './components/InterestRequestsPage';
import { User, Match } from './components/types';
import { AdminProvider } from '../../context/AdminContext';
import { ThemeProvider } from '../../context/ThemeContext';
import { fetchUserStats } from './api/adminApi';
import AdminHelpRequests from './components/HelpRequest';
import AdminStoryList from './components/AdminStoryList';

const AdminPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // ✅ Get initial tab from localStorage or URL hash, default to 'dashboard'
  const getInitialTab = (): string => {
    // First, check if there's a hash in URL (e.g., #users)
    if (location.hash) {
      const hashTab = location.hash.replace('#', '');
      if (['dashboard', 'users', 'matches', 'settings', 'interestRequestsPage'].includes(hashTab)) {
        return hashTab;
      }
    }

    // Second, check localStorage
    const savedTab = localStorage.getItem('adminActiveTab');
    if (savedTab && ['dashboard', 'users', 'matches', 'settings', 'interestRequestsPage'].includes(savedTab)) {
      return savedTab;
    }

    // Default to dashboard
    return 'dashboard';
  };

  const [activeTab, setActiveTab] = useState<string>(getInitialTab());

  // ✅ Admin auth check
  useEffect(() => {
    const isAdmin = localStorage.getItem('isAdmin') === 'true';
    const adminToken = localStorage.getItem('adminToken');
    if (!isAdmin || !adminToken) {
      navigate('/admin/login');
    }
  }, [navigate]);

  // ✅ Save active tab to localStorage and update URL hash whenever it changes
  useEffect(() => {
    localStorage.setItem('adminActiveTab', activeTab);
    window.location.hash = activeTab;
  }, [activeTab]);

  // ✅ Listen to browser back/forward navigation
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace('#', '');
      if (hash && ['dashboard', 'users', 'matches', 'settings', 'interestRequestsPage'].includes(hash)) {
        setActiveTab(hash);
      }
    };

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  // ✅ State for dashboard data
  const [users, setUsers] = useState<User[]>([]);
  const [stats, setStats] = useState<{
    totalUsers: number;
    pendingApprovals: number;
    activeUsers: number;
    successMatches: number;
    premiumUsers: number;
    recentUsers: User[];
  }>({
    totalUsers: 0,
    pendingApprovals: 0,
    activeUsers: 0,
    successMatches: 0,
    premiumUsers: 0,
    recentUsers: []
  });

  const [matches] = useState<Match[]>([]);
  const [loading, setLoading] = useState(true);

  // ✅ Fetch Dashboard Data
  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        const { users, stats: dashboardStats } = await fetchUserStats();
        setUsers(users);
        setStats(dashboardStats);
      } catch (error) {
        console.error('Error loading dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };
    loadDashboardData();
  }, []);

  // ✅ Action Handlers
  const approveUser = (id: number) => {
    setUsers(users.map(u => u.id === id ? { ...u, status: 'approved' } : u));
  };

  const rejectUser = (id: number) => {
    setUsers(users.map(u => u.id === id ? { ...u, status: 'rejected' } : u));
  };

  const deleteUser = (id: number) => {
    setUsers(users.filter(u => u.id !== id));
  };

  // ✅ Render
  return (
    <AdminProvider>
      <ThemeProvider>
        <div className="flex flex-col h-screen overflow-hidden">
          {/* Fixed Header */}
          <div className="flex-shrink-0 z-50">
            <AdminHeader />
          </div>

          {/* Sidebar + Scrollable Content */}
          <div className="flex flex-1 overflow-hidden">
            {/* Fixed Sidebar */}
            <div className="flex-shrink-0">
              <AdminSidebar activeTab={activeTab} setActiveTab={setActiveTab} />
            </div>

            {/* Scrollable main content */}
            <main className="flex-1 overflow-y-auto bg-gray-50 dark:bg-gray-800 transition-colors duration-200 p-4 sm:p-6 lg:p-8">
              {loading ? (
                <div className="flex flex-col items-center justify-center h-full min-h-[60vh]">
                  <div className="relative">
                    <div className="animate-spin rounded-full h-16 w-16 border-4 border-indigo-200 border-t-indigo-600 dark:border-gray-700 dark:border-t-indigo-400"></div>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-8 h-8 bg-indigo-500 rounded-full animate-pulse"></div>
                    </div>
                  </div>
                  <p className="mt-4 text-gray-600 dark:text-gray-300 font-medium">Loading admin panel...</p>
                </div>
              ) : (
                <div className="animate-fadeIn">
                  {activeTab === 'dashboard' && <Dashboard users={users} matches={matches} stats={stats} />}
                  {activeTab === 'users' && <UserManagement users={users as any} deleteUser={deleteUser} />}
                  {activeTab === 'matches' && <MatchManagement />}
                  {activeTab === 'interestRequestsPage' && <InterestRequests />}
                  {activeTab === 'settings' && <Settings />}
                  {activeTab === 'helpRequestsPage' && <AdminHelpRequests />}
                  {activeTab === 'adminStoryList' && <AdminStoryList />}
                </div>
              )}
            </main>
          </div>
        </div>
      </ThemeProvider>
    </AdminProvider>
  );

};

export default AdminPage;
