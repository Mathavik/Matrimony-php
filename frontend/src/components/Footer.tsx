import React from "react";
import {
  Heart,
  Phone,
  Mail,
  MapPin,
  Facebook,
  Twitter,
  Instagram,
  Youtube,
  ChevronRight,
} from "lucide-react";
import logo from "../components/assets/logoblack.png";

const Footer: React.FC = () => {
  // Define social media links and their corresponding icons
  const socialLinks = [
    { name: "Facebook", icon: Facebook, href: "#" }, // Replace '#' with actual URLs
    { name: "Twitter", icon: Twitter, href: "#" },
    { name: "Instagram", icon: Instagram, href: "#" },
    { name: "YouTube", icon: Youtube, href: "#" },
  ];

  // Define Quick Links for a better footer structure
  const quickLinks = [
    { name: "About Us", href: "#" },
    { name: "How It Works", href: "#" },
    { name: "Success Stories", href: "#" },
    { name: "Privacy Policy", href: "#" },
    { name: "Terms & Conditions", href: "#" },
  ];

  return (
    <footer className="relative overflow-hidden text-white pt-16 pb-8 px-4 sm:px-6 lg:px-8 bg-gray-900 border-t-8 border-pink-600/50">
      <style>{`
        @keyframes float {0%,100%{transform:translateY(0)}50%{transform:translateY(-6px)}}
        .animate-float { animation: float 6s ease-in-out infinite }
      `}</style>

      <div className="relative max-w-7xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 lg:gap-12">
          {/* ===== Brand Section - Span 2 columns on small screens for prominence ===== */}

          <div className="col-span-2 md:col-span-1 space-y-5">
            <div className="flex justify-start items-center ml-8">
              <img
                src={logo}
                alt="WedAura"
                className="h-12 w-auto object-contain"
              />
            </div>
            <p className="text-gray-400 leading-relaxed text-sm max-w-xs text-left ml-8">
              Your Journey to Love Starts with WedAura. We connect hearts with traditional values and modern technology.
            </p>
          </div>

          {/* ===== Quick Links ===== */}
          <div className="col-span-1">
            <h3 className="text-xl font-bold mb-5 text-pink-400 border-b-2 border-pink-500 w-fit pb-1">
              QUICK LINKS
            </h3>
            <ul className="space-y-3">
              {quickLinks.map((link) => (
                <li key={link.name}>
                  <a
                    href={link.href}
                    className="flex items-center text-gray-400 hover:text-pink-300 transition-colors duration-200 text-sm group"
                  >
                    <ChevronRight className="w-3 h-3 mr-2 group-hover:translate-x-1 transition-transform duration-200 text-pink-500" />
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* ===== Contact Info - Moved to the right for better flow ===== */}
          <div className="col-span-2 md:col-span-1">
            <h3 className="text-xl font-bold mb-5 text-pink-400 border-b-2 border-pink-500 w-fit pb-1">
              GET IN TOUCH
            </h3>
            <div className="space-y-4 text-gray-400 text-sm">
              <div>
                <div className="flex items-start">
                  <MapPin className="w-5 h-5 flex-shrink-0 animate-float text-pink-500 mt-0.5 mr-2" />
                  <address className="not-italic leading-relaxed">
                    4th Floor, Square Building, Metro Train,<br />
                    MG Road, Tamil Nadu, India - 682016
                  </address>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <Phone className="w-5 h-5 flex-shrink-0 animate-float text-pink-500" />
                <div className="flex flex-col">
                  <a href="tel:+917000066670" className="hover:text-pink-300 transition-colors">+91 7000066670</a>
                  <a href="tel:+919000018833" className="hover:text-pink-300 transition-colors">+91 9000018833</a>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <Mail className="w-5 h-5 flex-shrink-0 animate-float text-pink-500" />
                <a href="mailto:info@wedauramatrimony.com" className="hover:text-pink-300 transition-colors">
                  info@wedauramatrimony.com
                </a>
              </div>
            </div>
          </div>

          {/* ===== Social Media - Separate column for better arrangement ===== */}
          <div className="col-span-2 md:col-span-1">
            <h3 className="text-xl font-bold mb-5 text-pink-400 border-b-2 border-pink-500 w-fit pb-1">
              SOCIAL MEDIA
            </h3>
            <div className="flex space-x-4">
              {socialLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  aria-label={link.name}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 bg-pink-600/20 rounded-full flex items-center justify-center text-pink-300 hover:bg-pink-600 hover:text-white transition-all duration-300 hover:scale-110 shadow-lg"
                >
                  <link.icon className="w-5 h-5" />
                </a>
              ))}
            </div>
            {/* Optional: Add a small, animated element to signify the dating/love theme */}
            <div className="mt-6 flex items-center space-x-2 text-gray-400 text-sm">
              <p>Made with</p>
              <Heart className="w-4 h-4 text-red-500 animate-pulse" />
              <p>in India.</p>
            </div>
          </div>
        </div>

        {/* ===== Footer Bottom (Copyright) ===== */}
        <div className="border-t border-gray-700 mt-12 pt-6 text-center text-gray-500 text-sm">
          <p>
            &copy; {new Date().getFullYear()} **WedAura**. All rights reserved. | Developed by [Your Company Name]
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;