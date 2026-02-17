import React from "react";
import {
  Mail,
  Phone,
  MapPin,
  MessageCircle,
  Headphones,
  ArrowRight,
} from "lucide-react";

export default function MatrimonyContact() {
  return (
    <div className="min-h-screen bg-white text-gray-900 font-sans">
      {/* ===== HERO SECTION ===== */}
      <div className="relative overflow-hidden min-h-screen flex flex-col justify-center items-center text-center px-4 sm:px-6 md:px-10">
        <div className="absolute inset-0">
          <img
            src="https://media.istockphoto.com/id/866987706/photo/indian-wedding-hands.jpg?s=612x612&w=0&k=20&c=6L-u9qhFPv9MjDnF4UK4AqjVbDKM4_8Xad72IHhwPZE="
            alt="Couple Background"
            className="w-full h-full object-cover brightness-75"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/30 to-black/60"></div>
        </div>

        <div className="relative z-10 text-white mt-24 sm:mt-40">
          <div className="inline-flex items-center gap-2 px-4 py-2 sm:px-6 sm:py-3 bg-white/20 backdrop-blur-sm rounded-full border border-white/30 shadow-lg animate-[fadeInDown_1s_ease-out]">
            <MessageCircle className="text-white animate-pulse" size={18} />
            <span className="font-semibold text-sm sm:text-base">Connect With Us</span>
          </div>

          <h1 className="text-3xl sm:text-5xl md:text-6xl font-bold mt-6 mb-4 leading-tight drop-shadow-[0_3px_8px_rgba(0,0,0,0.7)]">
            <span className="inline-block bg-gradient-to-r from-white via-gray-100 to-gray-300 bg-clip-text text-transparent animate-[slideInLeft_1s_ease-out]">
              Let's Start Your
            </span>
            <br />
            <span className="inline-block bg-gradient-to-r from-gray-200 via-gray-100 to-white bg-clip-text text-transparent animate-[slideInRight_1s_ease-out]">
              Journey Together
            </span>
          </h1>

          <p className="text-sm sm:text-lg max-w-md sm:max-w-2xl mx-auto mb-8 leading-relaxed font-medium animate-[fadeIn_1s_ease-out_0.8s_both] text-gray-100">
            Have questions? Need help? We're just a message away from making your dream come true!
          </p>
        </div>
      </div>

      {/* ===== CONTACT SECTION ===== */}
      <section className="max-w-7xl mx-auto px-4 sm:px-8 py-12 md:py-20 grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
{/* LEFT DETAILS */}
<div className="space-y-5 sm:space-y-6 text-left">

  <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900">
    Contact Us
  </h2>

  <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
    Our team is here to assist you in finding your perfect partner.
  </p>

 {/* ADDRESS BLOCK */}
<div className="space-y-2">   {/* gap reduce panniten */}

  {/* ADDRESS TITLE + ICON */}
  <div className="flex items-center gap-2">
    <MapPin className="text-pink-500" size={22} />
    <h3 className="font-semibold text-lg text-gray-800">
      Address
    </h3>
  </div>

  {/* ADDRESS LINES — now starts IMMEDIATELY, no gap */}
  <div className="ml-8 text-sm sm:text-base text-gray-600 leading-relaxed space-y-1">
    <p>Corporate Office, Royal Deligt Matrimony</p>
    <p>4nd Floor, Square Building, Metro Train,</p>
    <p>MG Road, Tamil Nadu, India - 682016</p>
  </div>

</div>


  <div className="space-y-4 text-sm sm:text-base mt-2">
    <div className="flex items-center gap-3">
      <Phone className="text-pink-500" size={20} />
      <p>+91 7000066670, +91 9000018833</p>
    </div>

    <div className="flex items-center gap-3">
      <Mail className="text-pink-500" size={20} />
      <p>info@wedauramatrimony.com</p>
    </div>

    <div className="flex items-center gap-3">
      <MapPin className="text-pink-500" size={20} />
      <p>Tamil Nadu</p>
    </div>
  </div>

</div>



        {/* RIGHT IMAGE + CARDS */}
        <div className="relative animate-[slideImage_1s_ease-out]">
          <img
            src="https://staticlearn.shine.com/l/m/images/blog/mobile/roles_and_responsibilities_of_customer_support_executive.webp"
            alt="Support Staff"
            className="w-full rounded-2xl shadow-xl"
          />

          {/* Floating Cards - Responsive Row, smaller on mobile, over image */}
          {/* <div className="absolute -bottom-5 left-1/2 -translate-x-1/2 flex gap-2 sm:gap-3 justify-center w-full max-w-[340px] sm:max-w-[480px]"> */}
            {/* WhatsApp */}
            {/* <div
              className="bg-white p-1.5 sm:p-3 rounded-lg shadow-md flex items-center gap-1.5 sm:gap-2 hover:shadow-lg transition-all animate-[slideFromRight_0.7s_ease-out] flex-1 max-w-[90px] sm:max-w-[160px]"
              style={{ animationDelay: "0.1s" }}
            >
              <MessageCircle className="text-green-500 shrink-0" size={15} />
              <div>
                <p className="font-semibold text-gray-800 text-[10px] sm:text-sm truncate">Chat</p>
                <p className="text-[9px] sm:text-xs text-gray-500 flex items-center gap-1 truncate">
                  WhatsApp <ArrowRight size={10} />
                </p>
              </div>
            </div> */}

            {/* Call */}
            {/* <div
              className="bg-white p-1.5 sm:p-3 rounded-lg shadow-md flex items-center gap-1.5 sm:gap-2 hover:shadow-lg transition-all animate-[slideFromRight_0.7s_ease-out] flex-1 max-w-[90px] sm:max-w-[160px]"
              style={{ animationDelay: "0.3s" }}
            >
              <Phone className="text-blue-500 shrink-0" size={15} />
              <div>
                <p className="font-semibold text-gray-800 text-[10px] sm:text-sm truncate">Call</p>
                <p className="text-[9px] sm:text-xs text-gray-500 truncate">7034776667</p>
              </div>
            </div> */}

            {/* Support */}
            {/* <div
              className="bg-white p-1.5 sm:p-3 rounded-lg shadow-md flex items-center gap-1.5 sm:gap-2 hover:shadow-lg transition-all animate-[slideFromRight_0.7s_ease-out] flex-1 max-w-[90px] sm:max-w-[160px]"
              style={{ animationDelay: "0.5s" }}
            >
              <Headphones className="text-pink-500 shrink-0" size={15} />
              <div>
                <p className="font-semibold text-gray-800 text-[10px] sm:text-sm truncate">Support</p>
                <p className="text-[9px] sm:text-xs text-gray-500 truncate">Write</p>
              </div>
            </div> */}
          {/* </div> */}
        </div>
      </section>

      {/* ===== GOOGLE MAP ===== */}
      <div className="w-full h-[300px] sm:h-[400px] mt-10 rounded-none overflow-hidden">
        <iframe
          title="Nest Matrimony Location"
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3929.4086582574685!2d76.28291517485859!3d9.981635190122671!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3b080d4d67172ea3%3A0x75e15d6f6cfbf5e3!2sNest%20Matrimony!5e0!3m2!1sen!2sin!4v1697451203845!5m2!1sen!2sin"
          width="100%"
          height="100%"
          allowFullScreen
          loading="lazy"
          className="border-0"
        ></iframe>
      </div>

      {/* ===== ANIMATIONS ===== */}
      <style>{`
        @keyframes fadeInDown {
          from { opacity: 0; transform: translateY(-30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes slideInLeft {
          from { opacity: 0; transform: translateX(-100px); }
          to { opacity: 1; transform: translateX(0); }
        }
        @keyframes slideInRight {
          from { opacity: 0; transform: translateX(100px); }
          to { opacity: 1; transform: translateX(0); }
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slideFromRight {
          0% {opacity:0; transform:translateX(100px);}
          100% {opacity:1; transform:translateX(0);}
        }
        @keyframes slideImage {
          0% {opacity:0; transform:translateX(80px);}
          100% {opacity:1; transform:translateX(0);}
        }
      `}</style>
    </div>
  );
}
