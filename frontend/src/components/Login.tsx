import React, { useState, useCallback } from "react";
import {
  Heart,
  Eye,
  EyeOff,
  Loader2,
  User,
  Lock,
  ArrowRight,
  X,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

interface FormErrors {
  loginId?: string;
  password?: string;
  submit?: string;
}
const Login = () => {
  const [open, setOpen] = useState(true); // 🔥 Popup open on page load

  const [loginId, setLoginId] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});

  const [statusMessage, setStatusMessage] = useState("");
  const [showRegisterPopup, setShowRegisterPopup] = useState(false);
  const navigate = useNavigate();
  const { setUserName } = useAuth();

  // Validation
  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};   // ⭐ FIXED TYPE

    if (!loginId.trim()) newErrors.loginId = "Login ID is required.";
    if (!password) newErrors.password = "Password is required.";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle Submit
  const handleSubmit = useCallback(
    async (e: React.FormEvent<HTMLFormElement>) => {  // ⭐ FIXED TYPE
      e.preventDefault();
      setStatusMessage("");

      if (!validateForm()) return;

      setIsLoading(true);

      try {
        // 🔥 First check if loginId exists
        const checkResponse = await fetch(
          "http://localhost/Matrimony-php/backend/api/Register/getUsers.php"
        );

        const result = await checkResponse.json();
        const users = result.users || [];

        const userExists = users.some(
          (user: any) => user.email === loginId
        );
        console.log("Login ID not found:", loginId);

        if (!userExists) {
          console.log("Login ID not found:", loginId);
          setShowRegisterPopup(true);
          setIsLoading(false);
          return;
        }

        // ✅ If exists → Continue Login API
        const response = await fetch(
          "http://localhost/Matrimony-php/backend/api/Register/login.php",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email: loginId, password }),
          }
        );

        const data = await response.json();

        if (response.ok) {
          setStatusMessage(data.message);

          const userNameFromDB = data.user?.fullName || "";
          localStorage.setItem("token", data.token);
          localStorage.setItem("userName", userNameFromDB);
          localStorage.setItem("userId", data.user?.id);
          setUserName(userNameFromDB);

          setTimeout(
            () => navigate(`/userdashboard?userId=${data.user?.id || ""}`),
            1000
          );
        } else {
          setErrors({ submit: data.message });
        }
      }
      catch (err) {
        setErrors({ submit: "Network error. Try again later." });
      } finally {
        setIsLoading(false);
      }
    },
    [loginId, password, navigate, setUserName]
  );
  const handleClose = () => {
    window.location.href = '/';
  };



  if (!open) return null;

  return (
    <>
      {/* 🔥 Background Overlay */}
      <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-start justify-center z-50">

        {/* 🔥 Animated Popup Box */}
        <div
          className="relative mt-10 w-full max-w-md bg-white rounded-xl shadow-xl p-8 
  animate-[slideDown_0.4s_ease-out]"
        >

          {/* Close Button */}
          <button
            onClick={handleClose}

            className="absolute right-4 top-4 text-gray-500 hover:text-black"
          >
            <X className="w-6 h-6" />
          </button>

          {/* Title Section */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-rose-100 rounded-full mb-4">
              <Heart className="w-8 h-8 text-rose-600" fill="currentColor" />
            </div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">Welcome Back</h1>
            <p className="text-gray-600">Sign in to continue your journey</p>
          </div>

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* LoginID */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2 text-left">
                Login ID
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  value={loginId}
                  onChange={(e) => setLoginId(e.target.value)}
                  className="w-full pl-11 px-4 py-3 bg-gray-50 border rounded-lg focus:ring-2 focus:ring-rose-200 focus:border-rose-500"
                  placeholder="Enter your email"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2 text-left">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-11 pr-11 px-4 py-3 bg-gray-50 border rounded-lg focus:ring-2 focus:ring-rose-200 focus:border-rose-500"
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
                >
                  {showPassword ? <EyeOff /> : <Eye />}
                </button>
              </div>
            </div>

            {/* Login Button */}
            <button
              type="submit"
              className="w-full bg-rose-600 text-white py-3 rounded-lg font-semibold hover:bg-rose-700 transition flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <Loader2 className="animate-spin" /> Logging in...
                </>
              ) : (
                <>
                  Login <ArrowRight />
                </>
              )}
            </button>

            {/* <div className="text-center pt-4">
              <p className="text-gray-600 text-sm">
                New User?
                <Link to="/Register" className="ml-1 text-rose-600 font-semibold">
                  Register Here
                </Link>
              </p>
            </div> */}
          </form>
        </div>

        {showRegisterPopup && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl p-6 w-full max-w-sm shadow-xl text-center">
              <h2 className="text-xl font-bold mb-4 text-gray-800">
                User Not Found
              </h2>
              <p className="text-gray-600 mb-6">
                This Login ID is not registered. Please register first.
              </p>

              <div className="flex gap-4 justify-center">
                <button
                  onClick={() => setShowRegisterPopup(false)}
                  className="px-4 py-2 bg-gray-200 rounded-lg"
                >
                  Cancel
                </button>

                <button
                  onClick={() => navigate("/")}
                  className="px-4 py-2 bg-rose-600 text-white rounded-lg"
                >
                  Go to Register
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 🔥 Tailwind Animation */}
      <style>
        {`
          @keyframes slideDown {
            0% { opacity: 0; transform: translateY(-80px); }
            100% { opacity: 1; transform: translateY(0); }
          }
        `}
      </style>
    </>
  );
};

export default Login;
