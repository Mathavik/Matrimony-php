import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast"; // ✅ Toast
import bannerImgDesktop from "../../components/assets/generated-image2.png";
import bannerImgMobile from "../../components/assets/mobilebanner.jpg";

type RelationKey =
  | "Myself"
  | "Daughter"
  | "Son"
  | "Sister"
  | "Brother"
  | "Relative"
  | "Friend";

const relations: RelationKey[] = [
  "Myself",
  "Daughter",
  "Son",
  "Sister",
  "Brother",
  "Relative",
  "Friend",
];

const relationsRequiringGender = ["Myself", "Relative", "Friend"];

const labelMap: Record<string, string> = {
  "Myself - Male": "Enter your name",
  "Myself - Female": "Enter your name",
  "Relative - Male": "Enter Relative's Male Name",
  "Relative - Female": "Enter Relative's Female Name",
  "Friend - Male": "Enter Friend's Male Name",
  "Friend - Female": "Enter Friend's Female Name",
  Son: "Enter Son's Name",
  Daughter: "Enter Daughter's Name",
  Brother: "Enter Brother's Name",
  Sister: "Enter Sister's Name",
};

const Banner: React.FC = () => {
  const navigate = useNavigate();
  const [showDropdown, setShowDropdown] = useState(false);
  const [relation, setRelation] = useState("");
  const [gender, setGender] = useState("");
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [showOtpModal, setShowOtpModal] = useState(false);
  const [otp, setOtp] = useState<string[]>(["", "", "", "", "", ""]);

  // ⭐ User already logged in?
  const isLoggedIn = !!localStorage.getItem("token");
  // ✅ Email validation function
  const validateEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  // ✅ Function to handle relation selection with default genders
  const handleRelationSelect = (r: RelationKey) => {
    setRelation(r);

    if (relationsRequiringGender.includes(r)) {
      // For Myself, Relative, Friend → ask user gender
      setGender("");
      setShowDropdown(true);
    } else {
      // Default genders for Daughter, Son, Sister, Brother
      switch (r) {
        case "Daughter":
        case "Sister":
          setGender("Female");
          break;
        case "Son":
        case "Brother":
          setGender("Male");
          break;
        default:
          setGender("");
      }
      setShowDropdown(false);
    }
  };

  const getRelationDisplayText = (): string => {
    if (!relation) return "Select";
    if (relationsRequiringGender.includes(relation) && gender)
      return `${relation} - ${gender}`;
    return relation;
  };

  const isAwaitingGender =
    relationsRequiringGender.includes(relation) && !gender;

  // ✅ Updated dropdown options to use handleRelationSelect
  const dropdownOptions = isAwaitingGender
    ? [
      {
        key: "Male",
        text: "Male",
        action: () => {
          setGender("Male");
          setShowDropdown(false);
        },
      },
      {
        key: "Female",
        text: "Female",
        action: () => {
          setGender("Female");
          setShowDropdown(false);
        },
      },
    ]
    : relations.map((r) => ({
      key: r,
      text: r,
      action: () => handleRelationSelect(r),
    }));



  // ✅ Send OTP API
  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateEmail(email)) return toast.error("Please enter a valid email!");
    if (!name) return toast.error("Please enter a name!");
    if (!relation) return toast.error("Please select relation!");
    if (relationsRequiringGender.includes(relation) && !gender)
      return toast.error("Please select gender!");

    try {
      const response = await fetch("http://localhost/Matrimony-php/backend/api/otp/sendOtp.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, name, relation, gender }),
      });
      const data = await response.json();

      if (response.ok) {
        toast.success(data.message);
        setShowOtpModal(true);
      } else {
        // ✅ **THIS IS WHERE YOUR SNIPPET GOES**
        if (data.code === "ALREADY_REGISTERED") {
          toast("You have already registered with this email.");
          return; // Stop further execution, no OTP modal
        } else {
          toast.error(data.message || "Error sending OTP");
        }
      }
    } catch (error) {
      console.error(error);
      toast.error("Server error. Try again later.");
    }
  };


  const handleOtpChange = (index: number, value: string) => {
    if (/^\d?$/.test(value)) {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);
      if (value && index < 5) {
        const next = document.getElementById(`otp-${index + 1}`);
        next?.focus();
      }
    }
  };

  // ✅ Verify OTP API
  const handleVerifyOtp = async () => {
    if (otp.join("").length !== 6) return toast.error("Please enter all 6 digits of OTP");

    try {
      const response = await fetch("http://localhost/Matrimony-php/backend/api/otp/verifyOtp.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp: otp.join("") }),
      });
      const data = await response.json();

      if (response.ok) {
        toast.success(data.message);
        setShowOtpModal(false);
        sessionStorage.setItem("otpVerified", "true");
        sessionStorage.setItem("user", JSON.stringify(data.user));
        navigate("/register");
      } else {
        // Friendly user messages
        switch (data.code) {
          case "INVALID_OTP":
            toast.error("Oops! The OTP you entered is incorrect. Try again.");
            break;
          case "OTP_EXPIRED":
            toast.error("Your OTP has expired. Please request a new one.");
            setShowOtpModal(false);
            break;
          case "ALREADY_REGISTERED":
            toast("You have already registered with this email.", { icon: "✅" });
            setShowOtpModal(false);
            break;
          default:
            toast.error(data.message || "Something went wrong. Please try again.");
        }
      }
    } catch (error) {
      console.error(error);
      toast.error("Server error. Please try again later.");
    }
  };



  return (
    <section className="relative h-screen flex items-end justify-end bg-cover bg-center overflow-hidden">
      {/* Toast Container */}
      <Toaster position="top-right" reverseOrder={false} />

      <div
        className="absolute inset-0 bg-cover bg-center md:hidden"
        style={{ backgroundImage: `url(${bannerImgMobile})` }}
      ></div>
      <div
        className="absolute inset-0 bg-cover bg-center hidden md:block"
        style={{ backgroundImage: `url(${bannerImgDesktop})` }}
      ></div>
      <div className="absolute inset-0 bg-gradient-to-r from-black/40 via-[#3c1f06]/40 to-transparent"></div>

      {/* Welcome Card for Logged-in Users */}
      {/* {isLoggedIn && (
        <div
          className="
      relative z-10 w-[90%] sm:w-[400px] rounded-3xl p-8 mb-8 mr-4 sm:mr-8 
      shadow-[0_0_60px_rgba(0,0,0,0.4)] 
      backdrop-blur-2xl 
      border border-white/50 
      animate-fadeInUp
    "
          style={{
            background:
              "linear-gradient(145deg, rgba(255,255,255,0.22), rgba(255,255,255,0.05))",
            border: "1.8px solid rgba(255,255,255,0.55)",
            WebkitBackdropFilter: "blur(25px)",
            backdropFilter: "blur(25px)",
          }}
        >
          <div className="flex justify-center mb-4">
            <div className="w-20 h-20 bg-gradient-to-br from-[#E91E63] to-[#D81B60] rounded-full flex items-center justify-center shadow-xl shadow-pink-500/30 border-2 border-white/60">
              <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
          </div>

          <h2 className="text-center text-2xl font-bold mb-2 drop-shadow-lg" style={{ color: '#E91E63' }}>
            Welcome Back!
          </h2>
          <p className="text-center text-white/90 text-sm mb-6 font-medium">
            You're already logged in to your matrimony profile
          </p>

          <div className="bg-white/10 backdrop-blur-md rounded-xl p-4 mb-6 border border-white/30">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse shadow-lg shadow-green-400/50"></div>
              <span className="text-sm font-semibold text-white">Profile Active</span>
            </div>
            <p className="text-xs text-white/80 leading-relaxed">
              Your profile is live and visible to potential matches. Continue exploring to find your perfect partner!
            </p>
          </div>

        </div>
      )} */}

      {/* Registration Box */}
      {!isLoggedIn && (
        <div
          className="
      relative z-10 
      w-[92%] sm:w-[380px]          /* Mobile width reduced */
      rounded-2xl sm:rounded-3xl    /* Mobile smaller rounding */
      p-4 sm:p-6                    /* Mobile padding reduced */
      mb-6 mx-auto sm:mr-8          /* Mobile center + less margin */
      shadow-lg sm:shadow-[0_0_60px_rgba(0,0,0,0.4)] 
      backdrop-blur-2xl 
      border border-white/40 
      animate-fadeInUp
  "
          style={{
            background:
              "linear-gradient(145deg, rgba(255,255,255,0.22), rgba(255,255,255,0.05))",
            border: "1.4px solid rgba(255,255,255,0.45)",
            WebkitBackdropFilter: "blur(20px)",
            backdropFilter: "blur(20px)",
          }}
        >


          {/* Title */}
          <h2 className="text-center text-[22px] font-bold text-white mb-1">
            Create a Matrimony Profile
          </h2>
          {/* Subtitle */}
          <p className="text-center text-white/90 font-medium text-sm mb-4">
            Find your perfect match
          </p>

          <form className="space-y-4" onSubmit={handleRegister}>
            {/* Profile created for */}
            <div className="relative z-30">
              <label className="block w-full text-left text-white text-sm font-medium mb-2">
                Profile created for
              </label>

              <div className="border border-gray-300 rounded-md">
                <button
                  type="button"
                  onClick={() =>
                    isAwaitingGender ? null : setShowDropdown(!showDropdown)
                  }
                  className="w-full px-4 py-2.5 text-left text-sm flex items-center justify-between bg-white rounded-md"
                >
                  <span
                    className={
                      getRelationDisplayText() !== "Select"
                        ? "text-gray-900"
                        : "text-gray-500"
                    }
                  >
                    {getRelationDisplayText()}
                  </span>
                  <svg
                    className={`w-5 h-5 transition-transform ${showDropdown ? "rotate-180" : ""
                      }`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </button>

                {showDropdown && (
                  <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-300 rounded-md shadow-lg z-40 p-2">
                    <div
                      className={`grid ${dropdownOptions.length > 2 ? "grid-cols-3" : "grid-cols-2"
                        } gap-2`}
                    >
                      {isAwaitingGender && (
                        <div className="col-span-full text-center py-1 text-sm font-semibold text-gray-600 border-b border-dashed mb-1">
                          Select Gender for {relation}
                        </div>
                      )}

                      {dropdownOptions.map((opt) => (
                        <button
                          key={opt.key}
                          type="button"
                          onClick={opt.action}
                          className={`py-1.5 text-sm rounded-md border transition-all duration-150 ${opt.key === getRelationDisplayText() ||
                            (isAwaitingGender &&
                              (opt.key === "Male" || opt.key === "Female"))
                            ? "bg-[#E91E63] text-white border-[#E91E63]"
                            : "border-gray-300 hover:border-[#E91E63] hover:bg-pink-50"
                            }`}
                        >
                          {opt.text}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Name */}
            <div>
              <label className="block w-full text-left text-white text-sm mb-1 font-medium">
                {labelMap[getRelationDisplayText()] || "Enter Name"}
              </label>

              <input
                type="text"
                placeholder={labelMap[getRelationDisplayText()] || "Enter Name"}
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full border border-gray-300 rounded-md px-4 py-2.5 text-sm focus:ring-2 focus:ring-[#E91E63] focus:outline-none"
                required
              />
            </div>

            {/* Email */}
            <div>
              <label className="block w-full text-left text-white text-sm mb-1 font-medium">
                Enter Email Address
              </label>


              <input
                type="email"
                placeholder="Enter Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full border border-gray-300 rounded-md px-4 py-2.5 text-sm focus:ring-2 focus:ring-[#E91E63] focus:outline-none"
                required
              />
              <p className="text-xs text-white/80 mt-1 text-left">
                OTP will be sent to this email
              </p>
            </div>

            <button
              type="submit"
              className="w-full py-2.5 rounded-md transition-all mt-2 font-semibold text-[15px] flex items-center justify-center gap-2 bg-[#E91E63] hover:bg-[#D81B60] text-white shadow-md"
            >
              REGISTER NOW
            </button>
          </form>
        </div>
      )}
      {/* OTP Modal */}
      {showOtpModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl w-[90%] max-w-sm text-center">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">
              Enter 6-Digit OTP
            </h3>
            <p className="text-sm text-gray-500 mb-4">
              OTP sent to <b>{email}</b>
            </p>
            <div className="flex justify-center gap-2 mb-4">
              {otp.map((num, index) => (
                <input
                  key={index}
                  id={`otp-${index}`}
                  type="text"
                  maxLength={1}
                  value={num}
                  onChange={(e) => handleOtpChange(index, e.target.value)}
                  className="w-10 h-10 text-center border border-gray-400 rounded-md text-lg focus:ring-2 focus:ring-[#E91E63] outline-none"
                />
              ))}
            </div>
            <button
              onClick={handleVerifyOtp}
              className="bg-[#E91E63] hover:bg-[#D81B60] text-white font-semibold px-6 py-2 rounded-md"
            >
              Verify OTP
            </button>
          </div>
        </div>
      )}

      <style>{`
        @keyframes fadeInUp {
          0% { opacity: 0; transform: translateY(40px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeInUp { animation: fadeInUp 0.9s ease-out forwards; }
      `}</style>
    </section>
  );
};

export default Banner;
