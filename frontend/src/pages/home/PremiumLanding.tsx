import React from "react";
import { Crown, Check, Sparkles, Star } from "lucide-react";
import { useNavigate } from "react-router-dom";
import premiumimg from "../../components/assets/premiumimg.png";

const PremiumLanding = () => {
  const navigate = useNavigate();

  return (
    <div className="bg-white">

      {/* HERO + FEATURES COMBINED */}
      <div className="relative bg-white pt-16 pb-16 px-6 overflow-hidden">

        {/* TOP/BOTTOM GLOWS */}
        <div className="absolute top-0 right-0 w-[250px] h-[250px] bg-pink-300 blur-[120px] opacity-30"></div>
        <div className="absolute bottom-0 left-0 w-[250px] h-[250px] bg-pink-200 blur-[130px] opacity-30"></div>

        <div className="relative max-w-6xl mx-auto grid md:grid-cols-2 gap-6 items-center">

          {/* LEFT SIDE */}
          <div className="text-center md:text-left space-y-3 md:space-y-4">
            {/* <div className="inline-flex w-20 h-20 bg-gradient-to-br from-yellow-400 to-yellow-600
          rounded-2xl items-center justify-center shadow-lg animate-pulse">
          <Crown className="w-10 h-10 text-white drop-shadow-lg" />
        </div> */}

            <h1 className="text-2xl md:text-4xl font-extrabold text-gray-900 leading-snug">
              Unlock Your <span className="text-pink-600">Premium</span> Matchmaking Experience
            </h1>

            <p className="text-gray-700 text-xs md:text-base max-w-md leading-snug">
              Premium users get priority visibility, unlimited access, and AI-powered smart matchmaking
              for faster, high-quality connections.
            </p>
            <button
              onClick={() => navigate("/PremiumPayment")}
              className="mt-3 px-8 py-3 rounded-full bg-pink-600 text-white font-semibold shadow-lg 
             hover:bg-pink-700 hover:scale-105 transition-all duration-300 flex items-center 
             justify-center gap-2"
            >
              <Star className="w-5 h-5" />
              Explore Premium Plans
            </button>

          </div>

          {/* FEATURES BELOW HERO (COMPACT, NO RIGHT IMAGE) */}
          <div className="max-w-5xl mx-auto mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              "Unlimited profile views",
              "Send unlimited interests",
              "See who viewed your profile",
              "Boost your profile ranking",
              "Premium customer support",
              "AI-based smart partner suggestions",
              "Advanced Filter Options",
              "Priority Profile Visibility",
            ].map((item, index) => (
              <div
                key={index}
                className="flex items-center gap-3 bg-white/60 backdrop-blur-md shadow rounded-xl p-3
            border border-pink-100 hover:shadow-lg hover:border-pink-300 transition-all duration-200"
              >

                <div className="w-10 h-10 flex items-center justify-center bg-pink-600 rounded-full shadow-lg">
                  <Check className="w-5 h-5 text-white" />
                </div>
                <p className="text-gray-800 font-medium text-xs md:text-sm">{item}</p>
              </div>
            ))}
          </div>

        </div>

      </div>
    </div>

  );
};

export default PremiumLanding;
