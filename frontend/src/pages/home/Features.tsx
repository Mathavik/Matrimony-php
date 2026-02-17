import React from "react";
import { Users, UserCheck, Lock } from "lucide-react";
import couple from "../../components/assets/generated-image.png";
const MatrimonyExperience: React.FC = () => {
  return (
    <section className="py-6 sm:py-8 md:py-3 px-3 sm:px-6 lg:px-10 bg-gradient-to-b from-white via-slate-50 to-white overflow-hidden relative">
      {/* ---------- Basic Animation ---------- */}
      <style>{`
        @keyframes fadeUp { 
          0% {opacity:0; transform:translateY(16px);} 
          100% {opacity:1; transform:none;} 
        }
        @keyframes floatY { 
          0%,100%{ transform:translateY(0);} 
          50%{ transform:translateY(-6px);} 
        }
        .animate-fadeUp { animation: fadeUp .7s ease-out both; }
        .animate-floatY { animation: floatY 6s ease-in-out infinite; }
      `}</style>

      <div className="max-w-11xl mx-auto relative z-10">
        {/* ---------- MATRIMONY EXPERIENCE ---------- */}
        <div className="w-full py-6 sm:py-8 px-3 sm:px-6 md:px-10 flex flex-col md:flex-row items-center justify-between gap-8 md:gap-24 animate-fadeUp">
          {/* Left Image */}
          <div className="flex-1 flex justify-center md:justify-start">
            <div className="relative">
              {/* Decorative Frame */}
              <div className="absolute inset-0 -z-10">
                <svg viewBox="0 0 400 500" className="w-full h-full">
                  <defs>
                    <linearGradient id="frameGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#D4AF37" />
                      <stop offset="50%" stopColor="#F4E5C3" />
                      <stop offset="100%" stopColor="#D4AF37" />
                    </linearGradient>
                  </defs>
                  {/* Ornate frame paths */}
                  <path d="M 50,10 Q 30,10 20,30 L 20,470 Q 20,490 40,490 L 360,490 Q 380,490 380,470 L 380,30 Q 380,10 360,10 Z"
                    fill="none" stroke="url(#frameGradient)" strokeWidth="3" />
                  {/* Corner decorations */}
                  <circle cx="50" cy="50" r="15" fill="url(#frameGradient)" opacity="0.6" />
                  <circle cx="350" cy="50" r="15" fill="url(#frameGradient)" opacity="0.6" />
                  <circle cx="50" cy="450" r="15" fill="url(#frameGradient)" opacity="0.6" />
                  <circle cx="350" cy="450" r="15" fill="url(#frameGradient)" opacity="0.6" />
                </svg>
              </div>

              <img
                src={couple}
                alt="Elite Matrimony Couple"
                className="w-[300px] xs:w-[340px] sm:w-[380px] md:w-[440px] object-cover rounded-3xl shadow-lg transition-transform duration-700 hover:scale-105 animate-floatY"
              />
            </div>
          </div>

          {/* Right Content */}
          <div className="flex-1 text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start gap-2 mb-3">
              <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900">
                Matrimony
              </h2>
            </div>

            <h3 className="text-lg sm:text-xl text-[#E91E63] font-semibold mb-5 leading-snug">
              The Largest And Most Successful Matrimony Service
            </h3>

            <div className="space-y-5 text-left">
              {[
                {
                  icon: <Users className="text-white w-5 h-5 sm:w-6 sm:h-6" />,
                  title: "Largest pool of elite profiles",
                  desc: "Access the most exclusive and verified set of elite matches for higher compatibility.",
                },
                {
                  icon: <UserCheck className="text-white w-5 h-5 sm:w-6 sm:h-6" />,
                  title: "Experienced Relationship Managers",
                  desc: "Dedicated Relationship Managers shortlist profiles that align with your preferences.",
                },
                {
                  icon: <Lock className="text-white w-5 h-5 sm:w-6 sm:h-6" />,
                  title: "100% Confidential Service",
                  desc: "Your personal details remain private and shared only with your consent.",
                },
              ].map((item, i) => (
                <div
                  key={i}
                  className="flex items-start gap-3 sm:gap-4 animate-fadeUp"
                  style={{ animationDelay: `${i * 0.15}s` }}
                >
                  <div className="bg-gradient-to-br from-pink-500 via-rose-500 to-pink-600 w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center rounded-full shadow-lg flex-shrink-0 hover:scale-110 transition-transform duration-300">
                    {item.icon}
                  </div>
                  <div>
                    <h4 className="text-sm sm:text-lg font-bold text-gray-900">
                      {item.title}
                    </h4>
                    <p className="text-[13px] sm:text-sm text-gray-700 mt-1">
                      {item.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default MatrimonyExperience;