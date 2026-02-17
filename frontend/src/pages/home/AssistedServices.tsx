import React from "react";
import { CheckCircle2, MessageCircle, Clock4, Video, Users, UserCheck } from "lucide-react";

const AssistedService: React.FC = () => {
  return (
    <section className="py-16 md:py-24 px-4 sm:px-6 lg:px-10 bg-gradient-to-b from-gray-50 via-white to-gray-50">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-4">
          <p className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-2">
            MEET FROM HOME
          </p>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900">
            Impress them Over the{" "}
            <span className="text-pink-600">Distance</span>
          </h2>
        </div>

        {/* Main Content Grid */}
        <div className="grid md:grid-cols-2 gap-8 md:gap-12 lg:gap-16 mt-12">
          {/* Left Side - Feature List */}
          <div className="space-y-10">
            {/* Feature 1 */}
            <div className="group">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-12 h-12 bg-pink-100 rounded-full flex items-center justify-center group-hover:bg-pink-200 transition-colors">
                  <Users className="w-6 h-6 text-pink-600" />
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-gray-900 mb-2 w-1">
                    Jeevansathi Match Hour
                  </h3>
                  <div className="h-0.5 w-16 bg-pink-600 mb-3"></div>
                  <p className="text-gray-600 leading-relaxed">
                    Register to join an online event to connect with members of your community in a short time
                  </p>
                </div>
              </div>
            </div>

            {/* Feature 2 */}
            <div className="group">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-12 h-12 bg-pink-100 rounded-full flex items-center justify-center group-hover:bg-pink-200 transition-colors">
                  <Video className="w-6 h-6 text-pink-600" />
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-gray-900 mb-2 w-1">
                    Voice & Video Calling
                  </h3>
                  <div className="h-0.5 w-16 bg-pink-600 mb-3"></div>
                  <p className="text-gray-600 leading-relaxed">
                    Enjoy secure conversations using our voice & video calling services without revealing your number
                  </p>
                </div>
              </div>
            </div>

            {/* Feature 3 */}
            <div className="group">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-12 h-12 bg-pink-100 rounded-full flex items-center justify-center group-hover:bg-pink-200 transition-colors">
                  <UserCheck className="w-6 h-6 text-pink-600" />
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-gray-900 mb-2 w-1">
                    Introducing Video Profiles
                  </h3>
                  <div className="h-0.5 w-16 bg-pink-600 mb-3"></div>
                  <p className="text-gray-600 leading-relaxed">
                    Stand out amongst others and engage faster! Introduce yourself by adding a video to your profile
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Side - Decorative Card */}
          <div className="flex items-center justify-center">
            <div className="relative w-full max-w-md">
              {/* Main Card */}
              <div className="bg-gradient-to-br from-pink-50 to-purple-50 rounded-3xl p-8 shadow-2xl border border-pink-100 relative overflow-hidden">
                {/* Decorative Elements */}
                <div className="absolute top-4 right-4 w-20 h-20 bg-pink-200 rounded-full opacity-30 blur-2xl"></div>
                <div className="absolute bottom-4 left-4 w-24 h-24 bg-purple-200 rounded-full opacity-30 blur-2xl"></div>
                
                {/* Content */}
                <div className="relative z-10 text-center">
                  <div className="w-32 h-32 mx-auto bg-white rounded-2xl shadow-lg flex items-center justify-center mb-6 transform hover:scale-105 transition-transform">
                    <Video className="w-16 h-16 text-pink-600" />
                  </div>
                  
                  <h3 className="text-2xl font-bold text-gray-900 mb-3">
                    Present yourself better
                  </h3>
                  
                  <p className="text-gray-600 text-sm mb-6">
                    Connect virtually and make lasting impressions with secure video features
                  </p>
                  
                  {/* Feature Badges */}
                  <div className="flex flex-wrap justify-center gap-2 mb-6">
                    <span className="px-4 py-2 bg-white rounded-full text-xs font-semibold text-pink-600 shadow-sm border border-pink-100">
                      HD Video
                    </span>
                    <span className="px-4 py-2 bg-white rounded-full text-xs font-semibold text-pink-600 shadow-sm border border-pink-100">
                      Secure Calls
                    </span>
                    <span className="px-4 py-2 bg-white rounded-full text-xs font-semibold text-pink-600 shadow-sm border border-pink-100">
                      Privacy First
                    </span>
                  </div>

                  {/* Stats Grid */}
                  <div className="grid grid-cols-3 gap-3">
                    {[
                      { icon: <CheckCircle2 className="w-5 h-5" />, label: "Verified", value: "100%" },
                      { icon: <MessageCircle className="w-5 h-5" />, label: "Response", value: "Fast" },
                      { icon: <Clock4 className="w-5 h-5" />, label: "Save Time", value: "50%" }
                    ].map((item, i) => (
                      <div key={i} className="bg-white rounded-xl p-3 shadow-sm border border-pink-50 hover:shadow-md transition-shadow">
                        <div className="flex justify-center mb-2 text-pink-600">
                          {item.icon}
                        </div>
                        <p className="text-xs font-semibold text-gray-900">{item.value}</p>
                        <p className="text-xs text-gray-500">{item.label}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              
              {/* Floating Accent Icons */}
              <div className="absolute -top-4 -left-4 w-10 h-10 bg-pink-500 rounded-full flex items-center justify-center shadow-lg animate-pulse">
                <MessageCircle className="w-5 h-5 text-white" />
              </div>
              <div className="absolute -bottom-4 -right-4 w-10 h-10 bg-purple-500 rounded-full flex items-center justify-center shadow-lg animate-pulse" style={{ animationDelay: '0.5s' }}>
                <Video className="w-5 h-5 text-white" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AssistedService;