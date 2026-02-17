import React, { useState, useEffect } from 'react';
import {
    Mail, Phone, MapPin, Cake, Ruler, Briefcase, Heart,
    ChevronLeft, ChevronRight, GraduationCap, DollarSign, Globe,
    Users, BookOpen, Clock, Lock
} from 'lucide-react';
import { useParams, useNavigate } from "react-router-dom";
import axios from 'axios';
import Swal from 'sweetalert2'; // 🌟 Import SweetAlert2
import 'sweetalert2/dist/sweetalert2.min.css';
// Interface definitions
interface UserProfile {
    id: number;
    profileFor: string;
    fullName: string;
    gender: string;
    dob: string;
    age: number;
    religion: string;
    motherTongue: string;
    maritalStatus: string;
    caste: string;
    height: string;
    education: string;
    occupation: string;
    annualIncome: string;
    country: string;
    state: string;
    city: string;
    email: string;
    mobile: string;
    profilePhoto: string | null;
    createdAt: string;
    isPublic: boolean;
}

interface RelatedProfile {
    id: number;
    name: string;
    age: number;
    city: string;
    profilePhoto: string;
}

// Helper component for detail items
interface DetailItemProps {
    icon: React.ElementType;
    label: string;
    value: string | number;
    color: string;
}

const DetailItem: React.FC<DetailItemProps> = ({ icon: Icon, label, value, color }) => (
    <div className="flex items-start p-3 border-b border-gray-100 last:border-b-0 min-w-0">
        <Icon className={`w-4 h-4 sm:w-5 sm:h-5 ${color} flex-shrink-0 mt-1`} />
        <div className="ml-3 flex flex-col min-w-0 flex-1">
            <span className="text-[10px] sm:text-xs font-medium text-gray-500 uppercase tracking-wider truncate">
                {label}
            </span>
            <span className="text-sm sm:text-base font-semibold text-gray-800 break-words">
                {value}
            </span>
        </div>
    </div>
);

// Helper component for Info Cards in the Hero Section
interface InfoCardProps {
    icon: React.ElementType;
    label: string;
    value: string | number;
}

const InfoCard: React.FC<InfoCardProps> = ({ icon: Icon, label, value }) => (
    <div className="bg-white rounded-lg p-2.5 sm:p-3 shadow-md border border-gray-100 text-center flex flex-col justify-center items-center min-h-[80px] sm:min-h-[90px] w-full">
        <Icon className="w-4 h-4 sm:w-5 sm:h-5 text-indigo-600 mb-1" />
        <div className="text-[10px] sm:text-xs font-medium text-gray-500 uppercase truncate max-w-full px-1">
            {label}
        </div>
        <div className="text-xs sm:text-sm md:text-lg font-bold text-gray-900 truncate max-w-full px-1">
            {value}
        </div>
    </div>
);

const ProfileDetails: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();

    // State management
    const [user, setUser] = useState<UserProfile | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isFavorite, setIsFavorite] = useState(false);
    const [showContactInfo, setShowContactInfo] = useState(false);
    const [relatedProfiles, setRelatedProfiles] = useState<RelatedProfile[]>([]);
    const [currentSlide, setCurrentSlide] = useState(0);
    const [requestStatus, setRequestStatus] = useState<string>("none");


    const handleRevealContact = () => {
  if (requestStatus === "accepted") {
    setShowContactInfo(true);
    Swal.fire({
      icon: 'success',
      title: 'Contact Unlocked 🔓',
      text: 'You can now view contact details!',
      confirmButtonColor: '#22c55e'
    });
  } else {
    Swal.fire({
      icon: 'warning',
      title: 'Access Restricted',
      text: 'This profile is private. You must send an interest request and have it accepted to view contact details.',
      confirmButtonColor: '#f43f5e'
    });
  }
};

    // Responsive profiles per view
    const getProfilesPerView = () => {
        if (typeof window === 'undefined') return 2;
        const width = window.innerWidth;
        if (width >= 1024) return 4;
        if (width >= 640) return 3;
        if (width >= 475) return 2;
        return 2;
    };

    const fetchProfileData = async () => {
        if (!id) return;
        try {
            setLoading(true);
            setError(null);

            const userRes = await axios.get(`http://localhost:5000/api/register/users/${id}`);
            setUser(userRes.data.user);

            const relatedRes = await axios.get(`http://localhost:5000/api/register/related/${id}`);
            setRelatedProfiles(relatedRes.data.relatedProfiles);
        } catch (err: any) {
            console.error('Fetch error:', err);
            setError('Failed to load profile details or related profiles.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProfileData();
    }, [id]);

    useEffect(() => {
        const fetchStatus = async () => {
            try {
                const loggedInUserId = localStorage.getItem("userId");
                if (!loggedInUserId || !id) return;

                const res = await axios.get(`http://localhost:5000/api/request/status`, {
                    params: { senderId: loggedInUserId, receiverId: id },
                });

                setRequestStatus(res.data.status);
            } catch (err) {
                console.error("Error checking request status:", err);
            }
        };

        if (user && !user.isPublic) {
            fetchStatus();
        } else if (user && user.isPublic) {
            setRequestStatus("n/a");
        }
    }, [id, user]);

    // Carousel controls
    const nextSlide = () => {
        const currentPpv = getProfilesPerView();
        setCurrentSlide((prev) => {
            if (prev + currentPpv >= relatedProfiles.length) {
                return 0;
            }
            return prev + 1;
        });
    };

    const prevSlide = () => {
        const currentPpv = getProfilesPerView();
        const maxIndex = relatedProfiles.length - currentPpv;
        setCurrentSlide((prev) => {
            if (prev === 0) {
                return Math.max(0, maxIndex);
            }
            return prev - 1;
        });
    };

    useEffect(() => {
        const handleResize = () => {
            setCurrentSlide(0);
        };
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    // Send Interest Handler
   const handleSendInterest = async () => {
        try {
            const loggedInUserId = localStorage.getItem("userId");
            if (!loggedInUserId) {
                Swal.fire({
                    icon: 'warning',
                    title: 'Login Required',
                    text: 'Please log in to send a request!',
                    confirmButtonColor: '#f43f5e',
                    confirmButtonText: 'Go to Login'
                }).then(() => navigate('/login'));
                return;
            }

            const res = await axios.post("http://localhost:5000/api/request/send", {
                senderId: Number(loggedInUserId),
                receiverId: user!.id,
            });

            Swal.fire({
                icon: 'success',
                title: 'Interest Sent 💌',
                text: res.data.message,
                confirmButtonColor: '#10b981'
            });
            setRequestStatus("pending");
        } catch (err: any) {
            if (err.response?.status === 403) {
                Swal.fire({
                    icon: 'info',
                    title: 'Premium Members Only 💎',
                    text: 'You can only send requests to premium members.',
                    confirmButtonColor: '#f97316'
                });
            } else {
                Swal.fire({
                    icon: 'error',
                    title: 'Failed to Send',
                    text: err.response?.data?.message || "Something went wrong.",
                    confirmButtonColor: '#ef4444'
                });
            }
        }
    };


    // Loading/Error States
    if (loading) return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <div className="text-center py-10 px-4">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
                <p className="text-base sm:text-lg text-gray-600">Loading profile...</p>
            </div>
        </div>
    );

    if (error) return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
            <div className="text-center py-10">
                <p className="text-base sm:text-lg text-red-600 font-semibold">{error}</p>
            </div>
        </div>
    );

    if (!user) return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
            <div className="text-center py-10">
                <p className="text-base sm:text-lg text-gray-600">Profile not found.</p>
            </div>
        </div>
    );

    // Carousel card width calculation
    const getCardWidthStyle = () => {
        const ppv = getProfilesPerView();
        const gap = 12; // gap-3 = 12px
        return {
            width: `calc(${100 / ppv}% - ${((ppv - 1) * gap) / ppv}px)`,
            minWidth: '140px'
        };
    };

    return (
        <div className="min-h-screen bg-gray-50 font-sans overflow-x-hidden mt-17">
            <div className="w-full max-w-6xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 pt-4 sm:pt-8 md:pt-12 pb-8">
                {/* Back Button */}
                <button
                    onClick={() => navigate(-1)}
                    className="mb-4 sm:mb-6 md:mb-8 px-3 py-2 sm:px-4 sm:py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-md font-medium transition-colors flex items-center gap-2 text-xs sm:text-sm shadow-sm"
                >
                    <ChevronLeft className="w-4 h-4" />
                    <span className="hidden xs:inline">Back to Listings</span>
                    <span className="xs:hidden">Back</span>
                </button>

                {/* PROFILE DETAILS HERO SECTION */}
                <div className="bg-white rounded-lg sm:rounded-xl shadow-xl sm:shadow-2xl shadow-gray-200 overflow-hidden border border-gray-100">
                    <div className="grid md:grid-cols-3 lg:grid-cols-4">
                        {/* Left Side - Image and Primary Info */}
                        <div className="md:col-span-1 bg-gradient-to-br from-gray-800 to-gray-900 p-4 sm:p-6 flex flex-col items-center justify-center text-white space-y-3 sm:space-y-4">
                            <div className="relative p-1 bg-white rounded-lg shadow-xl w-full max-w-[200px] sm:max-w-none">
                                <div className="w-full aspect-[4/5] rounded-md overflow-hidden flex items-center justify-center bg-gradient-to-br from-pink-600 to-purple-700">
                                    {user.profilePhoto ? (
                                        <img
                                            src={user.profilePhoto}
                                            alt={user.fullName}
                                            className="w-full h-full object-cover object-center"
                                        />
                                    ) : (
                                        <span
                                            className="text-7xl font-bold text-white"
                                            style={{
                                                fontFamily: "'Brush Script MT', cursive",
                                            }}
                                        >
                                            {user.fullName?.charAt(0)?.toUpperCase() || "?"}
                                        </span>
                                    )}
                                </div>
                            </div>

                            <h1 className="text-xl sm:text-2xl font-bold text-center mt-2 truncate max-w-full px-2">
                                {user.fullName}
                            </h1>
                            <p className="text-xs sm:text-sm font-light opacity-80 text-center px-2">
                                {user.occupation}
                            </p>
                            <div className="flex items-center space-x-2 text-xs sm:text-sm">
                                <MapPin className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
                                <span className="truncate">
                                    {user.city}, {user.country}
                                </span>
                            </div>

                            {/* Send Interest Button */}
                            {!user.isPublic && (
                                <div className="w-full pt-2 px-2">
                                    {requestStatus === "none" || requestStatus === "rejected" ? (
                                        <button
                                            onClick={handleSendInterest}
                                            className="w-full flex items-center justify-center gap-2 
                     bg-gradient-to-r from-pink-500 via-rose-500 to-red-500 
                     text-white py-2.5 sm:py-3 px-4 sm:px-6 rounded-lg sm:rounded-xl 
                     font-semibold text-xs sm:text-sm
                     shadow-lg shadow-pink-300/40 
                     hover:shadow-xl hover:shadow-pink-400/50 
                     hover:scale-[1.02] active:scale-95 
                     transition-all duration-300 ease-in-out group"
                                        >
                                            <Heart className="w-4 h-4 group-hover:animate-pulse" />
                                            <span>Send Interest</span>
                                        </button>
                                    ) : requestStatus === "pending" ? (
                                        <button
                                            disabled
                                            className="w-full flex items-center justify-center gap-2 
                     bg-yellow-400 text-gray-800 py-2.5 sm:py-3 px-4 sm:px-6 
                     rounded-lg sm:rounded-xl font-semibold text-xs sm:text-sm
                     shadow-md cursor-not-allowed opacity-90"
                                        >
                                            <Clock className="w-4 h-4 animate-pulse" />
                                            <span>Request Pending</span>
                                        </button>
                                    ) : requestStatus === "accepted" ? (
                                        <button
                                            disabled
                                            className="w-full flex items-center justify-center gap-2 
                     bg-green-600 text-white py-2.5 sm:py-3 px-4 sm:px-6 
                     rounded-lg sm:rounded-xl font-semibold text-xs sm:text-sm
                     shadow-md cursor-not-allowed"
                                        >
                                            <Heart className="w-4 h-4 fill-current" />
                                            <span>Request Accepted</span>
                                        </button>
                                    ) : null}
                                </div>
                            )}
                        </div>


                        {/* Right Side - Quick Info Cards & Contact */}
                        <div className="md:col-span-2 lg:col-span-3 p-4 sm:p-6 md:p-8">
                            {/* Header */}
                            <div className="flex flex-col xs:flex-row justify-between items-start xs:items-center gap-2 xs:gap-0 border-b pb-3 sm:pb-4 mb-4 sm:mb-6">
                                <span className="text-xs sm:text-sm font-bold text-indigo-600 uppercase tracking-widest">
                                    {user.profileFor} Profile
                                </span>
                                <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] sm:text-xs font-semibold ${user.isPublic
                                        ? "bg-green-100 text-green-700"
                                        : "bg-red-100 text-red-700"
                                    }`}>
                                    {user.isPublic ? <Globe className="w-3 h-3" /> : <Lock className="w-3 h-3" />}
                                    {user.isPublic ? "Public" : "Private"}
                                </div>
                            </div>

                            {/* Quick Stats Grid */}
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-2 sm:gap-3 md:gap-4 mb-6 sm:mb-8">
                                <InfoCard icon={Cake} label="Age" value={`${user.age} Yrs`} />
                                <InfoCard icon={Ruler} label="Height" value={user.height} />
                                <InfoCard icon={Briefcase} label="Status" value={user.maritalStatus} />
                                <InfoCard icon={MapPin} label="Location" value={user.state} />
                            </div>

                            {/* Detailed Information & Contact Sections */}
                            <div className="grid lg:grid-cols-2 gap-4 sm:gap-6 md:gap-8">
                                {/* Detailed Information Panel */}
                                <div className="border border-gray-200 rounded-lg overflow-hidden">
                                    <h3 className="text-sm sm:text-base md:text-lg font-bold text-gray-800 p-3 sm:p-4 border-b bg-gray-50">
                                        Detailed Information
                                    </h3>
                                    <div className="divide-y divide-gray-100">
                                        <DetailItem icon={Users} label="Gender" value={user.gender} color="text-pink-600" />
                                        <DetailItem icon={BookOpen} label="Religion" value={user.religion} color="text-amber-600" />
                                        <DetailItem icon={GraduationCap} label="Education" value={user.education} color="text-indigo-600" />
                                        <DetailItem icon={DollarSign} label="Income" value={user.annualIncome} color="text-green-600" />
                                        <DetailItem icon={Globe} label="Mother Tongue" value={user.motherTongue} color="text-blue-600" />
                                        <DetailItem icon={Clock} label="Profile Date" value={new Date(user.createdAt).toLocaleDateString()} color="text-gray-600" />
                                    </div>
                                </div>

                                {/* Contact Info Panel */}
                                <div className="border border-gray-200 rounded-lg overflow-hidden h-fit">
                                    <h3 className="text-sm sm:text-base md:text-lg font-bold text-gray-800 p-3 sm:p-4 border-b bg-gray-50">
                                        Contact Details
                                    </h3>
                                    <div className="p-3 sm:p-4 space-y-3 sm:space-y-4">
                                        {user.isPublic ? (
                                            <div className="space-y-3">
                                                <div className="flex items-center gap-2 sm:gap-3 text-gray-700 break-all">
                                                    <Phone className="w-4 h-4 sm:w-5 sm:h-5 text-indigo-600 flex-shrink-0" />
                                                    <span className="text-xs sm:text-sm md:text-base font-medium">{user.mobile}</span>
                                                </div>
                                                <div className="flex items-center gap-2 sm:gap-3 text-gray-700 break-all">
                                                    <Mail className="w-4 h-4 sm:w-5 sm:h-5 text-indigo-600 flex-shrink-0" />
                                                    <span className="text-xs sm:text-sm md:text-base font-medium">{user.email}</span>
                                                </div>
                                                <p className="text-[10px] sm:text-xs text-gray-500 mt-2 text-center">
                                                    This profile is public. Contact details are visible.
                                                </p>
                                            </div>
                                        ) : showContactInfo ? (
                                            <div className="space-y-3">
                                                <div className="flex items-center gap-2 sm:gap-3 text-gray-700 break-all">
                                                    <Phone className="w-4 h-4 sm:w-5 sm:h-5 text-indigo-600 flex-shrink-0" />
                                                    <span className="text-xs sm:text-sm md:text-base font-medium">{user.mobile}</span>
                                                </div>
                                                <div className="flex items-center gap-2 sm:gap-3 text-gray-700 break-all">
                                                    <Mail className="w-4 h-4 sm:w-5 sm:h-5 text-indigo-600 flex-shrink-0" />
                                                    <span className="text-xs sm:text-sm md:text-base font-medium">{user.email}</span>
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="space-y-3 sm:space-y-4 text-center">
                                                <div className="space-y-2">
                                                    <div className="flex items-center justify-center gap-2 text-gray-400">
                                                        <Phone className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" />
                                                        <span className="text-xs sm:text-sm font-mono">••••••••</span>
                                                    </div>
                                                    <div className="flex items-center justify-center gap-2 text-gray-400">
                                                        <Mail className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" />
                                                        <span className="text-xs sm:text-sm font-mono">••••••••</span>
                                                    </div>
                                                </div>
                                               <button
  onClick={handleRevealContact}
  className="w-full px-4 py-2 sm:py-2.5 
           bg-gradient-to-r from-pink-500 to-rose-600 
           text-white rounded-lg font-semibold text-xs sm:text-sm 
           hover:from-pink-600 hover:to-rose-700 
           shadow-md hover:shadow-lg
           transition-all duration-300"
>
  {requestStatus === 'accepted' ? ' Reveal Contact' : ' Contact Locked'}
</button>

                                                <p className="text-[10px] sm:text-xs text-gray-500">
                                                    {requestStatus === 'accepted'
                                                        ? "Request accepted! Click to reveal."
                                                        : "Send interest request to unlock."
                                                    }
                                                </p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Related Profiles Section */}
                <div className="mt-8 sm:mt-12 md:mt-16">
                    <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-800 mb-4 sm:mb-6 border-b pb-2">
                        Similar Profiles
                    </h2>
                    {relatedProfiles.length > 0 ? (
                        <div className="relative px-8 sm:px-10">
                            {/* Previous Button */}
                            <button
                                onClick={prevSlide}
                                className="absolute left-0 top-1/2 -translate-y-1/2 z-10 
                                         w-7 h-7 sm:w-8 sm:h-8 md:w-10 md:h-10 
                                         bg-gradient-to-br from-gray-700 to-gray-900 
                                         text-white rounded-full flex items-center justify-center 
                                         hover:from-gray-800 hover:to-black
                                         transition-all shadow-lg hover:shadow-xl 
                                         disabled:opacity-40 disabled:cursor-not-allowed
                                         hover:scale-110 active:scale-95"
                                disabled={relatedProfiles.length <= getProfilesPerView()}
                            >
                                <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
                            </button>

                            {/* Carousel Container */}
                            <div className="overflow-hidden">
                                <div
                                    className="flex gap-3 transition-transform duration-500 ease-out"
                                    style={{ transform: `translateX(-${currentSlide * (100 / getProfilesPerView())}%)` }}
                                >
                                    {relatedProfiles.map((profile) => (
                                        <div
                                            key={profile.id}
                                            className="flex-shrink-0 bg-white rounded-lg shadow-md overflow-hidden 
                                                     border border-gray-100 hover:shadow-xl 
                                                     hover:-translate-y-1 transition-all duration-300 cursor-pointer
                                                     group"
                                            style={getCardWidthStyle()}
                                            onClick={() => navigate(`/profiledetails/${profile.id}`)}
                                        >
                                            <div className="relative h-40 sm:h-48 md:h-56 overflow-hidden">
                                                <img
                                                    src={profile.profilePhoto || 'https://via.placeholder.com/300?text=No+Photo'}
                                                    alt={profile.name}
                                                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                                />
                                                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"></div>
                                                <div className="absolute bottom-0 left-0 right-0 text-white p-2 sm:p-3">
                                                    <div className="flex items-center justify-center gap-1.5 bg-white/20 backdrop-blur-sm rounded-full px-2 py-1 w-fit mx-auto">
                                                        <Cake className="w-3 h-3" />
                                                        <span className="text-xs sm:text-sm font-semibold">{profile.age} Years</span>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="p-2.5 sm:p-3 text-center bg-gradient-to-b from-white to-gray-50">
                                                <h3 className="font-bold text-gray-800 mb-1 text-sm sm:text-base truncate">
                                                    {profile.name}
                                                </h3>
                                                <div className="flex items-center justify-center gap-1 text-gray-600">
                                                    <MapPin className="w-3 h-3 flex-shrink-0" />
                                                    <p className="text-xs sm:text-sm truncate">{profile.city}</p>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Next Button */}
                            <button
                                onClick={nextSlide}
                                className="absolute right-0 top-1/2 -translate-y-1/2 z-10 
                                         w-7 h-7 sm:w-8 sm:h-8 md:w-10 md:h-10 
                                         bg-gradient-to-br from-gray-700 to-gray-900 
                                         text-white rounded-full flex items-center justify-center 
                                         hover:from-gray-800 hover:to-black
                                         transition-all shadow-lg hover:shadow-xl 
                                         disabled:opacity-40 disabled:cursor-not-allowed
                                         hover:scale-110 active:scale-95"
                                disabled={relatedProfiles.length <= getProfilesPerView()}
                            >
                                <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
                            </button>
                        </div>
                    ) : (
                        <div className="text-center py-12 sm:py-16 bg-white rounded-lg border border-gray-200">
                            <Users className="w-12 h-12 sm:w-16 sm:h-16 text-gray-300 mx-auto mb-3 sm:mb-4" />
                            <p className="text-sm sm:text-base text-gray-500">No similar profiles found at the moment.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};


export default ProfileDetails;
