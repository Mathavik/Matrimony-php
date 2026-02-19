import React, { useEffect, useState } from "react";
// import axios from "axios";
import axiosInstance from "../../../axiosInstance";

// const API_URL = "http://localhost:5000/api/help";

interface HelpRequest {
  id: number;
  name: string;
  email: string;
  subject: string;
  message: string;
  status: string;
  created_at: string;
}

const AdminHelpRequests: React.FC = () => {
  const [helpRequests, setHelpRequests] = useState<HelpRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<number | null>(null);
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedRequest, setSelectedRequest] = useState<HelpRequest | null>(null);
  const [showModal, setShowModal] = useState(false);

  // Fetch all help requests
  const fetchHelpRequests = async () => {
    try {
      // API call simulation and fallback data
      // const response = await axios.get(API_URL);
      const response = await axiosInstance.get(
  "/api/Help/getHelp.php"
);

      setHelpRequests(response.data.data);
      setLoading(false);
    } catch (err) {
      console.error("Error fetching help requests:", err);
      // Fallback data for demonstration in local environment
      setHelpRequests([
        {
          id: 1,
          name: "Sarah L. Chen",
          email: "sarah.l.chen@email.com",
          subject: "Profile Verification Stuck",
          message: "I submitted my government ID three days ago for profile verification, but it still shows as pending. Can you please check the status and expedite the process?",
          status: "Pending",
          created_at: "2025-11-21T06:15:46.000Z",
        },
        {
            id: 2,
            name: "Rahul Sharma",
            email: "rahul.sharma@mail.in",
            subject: "Photo Upload Issue - Max Size Limit",
            message: "I am trying to upload a high-quality photo for my profile, but the system keeps rejecting it, saying the file size is too large (8MB). Can you increase the limit or suggest a workaround? Thanks!",
            status: "Resolved",
            created_at: "2025-11-20T10:00:00.000Z",
        },
        {
            id: 3,
            name: "Priya Menon",
            email: "priya.menon@mail.co",
            subject: "Account Deactivation Request",
            message: "I have found my match and would like to permanently deactivate my account. Please confirm when this process is complete.",
            status: "Closed",
            created_at: "2025-11-19T14:30:00.000Z",
        }
      ]);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHelpRequests();
  }, []);

  // Update request status
  const updateStatus = async (id: number, status: string) => {
    setUpdatingId(id);
    try {
      // await axios.put(`${API_URL}/status/${id}`, { status });
await axiosInstance.put(
  `/api/Help/updateByIdHelp.php?id=${id}`,
  { status }
);

      // Update UI after success
      setHelpRequests((prev) =>
        prev.map((req) =>
          req.id === id ? { ...req, status: status } : req
        )
      );
    } catch (err) {
      console.error("Error updating status:", err);
    }
    setUpdatingId(null);
  };

  // Filter and search logic
  const filteredRequests = helpRequests.filter((req) => {
    const statusLower = req.status.toLowerCase();
    const filterLower = filterStatus.toLowerCase();

    const matchesStatus = filterLower === "all" || statusLower === filterLower;
    const matchesSearch = 
      req.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      req.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      req.subject.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  // Stats calculation
  const stats = {
    total: helpRequests.length,
    pending: helpRequests.filter(r => r.status === "Pending").length,
    resolved: helpRequests.filter(r => r.status === "Resolved").length,
    closed: helpRequests.filter(r => r.status === "Closed").length,
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "pending":
        // Light color with dark text
        return "bg-amber-100 text-amber-700 border-amber-300";
      case "resolved":
        return "bg-emerald-100 text-emerald-700 border-emerald-300";
      case "closed":
        return "bg-gray-200 text-gray-700 border-gray-400";
      default:
        return "bg-pink-100 text-pink-700 border-pink-300";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case "pending":
        return "⏳";
      case "resolved":
        return "✅";
      case "closed":
        return "🔒";
      default:
        return "📋";
    }
  };

  const viewDetails = (request: HelpRequest) => {
    setSelectedRequest(request);
    setShowModal(true);
  };

  if (loading) {
    return (
      // Simple Pink/White Loading Screen
      <div className="flex items-center justify-center min-h-screen bg-pink-50 p-10">
        <div className="text-center">
          <div className="relative w-16 h-16 mx-auto mb-4">
            <div className="border-4 border-pink-400 border-t-transparent rounded-full animate-spin"></div>
          </div>
          <p className="text-xl font-semibold text-pink-700">Loading requests...</p>
        </div>
      </div>
    );
  }

  return (
    // Main Container - Clean White Background with Pink Accent
    <div className="min-h-screen bg-pink-50 p-6 sm:p-10">
      <div className="max-w-7xl mx-auto bg-white p-8 rounded-xl border border-pink-200">
        
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-2">
            <div className="w-12 h-12 bg-pink-600 rounded-lg flex items-center justify-center">
              <span className="text-2xl text-white">🎧</span>
            </div>
            <div>
              <h1 className="text-4xl sm:text-4xl font-extrabold text-pink-700">
                Customer Support Dashboard
              </h1>
              <p className="text-gray-600 mt-1 text-lg">Manage and track all user help requests</p>
            </div>
          </div>
        </div>
        
        <hr className="border-t border-pink-100 mb-8" />

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
          
          {/* Total Requests Card */}
          <div className="bg-white rounded-lg p-5 border-l-4 border-pink-600 shadow-sm transition-all duration-200 hover:bg-pink-50">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">Total Requests</p>
                <p className="text-3xl font-bold text-pink-700">{stats.total}</p>
              </div>
              <div className="w-12 h-12 bg-pink-100 rounded-md flex items-center justify-center text-2xl">
                <span>📋</span>
              </div>
            </div>
          </div>

          {/* Pending Card */}
          <div className="bg-white rounded-lg p-5 border-l-4 border-amber-500 shadow-sm transition-all duration-200 hover:bg-pink-50">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">Pending</p>
                <p className="text-3xl font-bold text-amber-600">{stats.pending}</p>
              </div>
              <div className="w-12 h-12 bg-amber-100 rounded-md flex items-center justify-center text-2xl">
                <span>⏳</span>
              </div>
            </div>
          </div>

          {/* Resolved Card */}
          <div className="bg-white rounded-lg p-5 border-l-4 border-emerald-500 shadow-sm transition-all duration-200 hover:bg-pink-50">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">Resolved</p>
                <p className="text-3xl font-bold text-emerald-600">{stats.resolved}</p>
              </div>
              <div className="w-12 h-12 bg-emerald-100 rounded-md flex items-center justify-center text-2xl">
                <span>✅</span>
              </div>
            </div>
          </div>

          {/* Closed Card */}
          <div className="bg-white rounded-lg p-5 border-l-4 border-gray-400 shadow-sm transition-all duration-200 hover:bg-pink-50">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">Closed</p>
                <p className="text-3xl font-bold text-gray-600">{stats.closed}</p>
              </div>
              <div className="w-12 h-12 bg-gray-200 rounded-md flex items-center justify-center text-2xl">
                <span>🔒</span>
              </div>
            </div>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="bg-white p-6 border border-pink-200 rounded-lg mb-8 shadow-inner">
          <div className="flex flex-col lg:flex-row gap-4 justify-between items-center">
            {/* Search Bar */}
            <div className="flex-1 w-full lg:max-w-md">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search by name, email, or subject..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-1 focus:ring-pink-400 focus:border-pink-400 transition-all text-gray-700"
                />
                <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-pink-400 text-xl">
                  🔍
                </span>
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery("")}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-pink-600 transition-colors"
                  >
                    ✕
                  </button>
                )}
              </div>
            </div>

            {/* Status Filter Buttons */}
            <div className="flex gap-2 flex-wrap justify-center lg:justify-end">
              {["all", "pending", "resolved", "closed"].map((status) => (
                <button
                  key={status}
                  onClick={() => setFilterStatus(status)}
                  className={`px-5 py-3 rounded-lg font-semibold text-sm transition-all duration-200 uppercase tracking-wider border ${
                    filterStatus === status
                      ? "bg-pink-600 text-white border-pink-700"
                      : "bg-white text-gray-700 border-gray-300 hover:bg-pink-50 hover:text-pink-600"
                  }`}
                >
                  {status}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Requests Cards List */}
        <div className="space-y-4">
          {filteredRequests.length === 0 ? (
            <div className="bg-white rounded-lg p-10 text-center border-2 border-dashed border-pink-300">
              <div className="text-5xl mb-3">💌</div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">No Requests Found</h3>
              <p className="text-gray-600">
                {searchQuery || filterStatus !== "all"
                  ? "Try adjusting your filters or search query."
                  : "No help requests at the moment."}
              </p>
            </div>
          ) : (
            filteredRequests.map((request) => (
              <div
                key={request.id}
                className="bg-white rounded-lg shadow-md transition-all duration-200 overflow-hidden border border-gray-200 hover:border-pink-300"
              >
                <div className="p-5">
                  <div className="flex flex-col md:flex-row items-start justify-between gap-4">
                    {/* Left Section - User Info & Details */}
                    <div className="flex items-start gap-4 flex-1 min-w-0">
                      <div className="w-12 h-12 bg-pink-600 rounded-full flex items-center justify-center text-white font-bold text-lg flex-shrink-0">
                        {request.name.charAt(0).toUpperCase()}
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-2">
                          <h3 className="text-lg font-bold text-gray-800 truncate">{request.name}</h3>
                          <span className={`px-3 py-1 rounded-full text-xs font-semibold border uppercase flex items-center gap-1 ${getStatusColor(request.status)}`}>
                            {getStatusIcon(request.status)} {request.status}
                          </span>
                        </div>
                        
                        <div className="text-sm text-gray-600 mb-3 space-y-1">
                          <span className="flex items-center gap-2">
                            <span className="text-lg text-pink-500">📧</span>
                            {request.email}
                          </span>
                          <span className="flex items-center gap-2">
                            <span className="text-lg text-gray-500">📅</span>
                            {new Date(request.created_at).toLocaleString()}
                          </span>
                        </div>

                        {/* Subject & Message Preview */}
                        <div className="bg-pink-50 rounded-md p-3 border border-pink-200">
                          <p className="text-sm font-bold text-pink-600 mb-1 flex items-center gap-2">
                            <span className="text-lg">📌</span> Subject: <span className="text-gray-800 font-semibold">{request.subject}</span>
                          </p>
                          {/* Ensure the entire sentence is readable without being blurry/cut off */}
                          <p className="text-gray-700 text-sm line-clamp-2">{request.message}</p>
                        </div>
                      </div>
                    </div>

                    {/* Right Section - Action Buttons/Dropdown */}
                    <div className="flex flex-col gap-2 w-full md:w-auto md:min-w-[180px] mt-3 md:mt-0">
                      <button
                        onClick={() => viewDetails(request)}
                        className="px-4 py-2 bg-pink-600 text-white rounded-md font-semibold hover:bg-pink-700 transition-colors border border-pink-600"
                      >
                        👁️ View Details
                      </button>
                      
                      <select
                        className={`w-full px-4 py-2 border rounded-md font-semibold transition-colors appearance-none bg-white ${
                          updatingId === request.id 
                            ? "opacity-50 cursor-not-allowed bg-gray-100" 
                            : "cursor-pointer border-gray-300 hover:border-pink-500 focus:border-pink-500"
                        }`}
                        value={request.status}
                        disabled={updatingId === request.id}
                        onChange={(e) => updateStatus(request.id, e.target.value)}
                      >
                        <option value="Pending">⏳ Pending</option>
                        <option value="Resolved">✅ Resolved</option>
                        <option value="Closed">🔒 Closed</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Modal for Full Details */}
      {showModal && selectedRequest && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-pink-600 p-5 rounded-t-lg">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-white">Request Details</h2>
                <button
                  onClick={() => setShowModal(false)}
                  className="w-8 h-8 bg-white/30 hover:bg-white/50 rounded-full flex items-center justify-center text-white text-lg transition-colors"
                >
                  ✕
                </button>
              </div>
            </div>

            <div className="p-6 space-y-4">
              {/* User Info Card */}
              <div className="bg-pink-50 rounded-md p-4 border border-pink-200">
                <div className="flex items-center gap-4 mb-3 border-b border-pink-100 pb-3">
                  <div className="w-14 h-14 bg-pink-600 rounded-full flex items-center justify-center text-white font-bold text-xl">
                    {selectedRequest.name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-800">{selectedRequest.name}</h3>
                    <p className="text-gray-600">{selectedRequest.email}</p>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div className="bg-white rounded-md p-3 border border-gray-300">
                    <p className="text-xs text-gray-600 mb-1 font-medium">Status</p>
                    <span className={`inline-flex px-3 py-1 rounded-full text-xs font-bold border uppercase ${getStatusColor(selectedRequest.status)}`}>
                      {getStatusIcon(selectedRequest.status)} {selectedRequest.status}
                    </span>
                  </div>
                  <div className="bg-white rounded-md p-3 border border-gray-300">
                    <p className="text-xs text-gray-600 mb-1 font-medium">Request ID</p>
                    <p className="font-bold text-pink-600">#{selectedRequest.id}</p>
                  </div>
                  <div className="bg-white rounded-md p-3 border border-gray-300">
                    <p className="text-xs text-gray-600 mb-1 font-medium">Submitted On</p>
                    <p className="font-bold text-gray-800 text-sm">
                      {new Date(selectedRequest.created_at).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </div>

              {/* Subject */}
              <div className="bg-white border border-pink-300 rounded-md p-4">
                <p className="text-sm font-semibold text-pink-600 mb-1">📌 Subject</p>
                <p className="text-lg font-bold text-gray-800">{selectedRequest.subject}</p>
              </div>

              {/* Message */}
              <div className="bg-white border border-gray-300 rounded-md p-4">
                <p className="text-sm font-semibold text-gray-600 mb-2">💬 Message</p>
                <p className="text-gray-700 leading-relaxed whitespace-pre-wrap text-base">
                  {selectedRequest.message}
                </p>
              </div>

              {/* Actions */}
              <div className="flex gap-3 pt-3">
                <button
                  onClick={() => {
                    updateStatus(selectedRequest.id, "Resolved");
                    setShowModal(false);
                  }}
                  className="flex-1 bg-emerald-500 text-white py-2 rounded-md font-semibold hover:bg-emerald-600 transition-colors"
                  disabled={selectedRequest.status === "Resolved"}
                >
                  {selectedRequest.status === "Resolved" ? "✅ Already Resolved" : "✅ Mark as Resolved"}
                </button>
                <button
                  onClick={() => {
                    updateStatus(selectedRequest.id, "Closed");
                    setShowModal(false);
                  }}
                  className="flex-1 bg-gray-500 text-white py-2 rounded-md font-semibold hover:bg-gray-600 transition-colors"
                  disabled={selectedRequest.status === "Closed"}
                >
                  {selectedRequest.status === "Closed" ? "🔒 Already Closed" : "🔒 Close Request"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminHelpRequests;