import React from "react";
import { Sparkles, Heart, Users, Award, ArrowRight, ArrowLeft } from "lucide-react";
import { useNavigate } from 'react-router-dom';
import left from "../../components/assets/whyelite-left.svg";
import right from "../../components/assets/whyelite-left.svg";

const cardData = [
  {
    imageSrc:
      "https://www.shaadidukaan.com/vogue/wp-content/uploads/2020/03/Candid-photography.jpg",
    title: "Understanding Your Preferences",
    description:
      "Your personal Relationship Manager will deeply understand your lifestyle, preferences, and cultural nuances to find your ideal match.",
    icon: Heart,
    color: "from-rose-500 to-pink-500"
  },
  {
    imageSrc:
      "https://media.glamour.com/photos/5c031b9852bd185ffa1a47ed/master/pass/45389948_209635203284257_6766680322904051719_n.jpg",
    title: "Recommending Matches",
    description:
      "We handpick and recommend the most compatible matches that fit your preferences, saving you valuable time.",
    icon: Sparkles,
    color: "from-rose-700 to-pink-600"
  },
  {
    imageSrc:
      "https://pros.weddingpro.com/wp-content/uploads/2020/10/How-to-Close-a-Sale_Sultan-Shah_shutterstock.com_.png",
    title: "Connecting with Prospects",
    description:
      "Once mutual interest is confirmed, we schedule smooth and respectful meetings for you and your families.",
    icon: Users,
    color: "from-rose-500 to-pink-500"
  },
];

const CTA = () => {
  const navigate = useNavigate();
  return (
    <div className="relative flex flex-col items-center w-full py-8 sm:py-12 md:py-16 lg:py-10 bg-gradient-to-br from-slate-50 via-purple-50/30 to-pink-50/30 overflow-hidden">
      {/* ---------- Enhanced Animations ---------- */}
      <style>{`
        @keyframes blob {
          0%, 100% { transform: translate(0, 0) scale(1) rotate(0deg); }
          25% { transform: translate(30px, -30px) scale(1.1) rotate(90deg); }
          50% { transform: translate(-20px, 20px) scale(0.9) rotate(180deg); }
          75% { transform: translate(20px, 30px) scale(1.05) rotate(270deg); }
        }
        @keyframes blobAlt {
          0%, 100% { transform: translate(0, 0) scale(1) rotate(0deg); }
          33% { transform: translate(-25px, 25px) scale(1.08) rotate(120deg); }
          66% { transform: translate(25px, -20px) scale(0.92) rotate(240deg); }
        }
        @keyframes cardFloat {
          0%, 100% { transform: translateY(0) rotate(0deg); }
          50% { transform: translateY(-12px) rotate(1deg); }
        }
        @keyframes fadeInUp {
          0% { opacity: 0; transform: translateY(40px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        @keyframes slideInLeft {
          0% { opacity: 0; transform: translateX(-60px); }
          100% { opacity: 1; transform: translateX(0); }
        }
        @keyframes slideInRight {
          0% { opacity: 0; transform: translateX(60px); }
          100% { opacity: 1; transform: translateX(0); }
        }
        @keyframes scaleIn {
          0% { opacity: 0; transform: scale(0.8); }
          100% { opacity: 1; transform: scale(1); }
        }
        @keyframes shimmer {
          0% { background-position: -200% center; }
          100% { background-position: 200% center; }
        }
        @keyframes pulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.8; transform: scale(1.05); }
        }
        @keyframes bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-5px); }
        }
        @keyframes iconSpin {
          0% { transform: rotate(0deg) scale(1); }
          50% { transform: rotate(180deg) scale(1.1); }
          100% { transform: rotate(360deg) scale(1); }
        }
        @keyframes decorFloat {
          0%, 100% { transform: translateY(0) rotate(0deg); }
          33% { transform: translateY(-15px) rotate(5deg); }
          66% { transform: translateY(5px) rotate(-5deg); }
        }
        @keyframes decorFloatAlt {
          0%, 100% { transform: translateY(0) rotate(0deg) scale(1); }
          50% { transform: translateY(-10px) rotate(-3deg) scale(1.05); }
        }
        .animate-blob { animation: blob 15s ease-in-out infinite; }
        .animate-blobAlt { animation: blobAlt 18s ease-in-out infinite; }
        .animate-cardFloat { animation: cardFloat 5s ease-in-out infinite; }
        .animate-fadeInUp { animation: fadeInUp 0.8s cubic-bezier(0.2, 0.8, 0.4, 1) both; }
        .animate-slideInLeft { animation: slideInLeft 0.9s cubic-bezier(0.2, 0.8, 0.4, 1) both; }
        .animate-slideInRight { animation: slideInRight 0.9s cubic-bezier(0.2, 0.8, 0.4, 1) both; }
        .animate-scaleIn { animation: scaleIn 0.7s cubic-bezier(0.2, 0.8, 0.4, 1) both; }
        .animate-shimmer { animation: shimmer 3s linear infinite; background-size: 200% 100%; }
        .animate-pulse-custom { animation: pulse 3s ease-in-out infinite; }
        .animate-bounce-custom { animation: bounce 2s ease-in-out infinite; }
        .animate-iconSpin { animation: iconSpin 3s ease-in-out infinite; }
        .animate-decorFloat { animation: decorFloat 6s ease-in-out infinite; }
        .animate-decorFloatAlt { animation: decorFloatAlt 7s ease-in-out infinite; }
      `}</style>

      {/* ---------- Left & Right SVG Decorations - Mobile Optimized ---------- */}
      <img
        src={left}
        alt="Decor Left"
        className="absolute -left-4 top-0 w-20 h-20 xs:w-24 xs:h-24 sm:w-32 sm:h-32 md:w-40 md:h-40 lg:w-44 lg:h-44 opacity-60 z-[5] pointer-events-none"
      />
      <img
        src={right}
        alt="Decor Right"
        className="absolute -right-4 top-0 w-20 h-20 xs:w-24 xs:h-24 sm:w-32 sm:h-32 md:w-40 md:h-40 lg:w-44 lg:h-44 opacity-60 z-[5] -scale-x-100 pointer-events-none"
      />


      {/* Animated Blob Backgrounds */}
      <div className="pointer-events-none absolute -left-10 sm:-left-16 md:-left-20 top-12 sm:top-16 md:top-24 w-32 h-32 sm:w-48 sm:h-48 md:w-60 md:h-60 bg-gradient-to-br from-pink-300/30 to-purple-300/30 rounded-full mix-blend-multiply blur-2xl sm:blur-3xl opacity-60 animate-blob" />
      <div className="pointer-events-none absolute -right-10 sm:-right-16 md:-right-20 bottom-12 sm:bottom-16 md:bottom-20 w-40 h-40 sm:w-56 sm:h-56 md:w-64 md:h-64 bg-gradient-to-br from-blue-300/30 to-cyan-300/30 rounded-full mix-blend-multiply blur-2xl sm:blur-3xl opacity-60 animate-blobAlt" />
      <div className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 sm:w-64 sm:h-64 md:w-80 md:h-80 bg-gradient-to-br from-purple-200/20 to-pink-200/20 rounded-full mix-blend-multiply blur-3xl opacity-40 animate-blob" style={{ animationDelay: '2s' }} />

      {/* ---------- Heading with Enhanced Styling - Mobile Optimized ---------- */}
      <div className="relative z-10 text-center mb-6 sm:mb-8 md:mb-10 lg:mb-12 px-4 xs:px-5 sm:px-6 animate-fadeInUp mt-8 xs:mt-10 sm:mt-12 md:mt-4">
        <div className="inline-flex items-center gap-1.5 sm:gap-2 bg-gradient-to-r from-purple-100 to-pink-100 px-2.5 py-1 xs:px-3 xs:py-1.5 sm:px-4 sm:py-2 rounded-full mb-2 xs:mb-3 sm:mb-4 animate-scaleIn">
          <Award className="w-3 h-3 xs:w-3.5 xs:h-3.5 sm:w-4 sm:h-4 text-purple-600 animate-iconSpin" />
          <span className="text-[9px] xs:text-[10px] sm:text-xs md:text-sm font-semibold text-purple-700 uppercase tracking-wide">Premium Service</span>
        </div>

        <h2 className="text-lg xs:text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-extrabold tracking-tight mb-1.5 xs:mb-2 sm:mb-3 animate-shimmer bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 bg-clip-text text-transparent leading-tight px-2">
          How Our Elite Service Works
        </h2>

        <p className="text-[10px] xs:text-[11px] sm:text-xs md:text-sm lg:text-base text-gray-600 max-w-xs xs:max-w-sm sm:max-w-xl md:max-w-2xl mx-auto animate-fadeInUp px-2" style={{ animationDelay: '0.2s' }}>
          Experience matchmaking redefined with personalized care
        </p>
      </div>

      {/* ---------- Cards with Enhanced Mobile Design ---------- */}
      <div className="relative z-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 xs:gap-4 sm:gap-5 md:gap-6 max-w-7xl px-3 xs:px-4 sm:px-5 md:px-8 w-full">
        {cardData.map((card, index) => {
          const Icon = card.icon;
          return (
            <div
              key={index}
              className="group bg-white/80 backdrop-blur-xl rounded-xl xs:rounded-2xl sm:rounded-3xl border-2 border-white shadow-lg hover:shadow-2xl hover:-translate-y-2 sm:hover:-translate-y-3 transition-all duration-500 flex flex-col overflow-hidden animate-fadeInUp"
              style={{ animationDelay: `${index * 0.15}s` }}
            >
            {/* Image Container with Overlay */}
<div className="relative overflow-hidden">
  <img
    src={card.imageSrc}
    alt={card.title}
    // **Change is here:** Removed animate-cardFloat and style prop
    className="w-full h-32 xs:h-36 sm:h-40 md:h-44 lg:h-48 object-cover transform transition-transform duration-700 group-hover:scale-110" 
  />

  {/* Dark overlay on hover (subtle) */}
  <div className={`absolute inset-0 bg-black opacity-0 transition-opacity duration-300 ${card.title === 'Recommending Matches' ? 'group-hover:opacity-30' : 'group-hover:opacity-20'}`}></div>
</div>

              {/* Content */}
              <div className="p-2.5 xs:p-3 sm:p-4 md:p-5 lg:p-6 flex flex-col flex-grow">
                {/* Title: special hover styles per card */}
                {card.title === 'Connecting with Prospects' ? (
                  <h3 className="text-xs xs:text-sm sm:text-base md:text-lg lg:text-xl font-bold text-gray-800 mb-1.5 xs:mb-2 sm:mb-2.5 md:mb-3 transition-all duration-300 leading-tight group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-rose-500 group-hover:to-pink-500 group-hover:bg-clip-text">
                    {card.title}
                  </h3>
                ) : card.title === 'Understanding Your Preferences' ? (
                  <h3 className="text-xs xs:text-sm sm:text-base md:text-lg lg:text-xl font-bold text-gray-800 mb-1.5 xs:mb-2 sm:mb-2.5 md:mb-3 transition-all duration-300 leading-tight group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-rose-500 group-hover:to-pink-500 group-hover:bg-clip-text">
                    {card.title}
                  </h3>
                ) : card.title === 'Recommending Matches' ? (
                  <h3 className="text-xs xs:text-sm sm:text-base md:text-lg lg:text-xl font-bold text-gray-800 mb-1.5 xs:mb-2 sm:mb-2.5 md:mb-3 transition-all duration-300 leading-tight group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-rose-500 group-hover:to-pink-500 group-hover:bg-clip-text">
                    {card.title}
                  </h3>
                ) : (
                  <h3 className="text-xs xs:text-sm sm:text-base md:text-lg lg:text-xl font-bold text-gray-800 mb-1.5 xs:mb-2 sm:mb-2.5 md:mb-3 transition-colors duration-300 leading-tight group-hover:text-white">
                    {card.title}
                  </h3>
                )}
                <p className="text-[10px] xs:text-[11px] sm:text-xs md:text-sm lg:text-base text-gray-600 leading-relaxed flex-grow">
                  {card.description}
                </p>

                {/* Decorative Line */}
                <div className={`mt-2 xs:mt-2.5 sm:mt-3 md:mt-4 h-0.5 w-0 group-hover:w-full bg-gradient-to-r ${card.color} transition-all duration-500 rounded-full`}></div>
              </div>
            </div>
          );
        })}
      </div>

      {/* ---------- Enhanced CTA Button ---------- */}
      <div className="relative z-10 mt-5 xs:mt-6 sm:mt-8 md:mt-10 lg:mt-12 animate-fadeInUp px-3" style={{ animationDelay: '0.6s' }}>
        <button
          onClick={() => navigate('/brides&groom')}
          className="gradient-btn group relative text-white font-bold text-[10px] xs:text-xs sm:text-sm md:text-base lg:text-lg py-2 px-5 xs:py-2.5 xs:px-6 sm:py-3 sm:px-8 md:py-3.5 md:px-10 lg:py-4 lg:px-12 rounded-full hover:scale-105 transition-all duration-300 overflow-hidden flex items-center justify-center gap-2"
        >
          <span className="relative flex items-center gap-1.5 xs:gap-2">
            <span>Find Your Matchmaking Profiles</span>
            <ArrowLeft className="w-3 h-3 xs:w-3.5 xs:h-3.5 sm:w-4 sm:h-4 md:w-5 md:h-5 transform rotate-180" />
          </span>
        </button>

      </div>

      {/* Floating Particles */}
      <div className="absolute top-40 right-20 w-1.5 h-1.5 xs:w-2 xs:h-2 sm:w-2.5 sm:h-2.5 md:w-3 md:h-3 rounded-full bg-purple-400 animate-bounce-custom opacity-60" style={{ animationDelay: '0.5s' }}></div>
      <div className="absolute bottom-32 left-1/4 w-1 h-1 xs:w-1.5 xs:h-1.5 sm:w-2 sm:h-2 rounded-full bg-blue-400 animate-bounce-custom opacity-60" style={{ animationDelay: '1s' }}></div>
      <div className="absolute bottom-20 right-1/3 w-1.5 h-1.5 xs:w-2 xs:h-2 sm:w-2.5 sm:h-2.5 md:w-3 md:h-3 rounded-full bg-cyan-400 animate-bounce-custom opacity-60" style={{ animationDelay: '1.5s' }}></div>
    </div>
  );
};

export default CTA;

