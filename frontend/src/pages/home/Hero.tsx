import React, { useState, useEffect } from 'react';
import { CheckCircle, Users } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import heroImage1 from '../../components/assets/profileimg.png';
// import heroImage2 from '../../assets/hero2.jpg';
const Hero: React.FC = () => {
  const navigate = useNavigate();
  const [headingIndex, setHeadingIndex] = useState(0);
  const [displayText, setDisplayText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);

  const headings = ['Life Partner', 'Perfect Match', 'Soulmate', 'True Love'];

  const heroImages = [
   heroImage1,
  ];

  useEffect(() => {
    const current = headings[headingIndex];
    const timeout = setTimeout(() => {
      if (!isDeleting && displayText !== current) {
        setDisplayText(current.substring(0, displayText.length + 1));
      } else if (isDeleting && displayText) {
        setDisplayText(current.substring(0, displayText.length - 1));
      } else if (!isDeleting && displayText === current) {
        setTimeout(() => setIsDeleting(true), 1800);
      } else if (isDeleting && !displayText) {
        setIsDeleting(false);
        setHeadingIndex((i) => (i + 1) % headings.length);
      }
    }, isDeleting ? 50 : 100);
    return () => clearTimeout(timeout);
  }, [displayText, isDeleting, headingIndex]);

  return (
    <>
      <style>{`
        @keyframes slideInLeft { from {opacity:0;transform:translateX(-60px);} to {opacity:1;transform:none;} }
        @keyframes slideInRight { from {opacity:0;transform:translateX(60px);} to {opacity:1;transform:none;} }
        @keyframes blob {0%{transform:translate(0,0) scale(1);}33%{transform:translate(10px,-10px) scale(1.05);}66%{transform:translate(-10px,10px) scale(.95);}100%{transform:translate(0,0) scale(1);} }
        @keyframes gradientMove {0%{background-position:0% 50%;}50%{background-position:100% 50%;}100%{background-position:0% 50%;}}
        .animate-slideInLeft{animation:slideInLeft 1s ease-out both;}
        .animate-slideInRight{animation:slideInRight 1s ease-out both;}
        .animate-blob{animation:blob 10s ease-in-out infinite;}
        .gradient-text{
          background:linear-gradient(90deg,#ec4899,#f43f5e,#9333ea,#ec4899);
          -webkit-background-clip:text;
          -webkit-text-fill-color:transparent;
          background-size:300%;
          animation:gradientMove 3s ease-in-out infinite;
        }
      `}</style>

      <section className="relative min-h-[70vh] md:min-h-[85vh] flex items-start md:items-center pt-12 md:pt-0 bg-white overflow-hidden">
        <div className="absolute -top-16 -left-20 w-64 h-64 bg-pink-100/30 rounded-full blur-3xl animate-blob"></div>
        <div className="absolute -bottom-24 -right-24 w-72 h-72 bg-purple-100/30 rounded-full blur-3xl animate-blob"></div>

        <div className="max-w-7xl mx-auto px-6 md:px-10 lg:px-16 grid md:grid-cols-2 items-center gap-12 lg:gap-20 relative z-10">
          {/* LEFT CONTENT */}
          <div className="animate-slideInLeft flex flex-col items-center md:items-start text-center md:text-left gap-6">
            <div className="flex items-center gap-2 px-4 py-2 bg-white border border-pink-200 rounded-full shadow-sm">
              <CheckCircle className="w-4 h-4 text-pink-600" />
              <span className="text-sm font-medium text-gray-700">
                Trusted Matrimony Platform
              </span>
            </div>

            <h1 className="text-[2.3rem] sm:text-[3rem] lg:text-[3.6rem] font-extrabold leading-tight text-gray-900">
              <span className="block mb-1">Discover Your</span>
              <span className="gradient-text font-extrabold">
                {displayText}
                <span className="text-pink-600 animate-pulse">|</span>
              </span>
            </h1>

            <p className="text-gray-600 text-base sm:text-lg max-w-lg leading-relaxed">
              Join Matrimony and find your ideal partner. Connect with people
              who share your values and interests. Start your journey to lasting
              happiness today.
            </p>

            <button
              onClick={() => navigate('/brides&groom')}
              className="mt-3 px-8 py-3 rounded-full bg-pink-600 text-white font-semibold shadow-lg 
                         hover:bg-pink-700 hover:scale-105 transition-all duration-300 flex items-center 
                         justify-center gap-2"
            >
              <Users className="w-5 h-5 text-white" />
              Browse Profiles
            </button>
          </div>

{/* RIGHT IMAGES */}
<div className="animate-slideInRight relative flex justify-center md:justify-end w-full">
  <div className="w-full h-[50vh] sm:h-[60vh] md:h-[50vh] lg:h-[80vh] rounded-2xl overflow-hidden">
    <img
      src={heroImages[0]}
      alt="Couple"
      className="object-cover w-full h-full hover:scale-105 transition-transform duration-500"
    />
  </div>




            
            </div>
          </div>
      </section>
    </>
  );
};

export default Hero;
