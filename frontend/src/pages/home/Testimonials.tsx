import React, { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

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

const Testimonials = () => {
  const [testimonials, setTestimonials] = useState<Story[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);

  // Fetch stories from API
  useEffect(() => {
    fetchStories();
  }, []);

  const fetchStories = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/stories/getstories");
      const allStories = await response.json();
      setTestimonials(allStories || []);
      setLoading(false);
    } catch (err) {
      console.error("Error fetching stories:", err);
      setLoading(false);
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

  const handlePrevious = () => {
    setCurrentIndex((prev) => (prev === 0 ? testimonials.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev === testimonials.length - 1 ? 0 : prev + 1));
  };

  const handleDotClick = (index: number) => {
    setCurrentIndex(index);
  };

  const handleViewAll = () => {
    window.location.href = '/share-your-story';
  };

  // Split quote into lines with controlled length
  const getQuoteLines = (quote: string) => {
    const words = quote.split(' ');
    const lines: string[] = [];
    let currentLine = '';
    const maxWordsPerLine = 8;
    let wordCount = 0;

    words.forEach((word, index) => {
      currentLine += (currentLine ? ' ' : '') + word;
      wordCount++;

      if (wordCount >= maxWordsPerLine || index === words.length - 1) {
        lines.push(currentLine);
        currentLine = '';
        wordCount = 0;
      }
    });

    return lines;
  };

  if (loading) {
    return (
      <section className="relative py-12 sm:py-16 lg:py-8 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-6xl mx-auto text-center">
          <p className="text-gray-600">Loading stories...</p>
        </div>
      </section>
    );
  }

 if (testimonials.length === 0) {
    return (
      <section className="relative py-12 sm:py-16 lg:py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-4xl mx-auto">
          {/* Section Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-rose-100 text-rose-700 text-sm font-medium mb-4">
              Success Stories
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
              Real Stories, Real Matches
            </h2>
          </div>

          {/* Empty State Card */}
          <div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden p-8 sm:p-12 text-center">
            {/* Decorative Background */}
            <div className="absolute inset-0 opacity-5">
              <div className="absolute top-0 right-0 w-48 h-48 bg-rose-300 rounded-full blur-3xl"></div>
              <div className="absolute bottom-0 left-0 w-48 h-48 bg-pink-300 rounded-full blur-3xl"></div>
            </div>

            {/* Heart Icon Illustration */}
            <div className="relative mb-6 flex justify-center">
              <div className="relative">
                {/* Animated hearts */}
                <div className="absolute -top-2 -left-2 text-rose-200 animate-pulse">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                  </svg>
                </div>
                <div className="absolute -top-4 -right-4 text-pink-200 animate-pulse" style={{ animationDelay: '0.5s' }}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                  </svg>
                </div>
                
                {/* Main Icon */}
                <div className="w-24 h-24 bg-gradient-to-br from-rose-100 to-pink-100 rounded-full flex items-center justify-center">
                  <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" className="text-rose-500">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                  </svg>
                </div>
              </div>
            </div>

            {/* Text Content */}
            <h3 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3">
              Be the First to Share Your Story!
            </h3>
            <p className="text-gray-600 text-base sm:text-lg mb-6 max-w-md mx-auto">
              Every great love story starts somewhere. Share yours and inspire others on their journey to find their perfect match.
            </p>

            {/* Call to Action Button */}
            <button
              onClick={handleViewAll}
              className="inline-flex items-center gap-2 px-6 py-3 bg-pink-600 text-white font-semibold rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4"/>
              </svg>
              Share Your Story
            </button>
              {/* <button
              onClick={() => navigate("/PremiumPayment")}
              className="mt-3 px-8 py-3 rounded-full bg-pink-600 text-white font-semibold shadow-lg 
             hover:bg-pink-700 hover:scale-105 transition-all duration-300 flex items-center 
             justify-center gap-2"
            ></button> */}

            {/* Decorative Element */}
            <div className="mt-8 flex items-center justify-center gap-2 text-gray-400">
              <div className="w-12 h-px bg-gradient-to-r from-transparent to-gray-300"></div>
              <span className="text-sm">Your story matters</span>
              <div className="w-12 h-px bg-gradient-to-l from-transparent to-gray-300"></div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  const currentTestimonial = testimonials[currentIndex];

  return (
    <section className="relative py-12 sm:py-16 lg:py-8 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-gray-50 to-white" style={{ fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif" }}>
      <div className="max-w-6xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center px-4 py-2 rounded-full bg-rose-100 text-rose-700 text-sm font-medium mb-4">
            Success Stories
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
            Real Stories, Real Matches
          </h2>
          <p className="text-gray-600 text-base sm:text-lg max-w-2xl mx-auto">
            Discover how couples found their perfect match through our platform
          </p>
        </div>

        {/* Main Testimonial Card */}
        <div className="relative bg-white rounded-3xl shadow-2xl border border-gray-100 overflow-hidden mb-10 max-w-5xl mx-auto">
          {/* Decorative Background Pattern */}
          <div className="absolute inset-0 opacity-5">
            <div className="absolute top-0 right-0 w-48 h-48 bg-rose-300 rounded-full blur-3xl"></div>
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-pink-300 rounded-full blur-3xl"></div>
          </div>
          
          {/* Decorative Corner Elements */}
          <div className="absolute top-3 right-3 w-16 h-16 opacity-10">
            <svg viewBox="0 0 100 100" className="w-full h-full text-rose-500">
              <path d="M 20,20 Q 50,10 80,20 Q 90,50 80,80 Q 50,90 20,80 Q 10,50 20,20" fill="currentColor" />
            </svg>
          </div>
          <div className="absolute bottom-3 left-3 w-12 h-12 opacity-10">
            <svg viewBox="0 0 100 100" className="w-full h-full text-pink-500">
              <circle cx="50" cy="50" r="40" fill="currentColor" />
            </svg>
          </div>
          
          <div className="grid md:grid-cols-5 gap-0 relative z-10">
            {/* Image Section - 2 columns */}
            <div className="md:col-span-2 relative overflow-hidden p-4 sm:p-6 bg-gradient-to-br from-rose-50/30 to-pink-50/30 flex items-center justify-center">
              <div className="relative w-full h-[220px] flex items-center justify-center">
                {/* Decorative Hearts */}
                <div className="absolute top-2 left-2 text-rose-300 opacity-50">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                  </svg>
                </div>
                <div className="absolute bottom-2 right-2 text-pink-300 opacity-50">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                  </svg>
                </div>
                
                <img
                  key={currentIndex}
                  src={getImageUrl(currentTestimonial.image)}
                  alt={currentTestimonial.names}
                  className="w-full h-full rounded-2xl shadow-xl object-cover transition-opacity duration-500 ring-2 ring-rose-100"
                  onError={(e) => {
                    e.currentTarget.src = "/placeholder-image.jpg";
                  }}
                />
              </div>
            </div>

            {/* Content Section - 3 columns */}
            <div className="md:col-span-3 p-4 sm:p-6 flex flex-col justify-center relative">
              {/* Large Decorative Quote Mark */}
              <div className="absolute top-2 left-2 text-rose-200 opacity-20 text-6xl leading-none select-none" style={{ fontFamily: "Georgia, serif" }}>"</div>
              
              {/* Quote */}
              <blockquote className="mb-4 max-w-md relative z-10">
                <div className="space-y-2">
                  {getQuoteLines(currentTestimonial.story).map((line, index) => (
                    <p 
                      key={index} 
                      className="text-sm sm:text-base text-gray-800 leading-relaxed font-normal text-left"
                    >
                      {index === 0 ? `"${line}` : index === getQuoteLines(currentTestimonial.story).length - 1 ? `${line}"` : line}
                    </p>
                  ))}
                </div>
              </blockquote>

              {/* Author Info with decorative line */}
              <div className="flex items-center justify-start border-t-2 border-rose-100 pt-3 relative">
                <div className="absolute -top-0.5 left-0 w-12 h-0.5 bg-gradient-to-r from-rose-500 to-pink-500"></div>
                <div>
                  <h4 className="text-sm sm:text-base font-bold text-gray-900">
                    {currentTestimonial.names}
                  </h4>
                  {currentTestimonial.location && (
                    <p className="text-xs text-gray-500">{currentTestimonial.location}</p>
                  )}
                  {currentTestimonial.marriedDate && (
                    <p className="text-xs text-gray-400">{currentTestimonial.marriedDate}</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Thumbnail Navigation */}
        <div className="flex flex-col items-center gap-5">
          {/* Avatar Thumbnails with Navigation Arrows */}
          <div className="flex items-center justify-center gap-4">
            {/* Left Arrow */}
            <button
              onClick={handlePrevious}
              className="w-10 h-10 rounded-full bg-rose-600 hover:bg-rose-700 shadow-lg flex items-center justify-center transition-all hover:scale-110"
              aria-label="Previous testimonial"
            >
              <ChevronLeft className="w-5 h-5 text-white" />
            </button>

            {/* Avatar Thumbnails */}
            <div className="flex items-center justify-center gap-4 flex-wrap">
              {testimonials.slice(0, Math.min(5, testimonials.length)).map((testimonial, index) => (
                <button
                  key={testimonial.id}
                  onClick={() => handleDotClick(index)}
                  className={`relative rounded-full overflow-hidden transition-all duration-300 ${
                    index === currentIndex
                      ? "w-14 h-14 ring-4 ring-rose-500 ring-offset-2"
                      : "w-11 h-11 opacity-50 hover:opacity-100 hover:scale-110"
                  }`}
                  aria-label={`View ${testimonial.names} testimonial`}
                >
                  <img
                    src={getImageUrl(testimonial.image)}
                    alt={testimonial.names}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.currentTarget.src = "/placeholder-image.jpg";
                    }}
                  />
                </button>
              ))}
              
              {/* Last Avatar with View All Overlay - Only show if more than 5 stories */}
              {testimonials.length > 5 && (
                <button
                  onClick={handleViewAll}
                  className="relative rounded-full overflow-hidden transition-all duration-300 w-11 h-11 opacity-50 hover:opacity-100 hover:scale-110"
                  aria-label="View all stories"
                >
                  <img
                    src={getImageUrl(testimonials[5].image)}
                    alt="View all"
                    className="w-full h-full object-cover blur-[2px]"
                    onError={(e) => {
                      e.currentTarget.src = "/placeholder-image.jpg";
                    }}
                  />
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                    <span className="text-white text-[9px] font-semibold text-center leading-tight">
                      View<br />all
                    </span>
                  </div>
                </button>
              )}
            </div>

            {/* Right Arrow */}
            <button
              onClick={handleNext}
              className="w-10 h-10 rounded-full bg-rose-600 hover:bg-rose-700 shadow-lg flex items-center justify-center transition-all hover:scale-110"
              aria-label="Next testimonial"
            >
              <ChevronRight className="w-5 h-5 text-white" />
            </button>
          </div>

          {/* Progress Indicators */}
          <div className="flex items-center gap-2">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => handleDotClick(index)}
                className={`transition-all duration-300 rounded-full ${
                  index === currentIndex
                    ? "w-8 h-2 bg-rose-600"
                    : "w-2 h-2 bg-gray-300 hover:bg-gray-400"
                }`}
                aria-label={`Go to testimonial ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;