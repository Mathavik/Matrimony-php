import React from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Calendar, MapPin, Clock, Heart } from "lucide-react";
import { format } from "date-fns";

interface Story {
  id: number;
  names: string;
  location: string;
  date: string;
  story: string;
  image: string;
  createdAt: string;
}

const StoryDetail: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { id } = useParams();
  const story = location.state?.story as Story;

  if (!story) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center px-4">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-4">Story not found</h2>
          <button
            onClick={() => navigate(-1)}
            className="px-6 py-3 bg-gray-900 text-white rounded-lg font-semibold hover:bg-gray-800 transition"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  const getImageUrl = (imagePath: string) => {
    if (!imagePath) return "/placeholder-image.jpg";
    if (imagePath.startsWith("http://") || imagePath.startsWith("https://")) {
      return imagePath;
    }
    const cleanPath = imagePath.startsWith("/") ? imagePath.substring(1) : imagePath;
    return `http://localhost:5000/${cleanPath}`;
  };

  const formatDateTime = (dateString: string) => {
    try {
      return format(new Date(dateString), "MMMM dd, yyyy 'at' hh:mm a");
    } catch {
      return dateString;
    }
  };

  return (
    <section className="min-h-screen bg-gray-50 py-4 sm:py-8 lg:py-12 mt-16">
      {/* Animations */}
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes slideIn {
          from { opacity: 0; transform: translateX(-20px); }
          to { opacity: 1; transform: translateX(0); }
        }
        .animate-fadeIn { animation: fadeIn 0.6s ease-out both; }
        .animate-slideIn { animation: slideIn 0.6s ease-out both; }
        .delay-100 { animation-delay: 0.1s; }
        .delay-200 { animation-delay: 0.2s; }
        .delay-300 { animation-delay: 0.3s; }
      `}</style>

      <div className="max-w-7xl mx-auto px-3 xs:px-4 sm:px-6 lg:px-8">
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="mb-4 sm:mb-6 flex items-center gap-2 px-4 py-2 bg-white rounded-lg shadow-sm hover:shadow-md transition-all text-gray-700 font-medium text-sm sm:text-base animate-fadeIn"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back</span>
        </button>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-6 lg:gap-8">
          {/* Left: Image Section - 5 columns */}
          <div className="lg:col-span-5 animate-slideIn">
            <div className="lg:sticky lg:top-6">
              {/* Image Container */}
              <div className="relative rounded-xl sm:rounded-2xl overflow-hidden shadow-lg bg-gray-200 aspect-[4/5] sm:aspect-[3/4]">
                <img
                  src={getImageUrl(story.image)}
                  alt={story.names}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.currentTarget.src = "/placeholder-image.jpg";
                  }}
                />
                
                {/* Simple Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                
                {/* Names on Image */}
                <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-6">
                  <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-white mb-2 sm:mb-3">
                    {story.names}
                  </h2>
                  <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-white/90 text-xs sm:text-sm">
                    <div className="flex items-center gap-1.5 ">
                      <MapPin className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                      <span>{story.location}</span>
                    </div>
                    {story.date && (
                      <>
                        <span className="text-white/50">•</span>
                        <div className="flex items-center gap-1.5">
                          <Calendar className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                          <span>{story.date}</span>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right: Content Section - 7 columns */}
          <div className="lg:col-span-7 animate-fadeIn delay-200">
            <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg p-4 sm:p-6 lg:p-8">
              
              {/* Header */}
              <div className="flex flex-col xs:flex-row xs:items-center xs:justify-between gap-3 sm:gap-4 mb-6 sm:mb-8">
                <div className="inline-flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full bg-pink-700 text-white text-xs sm:text-sm font-semibold w-fit">
                  <Heart className="w-3.5 h-3.5 sm:w-4 sm:h-4 fill-current" />
                  <span>Love Story</span>
                </div>
                
                {story.createdAt && (
                  <div className="flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm text-gray-500">
                    <Clock className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                    <span className="line-clamp-1">{formatDateTime(story.createdAt)}</span>
                  </div>
                )}
              </div>

              {/* Title */}
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-4 sm:mb-6 leading-tight">
                Our Journey Together
              </h1>

              {/* Divider */}
              <div className="h-px bg-gray-200 mb-6 sm:mb-8" />

              {/* Story Content */}
              <div className="mb-6 sm:mb-8 space-y-4 sm:space-y-5">
                {story.story.split('\n').map((paragraph, idx) => (
                  paragraph.trim() && (
                    <p key={idx} className="text-sm sm:text-base lg:text-lg text-gray-700 leading-relaxed">
                      {paragraph}
                    </p>
                  )
                ))}
              </div>

              {/* Quote Section */}
              {/* <div className="my-6 sm:my-8 p-4 sm:p-6 lg:p-8 rounded-xl sm:rounded-2xl bg-gray-900 text-white">
                <div className="text-3xl sm:text-4xl font-serif mb-2 opacity-50">"</div>
                <p className="text-sm sm:text-base lg:text-lg italic leading-relaxed mb-3 sm:mb-4">
                  Every love story is beautiful, but ours is my favorite.
                </p>
                <div className="flex items-center gap-2">
                  <div className="h-0.5 w-8 sm:w-12 bg-white/30" />
                  <Heart className="w-3.5 h-3.5 sm:w-4 sm:h-4 fill-current" />
                </div>
              </div> */}

              {/* Metadata Cards */}
              <div className="grid grid-cols-1 xs:grid-cols-2 gap-3 sm:gap-4 mb-6 sm:mb-8">
                <div className="rounded-lg sm:rounded-xl bg-gray-50 p-4 sm:p-5 border border-gray-200">
                  <div className="flex items-start gap-3">
                    <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-lg bg-pink-700 flex items-center justify-center flex-shrink-0">
                      <MapPin className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-[10px] sm:text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Location</div>
                      <div className="text-sm sm:text-base text-gray-900 font-semibold truncate">{story.location}</div>
                    </div>
                  </div>
                </div>

                {story.date && (
                  <div className="rounded-lg sm:rounded-xl bg-gray-50 p-4 sm:p-5 border border-gray-200">
                    <div className="flex items-start gap-3">
                      <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-lg bg-gray-900 flex items-center justify-center flex-shrink-0">
                        <Calendar className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-[10px] sm:text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Date</div>
                        <div className="text-sm sm:text-base text-gray-900 font-semibold truncate">{story.date}</div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Action Button */}
              <button
                onClick={() => navigate(-1)}
                className="w-full px-5 sm:px-6 py-3 sm:py-4 bg-pink-700 text-white rounded-lg sm:rounded-xl font-semibold text-sm sm:text-base shadow-md hover:bg-gray-800 hover:shadow-lg transition-all duration-300 flex items-center justify-center gap-2 sm:gap-3"
              >
                <Heart className="w-4 h-4 sm:w-5 sm:h-5" />
                <span>Read More Stories</span>
              </button>
            </div>
          </div>
        </div>

        {/* Footer */}
      </div>
    </section>
  );
};

export default StoryDetail;
