import React, { useEffect, useState } from "react";
import { Heart, Users, TrendingUp, Calendar, MapPin, Cake, User } from "lucide-react";

interface Match {
  id: number;
  senderName: string;
  receiverName: string;
  senderAge: number;
  receiverAge: number;
  senderCity: string;
  receiverCity: string;
  senderPhoto?: string;
  receiverPhoto?: string;
  createdAt: string;
}

const MatchManagement: React.FC = () => {
  const [matches, setMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterBy, setFilterBy] = useState<"all" | "recent">("all");

  useEffect(() => {
    fetchMatches();
  }, []);

  const fetchMatches = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/request/all-matches");
      const data = await res.json();
      if (data.success) setMatches(data.matches);
    } catch (err) {
      console.error("Error fetching matches:", err);
    } finally {
      setLoading(false);
    }
  };

  const getRecentMatches = () => {
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    return matches.filter(
      (match) => new Date(match.createdAt) >= sevenDaysAgo
    ).length;
  };

  const filteredMatches = matches.filter((match) => {
    const matchesSearch =
      match.senderName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      match.receiverName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      match.senderCity.toLowerCase().includes(searchTerm.toLowerCase()) ||
      match.receiverCity.toLowerCase().includes(searchTerm.toLowerCase());

    if (filterBy === "recent") {
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
      return matchesSearch && new Date(match.createdAt) >= sevenDaysAgo;
    }

    return matchesSearch;
  });

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const options: Intl.DateTimeFormatOptions = {
      month: "short",
      day: "numeric",
      year: "numeric",
    };
    return date.toLocaleDateString("en-US", options);
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-pink-500 border-t-transparent mb-4"></div>
          <p className="text-gray-600 font-medium">Loading matches...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-pink-50/30 to-purple-50/30 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-gradient-to-br from-pink-500 to-rose-600 rounded-lg shadow-lg">
              <Heart className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
            </div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-800">
              Match Management
            </h1>
          </div>
          <p className="text-sm sm:text-base text-gray-600 ml-1">
            Monitor and manage all successful connections
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-8">
          {/* Total Matches Card */}
          <div className="relative overflow-hidden bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl shadow-xl p-6 transform transition-all duration-300 hover:scale-105 hover:shadow-2xl">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16"></div>
            <div className="relative">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-white/20 backdrop-blur-sm rounded-xl">
                  <Users className="w-6 h-6 text-white" />
                </div>
                <span className="text-xs font-semibold text-blue-100 bg-white/20 px-3 py-1 rounded-full">
                  All Time
                </span>
              </div>
              <h3 className="text-sm font-medium text-blue-100 mb-1">
                Total Matches
              </h3>
              <p className="text-4xl font-bold text-white">{matches.length}</p>
            </div>
          </div>

          {/* Recent Matches Card */}
          <div className="relative overflow-hidden bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl shadow-xl p-6 transform transition-all duration-300 hover:scale-105 hover:shadow-2xl">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16"></div>
            <div className="relative">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-white/20 backdrop-blur-sm rounded-xl">
                  <Calendar className="w-6 h-6 text-white" />
                </div>
                <span className="text-xs font-semibold text-emerald-100 bg-white/20 px-3 py-1 rounded-full">
                  Last 7 Days
                </span>
              </div>
              <h3 className="text-sm font-medium text-emerald-100 mb-1">
                Recent Matches
              </h3>
              <p className="text-4xl font-bold text-white">
                {getRecentMatches()}
              </p>
            </div>
          </div>

          {/* Success Rate Card */}
          <div className="relative overflow-hidden bg-gradient-to-br from-pink-500 to-rose-600 rounded-2xl shadow-xl p-6 transform transition-all duration-300 hover:scale-105 hover:shadow-2xl sm:col-span-2 lg:col-span-1">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16"></div>
            <div className="relative">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-white/20 backdrop-blur-sm rounded-xl">
                  <TrendingUp className="w-6 h-6 text-white" />
                </div>
                <span className="text-xs font-semibold text-pink-100 bg-white/20 px-3 py-1 rounded-full">
                  Active
                </span>
              </div>
              <h3 className="text-sm font-medium text-pink-100 mb-1">
                Success Rate
              </h3>
              <p className="text-4xl font-bold text-white">
                {matches.length > 0 ? "100%" : "0%"}
              </p>
            </div>
          </div>
        </div>

        {/* Search and Filter Bar */}
        <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6 mb-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <input
                type="text"
                placeholder="Search by name or city..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all duration-200 outline-none"
              />
              <svg
                className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setFilterBy("all")}
                className={`px-4 py-3 rounded-lg font-medium text-sm transition-all duration-200 ${
                  filterBy === "all"
                    ? "bg-gradient-to-r from-pink-500 to-rose-600 text-white shadow-lg"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                All Matches
              </button>
              <button
                onClick={() => setFilterBy("recent")}
                className={`px-4 py-3 rounded-lg font-medium text-sm transition-all duration-200 ${
                  filterBy === "recent"
                    ? "bg-gradient-to-r from-pink-500 to-rose-600 text-white shadow-lg"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                Recent
              </button>
            </div>
          </div>
        </div>

        {/* Matches List */}
        {filteredMatches.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
            <div className="w-20 h-20 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
              <Heart className="w-10 h-10 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-700 mb-2">
              No Matches Found
            </h3>
            <p className="text-gray-500">
              {searchTerm
                ? "Try adjusting your search criteria"
                : "No matches have been created yet"}
            </p>
          </div>
        ) : (
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
            {/* Desktop Table View */}
            <div className="hidden lg:block overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gradient-to-r from-pink-600 to-rose-600 text-white">
                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider">
                      Match ID
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider">
                      Sender
                    </th>
                    <th className="px-6 py-4 text-center text-xs font-semibold uppercase tracking-wider">
                      Connection
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider">
                      Receiver
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider">
                      Matched On
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredMatches.map((match, index) => (
                    <tr
                      key={match.id}
                      className={`transition-colors hover:bg-pink-50 ${
                        index % 2 === 0 ? "bg-white" : "bg-gray-50"
                      }`}
                    >
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-gradient-to-r from-pink-100 to-rose-100 text-pink-700">
                          #{match.id}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="relative">
                            <img
                              src={
                                match.senderPhoto ||
                                "https://via.placeholder.com/150?text=User"
                              }
                              alt="Sender"
                              className="w-12 h-12 rounded-full object-cover border-2 border-pink-200"
                            />
                            <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white"></div>
                          </div>
                          <div>
                            <p className="font-semibold text-gray-800">
                              {match.senderName}
                            </p>
                            <div className="flex items-center gap-2 text-xs text-gray-500 mt-1">
                              <div className="flex items-center gap-1">
                                <Cake className="w-3 h-3" />
                                <span>{match.senderAge} yrs</span>
                              </div>
                              <span>•</span>
                              <div className="flex items-center gap-1">
                                <MapPin className="w-3 h-3" />
                                <span>{match.senderCity}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex justify-center">
                          <div className="p-2 bg-gradient-to-br from-pink-100 to-rose-100 rounded-full">
                            <Heart className="w-5 h-5 text-pink-600 fill-current" />
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="relative">
                            <img
                              src={
                                match.receiverPhoto ||
                                "https://via.placeholder.com/150?text=User"
                              }
                              alt="Receiver"
                              className="w-12 h-12 rounded-full object-cover border-2 border-pink-200"
                            />
                            <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white"></div>
                          </div>
                          <div>
                            <p className="font-semibold text-gray-800">
                              {match.receiverName}
                            </p>
                            <div className="flex items-center gap-2 text-xs text-gray-500 mt-1">
                              <div className="flex items-center gap-1">
                                <Cake className="w-3 h-3" />
                                <span>{match.receiverAge} yrs</span>
                              </div>
                              <span>•</span>
                              <div className="flex items-center gap-1">
                                <MapPin className="w-3 h-3" />
                                <span>{match.receiverCity}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4 text-gray-400" />
                          <div>
                            <p className="text-sm font-medium text-gray-700">
                              {formatDate(match.createdAt)}
                            </p>
                            <p className="text-xs text-gray-500">
                              {formatTime(match.createdAt)}
                            </p>
                          </div>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile Card View */}
            <div className="lg:hidden divide-y divide-gray-200">
              {filteredMatches.map((match) => (
                <div key={match.id} className="p-4 hover:bg-pink-50 transition-colors">
                  <div className="flex items-center justify-between mb-4">
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-gradient-to-r from-pink-100 to-rose-100 text-pink-700">
                      #{match.id}
                    </span>
                    <div className="flex items-center gap-2 text-xs text-gray-500">
                      <Calendar className="w-3 h-3" />
                      <span>{formatDate(match.createdAt)}</span>
                    </div>
                  </div>

                  <div className="space-y-4">
                    {/* Sender */}
                    <div className="flex items-center gap-3">
                      <div className="relative">
                        <img
                          src={
                            match.senderPhoto ||
                            "https://via.placeholder.com/150?text=User"
                          }
                          alt="Sender"
                          className="w-14 h-14 rounded-full object-cover border-2 border-pink-200"
                        />
                        <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white"></div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-gray-800 truncate">
                          {match.senderName}
                        </p>
                        <div className="flex items-center gap-2 text-xs text-gray-500 mt-1">
                          <div className="flex items-center gap-1">
                            <Cake className="w-3 h-3" />
                            <span>{match.senderAge} yrs</span>
                          </div>
                          <span>•</span>
                          <div className="flex items-center gap-1">
                            <MapPin className="w-3 h-3" />
                            <span className="truncate">{match.senderCity}</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Connection Icon */}
                    <div className="flex justify-center">
                      <div className="p-2 bg-gradient-to-br from-pink-100 to-rose-100 rounded-full">
                        <Heart className="w-5 h-5 text-pink-600 fill-current" />
                      </div>
                    </div>

                    {/* Receiver */}
                    <div className="flex items-center gap-3">
                      <div className="relative">
                        <img
                          src={
                            match.receiverPhoto ||
                            "https://via.placeholder.com/150?text=User"
                          }
                          alt="Receiver"
                          className="w-14 h-14 rounded-full object-cover border-2 border-pink-200"
                        />
                        <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white"></div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-gray-800 truncate">
                          {match.receiverName}
                        </p>
                        <div className="flex items-center gap-2 text-xs text-gray-500 mt-1">
                          <div className="flex items-center gap-1">
                            <Cake className="w-3 h-3" />
                            <span>{match.receiverAge} yrs</span>
                          </div>
                          <span>•</span>
                          <div className="flex items-center gap-1">
                            <MapPin className="w-3 h-3" />
                            <span className="truncate">{match.receiverCity}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Results Count */}
        {filteredMatches.length > 0 && (
          <div className="mt-6 text-center text-sm text-gray-600">
            Showing <span className="font-semibold text-gray-800">{filteredMatches.length}</span> of{" "}
            <span className="font-semibold text-gray-800">{matches.length}</span> total matches
          </div>
        )}
      </div>
    </div>
  );
};

export default MatchManagement;
