

import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  User,
  Mail,
  Briefcase,
  Phone,
  MapPin,
  Calendar,
  Heart,
  Globe,
  Lock,
  Check,
  X,
  Camera,
  Trash2,
  Edit3,
  ArrowLeft,
  DollarSign,
  Users,
  Send
} from "lucide-react";

/* -------------------- Detail Card Component -------------------- */
const DetailCard = ({
  icon: Icon,
  label,
  name,
  value,
  editing,
  onChange,
  options,
  type
}: any) => {
  return (
    <div className="bg-gray-50 rounded-lg p-4 hover:bg-gray-100 transition-colors">
      <div className="flex items-start gap-3">
        <div className="w-10 h-10 flex items-center justify-center bg-white rounded-lg shadow-sm shrink-0">
          <Icon size={18} className="text-rose-500" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-xs text-gray-400 uppercase font-semibold mb-1">{label}</p>
          {editing ? (
            options && Array.isArray(options) ? (
              <select
                name={name}
                value={value || ""}
                onChange={onChange}
                className="w-full bg-white border border-gray-300 rounded-md px-3 py-1.5 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-rose-500"
              >
                <option value="">Select</option>
                {options.map((opt: string) => (
                  <option key={opt} value={opt}>{opt}</option>
                ))}
              </select>
            ) : (
              <input
                type={type || "text"}
                name={name}
                value={value || ""}
                onChange={onChange}
                className="w-full bg-white border border-gray-300 rounded-md px-3 py-1.5 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-rose-500"
              />
            )
          ) : (
            <p className="text-base font-semibold text-gray-900 truncate">{value || "-"}</p>
          )}
        </div>
      </div>
    </div>
  );
};

/* -------------------- User List Item Component -------------------- */
const UserListItem = ({ user, type }: any) => {
  const getPhotoUrl = (photo: string | null | undefined) => {
    if (!photo) return undefined;
    if (photo.startsWith("http")) return photo;
    return `http://localhost:5000/uploads/${photo}`;
  };

  return (
    <div className="flex items-center gap-3 p-3 bg-white rounded-lg border border-gray-200 hover:border-rose-300 transition-colors">
      <div className="w-12 h-12 rounded-full overflow-hidden bg-gray-100 flex items-center justify-center border-2 border-white shadow-sm">
        {user.profilePhoto ? (
          <img
            src={getPhotoUrl(user.profilePhoto)}
            alt={user.fullName}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-rose-100 to-pink-200 text-rose-600 font-bold rounded-full">
            {user.fullName?.[0]?.toUpperCase() || "U"}
          </div>
        )}
      </div>
      <div className="flex-1 min-w-0">
        <h4 className="font-semibold text-gray-900 truncate">{user.fullName}</h4>
        <p className="text-sm text-gray-600 truncate">{user.occupation || "Not specified"}</p>
      </div>
      <div className={`px-3 py-1 rounded-full text-xs font-semibold ${type === 'sent'
        ? 'bg-rose-50 text-rose-700 border border-rose-200'
        : 'bg-blue-50 text-blue-700 border border-blue-200'
        }`}>
        {type === 'sent' ? 'Sent' : 'Received'}
      </div>
    </div>
  );
};

const fieldOptions = {
  profileFor: ["Self", "Son", "Daughter", "Brother", "Sister", "Relative", "Friend"],
  genders: ["Male", "Female"],
  religions: ["Hindu", "Christian", "Muslim", "Sikh", "Buddhist", "Jain", "Other"],
  motherTongues: ["Tamil", "Telugu", "Malayalam", "Kannada", "Hindi", "English", "Marathi", "Bengali", "Other"],
  maritalStatuses: ["Never Married", "Divorced", "Widowed", "Awaiting Divorce"],
  heights: ["4.0", "4.1", "4.2", "4.3", "4.4", "4.5", "4.6", "4.7", "4.8", "4.9", "4.10", "4.11", "5.0", "5.1", "5.2", "5.3", "5.4", "5.5", "5.6", "5.7", "5.8", "5.9", "5.10", "5.11", "6.0", "6.1", "6.2", "6.3", "6.4", "6.5"],
  countries: ["India", "USA", "UK", "Canada", "Australia", "Other"],
};

/* -------------------- Main Profile Page -------------------- */
const ProfilePage = () => {
  const [profile, setProfile] = useState<any>(null);
  const [tempProfile, setTempProfile] = useState<any>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [activeSection, setActiveSection] = useState<"Personal" | "Professional" | "Interests" | "Connections">("Professional");
  const [showDeletePopup, setShowDeletePopup] = useState(false);
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [showPrivacyConfirm, setShowPrivacyConfirm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [sentCount, setSentCount] = useState(0);
  const [receivedCount, setReceivedCount] = useState(0);
  const [sentUsers, setSentUsers] = useState<any[]>([]);
  const [receivedUsers, setReceivedUsers] = useState<any[]>([]);
  const [connectionsLoading, setConnectionsLoading] = useState(false);
  const navigate = useNavigate(); // Add this line
  const userId = localStorage.getItem("userId");

  useEffect(() => {
    if (userId) {
      fetchProfile();
      fetchRequestCounts();
    }
  }, [userId]);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`http://localhost:5000/api/register/users/${userId}`);
      const userData = {
        ...res.data.user,
        isPublic: res.data.user.isPublic !== false,
      };
      setProfile(userData);
      setTempProfile(userData);
    } catch (err) {
      console.error("Error fetching profile:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchRequestCounts = async () => {
    try {
      const sentRes = await axios.get(
        `http://localhost:5000/api/request/sentcount/${userId}`
      );
      const receivedRes = await axios.get(
        `http://localhost:5000/api/request/receivedcount/${userId}`
      );

      setSentCount(sentRes.data.count || 0);
      setReceivedCount(receivedRes.data.count || 0);
    } catch (error) {
      console.error("Error fetching request counts:", error);
    }
  };

  const fetchConnectionDetails = async () => {
    try {
      setConnectionsLoading(true);

      // Fetch sent interests with user details
      const sentRes = await axios.get(
        `http://localhost:5000/api/request/sent/${userId}`
      );

      // Fetch received interests with user details  
      const receivedRes = await axios.get(
        `http://localhost:5000/api/request/received-users/${userId}` // Updated endpoint name
      );

      console.log('Sent users:', sentRes.data.users);
      console.log('Received users:', receivedRes.data.users);

      setSentUsers(sentRes.data.users || []);
      setReceivedUsers(receivedRes.data.users || []);
    } catch (error) {
      console.error("Error fetching connection details:", error);
      setSentUsers([]);
      setReceivedUsers([]);
    } finally {
      setConnectionsLoading(false);
    }
  };

  useEffect(() => {
    if (activeSection === "Connections" && userId) {
      fetchConnectionDetails();
    }
  }, [activeSection, userId]);

  const getPhotoUrl = (photo: string | null | undefined) => {
    if (!photo) return undefined;
    if (photo.startsWith("http")) return photo;
    return `http://localhost:5000/uploads/${photo}`;
  };

  const handleChange = (e: any) => {
    setTempProfile({ ...tempProfile, [e.target.name]: e.target.value });
  };

  const handleCancel = () => {
    setTempProfile(profile);
    setIsEditing(false);
    setSelectedFile(null);
  };

  const handleSave = async () => {
    try {
      const formData = new FormData();
      Object.entries(tempProfile).forEach(([key, value]) => {
        if (value !== null && value !== undefined) {
          formData.append(key, value as string);
        }
      });
      if (selectedFile) {
        formData.append("profilePhoto", selectedFile);
      }

      const res = await axios.put(
        `http://localhost:5000/api/register/update/${userId}`,
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      setProfile(res.data.user);
      setTempProfile(res.data.user);
      setIsEditing(false);
      setSelectedFile(null);

      setShowSuccessPopup(true);
      setTimeout(() => setShowSuccessPopup(false), 2000);
    } catch (err) {
      console.error(err);
      alert("Error updating profile.");
    }
  };

  const handlePrivacyToggle = () => {
    if (tempProfile.isPublic) {
      setShowPrivacyConfirm(true);
    } else {
      setTempProfile({ ...tempProfile, isPublic: true });
    }
  };

  const confirmPrivacyChange = () => {
    setTempProfile({ ...tempProfile, isPublic: false });
    setShowPrivacyConfirm(false);
  };
  useEffect(() => {
    const contentBox = document.getElementById("scrollable-box");
    if (contentBox) contentBox.scrollTop = 0;
  }, [activeSection]);
  const handleDeleteAccount = async () => {
    try {
      await axios.delete(`http://localhost/Matrimony-php/backend/api/register/deleteUser.php?id=${userId}`);
      localStorage.clear();
      window.location.href = "/";
    } catch (error) {
      console.error(error);
      alert("Failed to delete account.");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-rose-600 font-bold text-lg">Loading Profile...</div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-gray-600 font-bold">Profile not found</div>
      </div>
    );
  }
  return (
    // **FULL SCREEN CONTAINER**
    <div className="min-h-screen flex bg-white">

      {/* LEFT SIDEBAR - Darker Pink */}
      <div className="w-[28%] min-h-screen bg-pink-200 border-r border-pink-300 p-6 flex flex-col items-center relative">

        {/* Back Button */}

        <button className="absolute top-6 left-6 p-2 rounded-full border border-pink-300 bg-white hover:bg-pink-100 text-rose-600 shadow-sm transition-transform hover:scale-105">
          <ArrowLeft
            onClick={() => navigate("/")}
            className="cursor-pointer"
            size={20}
          />

        </button>

        {/* Profile Image Big */}
        <div className="relative w-44 h-44 mb-8 mt-16">
          <div className="relative z-10 w-full h-full rounded-full overflow-hidden border-4 border-white shadow-lg bg-gray-100">
            {selectedFile ? (
              <img src={URL.createObjectURL(selectedFile)} className="w-full h-full object-cover" />
            ) : profile.profilePhoto ? (
              <img src={getPhotoUrl(profile.profilePhoto)} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-6xl text-gray-400 font-bold bg-gray-200">
                {profile.fullName?.[0]}
              </div>
            )}

            {isEditing && (
              <label className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center cursor-pointer hover:bg-black/50 text-white gap-1">
                <Camera size={22} />
                <span className="text-xs">Change Photo</span>
                <input
                  type="file"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      setSelectedFile(file);
                    }
                  }}
                />
              </label>
            )}
          </div>

          <button
            onClick={() => !isEditing && setIsEditing(true)}
            className={`absolute bottom-0 right-0 z-20 w-9 h-9 rounded-full flex items-center justify-center shadow-lg text-white hover:scale-105 transition-all ${isEditing ? "bg-gray-500" : "bg-rose-600 hover:bg-rose-700"
              }`}
          >
            <Edit3 size={16} />
          </button>
        </div>

        {/* Name, Work, Email */}
        <div className="text-center w-full px-3">
          {isEditing ? (
            <input
              name="fullName"
              value={tempProfile.fullName}
              onChange={handleChange}
              className="text-3xl font-bold text-gray-900 bg-gray-50 border-b-2 border-rose-400 w-full text-center mb-2"
            />
          ) : (
            <h1 className="text-3xl font-extrabold text-gray-900 mb-3 truncate">
              {profile.fullName}
            </h1>
          )}

          <div className="flex items-center justify-center gap-2 text-gray-700 text-base font-semibold mb-1">
            <Briefcase size={16} className="text-rose-600" />
            <span>{profile.occupation}</span>
          </div>

          <div className="flex items-center justify-center gap-2 text-gray-600 text-sm">
            <Mail size={16} className="text-rose-600" />
            <span className="truncate max-w-[200px] font-medium">{profile.email}</span>
          </div>
        </div>
      </div>

      {/* ================= RIGHT CONTENT (Scrollable) ================= */}
      <div className="col-span-12 md:col-span-9 lg:col-span-9 h-full flex flex-col bg-white p-0 md:p-5">

        {/* 1. TOP BUTTONS (Tabs) */}
        <div className="flex flex-wrap gap-2 mb-6 border-b border-gray-100 pb-4 shrink-0">
          <button
            onClick={() => setActiveSection("Personal")}
            className={`px-4 py-2 rounded-xl text-sm font-bold transition-all flex items-center gap-2 shadow-sm ${activeSection === "Personal" ? "bg-rose-600 text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}
          >
            <User size={14} /> Personal Info
          </button>
          <button
            onClick={() => setActiveSection("Professional")}
            className={`px-4 py-2 rounded-xl text-sm font-bold transition-all flex items-center gap-2 shadow-sm ${activeSection === "Professional" ? "bg-rose-600 text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}
          >
            <Briefcase size={14} /> Professional Info
          </button>
          <button
            onClick={() => setActiveSection("Connections")}
            className={`px-4 py-3 rounded-t-lg text-sm font-semibold transition-all whitespace-nowrap ${activeSection === "Connections"
              ? "bg-rose-600 text-white"
              : "text-gray-600 hover:bg-gray-100"
              }`}
          >
            <div className="flex items-center gap-2">
              <Users size={16} />
              Connections ({sentCount + receivedCount})
            </div>
          </button>
        </div>

        {/* Edit Mode Controls */}
        {isEditing && (
          <div className="flex items-center justify-end gap-3 mb-4 shrink-0">
            <button onClick={handleCancel} className="bg-white text-gray-600 px-4 py-2 rounded-xl font-bold text-sm hover:bg-gray-100 border border-gray-300 flex items-center gap-1 transition-colors">
              <X size={16} /> Cancel
            </button>
            <button onClick={handleSave} className="bg-black text-white px-5 py-2 rounded-xl font-bold text-sm hover:bg-gray-800 shadow-md flex items-center gap-1 transition-colors">
              <Check size={16} /> Save Changes
            </button>
          </div>
        )}
        {/* Added scrollbar styling for better look */}
        <style>{` 
            .custom-scrollbar::-webkit-scrollbar {
                width: 6px;
            }
            .custom-scrollbar::-webkit-scrollbar-thumb {
                background-color: #e5e7eb; /* Gray-200 */
                border-radius: 10px;
            }
          `}</style>
        <div
          id="scrollable-box"
          className="h-[75vh] overflow-y-auto px-10 pr-35 custom-scrollbar"
        >


          {/* Personal Info Section */}
          {activeSection === "Personal" && (
            <div className="space-y-8">
              <div>
                <h3 className="text-xs font-bold text-gray-400 uppercase mb-4 flex items-center gap-2">
                  <span className="w-1 h-4 bg-rose-500 rounded-full"></span>
                  Basic Details
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  <DetailCard icon={User} label="Profile For" name="profileFor" value={tempProfile.profileFor} editing={isEditing} onChange={handleChange} options={fieldOptions.profileFor} />
                  <DetailCard icon={User} label="Gender" name="gender" value={tempProfile.gender} editing={isEditing} onChange={handleChange} options={fieldOptions.genders} />
                  <DetailCard icon={Calendar} label="Date of Birth" name="dob" value={tempProfile.dob} editing={isEditing} onChange={handleChange} type="date" />
                  <DetailCard icon={Calendar} label="Age" name="age" value={tempProfile.age} editing={isEditing} onChange={handleChange} type="number" />
                  <DetailCard icon={User} label="Height" name="height" value={tempProfile.height} editing={isEditing} onChange={handleChange} options={fieldOptions.heights} />
                </div>
              </div>

              <div>
                <h3 className="text-xs font-bold text-gray-400 uppercase mb-4 flex items-center gap-2">
                  <span className="w-1 h-4 bg-rose-500 rounded-full"></span>
                  Cultural & Social
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  <DetailCard icon={Globe} label="Religion" name="religion" value={tempProfile.religion} editing={isEditing} onChange={handleChange} options={fieldOptions.religions} />
                  <DetailCard icon={Globe} label="Mother Tongue" name="motherTongue" value={tempProfile.motherTongue} editing={isEditing} onChange={handleChange} options={fieldOptions.motherTongues} />
                  <DetailCard icon={Heart} label="Marital Status" name="maritalStatus" value={tempProfile.maritalStatus} editing={isEditing} onChange={handleChange} options={fieldOptions.maritalStatuses} />
                  <DetailCard icon={User} label="Caste" name="caste" value={tempProfile.caste} editing={isEditing} onChange={handleChange} />
                </div>
              </div>
            </div>
          )}

          {/* Professional Info Section */}
          {activeSection === "Professional" && (
            <div className="space-y-8">
              <div>
                <h3 className="text-xs font-bold text-gray-400 uppercase mb-4 flex items-center gap-2">
                  <span className="w-1 h-4 bg-rose-500 rounded-full"></span>
                  Career Details
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  <DetailCard icon={Briefcase} label="Education" name="education" value={tempProfile.education} editing={isEditing} onChange={handleChange} />
                  <DetailCard icon={Briefcase} label="Occupation" name="occupation" value={tempProfile.occupation} editing={isEditing} onChange={handleChange} />
                  <DetailCard icon={DollarSign} label="Annual Income" name="annualIncome" value={tempProfile.annualIncome} editing={isEditing} onChange={handleChange} />
                </div>
              </div>

              <div>
                <h3 className="text-xs font-bold text-gray-400 uppercase mb-4 flex items-center gap-2">
                  <span className="w-1 h-4 bg-rose-500 rounded-full"></span>
                  Location & Contact
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  <DetailCard icon={Globe} label="Country" name="country" value={tempProfile.country} editing={isEditing} onChange={handleChange} options={fieldOptions.countries} />
                  <DetailCard icon={MapPin} label="State" name="state" value={tempProfile.state} editing={isEditing} onChange={handleChange} />
                  <DetailCard icon={MapPin} label="City" name="city" value={tempProfile.city} editing={isEditing} onChange={handleChange} />
                  <DetailCard icon={Mail} label="Email" name="email" value={tempProfile.email} editing={false} onChange={handleChange} />
                  <DetailCard icon={Phone} label="Mobile" name="mobile" value={tempProfile.mobile} editing={isEditing} onChange={handleChange} type="tel" />
                </div>
              </div>
            </div>
          )}


          {activeSection === "Connections" && (
            <div className="space-y-8">
              {/* Sent Interests */}
              <div>
                <h3 className="text-xs font-bold text-gray-400 uppercase mb-4 flex items-center gap-2">
                  <span className="w-1 h-4 bg-rose-500 rounded-full"></span>
                  Interests Sent By You ({sentUsers.length})
                </h3>
                {connectionsLoading ? (
                  <div className="text-center py-8">
                    <div className="text-rose-600 font-bold">Loading connections...</div>
                  </div>
                ) : sentUsers.length > 0 ? (
                  <div className="bg-white rounded-xl border border-gray-200 p-6">
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
                      {sentUsers.map((user) => (
                        <div key={user._id} className="flex flex-col items-center text-center group">
                          <div className="relative mb-3">
                            <div className="w-20 h-20 rounded-full overflow-hidden bg-gradient-to-br from-rose-100 to-pink-200 border-4 border-white shadow-lg group-hover:border-rose-300 transition-all duration-300">
                              {user.profilePhoto ? (
                                <img
                                  src={getPhotoUrl(user.profilePhoto)}
                                  alt={user.fullName}
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center text-2xl text-rose-600 font-bold">
                                  {user.fullName?.[0]?.toUpperCase() || "U"}
                                </div>
                              )}
                            </div>
                            <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-rose-500 rounded-full border-2 border-white flex items-center justify-center">
                              <Send size={10} className="text-white" />
                            </div>
                          </div>
                          <h4 className="font-semibold text-gray-900 text-sm mb-1 truncate w-full">{user.fullName}</h4>
                          <p className="text-xs text-gray-600 truncate w-full">{user.occupation || "Not specified"}</p>
                          <div className="mt-2 px-2 py-1 bg-rose-50 text-rose-700 rounded-full text-xs font-semibold">
                            Sent
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-12 bg-gray-50 rounded-xl border border-gray-200">
                    <Send size={48} className="mx-auto text-gray-400 mb-4" />
                    <p className="text-gray-600 font-semibold text-lg mb-2">No interests sent yet</p>
                    <p className="text-gray-500 text-sm">Start exploring profiles and send interests to connect with others</p>
                  </div>
                )}
              </div>

              {/* Received Interests */}
              <div>
                <h3 className="text-xs font-bold text-gray-400 uppercase mb-4 flex items-center gap-2">
                  <span className="w-1 h-4 bg-blue-500 rounded-full"></span>
                  Interests Received From Others ({receivedUsers.length})
                </h3>
                {connectionsLoading ? (
                  <div className="text-center py-8">
                    <div className="text-rose-600 font-bold">Loading connections...</div>
                  </div>
                ) : receivedUsers.length > 0 ? (
                  <div className="bg-white rounded-xl border border-gray-200 p-6">
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
                      {receivedUsers.map((user) => (
                        <div key={user._id} className="flex flex-col items-center text-center group">
                          <div className="relative mb-3">
                            <div className="w-20 h-20 rounded-full overflow-hidden bg-gradient-to-br from-blue-100 to-cyan-200 border-4 border-white shadow-lg group-hover:border-blue-300 transition-all duration-300">
                              {user.profilePhoto ? (
                                <img
                                  src={getPhotoUrl(user.profilePhoto)}
                                  alt={user.fullName}
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center text-2xl text-blue-600 font-bold">
                                  {user.fullName?.[0]?.toUpperCase() || "U"}
                                </div>
                              )}
                            </div>
                            <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-blue-500 rounded-full border-2 border-white flex items-center justify-center">
                              <Users size={10} className="text-white" />
                            </div>
                          </div>
                          <h4 className="font-semibold text-gray-900 text-sm mb-1 truncate w-full">{user.fullName}</h4>
                          <p className="text-xs text-gray-600 truncate w-full">{user.occupation || "Not specified"}</p>
                          <div className="mt-2 px-2 py-1 bg-blue-50 text-blue-700 rounded-full text-xs font-semibold">
                            Received
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-12 bg-gray-50 rounded-xl border border-gray-200">
                    <Users size={48} className="mx-auto text-gray-400 mb-4" />
                    <p className="text-gray-600 font-semibold text-lg mb-2">No interests received yet</p>
                    <p className="text-gray-500 text-sm">Your profile will appear to others when they search for matches</p>
                  </div>
                )}
              </div>
            </div>
          )}

        </div>

      </div>

      {/* --- POPUPS (Same as before, with minor color updates) --- */}
      {showPrivacyConfirm && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-xs text-center">
            <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <Lock className="w-6 h-6 text-gray-600" />
            </div>
            <h2 className="text-lg font-bold text-gray-800 mb-2">Change Profile Visibility?</h2>
            <p className="text-sm text-gray-500 mb-4">Are you sure you want to change your profile to **Private**? This will limit who can view your profile.</p>
            <div className="flex gap-2 mt-4">
              <button onClick={() => setShowPrivacyConfirm(false)} className="flex-1 bg-gray-100 text-gray-800 py-2 rounded-lg text-sm font-bold hover:bg-gray-200">Cancel</button>
              <button onClick={confirmPrivacyChange} className="flex-1 bg-rose-600 text-white py-2 rounded-lg text-sm font-bold hover:bg-rose-700">Yes, Make Private</button>
            </div>
          </div>
        </div>
      )}

      {showDeletePopup && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-xs text-center">
            <div className="w-12 h-12 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-3">
              <Trash2 className="w-6 h-6 text-red-500" />
            </div>
            <h2 className="text-lg font-bold text-gray-800 mb-2">Delete Account?</h2>
            <p className="text-sm text-gray-500 mb-4">This action cannot be undone. All your data will be permanently lost.</p>
            <div className="flex gap-2 mt-4">
              <button onClick={() => setShowDeletePopup(false)} className="flex-1 bg-gray-100 text-gray-800 py-2 rounded-lg text-sm font-bold hover:bg-gray-200">Cancel</button>
              <button onClick={handleDeleteAccount} className="flex-1 bg-red-600 text-white py-2 rounded-lg text-sm font-bold hover:bg-red-700">Yes, Delete</button>
            </div>
          </div>
        </div>
      )}

      {showSuccessPopup && (
        <div className="fixed inset-0 flex items-end justify-center z-50 pb-10 pointer-events-none">
          <div className="bg-black text-white px-5 py-3 rounded-full shadow-2xl flex items-center gap-2 animate-bounce">
            <Check size={16} className="text-green-400" /> <span className="text-sm font-bold">Profile Updated Successfully!</span>
          </div>
        </div>
      )}

    </div>
  );
};

export default ProfilePage;