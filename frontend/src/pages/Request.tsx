import React, { useState, useEffect } from "react";
import axios from "axios";
import { Check, X, Search, Eye } from "lucide-react";

interface UserRequest {
  id: number;
  sender: {
    id: number;
    fullName: string;
    age: number;
    occupation: string;
    city: string;
    gender: string;
    religion?: string;
    caste?: string;
    education?: string;
    state?: string;
    profilePhoto?: string | null;
  };
  status: "pending" | "accepted" | "rejected";
  createdAt: string;
}

const RequestManager: React.FC = () => {
  const [requests, setRequests] = useState<UserRequest[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [selectedSender, setSelectedSender] = useState<UserRequest["sender"] | null>(null);

  const BASE_URL = "http://localhost:5000";

  // ✅ Fetch only pending requests
  const fetchRequests = async () => {
    try {
      setLoading(true);
      const user = JSON.parse(localStorage.getItem("userId") || "{}");
      const res = await axios.get(`${BASE_URL}/api/request/received/${user}`);
      const allRequests = res.data.data || [];
      const pendingOnly = allRequests.filter(
        (req: UserRequest) => req.status === "pending"
      );
      setRequests(pendingOnly);
    } catch (err) {
      console.error("Error fetching pending requests:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  // ✅ Accept / Reject actions
  const handleAccept = async (id: number) => {
    try {
      await axios.get(`${BASE_URL}/api/request/respond?requestId=${id}&status=accepted`);
      setRequests(reqs => reqs.filter(r => r.id !== id));
      alert("✅ Request accepted");
    } catch (err) {
      console.error("Error accepting request:", err);
      alert("❌ Failed to accept request");
    }
  };

  const handleReject = async (id: number) => {
    try {
      await axios.get(`${BASE_URL}/api/request/respond?requestId=${id}&status=rejected`);
      setRequests(reqs => reqs.filter(r => r.id !== id));
      alert("❌ Request rejected");
    } catch (err) {
      console.error("Error rejecting request:", err);
      alert("Failed to reject request");
    }
  };

  const formatDate = (dateString: string) => new Date(dateString).toLocaleString();

  // ✅ Search filter
  const filteredRequests = requests.filter(req =>
    req.sender.fullName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-slate-50 py-20">
      {/* Header */}
      <div className="bg-slate-50 ">
        <div className="max-w-7xl mx-auto px-6 py-6 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Requests</h1>
            <p className="text-slate-600 mt-1">View and manage sender requests</p>
          </div>
          <div className="text-right">
            <p className="text-sm text-slate-600">Total Pending</p>
            <p className="text-2xl font-bold text-slate-900">{requests.length}</p>
          </div>
        </div>
      </div>

      {/* Search Bar */}
      <div className="max-w-7xl mx-auto px-6 mt-6">
        <div className="bg-white border border-slate-200 rounded-lg p-4 mb-6 flex">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type="text"
              placeholder="Search by sender name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
            />
          </div>
        </div>

        {/* Table */}
        <div className="max-w-5xl mx-auto mt-8">
          <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
            {loading ? (
              <div className="p-10 text-center text-slate-500">
                Loading pending requests...
              </div>
            ) : filteredRequests.length === 0 ? (
              <div className="p-10 text-center text-slate-500">
                No pending requests found
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-slate-700">
                  <thead className="bg-slate-50 border-b border-slate-200">
                    <tr>
                      <th className="px-20 py-3 text-left font-semibold uppercase tracking-wider text-xs">
                        Sender
                      </th>
                      <th className="px-60 py-3 text-left font-semibold uppercase tracking-wider text-xs">
                        Date
                      </th>
                      <th className="px-6 py-3 text-center font-semibold uppercase tracking-wider text-xs">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredRequests.map((req) => (
                      <tr
                        key={req.id}
                        className="hover:bg-slate-50 transition-colors duration-150"
                      >
                        {/* Sender Info */}
                        <td className="px-6 py-3 flex items-center gap-3">
                          <img
                            src={
                              req.sender.profilePhoto
                                ? `${BASE_URL}/uploads/${req.sender.profilePhoto}`

                                : "/default-avatar.png"
                            }
                            alt="Profile"
                            className="w-10 h-10 rounded-full object-cover border border-slate-200"
                          />
                          <div>
                            <p className="font-medium text-slate-900">
                              {req.sender.fullName}
                            </p>
                            <p className="text-slate-500 text-xs">
                              {req.sender.age} yrs • {req.sender.occupation}
                            </p>
                          </div>
                        </td>

                        {/* Date */}
                        <td className="text-slate-600 text-sm">
                          {formatDate(req.createdAt)}
                        </td>

                        {/* Actions */}
                        <td className="px-6 py-3 text-center">
                          <div className="flex justify-center gap-3">
                            <button
                              onClick={() => setSelectedSender(req.sender)}
                              className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg transition"
                            >
                              <Eye className="w-5 h-5" />
                            </button>
                            <button
                              onClick={() => handleAccept(req.id)}
                              className="p-2 text-emerald-700 hover:bg-emerald-50 rounded-lg transition"
                            >
                              <Check className="w-5 h-5" />
                            </button>
                            <button
                              onClick={() => handleReject(req.id)}
                              className="p-2 text-rose-700 hover:bg-rose-50 rounded-lg transition"
                            >
                              <X className="w-5 h-5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>

      </div>

      {/* 🧩 Modal for Sender Details */}
      {selectedSender && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white w-full max-w-md rounded-2xl shadow-lg p-6 relative">
            <button
              onClick={() => setSelectedSender(null)}
              className="absolute top-3 right-3 text-slate-500 hover:text-slate-700"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="text-center">
              <img
                src={
                  selectedSender.profilePhoto
                    ? `${BASE_URL}/${selectedSender.profilePhoto}`
                    : "/default-avatar.png"
                }
                alt="Profile"
                className="w-24 h-24 rounded-full mx-auto border object-cover"
              />
              <h2 className="text-xl font-semibold text-slate-900 mt-3">
                {selectedSender.fullName}
              </h2>
              <p className="text-slate-600 text-sm mt-1">
                {selectedSender.age} yrs • {selectedSender.gender}
              </p>
            </div>

            <div className="mt-5 space-y-2 text-sm text-slate-700">
              <p><strong>Occupation:</strong> {selectedSender.occupation || "N/A"}</p>
              <p><strong>Education:</strong> {selectedSender.education || "N/A"}</p>
              <p><strong>Religion:</strong> {selectedSender.religion || "N/A"}</p>
              <p><strong>Caste:</strong> {selectedSender.caste || "N/A"}</p>
              <p><strong>City:</strong> {selectedSender.city}, {selectedSender.state}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RequestManager;
