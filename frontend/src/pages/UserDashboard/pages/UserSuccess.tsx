import React, { useState, useEffect } from "react";
import axios from "axios";
import { Star, Quote, Share2, Upload, X, Send, Edit2, Trash2, Eye } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";


interface Story {
  id: number;
  names: string;
  location: string;
  marriedDate: string;
  story: string;
  image: string;
  createdAt: string;
  userId?: number;
}


const UserSuccess: React.FC = () => {
  const navigate = useNavigate();
  const [stories, setStories] = useState<Story[]>([]);
  const [userStories, setUserStories] = useState<Story[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingStory, setEditingStory] = useState<Story | null>(null);
  const [formData, setFormData] = useState({
    names: "",
    location: "",
    date: "",
    story: "",
    imageFile: null as File | null,
    imagePreview: "",
  });
  const [formError, setFormError] = useState("");

  // Get the actual logged-in user ID from localStorage
  const [currentUserId, setCurrentUserId] = useState<number | null>(null);


  // Fetch current user ID from localStorage
  useEffect(() => {
    const getUserId = () => {
      const storedUserId = localStorage.getItem("userId");
      if (storedUserId) {
        setCurrentUserId(parseInt(storedUserId));
      } else {
        setCurrentUserId(null);
      }
    };
    getUserId();
  }, []);


  // Fetch stories whenever currentUserId changes
  useEffect(() => {
    if (currentUserId !== null) {
      fetchStories();
    }
  }, [currentUserId]);


  // Fetch stories function
  const fetchStories = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/stories/getstories");
      const allStories = res.data || [];

      if (currentUserId !== null) {
        // Separate user's own stories and others' stories based on userId
        const userOwned = allStories.filter((s: Story) => s.userId === currentUserId);
        const othersStories = allStories.filter((s: Story) => s.userId !== currentUserId);

        setUserStories(userOwned);
        setStories(othersStories);
      } else {
        // If no user is logged in, show all stories in "Real Stories" section
        setUserStories([]);
        setStories(allStories);
      }
    } catch (err) {
      console.error("Error fetching stories:", err);
    }
  };


  // Helper function to get correct image URL
  const getImageUrl = (imagePath: string) => {
    if (!imagePath) return "/placeholder-image.jpg";
    if (imagePath.startsWith("http://") || imagePath.startsWith("https://")) {
      return imagePath;
    }
    const cleanPath = imagePath.startsWith("/") ? imagePath.substring(1) : imagePath;
    return `http://localhost:5000/${cleanPath}`;
  };


  // Count characters in story
  const countCharacters = (text: string): number => {
    return text.trim().length;
  };


  // Validate story (minimum 164 characters)
  const validateStory = (text: string): boolean => {
    const chars = countCharacters(text);
    if (chars < 164) {
      setFormError(`Story must have at least 164 characters. You have ${chars} character(s).`);
      return false;
    }
    setFormError("");
    return true;
  };


  // Truncate story to 50 characters
  const truncateStory = (text: string, maxChars: number = 50): string => {
    if (text.length <= maxChars) return text;
    return text.substring(0, maxChars);
  };


  // Check if story needs "View More"
  const needsViewMore = (text: string): boolean => {
    return text.length > 50;
  };


  // Handle image upload
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData((prev) => ({ ...prev, imageFile: file }));
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData((prev) => ({ ...prev, imagePreview: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };


  // Open edit form
  const handleEdit = (story: Story) => {
    setEditingStory(story);
    setFormData({
      names: story.names,
      location: story.location,
      date: story.marriedDate,
      story: story.story,
      imageFile: null,
      imagePreview: getImageUrl(story.image),
    });
    setFormError("");
    setShowForm(true);
  };


  // Delete story with confirmation
  const handleDelete = async (storyId: number) => {
    // Show SweetAlert2 confirmation dialog
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "Cancel",
      timer: 2000,
      timerProgressBar: true,
    });

    if (!result.isConfirmed) {
      return; // User clicked "Cancel"
    }

    if (currentUserId === null) {
      await Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "You must be logged in to delete a story.",
        timer: 2000,
        timerProgressBar: true,
        showConfirmButton: false,
      });
      return;
    }

    try {
      const response = await axios.delete(
        `http://localhost:5000/api/stories/deletestory/${storyId}`,
        {
          data: { userId: currentUserId }
        }
      );

      if (response.status === 200) {
        // Remove from userStories state
        setUserStories(userStories.filter(s => s.id !== storyId));
        await Swal.fire({
          icon: "success",
          title: "Deleted!",
          text: "Story deleted successfully!",
          timer: 2000,
          timerProgressBar: true,
          showConfirmButton: false,
        });
      }
    } catch (err: any) {
      console.error("Error deleting story:", err);
      const errorMsg = err.response?.data?.message || "Failed to delete story.";
      await Swal.fire({
        icon: "error",
        title: "Error",
        text: errorMsg,
        timer: 2000,
        timerProgressBar: true,
        showConfirmButton: false,
      });
    }
  };


  // View full story
  const handleViewStory = (story: Story) => {
    navigate(`/story/${story.id}`, { state: { story } });
  };


  // Submit or update story
  const handleSubmit = async () => {
    if (!formData.names || !formData.location || !formData.story) {
      await Swal.fire({
        icon: "error",
        title: "Missing Fields",
        text: "Please fill in all required fields.",
        timer: 2000,
        timerProgressBar: true,
        showConfirmButton: false,
      });
      return;
    }


    if (currentUserId === null) {
      await Swal.fire({
        icon: "error",
        title: "Not Logged In",
        text: "You must be logged in to submit a story.",
        timer: 2000,
        timerProgressBar: true,
        showConfirmButton: false,
      });
      return;
    }


    // Validate story has minimum 164 characters
    if (!validateStory(formData.story)) {
      return;
    }


    try {
      const form = new FormData();
      form.append("names", formData.names);
      form.append("location", formData.location);
      form.append("date", formData.date);
      form.append("story", formData.story);
      form.append("userId", currentUserId.toString());
      if (formData.imageFile) {
        form.append("image", formData.imageFile);
      }


      if (editingStory) {
        // Update existing story
        const res = await axios.put(
          `http://localhost:5000/api/stories/updatestory/${editingStory.id}`,
          form,
          { headers: { "Content-Type": "multipart/form-data" } }
        );

        if (res.status === 200) {
          const updatedStory = res.data.story;
          updatedStory.userId = currentUserId;
          // Update in userStories
          setUserStories(userStories.map(s => s.id === editingStory.id ? updatedStory : s));
          await Swal.fire({
            icon: "success",
            title: "Updated!",
            text: "Story updated successfully!",
            timer: 2000,
            timerProgressBar: true,
            showConfirmButton: false,
          });
        }
      } else {
        // Create new story
        const res = await axios.post(
          "http://localhost:5000/api/stories/submitstory",
          form,
          { headers: { "Content-Type": "multipart/form-data" } }
        );


        if (res.status === 201) {
          const newStory = res.data.story;
          newStory.userId = currentUserId;
          setUserStories([newStory, ...userStories]);
          await Swal.fire({
            icon: "success",
            title: "Success!",
            text: "Story submitted successfully!",
            timer: 2000,
            timerProgressBar: true,
            showConfirmButton: false,
          });
        }
      }


      // Close form and reset
      setShowForm(false);
      setEditingStory(null);
      setFormData({
        names: "",
        location: "",
        date: "",
        story: "",
        imageFile: null,
        imagePreview: "",
      });
      setFormError("");
    } catch (err: any) {
      console.error("Error submitting story:", err);
      const errorMsg = err.response?.data?.message || "Failed to submit. Try again later.";
      await Swal.fire({
        icon: "error",
        title: "Error",
        text: errorMsg,
        timer: 2000,
        timerProgressBar: true,
        showConfirmButton: false,
      });
    }
  };


  // Story Card Component
  const StoryCard = ({ story, isUserStory }: { story: Story; isUserStory: boolean }) => (
    <div className="relative overflow-hidden rounded-2xl bg-white/95 backdrop-blur-sm border border-slate-100 p-5 sm:p-6 shadow-md hover:shadow-2xl transform transition-all duration-500 hover:-translate-y-2">
      <div className="absolute -top-12 -right-12 w-36 h-36 bg-accent-200/30 rounded-full blur-3xl" />


      <div className="flex items-start gap-3 xs:gap-4">
        {/* Profile Image */}
        <div className="w-14 h-14 xs:w-16 xs:h-16 rounded-xl overflow-hidden shadow-md flex-shrink-0">
          <img
            src={getImageUrl(story.image)}
            alt={story.names}
            className="w-full h-full object-cover transform transition-transform duration-700 hover:scale-110"
            onError={(e) => {
              e.currentTarget.src = "/placeholder-image.jpg";
            }}
          />
        </div>


        {/* Text */}
        <div className="flex-1">
          <div className="flex items-center gap-1.5">
            {[...Array(5)].map((_, idx) => (
              <Star key={idx} className="w-3.5 h-3.5 text-yellow-400 fill-yellow-400" />
            ))}
          </div>
          <div className="mt-2 text-gray-600 text-sm leading-relaxed">
            <span>{truncateStory(story.story)}</span>
            {needsViewMore(story.story) && (
              <>
                <span>... </span>
                <button
                  onClick={() => handleViewStory(story)}
                  className="text-brand-600 hover:text-brand-700 font-medium inline-flex items-center gap-1"
                >
                  <Eye className="w-3.5 h-3.5" />
                  View More
                </button>
              </>
            )}
          </div>


          <div className="mt-2 font-semibold text-gray-900 text-sm">{story.names}</div>
          {story.location && <div className="text-xs text-gray-500">{story.location}</div>}
          {story.marriedDate && <div className="mt-1 text-xs text-gray-400">{story.marriedDate}</div>}


          {/* User Actions - Only show for story owner */}
          {isUserStory && currentUserId !== null && story.userId === currentUserId && (
            <div className="mt-3 flex gap-2">


            </div>
          )}
        </div>


        {/* Quote Icon */}
        <div className="w-8 h-8 xs:w-9 xs:h-9 rounded-full bg-brand-50 flex items-center justify-center">
          <Quote className="w-4 h-4 text-brand-600" />
        </div>
      </div>
    </div>
  );


  return (
<section className="mt-0 relative py-8 sm:py-10 px-3 xs:px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-white via-slate-50 to-white overflow-hidden">      {/* Inline Animations */}
      <style>{`
        @keyframes fadeUp {
          0% { opacity: 0; transform: translateY(30px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        @keyframes float {
          0%,100% { transform: translateY(0); }
          50% { transform: translateY(-6px); }
        }
        @keyframes glow {
          0%,100% { box-shadow: 0 0 0 rgba(255,120,180,0); }
          50% { box-shadow: 0 0 15px rgba(255,120,180,.3); }
        }
        @keyframes fadeIn {
          0% { opacity: 0; transform: scale(0.9); }
          100% { opacity: 1; transform: scale(1); }
        }
        .animate-fadeUp { animation: fadeUp 1s ease-out both; }
        .animate-float { animation: float 5s ease-in-out infinite; }
        .animate-glow { animation: glow 2s ease-in-out infinite; }
        .animate-fadeIn { animation: fadeIn 0.3s ease-out both; }
      `}</style>


      {/* Decorative Blobs */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -left-24 top-0 w-64 h-64 bg-pink-200/40 rounded-full blur-3xl opacity-60 animate-float" />
        <div className="absolute right-0 bottom-0 w-80 h-80 bg-indigo-200/40 rounded-full blur-3xl opacity-60 animate-float" />
      </div>


      <div className="max-w-7xl mx-auto relative z-10">
        {/* Share Story Button */}
        {currentUserId !== null && (
          <div className="text-center mb-8">
            <button
              onClick={() => {
                setEditingStory(null);
                setFormData({
                  names: "",
                  location: "",
                  date: "",
                  story: "",
                  imageFile: null,
                  imagePreview: "",
                });
                setFormError("");
                setShowForm(true);
              }}
              className="px-6 py-3 bg-gradient-to-r from-brand-600 to-accent-500 text-white rounded-full font-semibold text-sm sm:text-base shadow-md hover:shadow-2xl transition-all hover:scale-105 animate-float flex items-center gap-2 mx-auto"
            >
              <Share2 className="w-4 h-4" />
              <span>Share Your Story</span>
            </button>
          </div>
        )}


        {/* Your Stories Section - Only show if user is logged in and has stories */}
        {currentUserId !== null && userStories.length > 0 && (
          <div className="mb-16">
            <div className="text-center mb-8">
              <h3 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-brand-600 to-accent-500 bg-clip-text text-transparent">
                Your Stories
              </h3>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 xs:gap-5 sm:gap-6 md:gap-8">
              {userStories.map((story) => (
                <StoryCard key={story.id} story={story} isUserStory={true} />
              ))}
            </div>
          </div>
        )}


        {/* Others' Stories Section */}
        {stories.length > 0 && (
          <>
            <div className="text-center animate-fadeUp mb-8">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-100 text-amber-700 text-xs sm:text-sm font-semibold shadow-sm animate-glow">
                Hear from Couples
              </div>
              <h2 className="mt-4 text-[1.8rem] xs:text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight bg-gradient-to-r from-brand-600 via-brand-400 to-accent-500 bg-clip-text text-transparent">
                Real Stories — Real Matches
              </h2>
              <p className="mt-3 max-w-2xl mx-auto text-gray-600 text-sm xs:text-base leading-relaxed">
                Our verified members have shared these beautiful stories that began on our platform.
              </p>
            </div>


            {/* Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 xs:gap-5 sm:gap-6 md:gap-8">
              {stories.map((story) => (
                <StoryCard key={story.id} story={story} isUserStory={false} />
              ))}
            </div>
          </>
        )}


        {/* Bottom Call-to-Action */}
        <div className="mt-12 text-center animate-fadeUp">
          <div className="inline-flex items-center gap-3 bg-white/90 px-4 py-2.5 rounded-full shadow-sm text-sm sm:text-base">
            <div className="text-gray-600">Trusted by</div>
            <div className="font-bold text-brand-600">50,000+</div>
            <div className="text-gray-600">verified members</div>
          </div>
        </div>
      </div>


      {/* Submit/Edit Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4" onClick={() => setShowForm(false)}>
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-3xl max-w-md w-full p-6 shadow-xl animate-fadeIn max-h-[90vh] overflow-y-auto"
          >
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold bg-gradient-to-r from-brand-600 to-accent-500 bg-clip-text text-transparent">
                {editingStory ? "Edit Your Story" : "Share Your Story"}
              </h3>
              <button
                onClick={() => {
                  setShowForm(false);
                  setEditingStory(null);
                  setFormError("");
                }}
                className="bg-gray-100 p-2 rounded-full hover:bg-gray-200 transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>


            <div className="space-y-3">
              <input
                type="text"
                placeholder="Couple Names *"
                value={formData.names}
                onChange={(e) => setFormData({ ...formData, names: e.target.value })}
                className="w-full border border-gray-300 px-4 py-2 rounded-lg focus:ring-2 focus:ring-brand-400 focus:border-brand-400 outline-none transition"
              />
              <input
                type="text"
                placeholder="City, State *"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                className="w-full border border-gray-300 px-4 py-2 rounded-lg focus:ring-2 focus:ring-brand-400 focus:border-brand-400 outline-none transition"
              />
              <input
                type="text"
                placeholder="Marriage Date"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                className="w-full border border-gray-300 px-4 py-2 rounded-lg focus:ring-2 focus:ring-brand-400 focus:border-brand-400 outline-none transition"
              />
              <div>
                <textarea
                  placeholder="Your Story * (Minimum 164 characters required)"
                  rows={8}
                  value={formData.story}
                  onChange={(e) => {
                    setFormData({ ...formData, story: e.target.value });
                    validateStory(e.target.value);
                  }}
                  className={`w-full border ${formError ? 'border-red-500' : 'border-gray-300'} px-4 py-2 rounded-lg resize-none focus:ring-2 focus:ring-brand-400 focus:border-brand-400 outline-none transition`}
                />
                {formError && (
                  <p className="text-red-500 text-xs mt-1">{formError}</p>
                )}
                <p className={`text-xs mt-1 ${countCharacters(formData.story) >= 164 ? 'text-green-600' : 'text-gray-500'}`}>
                  Current characters: {countCharacters(formData.story)} / 164 minimum
                </p>
              </div>
              <div className="text-center">
                <input
                  type="file"
                  id="upload"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
                <label
                  htmlFor="upload"
                  className="cursor-pointer inline-flex items-center gap-2 bg-brand-50 px-4 py-2 rounded-lg border border-brand-200 text-brand-700 hover:bg-brand-100 transition font-medium"
                >
                  <Upload className="w-4 h-4" />
                  {formData.imagePreview ? "Change Image" : "Upload Image"}
                </label>
                {formData.imagePreview && (
                  <img
                    src={formData.imagePreview}
                    alt="preview"
                    className="w-24 h-24 mx-auto mt-3 rounded-xl object-cover shadow-md"
                  />
                )}
              </div>
              <button
                onClick={handleSubmit}
                disabled={countCharacters(formData.story) < 164}
                className="w-full py-3 bg-gradient-to-r from-brand-600 to-accent-500 text-white rounded-full font-bold flex items-center justify-center gap-2 hover:scale-105 transition shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
              >
                <Send className="w-5 h-5" />
                {editingStory ? "Update Story" : "Submit Story"}
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};


export default UserSuccess;
