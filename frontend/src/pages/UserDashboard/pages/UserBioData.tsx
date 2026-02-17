import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Heart, Filter, X, ChevronDown, Search } from 'lucide-react';
import { useNavigate, useLocation } from "react-router-dom";
import Swal from 'sweetalert2';
import 'sweetalert2/dist/sweetalert2.min.css';
import Login from '../../../components/Login';

interface UserProfile {
  id: number;
  fullName: string;
  gender: string;
  age: number;
  occupation: string;
  state: string;
  profilePhoto: string;
  imageSrc?: string;
}

const BioData: React.FC = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const userIdFromUrl = queryParams.get('userId');

  const userId = userIdFromUrl || localStorage.getItem('userId');
  const navigate = useNavigate();

  const [profiles, setProfiles] = useState<UserProfile[]>([]);
  const [ageRange, setAgeRange] = useState<[number, number]>([18, 80]);
  const [biodataType, setBiodataType] = useState<string>("All");
  const [division, setDivision] = useState<string>("All");
  const [favorites, setFavorites] = useState<Set<number>>(new Set());
  const [filtersOpen, setFiltersOpen] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);

  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [isPremiumUser, setIsPremiumUser] = useState<boolean>(false);

  const [animatingIds, setAnimatingIds] = useState<Set<number>>(new Set());
  const createdObjectURLs = React.useRef<string[]>([]);

  const [availableStates, setAvailableStates] = useState<string[]>([]);
  const [showRegisterModal, setShowRegisterModal] = useState(false);

  const shouldBlurContent = !isLoggedIn || !isPremiumUser;

  useEffect(() => {
    const otpVerified = sessionStorage.getItem("otpVerified");
    if (otpVerified === "true") {
      setShowRegisterModal(true);
      sessionStorage.removeItem("otpVerified");
    }
  }, []);

  useEffect(() => {
    if (loading) return;

    const checkAndRedirect = async () => {
      const token = localStorage.getItem('token');

      if (!userId || !token) {
        setShowRegisterModal(true);
        return;
      }

      try {
        const response = await axios.get(
          `http://localhost:5000/api/premiumpayment/status/${userId}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        const isPremium = response.data?.user?.isPremium || false;

        if (!isPremium) {
          const currentUserId = userIdFromUrl || userId;
          navigate(`/premiumpayment?userId=${currentUserId}`);
        } else {
          setShowRegisterModal(false);
        }
      } catch (error) {
        console.error("Error checking premium status:", error);
        setShowRegisterModal(true);
      }
    };

    checkAndRedirect();
  }, [loading, userId, userIdFromUrl, navigate]);

  useEffect(() => {
    const fetchProfiles = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/register/users");
        const result = Array.isArray(res.data)
          ? res.data
          : res.data.users || res.data.data || [];

        const initProfiles = (result as any[]).map((p) => ({
          ...p,
          imageSrc: undefined,
        }));
        setProfiles(initProfiles);

        const states = Array.from(
          new Set(initProfiles.map(p => p.state).filter(Boolean))
        );
        setAvailableStates(states);

        setLoading(false);
      } catch (error) {
        console.error("Error fetching profiles:", error);
        setLoading(false);
      }
    };

    const fetchFavorites = async () => {
      try {
        if (!userId) return;
        const res = await axios.get(`http://localhost:5000/api/favorites/${userId}`);
        const favs = res.data?.favorites || [];
        const favSet = new Set<number>(favs.map((f: any) => Number(f.favoriteUserId)));
        setFavorites(favSet);
      } catch (err) {
        console.error("Error fetching favorites:", err);
      }
    };

    fetchProfiles();
    fetchFavorites();

    return () => {
      createdObjectURLs.current.forEach((u) => URL.revokeObjectURL(u));
    };
  }, [userId]);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!userId || !token) {
      setIsLoggedIn(false);
      setIsPremiumUser(false);
      return;
    }

    setIsLoggedIn(true);

    const checkPremium = async () => {
      try {
        const res = await axios.get(
          `http://localhost:5000/api/premiumpayment/status/${userId}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setIsPremiumUser(res.data?.user?.isPremium || false);
      } catch (err) {
        console.error("Error checking premium:", err);
        setIsPremiumUser(false);
      }
    };

    checkPremium();
  }, [userId]);

  useEffect(() => {
    if (profiles.length === 0) return;
    const token = localStorage.getItem('token');
    let isMounted = true;

    const loadImages = async () => {
      const updatedProfiles = await Promise.all(
        profiles.map(async (p) => {
          if (!p.profilePhoto) return p;

          const parts = p.profilePhoto.split('/');
          const filename = parts[parts.length - 1];
          const endpoint = `http://localhost:5000/api/register/profile-photo/${filename}`;

          try {
            if (token) {
              const resp = await fetch(endpoint, { headers: { Authorization: `Bearer ${token}` } });
              if (!resp.ok) throw new Error('Image fetch failed');
              const blob = await resp.blob();
              const url = URL.createObjectURL(blob);
              createdObjectURLs.current.push(url);
              return { ...p, imageSrc: url };
            } else {
              return { ...p, imageSrc: endpoint };
            }
          } catch {
            return { ...p, imageSrc: p.profilePhoto };
          }
        })
      );

      if (isMounted) setProfiles(updatedProfiles);
    };

    loadImages();
    return () => { isMounted = false; };
  }, [profiles.length]);

  const toggleFavorite = async (favoriteUserId: number) => {
    try {
      const loggedInUserId = Number(userId);
      if (!loggedInUserId) {
        alert('Please log in to add favorites.');
        navigate('/login');
        return;
      }

      const isFav = favorites.has(favoriteUserId);
      if (isFav) {
        await axios.post('http://localhost:5000/api/favorites/remove', {
          userId: loggedInUserId,
          favoriteUserId,
        });
        const updated = new Set(favorites);
        updated.delete(favoriteUserId);
        setFavorites(updated);
      } else {
        await axios.post('http://localhost:5000/api/favorites/add', {
          userId: loggedInUserId,
          favoriteUserId,
        });
        const updated = new Set(favorites);
        updated.add(favoriteUserId);
        setFavorites(updated);

        setAnimatingIds((prev) => {
          const copy = new Set(prev);
          copy.add(favoriteUserId);
          return copy;
        });
        setTimeout(() => {
          setAnimatingIds((prev) => {
            const copy = new Set(prev);
            copy.delete(favoriteUserId);
            return copy;
          });
        }, 700);
      }
    } catch (err: any) {
      console.error(err);
      alert(err?.response?.data?.message || 'Error updating favorites');
    }
  };

  const handleViewDetails = async (id: number) => {
    const token = localStorage.getItem('token');
    const currentUserId = userIdFromUrl || userId;

    if (!currentUserId || !token) {
      Swal.fire({
        icon: 'warning',
        title: 'Login Required',
        text: 'Please log in to view profile details!',
        confirmButtonColor: '#ec4899',
        confirmButtonText: 'Go to Login',
        background: '#fffafc',
      }).then(() => navigate('/login'));
      return;
    }

    try {
      const response = await axios.get(
        `http://localhost:5000/api/premiumpayment/status/${currentUserId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const isPremium = response.data?.user?.isPremium || false;

      if (isPremium) {
          // Navigate inside the UserDashboard to the UserProfileDetails view
          // Store the selected profile id so the dashboard-details component can read it
          try {
            sessionStorage.setItem('selectedProfileId', String(id));
            sessionStorage.setItem('selectedProfileUserId', String(currentUserId));
            window.dispatchEvent(new CustomEvent('openUserProfileDetails', { detail: { id, userId: currentUserId } }));
          } catch (e) {
            // fallback to route navigation if storage/dispatch fails
            navigate(`/profiledetails/${id}?userId=${currentUserId}`);
          }
        } else {
        Swal.fire({
          icon: 'info',
          title: 'Premium Members Only 💎',
          text: 'Only Premium users can view detailed profiles.',
          confirmButtonColor: '#f43f5e',
          confirmButtonText: 'Upgrade Now',
          showCancelButton: true,
          cancelButtonText: 'Maybe Later',
          background: '#fffafc',
        }).then((result) => {
          if (result.isConfirmed) navigate(`/premiumpayment?userId=${currentUserId}`);
        });
      }
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Access Denied',
        text: 'Please complete your Premium payment to access profile details.',
        confirmButtonColor: '#ef4444',
      }).then(() => navigate(`/premiumpayment?userId=${currentUserId}`));
    }
  };

  const handleResetFilters = () => {
    setAgeRange([18, 80]);
    setBiodataType("All");
    setDivision("All");
  };

  const filtered = profiles.filter((p) => {
    if (userId && Number(p.id) === Number(userId)) return false;
    if (p.age < ageRange[0] || p.age > ageRange[1]) return false;
    if (biodataType === "Brides" && p.gender !== "Female") return false;
    if (biodataType === "Grooms" && p.gender !== "Male") return false;
    if (division !== "All" && p.state !== division) return false;
    return true;
  });

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col justify-center items-center bg-gradient-to-br from-pink-50 to-rose-50">
        <div className="w-16 h-16 border-4 border-pink-200 border-t-pink-600 rounded-full animate-spin"></div>
        <p className="mt-4 text-gray-600 font-medium">Loading profiles...</p>
      </div>
    );
  }

  return (
    <>
      {showRegisterModal && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="relative bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setShowRegisterModal(false)}
              className="absolute top-4 right-4 z-10 p-2 bg-white rounded-full shadow-lg hover:bg-gray-100 transition"
            >
              <X className="w-6 h-6 text-gray-600" />
            </button>
            <Login />
          </div>
        </div>
      )}

      <div className={`min-h-screen bg-gradient-to-br from-pink-50 to-rose-50 pb-10 ${shouldBlurContent ? 'filter blur-md pointer-events-none' : ''}`}>
        <style>{`
          @keyframes like-pop {
            0% { transform: scale(1); }
            30% { transform: scale(1.4); }
            60% { transform: scale(0.9); }
            100% { transform: scale(1); }
          }

          .animate-like {
            animation: like-pop 0.6s cubic-bezier(0.34, 1.56, 0.64, 1);
          }

          .card-hover {
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          }

          .card-hover:hover {
            transform: translateY(-6px);
            box-shadow: 0 20px 30px -10px rgba(236, 72, 153, 0.3), 0 10px 20px -5px rgba(0, 0, 0, 0.1);
          }

          .filter-sidebar {
            transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          }

          .custom-scrollbar::-webkit-scrollbar {
            width: 6px;
          }

          .custom-scrollbar::-webkit-scrollbar-track {
            background: #fce7f3;
            border-radius: 10px;
          }

          .custom-scrollbar::-webkit-scrollbar-thumb {
            background: linear-gradient(to bottom, #ec4899, #f43f5e);
            border-radius: 10px;
          }

          .custom-scrollbar::-webkit-scrollbar-thumb:hover {
            background: linear-gradient(to bottom, #db2777, #e11d48);
          }

          .shimmer {
            background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.4), transparent);
            background-size: 200% 100%;
            animation: shimmer 2s infinite;
          }

          @keyframes shimmer {
            0% { background-position: -200% 0; }
            100% { background-position: 200% 0; }
          }
        `}</style>

        <div className="border-b border-pink-100 bg-white/80 backdrop-blur-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-0">

            <div className="flex items-center justify-between">
              <div>
                <h3 className="mt-[-8px] text-2xl sm:text-3xl font-bold bg-gradient-to-r from-pink-600 via-rose-600 to-pink-500 bg-clip-text text-transparent">
                  Discover Profiles
                </h3>
              </div>
              <button
                onClick={() => setFiltersOpen(!filtersOpen)}
                className="mt-[-60px] flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-pink-500 to-rose-500 text-white rounded-full font-semibold hover:shadow-lg hover:scale-105 transition-all duration-200 relative overflow-hidden group"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-pink-600 to-rose-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <Filter size={18} className="relative z-10" />
                <span className="hidden sm:inline relative z-10">Filters</span>
                {(biodataType !== "All" || division !== "All" || ageRange[0] !== 18 || ageRange[1] !== 80) && (
                  <span className="bg-white text-pink-600 rounded-full w-5 h-5 text-xs flex items-center justify-center font-bold relative z-10 animate-pulse">
                    !
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>

        {filtersOpen && (
          <div
            className="fixed inset-0 bg-black/60 z-50 backdrop-blur-sm transition-opacity duration-300"
            onClick={() => setFiltersOpen(false)}
          />
        )}

        <div
          className={`fixed top-0 right-0 h-full w-80 sm:w-96 bg-white shadow-2xl z-50 transform transition-transform duration-300 ease-in-out ${filtersOpen ? 'translate-x-0' : 'translate-x-full'
            }`}
        >
          <div className="flex flex-col h-full">
            <div className="bg-gradient-to-r from-pink-500 to-rose-500 p-6 text-white relative overflow-hidden">
              <div className="absolute inset-0 opacity-20">
                <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS13aWR0aD0iMSIvPjwvcGF0dGVybj48L2RlZnM+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNncmlkKSIvPjwvc3ZnPg==')]"></div>
              </div>
              <div className="flex items-center justify-between relative z-10">
                <div>
                  <h2 className="text-2xl font-bold">Filters</h2>
                  <p className="text-sm text-pink-100 mt-1">Refine your search</p>
                </div>
                <button
                  onClick={() => setFiltersOpen(false)}
                  className="p-2 hover:bg-white/20 rounded-full transition-all duration-200 hover:rotate-90"
                >
                  <X size={24} />
                </button>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto custom-scrollbar p-6 space-y-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                  <span className="w-1 h-4 bg-gradient-to-b from-pink-500 to-rose-500 rounded-full"></span>
                  Profile Type
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {["All", "Brides", "Grooms"].map((type) => (
                    <button
                      key={type}
                      onClick={() => setBiodataType(type)}
                      className={`py-2.5 px-3 rounded-lg font-medium text-sm transition-all duration-200 relative overflow-hidden ${biodataType === type
                        ? 'bg-gradient-to-r from-pink-500 to-rose-500 text-white shadow-lg scale-105'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                    >
                      {biodataType === type && (
                        <div className="absolute inset-0 shimmer"></div>
                      )}
                      <span className="relative z-10">{type}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                  <span className="w-1 h-4 bg-gradient-to-b from-pink-500 to-rose-500 rounded-full"></span>
                  Age Range: <span className="text-pink-600">{ageRange[0]} - {ageRange[1]} years</span>
                </label>
                <div className="space-y-4">
                  <div>
                    <label className="text-xs text-gray-600 mb-1 block font-medium">Min Age</label>
                    <input
                      type="range"
                      min="18"
                      max="80"
                      value={ageRange[0]}
                      onChange={(e) => setAgeRange([parseInt(e.target.value), ageRange[1]])}
                      className="w-full h-2 bg-pink-200 rounded-lg appearance-none cursor-pointer accent-pink-500"
                      style={{
                        background: `linear-gradient(to right, #ec4899 0%, #ec4899 ${((ageRange[0] - 18) / 42) * 100}%, #fce7f3 ${((ageRange[0] - 18) / 42) * 100}%, #fce7f3 100%)`
                      }}
                    />
                    <div className="flex justify-between text-xs text-gray-500 mt-1">
                      <span>18</span>
                      <span className="font-semibold text-pink-600">{ageRange[0]}</span>
                    </div>
                  </div>
                  <div>
                    <label className="text-xs text-gray-600 mb-1 block font-medium">Max Age</label>
                    <input
                      type="range"
                      min="18"
                      max="80"
                      value={ageRange[1]}
                      onChange={(e) => setAgeRange([ageRange[0], parseInt(e.target.value)])}
                      className="w-full h-2 bg-pink-200 rounded-lg appearance-none cursor-pointer accent-pink-500"
                      style={{
                        background: `linear-gradient(to right, #ec4899 0%, #ec4899 ${((ageRange[1] - 18) / 42) * 100}%, #fce7f3 ${((ageRange[1] - 18) / 42) * 100}%, #fce7f3 100%)`
                      }}
                    />
                    <div className="flex justify-between text-xs text-gray-500 mt-1">
                      <span className="font-semibold text-pink-600">{ageRange[1]}</span>
                      <span>80</span>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                  <span className="w-1 h-4 bg-gradient-to-b from-pink-500 to-rose-500 rounded-full"></span>
                  Location (State)
                </label>
                <div className="relative">
                  <select
                    value={division}
                    onChange={(e) => setDivision(e.target.value)}
                    className="w-full px-4 py-3 bg-gradient-to-r from-pink-50 to-rose-50 border-2 border-pink-200 rounded-lg appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent text-gray-700 font-medium transition-all duration-200"
                  >
                    <option value="All">All Locations</option>
                    {availableStates.map((state) => (
                      <option key={state} value={state}>
                        {state}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-pink-500 pointer-events-none" size={20} />
                </div>
              </div>
            </div>

            <div className="p-6 border-t border-gray-200 bg-gradient-to-b from-white to-pink-50 space-y-3">
              <button
                onClick={handleResetFilters}
                className="w-full py-3 bg-gray-100 text-gray-700 rounded-lg font-semibold hover:bg-gray-200 transition-all duration-200 border-2 border-gray-200 hover:border-gray-300"
              >
                Reset All Filters
              </button>
              <button
                onClick={() => setFiltersOpen(false)}
                className="w-full py-3 bg-gradient-to-r from-pink-500 to-rose-500 text-white rounded-lg font-semibold hover:shadow-xl transition-all duration-200 relative overflow-hidden group"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-pink-600 to-rose-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <span className="relative z-10">Apply Filters ({filtered.length})</span>
              </button>
            </div>
          </div>
        </div>

        <main className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6 py-6">
          {filtered.length === 0 ? (
            <div className="text-center py-20">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-pink-100 to-rose-100 rounded-full mb-4 animate-pulse">
                <Search className="w-10 h-10 text-pink-500" />
              </div>
              <h3 className="text-xl font-semibold text-gray-700 mb-2">No profiles found</h3>
              <p className="text-gray-500 mb-6">Try adjusting your filters to see more results</p>
              <button
                onClick={handleResetFilters}
                className="px-6 py-2.5 bg-gradient-to-r from-pink-500 to-rose-500 text-white rounded-lg font-semibold hover:shadow-lg transition-all duration-200"
              >
                Reset Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 max-w-6xl mx-auto">
              {filtered.map((profile) => {
                const isFav = favorites.has(profile.id);
                const isAnimating = animatingIds.has(profile.id);

                return (
                  <div
                    key={profile.id}
                    className="bg-white rounded-2xl shadow-lg overflow-hidden flex flex-col card-hover border border-pink-100 relative h-96"
                  >
                    <div
                      className="absolute inset-0 bg-cover bg-center rounded-2xl"
                      style={{
                        backgroundImage: `url(${profile.imageSrc ||
                          profile.profilePhoto ||
                          "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png"
                          })`
                      }}
                    >
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-transparent rounded-2xl"></div>
                    </div>

                    <div className="relative z-10 flex flex-col flex-1 p-5 justify-end">
                      <div className="flex justify-end mb-2">
                        <button
                          onClick={() => toggleFavorite(profile.id)}
                          className={`p-2 rounded-full shadow-lg transform transition-all duration-200 hover:scale-110 ${isFav
                            ? "bg-gradient-to-r from-red-500 to-pink-500 text-white"
                            : "bg-white/90 text-red-500 hover:bg-white"
                            }`}
                          aria-label={isFav ? "Remove favorite" : "Add favorite"}
                        >
                          <div className={isAnimating ? 'animate-like' : ''}>
                            <Heart size={18} fill={isFav ? "white" : "none"} strokeWidth={2.5} />
                          </div>
                        </button>
                      </div>

                      <div className="space-y-3">
                        <div className="flex justify-between items-start">
                          <h3 className="font-bold text-white text-xl mb-1 drop-shadow-lg">
                            {profile.fullName}
                          </h3>
                          <div className="bg-gradient-to-r from-pink-500 to-rose-500 text-white px-3 py-1 rounded-full text-sm font-bold shadow-lg">
                            {profile.age} years
                          </div>
                        </div>

                        <p className="text-white text-base font-medium drop-shadow-lg">
                          {profile.occupation || 'Not specified'}
                        </p>

                        <button
                          onClick={() => handleViewDetails(profile.id)}
                          className="w-full bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white py-3 px-4 rounded-xl text-sm font-semibold transition-all duration-200 shadow-lg hover:shadow-xl relative overflow-hidden group border-2 border-white/20 mt-2"
                        >
                          <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                          <span className="relative z-10">View Profile</span>
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </main>
      </div>
    </>
  );
};
export default BioData;