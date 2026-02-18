import React, { useState, useEffect } from "react";
import axios from "axios";
import { Edit2, Trash2, Eye, X, Send, Upload, Star, Search, Filter, MoreVertical, Check, AlertCircle } from "lucide-react";
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
  userId: number;
  isFeatured?: boolean;
  color?: string;
}

const getImageUrl = (imagePath: string) => {
  if (!imagePath) return "/placeholder-image.jpg";
  if (imagePath.startsWith("http://") || imagePath.startsWith("https://")) {
    return imagePath;
  }
  const cleanPath = imagePath.startsWith("/") ? imagePath.substring(1) : imagePath;
  return `http://localhost:5000/${cleanPath}`;
};

const countCharacters = (text: string): number => {
  return text.trim().length;
};

const validateStory = (text: string, setFormError: (msg: string) => void): boolean => {
  const chars = countCharacters(text);
  if (chars < 164) {
    setFormError(`Story must have at least 164 characters. You have ${chars} character(s).`);
    return false;
  }
  setFormError("");
  return true;
};

const AdminStoryList: React.FC = () => {
  const navigate = useNavigate();
  const [allStories, setAllStories] = useState<Story[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingStory, setEditingStory] = useState<Story | null>(null);
  const [formError, setFormError] = useState("");
  const [currentUserId, setCurrentUserId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  const [formData, setFormData] = useState({
    names: "",
    location: "",
    date: "",
    story: "",
    imageFile: null as File | null,
    imagePreview: "",
  });

  useEffect(() => {
    const storedUserId = localStorage.getItem("userId");
    if (storedUserId) {
      setCurrentUserId(parseInt(storedUserId));
    }
    fetchStories();
  }, []);

  const fetchStories = async () => {
    setLoading(true);
    try {
      const res = await axios.get("http://localhost:5000/api/stories/getstories");
      const storiesWithUserId = res.data.filter((s: Story) => s.userId !== undefined) as Story[];
      setAllStories(storiesWithUserId);
    } catch (err) {
      console.error("Error fetching stories:", err);
      Swal.fire({
        icon: "error",
        title: "Fetch Error",
        text: "Failed to load stories for admin view.",
      });
    } finally {
      setLoading(false);
    }
  };

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

  const handleEdit = (story: Story) => {
    if (story.userId !== currentUserId) {
      Swal.fire({
        icon: "warning",
        title: "Unauthorized",
        text: "You can only edit stories you have submitted.",
        timer: 3000,
        timerProgressBar: true,
      });
      return;
    }
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

  const handleDelete = async (storyId: number, storyUserId: number) => {
    if (storyUserId !== currentUserId) {
      await Swal.fire({
        icon: "warning",
        title: "Unauthorized",
        text: "You can only delete stories you have submitted.",
        timer: 3000,
        timerProgressBar: true,
      });
      return;
    }

    const result = await Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    });

    if (!result.isConfirmed) return;

    try {
      await axios.delete(
        `http://localhost:5000/api/stories/deletestory/${storyId}`,
        {
          data: { userId: currentUserId }
        }
      );

      setAllStories(allStories.filter(s => s.id !== storyId));
      await Swal.fire({
        icon: "success",
        title: "Deleted!",
        text: "Story deleted successfully!",
        timer: 2000,
        timerProgressBar: true,
        showConfirmButton: false,
      });
    } catch (err: any) {
      console.error("Error deleting story:", err);
      const errorMsg = err.response?.data?.message || "Failed to delete story.";
      await Swal.fire({ icon: "error", title: "Error", text: errorMsg });
    }
  };

  const handleSubmit = async () => {
    if (!formData.names || !formData.location || !formData.story) {
      await Swal.fire({ icon: "error", title: "Missing Fields", text: "Please fill in all required fields." });
      return;
    }

    if (currentUserId === null) {
      await Swal.fire({ icon: "error", title: "Not Logged In", text: "User ID is required for this action." });
      return;
    }

    if (!validateStory(formData.story, setFormError)) return;

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

      let res;
      if (editingStory) {
        res = await axios.put(
          `http://localhost:5000/api/stories/updatestory/${editingStory.id}`,
          form,
          { headers: { "Content-Type": "multipart/form-data" } }
        );

        if (res.status === 200) {
          const updatedStory = { ...res.data.story, userId: currentUserId };
          setAllStories(allStories.map(s => s.id === editingStory.id ? updatedStory : s));
          await Swal.fire({ icon: "success", title: "Updated!", text: "Story updated successfully!", timer: 2000, showConfirmButton: false });
        }
      } else {
        res = await axios.post(
          "http://localhost:5000/api/stories/submitstory",
          form,
          { headers: { "Content-Type": "multipart/form-data" } }
        );

        if (res.status === 201) {
          const newStory = { ...res.data.story, userId: currentUserId };
          setAllStories([newStory, ...allStories]);
          await Swal.fire({ icon: "success", title: "Success!", text: "Story submitted successfully!", timer: 2000, showConfirmButton: false });
        }
      }

      setShowForm(false);
      setEditingStory(null);
      setFormData({ names: "", location: "", date: "", story: "", imageFile: null, imagePreview: "" });
      setFormError("");
    } catch (err: any) {
      console.error("Error submitting story:", err);
      const errorMsg = err.response?.data?.message || "Failed to submit/update story. Try again later.";
      await Swal.fire({ icon: "error", title: "Error", text: errorMsg });
    }
  };

  const filteredStories = allStories.filter(story => 
    story.names.toLowerCase().includes(searchTerm.toLowerCase()) ||
    story.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center h-screen bg-gray-50">
        <div className="w-16 h-16 border-4 border-gray-200 border-t-blue-600 rounded-full animate-spin"></div>
        <p className="mt-4 text-gray-600 font-medium">Loading stories...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Success Stories</h1>
            <p className="text-sm text-gray-500 mt-1">Manage and review all success stories</p>
          </div>
          <button
            onClick={() => {
              setEditingStory(null);
              setFormData({ names: "", location: "", date: "", story: "", imageFile: null, imagePreview: "" });
              setFormError("");
              setShowForm(true);
            }}
            className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
          >
            <Send className="w-4 h-4" />
            Add Story
          </button>
        </div>
      </div>

      <div className="px-6 py-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-white border border-gray-200 rounded-lg p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Total Stories</p>
                <p className="text-3xl font-bold text-gray-900 mt-1">{allStories.length}</p>
              </div>
              <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center">
                <Star className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-lg p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Your Stories</p>
                <p className="text-3xl font-bold text-gray-900 mt-1">
                  {allStories.filter(s => s.userId === currentUserId).length}
                </p>
              </div>
              <div className="w-12 h-12 bg-green-50 rounded-lg flex items-center justify-center">
                <Check className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-lg p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Featured</p>
                <p className="text-3xl font-bold text-gray-900 mt-1">
                  {allStories.filter(s => s.isFeatured).length}
                </p>
              </div>
              <div className="w-12 h-12 bg-amber-50 rounded-lg flex items-center justify-center">
                <Star className="w-6 h-6 text-amber-600 fill-amber-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Search and Filter */}
        <div className="bg-white border border-gray-200 rounded-lg p-4 mb-6">
          <div className="flex items-center gap-3">
            <div className="flex-1 relative">
              <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search by names or location..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-sm"
              />
            </div>
            <button className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors flex items-center gap-2">
              <Filter className="w-4 h-4" />
              Filter
            </button>
          </div>
        </div>

        {/* Stories Table */}
        <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Story
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Location
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    User ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredStories.map((story) => (
                  <tr key={story.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                          {story.image ? (
                            <img
                              src={getImageUrl(story.image)}
                              alt={story.names}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <Star className="w-5 h-5 text-gray-400" />
                            </div>
                          )}
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm font-medium text-gray-900 truncate">
                            {story.names}
                          </p>
                          <p className="text-xs text-gray-500 truncate">
                            ID: {story.id}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm text-gray-900">{story.location}</p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm text-gray-900">{story.marriedDate || '-'}</p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm text-gray-900">{story.userId}</p>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        {story.userId === currentUserId && (
                          <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-blue-50 text-blue-700">
                            Your Story
                          </span>
                        )}
                        {story.isFeatured && (
                          <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-amber-50 text-amber-700">
                            <Star className="w-3 h-3 mr-1" />
                            Featured
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => navigate(`/story/${story.id}`, { state: { story } })}
                          className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="View Story"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleEdit(story)}
                          disabled={story.userId !== currentUserId}
                          className={`p-2 rounded-lg transition-colors ${
                            story.userId === currentUserId
                              ? 'text-gray-500 hover:text-blue-600 hover:bg-blue-50'
                              : 'text-gray-300 cursor-not-allowed'
                          }`}
                          title={story.userId === currentUserId ? "Edit Story" : "Unauthorized"}
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(story.id, story.userId)}
                          disabled={story.userId !== currentUserId}
                          className={`p-2 rounded-lg transition-colors ${
                            story.userId === currentUserId
                              ? 'text-gray-500 hover:text-red-600 hover:bg-red-50'
                              : 'text-gray-300 cursor-not-allowed'
                          }`}
                          title={story.userId === currentUserId ? "Delete Story" : "Unauthorized"}
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Empty State */}
          {filteredStories.length === 0 && (
            <div className="text-center py-12">
              <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-3" />
              <h3 className="text-sm font-medium text-gray-900 mb-1">No stories found</h3>
              <p className="text-sm text-gray-500">
                {searchTerm ? 'Try adjusting your search' : 'Get started by adding your first story'}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setShowForm(false)}>
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-xl"
          >
            {/* Modal Header */}
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">
                {editingStory ? "Edit Success Story" : "Add Success Story"}
              </h3>
              <button
                onClick={() => {
                  setShowForm(false);
                  setEditingStory(null);
                  setFormError("");
                }}
                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Couple Names <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="e.g., John & Jane"
                  value={formData.names}
                  onChange={(e) => setFormData({ ...formData, names: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-sm"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Location <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="City, State"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-sm"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Marriage Date
                </label>
                <input
                  type="text"
                  placeholder="e.g., June 15, 2023"
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-sm"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Story <span className="text-red-500">*</span>
                </label>
                <textarea
                  placeholder="Share the success story... (Minimum 164 characters required)"
                  rows={6}
                  value={formData.story}
                  onChange={(e) => {
                    setFormData({ ...formData, story: e.target.value });
                    validateStory(e.target.value, setFormError);
                  }}
                  className={`w-full px-3 py-2 border ${
                    formError ? 'border-red-500' : 'border-gray-300'
                  } rounded-lg resize-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-sm`}
                />
                <div className="flex items-center justify-between mt-2">
                  <p className={`text-xs ${countCharacters(formData.story) >= 164 ? 'text-green-600' : 'text-gray-500'}`}>
                    {countCharacters(formData.story)} / 164 characters
                  </p>
                  {formError && (
                    <p className="text-xs text-red-500">{formError}</p>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Upload Image
                </label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors">
                  <input
                    type="file"
                    id="upload"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                  <label htmlFor="upload" className="cursor-pointer">
                    {formData.imagePreview ? (
                      <div className="space-y-3">
                        <img
                          src={formData.imagePreview}
                          alt="preview"
                          className="w-32 h-32 rounded-lg object-cover mx-auto"
                        />
                        <p className="text-sm text-blue-600 font-medium">Change Image</p>
                      </div>
                    ) : (
                      <>
                        <Upload className="w-10 h-10 text-gray-400 mx-auto mb-2" />
                        <p className="text-sm text-gray-600 font-medium mb-1">Click to upload</p>
                        <p className="text-xs text-gray-500">PNG, JPG up to 10MB</p>
                      </>
                    )}
                  </label>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="sticky bottom-0 bg-gray-50 border-t border-gray-200 px-6 py-4 flex items-center justify-end gap-3">
              <button
                onClick={() => {
                  setShowForm(false);
                  setEditingStory(null);
                  setFormError("");
                }}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                disabled={countCharacters(formData.story) < 164}
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                <Send className="w-4 h-4" />
                {editingStory ? "Update Story" : "Add Story"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminStoryList;