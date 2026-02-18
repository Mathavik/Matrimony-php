import React, { useState, useEffect } from 'react';
import { Search, Eye, Trash2, Crown, X, Heart, MapPin, Briefcase, Phone, Mail, Calendar, User, Award, Filter, ChevronDown, Users, TrendingUp, Download, MoreVertical } from 'lucide-react';
import { deleteUserById } from '../api/adminApi'; // adjust path if needed

interface UserType {
  id: number;
  name: string;
  email: string;
  mobile: string;
  gender: string;
  age: number;
  profileFor?: string;
  religion?: string;
  caste?: string;
  motherTongue?: string;
  education?: string;
  profession?: string;
  annualIncome?: string;
  height?: string;
  maritalStatus?: string;
  dob?: string;
  country?: string;
  state?: string;
  city?: string;
  premium?: boolean;
  status?: string;
  registeredDate?: string;
  profilePhoto?: string;
  location?: string;
}

interface UserManagementProps {
  users: UserType[];
  deleteUser: (id: number) => void;
}

const UserManagement: React.FC<UserManagementProps> = ({ users: propUsers = [], deleteUser }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUser, setSelectedUser] = useState<UserType | null>(null);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [userToDelete, setUserToDelete] = useState<UserType | null>(null);
  const [matchesCount, setMatchesCount] = useState(0);
  const [loading, setLoading] = useState(true);

  const users = propUsers || [];

  // Fetch accepted matches count
  useEffect(() => {
    const fetchMatchesCount = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/request/accepted-count');
        const data = await response.json();
        setMatchesCount(data.count || 0);
      } catch (error) {
        console.error('Error fetching matches:', error);
        setMatchesCount(0);
      } finally {
        setLoading(false);
      }
    };

    fetchMatchesCount();
  }, []);

  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (user.profession?.toLowerCase().includes(searchTerm.toLowerCase()) ?? false) ||
      (user.location?.toLowerCase().includes(searchTerm.toLowerCase()) ?? false);
    return matchesSearch;
  });

  const handleViewUser = (user: UserType) => {
    setSelectedUser(user);
    setShowViewModal(true);
  };

  const handleDeleteClick = (user: UserType) => {
    setUserToDelete(user);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
  if (userToDelete) {
    try {
      await deleteUserById(userToDelete.id); // 🔥 Call backend API
      deleteUser(userToDelete.id); // Optional — remove from local state
      setShowDeleteModal(false);
      setUserToDelete(null);
      alert('User deleted successfully!');
    } catch (error) {
      console.error('Delete failed:', error);
      alert('Failed to delete user');
    }
  }
};


  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  const premiumCount = users.filter(u => u.premium).length;
  const activeCount = users.filter(u => u.status === 'active').length;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Navigation Bar */}
      <div className="bg-white border-b border-gray-200 sticky">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-indigo-600 rounded-lg flex items-center justify-center">
                <Users className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold Total Users-900">User Management</h1>
                <p className="text-sm Total Users-500">Manage and monitor user profiles</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-6">
        {/* Stats Dashboard */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
          <div className="bg-white rounded-xl p-6 border border-gray-200 hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center">
                <Users className="w-6 h-6 text-indigo-600" />
              </div>
              <TrendingUp className="w-5 h-5 text-green-500" />
            </div>
            <p className="text-sm Total Users-600 mb-1">Total Users</p>
            <p className="text-3xl font-bold Total Users-900">{users.length}</p>
            <p className="text-xs Total Users-500 mt-2">Active registered users</p>
          </div>

          <div className="bg-white rounded-xl p-6 border border-gray-200 hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-amber-100 rounded-lg flex items-center justify-center">
                <Crown className="w-6 h-6 text-amber-600" />
              </div>
              <TrendingUp className="w-5 h-5 text-green-500" />
            </div>
            <p className="text-sm Total Users-600 mb-1">Premium Members</p>
            <p className="text-3xl font-bold Total Users-900">{premiumCount}</p>
            <p className="text-xs Total Users-500 mt-2">
              {users.length > 0 ? ((premiumCount / users.length) * 100).toFixed(1) : '0'}% conversion
            </p>
          </div>

          <div className="bg-white rounded-xl p-6 border border-gray-200 hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <Heart className="w-6 h-6 text-purple-600" />
              </div>
              {loading ? (
                <div className="w-5 h-5 border-2 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <TrendingUp className="w-5 h-5 text-green-500" />
              )}
            </div>
            <p className="text-sm Total Users-600 mb-1">Matches Made</p>
            <p className="text-3xl font-bold Total Users-900">
              {loading ? '...' : matchesCount}
            </p>
            <p className="text-xs Total Users-500 mt-2">Accepted connections</p>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 Total Users-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search by name, profession, or location..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
            </div>
            <div className="flex gap-3">
              <button className="px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2">
                <Filter className="w-5 h-5" />
                Filters
              </button>
            </div>
          </div>
        </div>

        {/* Table View */}
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold Total Users-600 uppercase tracking-wider">User</th>
                  {/* <th className="px-6 py-4 text-left text-xs font-semibold Total Users-600 uppercase tracking-wider">Contact</th> */}
                  <th className="px-6 py-4 text-left text-xs font-semibold Total Users-600 uppercase tracking-wider">Details</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold Total Users-600 uppercase tracking-wider">Location</th>
                  <th className="px-6 py-4 text-right text-xs font-semibold Total Users-600 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-3">
                        {user.profilePhoto ? (
                          <img
                            src={user.profilePhoto}
                            alt={user.name}
                            className="w-10 h-10 rounded-full object-cover"
                          />
                        ) : (
                          <div className="w-10 h-10 bg-indigo-600 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                            {getInitials(user.name)}
                          </div>
                        )}
                        <div>
                          <div className="flex items-center gap-2">
                            <p className="font-semibold Total Users-900">{user.name}</p>
                            {user.premium && (
                              <Crown className="w-4 h-4 text-amber-500" fill="currentColor" />
                            )}
                          </div>
                          {/* <p className="text-sm Total Users-500">ID: #{user.id}</p> */}
                        </div>
                      </div>
                    </td>
                    {/* <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm">
                        <p className="Total Users-900">{user.email}</p>
                        <p className="Total Users-500">{user.mobile}</p>
                      </div>
                    </td> */}
                    <td className="px-4 py-4 align-middle text-left">
                      <div className="text-sm">
                        <span className="Total Users-900">
                          {user.age} yrs • {user.gender}
                        </span>
                        <span className="Total Users-500 ">
                          {user.profession || "—"}
                        </span>
                      </div>
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-1 text-sm Total Users-600">
                        <MapPin className="w-4 h-4 Total Users-400" />
                        {user.location}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleViewUser(user)}
                          className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                          title="View Details"
                        >
                          <Eye className="w-5 h-5" />
                        </button>
                        <button
                          onClick={() => handleDeleteClick(user)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Delete User"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredUsers.length === 0 && (
            <div className="text-center py-12">
              <User className="w-16 h-16 Total Users-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold Total Users-700 mb-2">No users found</h3>
              <p className="Total Users-500">Try adjusting your search criteria</p>
            </div>
          )}
        </div>
      </div>

      {/* View Modal sectionsss*/}
      {showViewModal && selectedUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
              <h2 className="text-xl font-bold Total Users-900">Profile Details</h2>
              <button
                onClick={() => setShowViewModal(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 Total Users-500" />
              </button>
            </div>

            <div className="p-6">
              <div className="flex items-center gap-6 mb-8 pb-6 border-b border-gray-200">
                {selectedUser.profilePhoto ? (
                  <img
                    src={selectedUser.profilePhoto}
                    alt={selectedUser.name}
                    className="w-24 h-24 rounded-full object-cover border-4 border-gray-100"
                  />
                ) : (
                  <div className="w-24 h-24 bg-indigo-600 rounded-full flex items-center justify-center text-white text-3xl font-bold">
                    {getInitials(selectedUser.name)}
                  </div>
                )}
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-2xl font-bold Total Users-900">{selectedUser.name}</h3>
                    {selectedUser.premium && (
                      <span className="flex items-center gap-1 bg-amber-100 text-amber-800 px-3 py-1 rounded-full text-sm font-semibold">
                        <Crown className="w-4 h-4" fill="currentColor" />
                        Premium
                      </span>
                    )}
                  </div>
                  <p className="Total Users-600 mb-1">ID: #{selectedUser.id}</p>
                  <p className="text-sm Total Users-500">{selectedUser.profession} • {selectedUser.location}</p>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-6">
                  <div>
                    <h4 className="text-sm font-semibold Total Users-900 mb-3 flex items-center gap-2">
                      <User className="w-4 h-4 text-indigo-600" />
                      Personal Information
                    </h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between py-2 border-b border-gray-100">
                        <span className="Total Users-600">Profile For</span>
                        <span className="font-medium Total Users-900">{selectedUser.profileFor || 'N/A'}</span>
                      </div>
                      <div className="flex justify-between py-2 border-b border-gray-100">
                        <span className="Total Users-600">Gender</span>
                        <span className="font-medium Total Users-900">{selectedUser.gender}</span>
                      </div>
                      <div className="flex justify-between py-2 border-b border-gray-100">
                        <span className="Total Users-600">Date of Birth</span>
                        <span className="font-medium Total Users-900">{selectedUser.dob || 'N/A'}</span>
                      </div>
                      <div className="flex justify-between py-2 border-b border-gray-100">
                        <span className="Total Users-600">Age</span>
                        <span className="font-medium Total Users-900">{selectedUser.age} years</span>
                      </div>
                      <div className="flex justify-between py-2 border-b border-gray-100">
                        <span className="Total Users-600">Height</span>
                        <span className="font-medium Total Users-900">{selectedUser.height || 'N/A'}</span>
                      </div>
                      <div className="flex justify-between py-2">
                        <span className="Total Users-600">Marital Status</span>
                        <span className="font-medium Total Users-900">{selectedUser.maritalStatus || 'N/A'}</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="text-sm font-semibold Total Users-900 mb-3 flex items-center gap-2">
                      <Heart className="w-4 h-4 text-indigo-600" />
                      Religious Background
                    </h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between py-2 border-b border-gray-100">
                        <span className="Total Users-600">Religion</span>
                        <span className="font-medium Total Users-900">{selectedUser.religion || 'N/A'}</span>
                      </div>
                      <div className="flex justify-between py-2 border-b border-gray-100">
                        <span className="Total Users-600">Caste</span>
                        <span className="font-medium Total Users-900">{selectedUser.caste || 'N/A'}</span>
                      </div>
                      <div className="flex justify-between py-2">
                        <span className="Total Users-600">Mother Tongue</span>
                        <span className="font-medium Total Users-900">{selectedUser.motherTongue || 'N/A'}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-6">
                  <div>
                    <h4 className="text-sm font-semibold Total Users-900 mb-3 flex items-center gap-2">
                      <Briefcase className="w-4 h-4 text-indigo-600" />
                      Professional Details
                    </h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between py-2 border-b border-gray-100">
                        <span className="Total Users-600">Education</span>
                        <span className="font-medium Total Users-900">{selectedUser.education || 'N/A'}</span>
                      </div>
                      <div className="flex justify-between py-2 border-b border-gray-100">
                        <span className="Total Users-600">Occupation</span>
                        <span className="font-medium Total Users-900">{selectedUser.profession}</span>
                      </div>
                      <div className="flex justify-between py-2">
                        <span className="Total Users-600">Annual Income</span>
                        <span className="font-medium Total Users-900">{selectedUser.annualIncome || 'N/A'}</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="text-sm font-semibold Total Users-900 mb-3 flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-indigo-600" />
                      Location Details
                    </h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between py-2 border-b border-gray-100">
                        <span className="Total Users-600">Country</span>
                        <span className="font-medium Total Users-900">{selectedUser.country || 'N/A'}</span>
                      </div>
                      <div className="flex justify-between py-2 border-b border-gray-100">
                        <span className="Total Users-600">State</span>
                        <span className="font-medium Total Users-900">{selectedUser.state || 'N/A'}</span>
                      </div>
                      <div className="flex justify-between py-2">
                        <span className="Total Users-600">City</span>
                        <span className="font-medium Total Users-900">{selectedUser.city || 'N/A'}</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="text-sm font-semibold Total Users-900 mb-3 flex items-center gap-2">
                      <Phone className="w-4 h-4 text-indigo-600" />
                      Contact Information
                    </h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between py-2 border-b border-gray-100">
                        <span className="Total Users-600">Email</span>
                        <span className="font-medium Total Users-900">{selectedUser.email}</span>
                      </div>
                      <div className="flex justify-between py-2">
                        <span className="Total Users-600">Mobile</span>
                        <span className="font-medium Total Users-900">{selectedUser.mobile}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="border-t border-gray-200 px-6 py-4 bg-gray-50 flex justify-end gap-3">
              <button
                onClick={() => setShowViewModal(false)}
                className="px-6 py-2.5 bg-white border border-gray-300 Total Users-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Modal */}
      {showDeleteModal && userToDelete && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl">
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Trash2 className="w-8 h-8 text-red-600" />
              </div>
              <h3 className="text-xl font-bold Total Users-900 mb-2">Delete User</h3>
              <p className="Total Users-600">
                Are you sure you want to delete <strong>{userToDelete.name}</strong>?
              </p>
              <p className="text-sm text-red-600 mt-2">This action cannot be undone.</p>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowDeleteModal(false);
                  setUserToDelete(null);
                }}
                className="flex-1 px-4 py-2.5 bg-white border border-gray-300 Total Users-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="flex-1 px-4 py-2.5 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserManagement;