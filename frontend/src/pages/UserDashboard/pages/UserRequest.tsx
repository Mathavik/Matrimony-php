import React, { useState, useEffect } from "react";
import axios from "axios";
import { Check, X, Search, Eye } from "lucide-react";

// Interface for User Request data
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

// ⭐⭐⭐ Custom Event Function: Count-ஐ சேமித்து, Event-ஐத் தூண்டுகிறது ⭐⭐⭐
// இதை UserDashboardHeader-உம் பயன்படுத்தும் வகையில் export செய்யப்படுகிறது.
export const dispatchRequestCountUpdate = (count: number) => {
    localStorage.setItem('pendingRequestCount', count.toString());
    window.dispatchEvent(new Event('requestCountUpdated'));
};
// ⭐⭐⭐

const UserRequest: React.FC = () => {
    const [requests, setRequests] = useState<UserRequest[]>([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [loading, setLoading] = useState(true);
    const [selectedSender, setSelectedSender] = useState<UserRequest["sender"] | null>(null);

    const BASE_URL = "http://localhost/Matrimony-php/backend";

    const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

    const showMessage = (text: string, type: 'success' | 'error') => {
        setMessage({ text, type });
        setTimeout(() => setMessage(null), 3000);
    };

    // ✅ Fetch only pending requests
    const fetchRequests = async () => {
        try {
            setLoading(true);
            const user = localStorage.getItem("userId");
            if (!user) {
                console.error("User ID not found in localStorage.");
                setLoading(false);
                dispatchRequestCountUpdate(0); // User ID இல்லை என்றால் count-ஐ 0-க்கு புதுப்பிக்கவும்.
                return;
            }

            const res = await axios.get(`${BASE_URL}/api/Request/getReceivedRequests.php?userId=${user}`);
            const allRequests = res.data.data || [];
            const pendingOnly = allRequests.filter(
                (req: UserRequest) => req.status === "pending"
            );
            setRequests(pendingOnly);
            
            // ⭐⭐⭐ புதுப்பிப்பு: Custom dispatch function-ஐ அழைக்கவும் ⭐⭐⭐
            dispatchRequestCountUpdate(pendingOnly.length);
            // ⭐⭐⭐
        } catch (err) {
            console.error("Error fetching pending requests:", err);
            showMessage("Failed to load requests.", 'error');
            dispatchRequestCountUpdate(0);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchRequests();
        
        // 1 minute interval for refresh
        const interval = setInterval(fetchRequests, 60000);
        return () => clearInterval(interval);
    }, []);

    // ✅ Accept / Reject actions
    const handleAccept = async (id: number) => {
        try {
            await axios.get(`${BASE_URL}/api/Request/handleRequestResponse.php?requestId=${id}&status=accepted`);
            setRequests(reqs => {
                const newReqs = reqs.filter(r => r.id !== id);
                // ⭐⭐⭐ புதுப்பிப்பு: Accept செய்த பிறகு Custom dispatch function-ஐ அழைக்கவும் ⭐⭐⭐
                dispatchRequestCountUpdate(newReqs.length);
                // ⭐⭐⭐
                return newReqs;
            });
            showMessage("✅ Request accepted successfully!", 'success');
        } catch (err) {
            console.error("Error accepting request:", err);
            showMessage("❌ Failed to accept request", 'error');
        }
    };

    const handleReject = async (id: number) => {
        try {
            await axios.get(`${BASE_URL}/api/Request/handleRequestResponse.php?requestId=${id}&status=rejected`);
            setRequests(reqs => {
                const newReqs = reqs.filter(r => r.id !== id);
                // ⭐⭐⭐ புதுப்பிப்பு: Reject செய்த பிறகு Custom dispatch function-ஐ அழைக்கவும் ⭐⭐⭐
                dispatchRequestCountUpdate(newReqs.length);
                // ⭐⭐⭐
                return newReqs;
            });
            showMessage("❌ Request rejected successfully!", 'error');
        } catch (err) {
            console.error("Error rejecting request:", err);
            showMessage("❌ Failed to reject request", 'error');
        }
    };

    const formatDate = (dateString: string) => new Date(dateString).toLocaleString();

    // ✅ Search filter
    const filteredRequests = requests.filter(req =>
        req.sender.fullName.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="min-h-screen bg-pink-50 font-sans">

            {/* Custom Toast Message Box */}
            {message && (
                <div className={`fixed top-4 right-4 z-50 p-4 rounded-lg shadow-xl text-white font-medium ${message.type === 'success' ? 'bg-pink-600' : 'bg-red-500'}`}>
                    {message.text}
                </div>
            )}

            {/* Header */}
            <div className="bg-white border-b border-pink-100 shadow-sm">
                <div className="max-w-7xl mx-auto px-6 py-5 flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-extrabold text-pink-700">Received Requests</h1>
                    </div>
                    <div className="text-right">
                        <p className="text-sm text-slate-500">Total Pending</p>
                        <p className="text-3xl font-bold text-pink-700">{requests.length}</p>
                    </div>
                </div>
            </div>

            {/* Search Bar & Table Container */}
            <div className="max-w-7xl mx-auto px-6 pt-8 pb-16">
                <div className="bg-white border border-pink-200 rounded-xl shadow-lg p-5 mb-8 flex">
                    <div className="flex-1 relative">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-pink-400" />
                        <input
                            type="text"
                            placeholder="Search by sender name..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-12 pr-4 py-3 border border-pink-300 rounded-xl focus:ring-3 focus:ring-pink-400 focus:border-pink-400 outline-none transition duration-150"
                        />
                    </div>
                </div>

                {/* Table */}
                <div className="mx-auto">
                    <div className="bg-white border border-pink-200 rounded-2xl shadow-xl overflow-hidden">
                        {loading ? (
                            <div className="p-10 text-center text-pink-500 font-semibold">
                                <svg className="animate-spin h-5 w-5 mr-3 inline-block" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                Loading pending requests...
                            </div>
                        ) : filteredRequests.length === 0 ? (
                            <div className="p-10 text-center text-slate-500">
                                <p className="text-xl">🎉</p>
                                No pending requests found! Time to relax.
                            </div>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="w-full text-sm text-slate-700">
                                    <thead className="bg-pink-100 border-b border-pink-200">
                                        <tr>
                                            <th className="px-6 py-4 text-left font-bold uppercase tracking-wider text-xs text-pink-700 whitespace-nowrap">
                                                Sender Details
                                            </th>
                                            <th className="px-6 py-4 text-left font-bold uppercase tracking-wider text-xs text-pink-700 whitespace-nowrap">
                                                Date Received
                                            </th>
                                            <th className="px-6 py-4 text-center font-bold uppercase tracking-wider text-xs text-pink-700 whitespace-nowrap">
                                                Actions
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-pink-100">
                                        {filteredRequests.map((req) => (
                                            <tr
                                                key={req.id}
                                                className="hover:bg-pink-50 transition-colors duration-150"
                                            >
                                                {/* Sender Info */}
                                                <td className="px-6 py-4 flex items-center gap-4 whitespace-nowrap">
                                                    <img
                                                        src={
                                                            req.sender.profilePhoto
                                                                ? `${BASE_URL}/uploads/${req.sender.profilePhoto}`
                                                                : `https://placehold.co/40x40/fbcfe8/be185d?text=${req.sender.fullName.charAt(0)}`
                                                        }
                                                        alt="Profile"
                                                        className="w-12 h-12 rounded-full object-cover border-2 border-pink-300 flex-shrink-0 shadow-md"
                                                        onError={(e) => {
                                                            e.currentTarget.onerror = null;
                                                            e.currentTarget.src = `https://placehold.co/48x48/fbcfe8/be185d?text=${req.sender.fullName.charAt(0)}`;
                                                        }}
                                                    />
                                                    <div>
                                                        <p className="font-semibold text-slate-800">
                                                            {req.sender.fullName}
                                                        </p>
                                                        <p className="text-slate-500 text-xs">
                                                            {req.sender.age} yrs • {req.sender.occupation}
                                                        </p>
                                                    </div>
                                                </td>

                                                {/* Date */}
                                                <td className="px-6 text-slate-600 text-sm whitespace-nowrap">
                                                    {formatDate(req.createdAt)}
                                                </td>

                                                {/* Actions */}
                                                <td className="px-6 py-4 text-center">
                                                    <div className="flex justify-center gap-3">
                                                        <button
                                                            title="View Details"
                                                            onClick={() => setSelectedSender(req.sender)}
                                                            className="p-3 text-pink-600 bg-pink-100 hover:bg-pink-200 rounded-full transition shadow-sm hover:shadow-md"
                                                        >
                                                            <Eye className="w-5 h-5" />
                                                        </button>
                                                        <button
                                                            title="Accept"
                                                            onClick={() => handleAccept(req.id)}
                                                            className="p-3 text-white bg-pink-500 hover:bg-pink-600 rounded-full transition shadow-md hover:shadow-lg transform hover:scale-105"
                                                        >
                                                            <Check className="w-5 h-5" />
                                                        </button>
                                                        <button
                                                            title="Reject"
                                                            onClick={() => handleReject(req.id)}
                                                            className="p-3 text-red-600 bg-red-100 hover:bg-red-200 rounded-full transition shadow-sm hover:shadow-md"
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

            {/* 🧩 Modal for Sender Details (Modal content is retained) */}
            {selectedSender && (
                <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
                    <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl p-8 relative transform transition-all duration-300 scale-100">
                        <button
                            onClick={() => setSelectedSender(null)}
                            className="absolute top-5 right-5 text-slate-500 hover:text-pink-700 p-2 rounded-full bg-pink-50 hover:bg-pink-100 transition"
                            title="Close"
                        >
                            <X className="w-6 h-6" />
                        </button>

                        <div className="text-center">
                            <img
                                src={
                                    selectedSender.profilePhoto
                                        ? `${BASE_URL}/uploads/${selectedSender.profilePhoto}`
                                        : `https://placehold.co/96x96/fbcfe8/be185d?text=${selectedSender.fullName.charAt(0)}`
                                }
                                alt="Profile"
                                className="w-24 h-24 rounded-full mx-auto border-4 border-pink-300 shadow-xl object-cover"
                                onError={(e) => {
                                    e.currentTarget.onerror = null;
                                    e.currentTarget.src = `https://placehold.co/96x96/fbcfe8/be185d?text=${selectedSender.fullName.charAt(0)}`;
                                }}
                            />
                            <h2 className="text-2xl font-bold text-pink-800 mt-4">
                                {selectedSender.fullName}
                            </h2>
                            <p className="text-slate-600 text-base mt-1">
                                {selectedSender.age} yrs • {selectedSender.gender}
                            </p>
                        </div>

                        <div className="mt-8 p-5 bg-pink-50 rounded-2xl space-y-3 text-sm text-slate-700 border border-pink-200 shadow-inner">
                            <DetailItem label="Occupation" value={selectedSender.occupation} />
                            <DetailItem label="Education" value={selectedSender.education} />
                            <DetailItem label="Religion" value={selectedSender.religion} />
                            <DetailItem label="Caste" value={selectedSender.caste} />
                            <DetailItem label="Location" value={`${selectedSender.city}, ${selectedSender.state}`} />
                        </div>

                        <div className="mt-6 flex justify-center gap-4">
                            <button
                                onClick={() => {
                                    handleAccept(requests.find(r => r.sender.id === selectedSender.id)?.id || 0);
                                    setSelectedSender(null);
                                }}
                                className="flex items-center gap-2 px-5 py-2.5 bg-pink-500 text-white rounded-full hover:bg-pink-600 transition font-medium text-base shadow-md hover:shadow-lg transform hover:scale-[1.02]"
                            >
                                <Check className="w-5 h-5" /> Accept
                            </button>
                            <button
                                onClick={() => {
                                    handleReject(requests.find(r => r.sender.id === selectedSender.id)?.id || 0);
                                    setSelectedSender(null);
                                }}
                                className="flex items-center gap-2 px-5 py-2.5 bg-red-500 text-white rounded-full hover:bg-red-600 transition font-medium text-base shadow-md hover:shadow-lg transform hover:scale-[1.02]"
                            >
                                <X className="w-5 h-5" /> Reject
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

// Helper component for modal details
const DetailItem: React.FC<{ label: string; value: string | number | undefined | null }> = ({ label, value }) => (
    <div className="flex justify-between items-center border-b border-pink-100 last:border-b-0 py-1.5">
        <strong className="text-pink-700 font-semibold">{label}:</strong>
        <span className="text-slate-600">{value || "N/A"}</span>
    </div>
);

export default UserRequest;