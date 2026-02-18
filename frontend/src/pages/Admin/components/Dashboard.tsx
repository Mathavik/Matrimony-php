import React from 'react';
import { Users, Bell, UserCheck, Heart } from 'lucide-react';
import { User, Match } from './types';

interface Stats {
  totalUsers: number;
  pendingApprovals: number;
  activeUsers: number;
  premiumUsers: number;
  successMatches: number;
  recentUsers: User[];
}

interface DashboardProps {
  users: User[];
  matches: Match[];
  stats: Stats;
}

const Dashboard: React.FC<DashboardProps> = ({ users, matches, stats }) => {
  // Display recent users from stats
  const recentUsers = stats.recentUsers;
  const genderStats = {
    male: users.filter(u => u.gender === 'Male').length,
    female: users.filter(u => u.gender === 'Female').length
  };
  
  return (
    <div>
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Dashboard Overview</h2>
      
      {/* Main Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg p-6 text-white shadow-lg hover:shadow-xl transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100 text-sm mb-1">Total Users</p>
              <p className="text-3xl font-bold">{stats.totalUsers}</p>
              <p className="text-blue-100 text-xs mt-2">
                {genderStats.male} Male • {genderStats.female} Female
              </p>
            </div>
            <Users className="w-12 h-12 text-blue-200" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg p-6 text-white shadow-lg hover:shadow-xl transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-orange-100 text-sm mb-1">Pending Approvals</p>
              <p className="text-3xl font-bold">{stats.pendingApprovals}</p>
              <p className="text-orange-100 text-xs mt-2">
                Needs Review
              </p>
            </div>
            <Bell className="w-12 h-12 text-orange-200" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-lg p-6 text-white shadow-lg hover:shadow-xl transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-100 text-sm mb-1">Premium Users</p>
              <p className="text-3xl font-bold">{stats.premiumUsers}</p>
              <p className="text-green-100 text-xs mt-2">
                {Math.round((stats.premiumUsers / stats.totalUsers) * 100)}% of Total
              </p>
            </div>
            <UserCheck className="w-12 h-12 text-green-200" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-pink-500 to-pink-600 rounded-lg p-6 text-white shadow-lg hover:shadow-xl transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-pink-100 text-sm mb-1">Success Matches</p>
              <p className="text-3xl font-bold">{stats.successMatches}</p>
              <p className="text-pink-100 text-xs mt-2">
                Active Connections
              </p>
            </div>
            <Heart className="w-12 h-12 text-pink-200" />
          </div>
        </div>
      </div>

      {/* Recent Users & Activity Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-800">Recent Registrations</h3>
            <span className="text-xs text-gray-500">Last {stats.recentUsers.length} registrations</span>
          </div>
          <div className="space-y-3">
            {recentUsers.map(user => (
              <div key={user.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full flex items-center justify-center text-white font-semibold relative">
                    {user.name.charAt(0)}
                    {user.premium && (
                      <div className="absolute -top-1 -right-1 w-4 h-4 bg-yellow-400 rounded-full flex items-center justify-center">
                        <span className="text-[8px]">⭐</span>
                      </div>
                    )}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="font-medium text-gray-800">{user.name}</p>
                      <span className="text-xs text-gray-500">•</span>
                      <p className="text-xs text-gray-500">{user.age} yrs</p>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-gray-500">
                      <span>{user.profession}</span>
                      <span>•</span>
                      <span>{user.location}</span>
                    </div>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-1">
                  <span className="text-[10px] text-gray-400">
                    {new Date(user.registeredDate).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-800">Recent Activity</h3>
            <span className="text-xs text-gray-500">Last {matches.length} matches</span>
          </div>
          <div className="space-y-3">
            {matches.map(match => (
              <div key={match.id} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                <Heart className={`w-5 h-5 ${
                  match.status === 'Connected' ? 'text-pink-500' :
                  match.status === 'Interest Sent' ? 'text-blue-500' :
                  'text-gray-400'
                } mt-1`} fill={match.status === 'Connected' ? 'currentColor' : 'none'} />
                <div className="flex-1">
                  <p className="text-sm text-gray-800">
                    <span className="font-medium">{match.user1}</span>
                    <span className="mx-2">→</span>
                    <span className="font-medium">{match.user2}</span>
                  </p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className={`text-xs px-2 py-0.5 rounded-full ${
                      match.status === 'Connected' ? 'bg-pink-100 text-pink-700' :
                      match.status === 'Interest Sent' ? 'bg-blue-100 text-blue-700' :
                      'bg-gray-100 text-gray-700'
                    }`}>
                      {match.status}
                    </span>
                    <span className="text-xs text-gray-400">{match.date}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div> */}
      </div>

      {/* Gender Distribution Chart could go here */}
      {/* <div className="mt-6">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold mb-4 text-gray-800">User Demographics</h3>
          Add a chart here showing gender distribution, age groups, etc.
        </div>
      </div> */}
    </div>
  );
};

export default Dashboard;