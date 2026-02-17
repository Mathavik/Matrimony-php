import React, { useState } from "react";
import { Lightbulb, HelpCircle, ChevronRight, ExternalLink } from "lucide-react";
import faqImage from "../../components/assets/faq.png";

const categories = [
  {
    title: "Getting Started",
    faqs: [
      {
        q: "How do I register on WedAura Matrimony?",
        a: "Click the 'Register Now' button on the homepage and fill in your basic details. Once submitted, your profile will be created instantly.",
      },
      {
        q: "Can I view profiles without registering?",
        a: "You can browse sample profiles, but to view full biodata and contact details, registration is required.",
      },
      {
        q: "How can I edit my profile after registration?",
        a: "Go to Dashboard → Profile → Edit Profile. You can update personal info, preferences, and photos anytime.",
      },
      {
        q: "Is verification mandatory?",
        a: "We recommend verifying your phone and email for better trust and higher visibility.",
      },
      {
        q: "Can I hide my profile temporarily?",
        a: "Yes, you can hide your profile using the ‘Hide Profile’ option in account settings.",
      },
    ],
  },
  {
    title: "Viewing Profiles",
    faqs: [
      {
        q: "Can I see all profiles after I register?",
        a: "Yes, once registered, you can explore and view other members' profiles that match your preferences.",
      },
      {
        q: "Will my profile be visible to everyone?",
        a: "Profile visibility depends on your privacy settings. You can choose to show or hide contact details.",
      },
      {
        q: "Are all profiles verified?",
        a: "We manually verify each profile and photo. Verified profiles display a ‘Verified’ badge.",
      },
      {
        q: "How do I shortlist profiles I like?",
        a: "Click the heart or ‘Add to Shortlist’ button on any profile. View them later in your dashboard.",
      },
    ],
  },
  {
    title: "Payments & Subscription",
    faqs: [
      {
        q: "Is WedAura Matrimony free to use?",
        a: "Basic registration is free. Premium plans unlock contact details and interest messages.",
      },
      {
        q: "What payment options are available?",
        a: "We support UPI, credit/debit cards, and net banking. All transactions are 100% secure.",
      },
      {
        q: "If I pay, can I access all profiles?",
        a: "Yes, premium members get unlimited access to verified profiles and contact details.",
      },
      {
        q: "Will my subscription auto-renew?",
        a: "No, subscriptions do not auto-renew. You can manually renew anytime.",
      },
      {
        q: "Can I get a refund if I cancel early?",
        a: "Refunds aren’t available once a premium plan is activated.",
      },
    ],
  },
  {
    title: "Profile & Account",
    faqs: [
      {
        q: "Can I delete my profile anytime?",
        a: "Yes. Go to 'Settings' → 'Account' → 'Delete Profile'.",
      },
      {
        q: "Can I upload more than one photo?",
        a: "Yes, multiple photos are allowed. We suggest clear and formal photos for better response.",
      },
      {
        q: "How can I get more visibility?",
        a: "Complete your profile, upload a photo, verify details, and stay active — verified profiles rank higher.",
      },
      {
        q: "How can I change my password?",
        a: "Go to Settings → Security → Change Password and update your details.",
      },
      {
        q: "Forgot password?",
        a: "Click ‘Forgot Password’ on the login page and follow email verification.",
      },
    ],
  },
  {
    title: "Support & Help",
    faqs: [
      {
        q: "How do I contact support?",
        a: "Email support@wedauramatrimony.com or use Live Chat on the Contact page.",
      },
      {
        q: "What are support hours?",
        a: "Support is available 9:00 AM – 9:00 PM, Monday to Sunday.",
      },
      {
        q: "Can I report fake profiles?",
        a: "Yes. Click ‘Report Profile’ on any user’s page — our team reviews every report promptly.",
      },
    ],
  },
];

export default function FaqPage() {
  const [activeCategory, setActiveCategory] = useState("Getting Started");

  return (
    <div className="min-h-screen bg-white mt-2 sm:mt-8 overflow-x-hidden">
      {/* Header Section */}
      <section className="flex flex-col lg:flex-row items-center justify-between px-3 sm:px-8 md:px-12 lg:px-16 py-8 sm:py-14 bg-gray-50 border-b border-gray-200">
        {/* Text Section */}
        <div className="max-w-xl text-center lg:text-left order-2 lg:order-1 mt-4 lg:mt-0">
          <h1 className="text-2xl sm:text-4xl md:text-5xl font-extrabold text-gray-800 mb-2 sm:mb-4 tracking-tight">
            WedAura <span className="text-rose-600">FAQ Center</span>
          </h1>
          <p className="text-gray-600 text-xs sm:text-base mb-3 sm:mb-6 px-1 sm:px-0">
            If you’re new to WedAura or want to understand our features better, this guide helps you learn more about how our matrimony platform works.
          </p>
          <p className="text-gray-500 text-xs sm:text-base px-1 sm:px-0 flex items-center justify-center lg:justify-start">
            Already have an account? Visit your{" "}
            <a
              href="#"
              className="text-rose-600 font-semibold underline hover:text-rose-700 transition flex items-center ml-1"
            >
              Find Your Partner <ExternalLink className="ml-1 h-3 sm:h-4 w-3 sm:w-4" />
            </a>
          </p>
        </div>

        {/* Image Section */}
        <div className="order-1 lg:order-2 flex justify-center w-full lg:w-auto">
          <img
            src={faqImage}
            alt="FAQ Illustration"
            className="w-[180px] h-[180px] sm:w-[250px] sm:h-[250px] md:w-[330px] md:h-[330px] lg:w-[420px] lg:h-[420px] object-contain"
          />
        </div>
      </section>

      {/* Main FAQ Section */}
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row gap-6 sm:gap-10 py-8 sm:py-14 px-3 sm:px-6">
        {/* Sidebar */}
        <aside className="md:w-1/4 bg-gray-50 p-3 sm:p-5 rounded-xl shadow-inner border border-gray-200 h-fit">
          <h3 className="text-base sm:text-lg font-bold text-gray-800 mb-3 sm:mb-4 border-b pb-2">
            FAQ Topics
          </h3>
          <ul className="flex flex-col gap-1.5 sm:gap-3">
            {categories.map((cat) => (
              <li
                key={cat.title}
                onClick={() => setActiveCategory(cat.title)}
                className={`cursor-pointer text-xs sm:text-base font-medium transition-all duration-200 p-2 sm:p-3 rounded-lg flex items-center ${
                  activeCategory === cat.title
                    ? "text-rose-700 bg-rose-50 border-l-4 border-rose-600 font-semibold"
                    : "text-gray-700 hover:bg-gray-100"
                }`}
              >
                <ChevronRight
                  className={`mr-1.5 sm:mr-2 transition-transform ${
                    activeCategory === cat.title ? "text-rose-600" : "text-gray-400"
                  }`}
                />
                {cat.title}
              </li>
            ))}
          </ul>
        </aside>

        {/* FAQ Content */}
        <div className="md:w-3/4 bg-white rounded-xl shadow-lg p-4 sm:p-8 border border-gray-100">
          <h2 className="text-xl sm:text-3xl font-bold mb-5 sm:mb-8 text-gray-800 border-b pb-3">
            {activeCategory}
          </h2>
          <div className="space-y-4 sm:space-y-6">
            {categories
              .find((cat) => cat.title === activeCategory)
              ?.faqs.map((faq, index) => (
                <div
                  key={index}
                  className="bg-gray-50 rounded-lg p-3 sm:p-5 border border-gray-200 shadow-sm hover:border-rose-300 transition-all duration-200"
                >
                  <h3 className="font-extrabold text-gray-800 mb-2 text-sm sm:text-lg flex items-center">
                    <HelpCircle className="mr-2 sm:mr-3 text-rose-600 h-4 sm:h-5 w-4 sm:w-5 flex-shrink-0" />
                    {faq.q}
                  </h3>
                  <p className="text-gray-600 leading-relaxed text-xs sm:text-base flex items-start pl-6 sm:pl-8">
                    <Lightbulb className="mr-2 sm:mr-3 text-rose-500 h-3 sm:h-4 w-3 sm:w-4 mt-0.5 sm:mt-1 flex-shrink-0" />
                    {faq.a}
                  </p>
                </div>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
}
