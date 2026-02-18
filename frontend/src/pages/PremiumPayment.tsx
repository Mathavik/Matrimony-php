import React, { useState } from 'react';
import { Crown, Check, CreditCard, Smartphone, Building2, ArrowRight, Shield, Star, Users, MessageCircle, Heart, Sparkles, Lock, Zap } from 'lucide-react';
import { useLocation, useNavigate } from "react-router-dom";

const PremiumPayment = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const userId = queryParams.get("userId");
  const navigate = useNavigate();
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [isProcessing, setIsProcessing] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [formData, setFormData] = useState({
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    cardholderName: '',
    upiId: '',
    bankName: 'State Bank of India'
  });

  const premiumPrice = 2999;
  const premiumDuration = '1 Year';

  const premiumFeatures = [
    'Unlimited profile views',
    'Send unlimited interests',
    'Advanced search filters',
    'Profile highlighting',
    'See who viewed your profile',
    'Verified badge',
  ];

  const bankOptions = [
    { 
      name: 'State Bank of India', 
      icon: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/cc/SBI-logo.svg/120px-SBI-logo.svg.png'
    },
    { 
      name: 'HDFC Bank', 
      icon: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/28/HDFC_Bank_Logo.svg/120px-HDFC_Bank_Logo.svg.png'
    },
    { 
      name: 'ICICI Bank', 
      icon: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/12/ICICI_Bank_Logo.svg/120px-ICICI_Bank_Logo.svg.png'
    },
    { 
      name: 'Axis Bank', 
      icon: 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/6a/Axis_Bank_logo.svg/120px-Axis_Bank_logo.svg.png'
    },
    { 
      name: 'Punjab National Bank', 
      icon: 'https://upload.wikimedia.org/wikipedia/en/thumb/4/4b/Punjab_National_Bank_logo.svg/120px-Punjab_National_Bank_logo.svg.png'
    },
    { 
      name: 'Bank of Baroda', 
      icon: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4e/Bank_of_Baroda_logo.svg/120px-Bank_of_Baroda_logo.svg.png'
    },
    { 
      name: 'Canara Bank', 
      icon: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/44/Canara_Bank_logo.svg/120px-Canara_Bank_logo.svg.png'
    },
    { 
      name: 'Kotak Mahindra Bank', 
      icon: 'https://upload.wikimedia.org/wikipedia/en/thumb/4/44/Kotak_Mahindra_Bank_logo.svg/120px-Kotak_Mahindra_Bank_logo.svg.png'
    },
    { 
      name: 'Yes Bank', 
      icon: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4b/Yes_Bank_SVG_Logo.svg/120px-Yes_Bank_SVG_Logo.svg.png'
    },
    { 
      name: 'IndusInd Bank', 
      icon: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c8/IndusInd_Bank_Logo.svg/120px-IndusInd_Bank_Logo.svg.png'
    },
    { 
      name: 'Union Bank of India', 
      icon: 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/69/Union_Bank_of_India_Logo.svg/120px-Union_Bank_of_India_Logo.svg.png'
    },
    { 
      name: 'Bank of India', 
      icon: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/87/Bank_of_India_logo.svg/120px-Bank_of_India_logo.svg.png'
    },
    { 
      name: 'Central Bank of India', 
      icon: 'https://upload.wikimedia.org/wikipedia/en/thumb/2/2d/Central_Bank_of_India_Logo.svg/120px-Central_Bank_of_India_Logo.svg.png'
    },
    { 
      name: 'Indian Bank', 
      icon: 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d7/Indian_Bank_Logo.svg/120px-Indian_Bank_Logo.svg.png'
    },
    { 
      name: 'IDBI Bank', 
      icon: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/33/IDBI_Bank_Logo.svg/120px-IDBI_Bank_Logo.svg.png'
    },
    { 
      name: 'Other Banks', 
      icon: 'https://cdn-icons-png.flaticon.com/128/2830/2830284.png'
    }
  ];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handlePayment = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      // Sweet Alert 2 style notification - no actual alert
      setIsProcessing(true);
      setTimeout(() => {
        setIsProcessing(false);
      }, 500);
      return;
    }

    setIsProcessing(true);

    try {
      const response = await fetch('http://localhost:5000/api/premiumpayment/pay', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          userId: userId,
          amount: premiumPrice,
          duration: premiumDuration,
          paymentMethod
        })
      });

      const data = await response.json();

      if (response.ok) {
        // Show success with smooth transition
        setTimeout(() => {
          setShowSuccess(true);
          // Auto navigate after 3 seconds
          setTimeout(() => {
            if (userId) navigate(`/userdashboard?userId=${userId}`);
            else navigate('/userdashboard');
          }, 3000);
        }, 500);
      } else {
        setIsProcessing(false);
        // Handle error silently or show inline error
      }
    } catch (err) {
      console.error('Payment error:', err);
      setIsProcessing(false);
      // Handle error silently or show inline error
    }
  };

  if (showSuccess) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4">
        <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl p-6 sm:p-8 text-center animate-scaleIn">
          <div className="w-20 h-20 sm:w-24 sm:h-24 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6 animate-checkmark">
            <Check className="w-10 h-10 sm:w-12 sm:h-12 text-white" strokeWidth={3} />
          </div>
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-2 sm:mb-3">Payment Successful!</h1>
          <p className="text-gray-600 mb-4 sm:mb-6 text-sm sm:text-base">
            Welcome to Premium Membership
          </p>
          <div className="bg-gradient-to-br from-amber-50 to-yellow-50 rounded-xl p-4 sm:p-6 mb-4 sm:mb-6 border-2 border-amber-200">
            <Crown className="w-14 h-14 sm:w-16 sm:h-16 text-amber-500 mx-auto mb-3 animate-bounce" />
            <p className="text-lg sm:text-xl font-bold text-gray-900 mb-1">
              Premium Membership Activated
            </p>
            <p className="text-xs sm:text-sm text-gray-600">{premiumDuration} • ₹{premiumPrice}</p>
            <div className="mt-3 sm:mt-4 flex items-center justify-center gap-2 text-xs sm:text-sm text-green-600 font-semibold">
              <Check className="w-4 h-4" />
              Profile Upgraded Successfully
            </div>
          </div>
          <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
            <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse"></div>
            <span>Redirecting to your profile...</span>
          </div>
        </div>

        <style>{`
          @keyframes scaleIn {
            from {
              opacity: 0;
              transform: scale(0.9);
            }
            to {
              opacity: 1;
              transform: scale(1);
            }
          }
          @keyframes checkmark {
            0% {
              transform: scale(0);
              opacity: 0;
            }
            50% {
              transform: scale(1.1);
            }
            100% {
              transform: scale(1);
              opacity: 1;
            }
          }
          .animate-scaleIn {
            animation: scaleIn 0.5s ease-out;
          }
          .animate-checkmark {
            animation: checkmark 0.6s ease-out;
          }
        `}</style>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white py-6 sm:py-8 px-4 mt-16 sm:mt-20">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-6 sm:mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 sm:w-16 sm:h-16 bg-pink-500 rounded-2xl mb-3 sm:mb-4">
            <Crown className="w-7 h-7 sm:w-8 sm:h-8 text-white" />
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-2">
            Upgrade to Premium
          </h1>
          <p className="text-gray-600 text-sm sm:text-base md:text-lg">
            Find your perfect match faster
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-6 lg:gap-8">
          {/* Left Section - Features */}
          <div className="space-y-4 sm:space-y-6">
            {/* Pricing Card */}
            <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-4 sm:p-6 md:p-8">
              <div className="text-center mb-4 sm:mb-6">
                <div className="inline-flex items-center justify-center w-14 h-14 sm:w-16 sm:h-16 bg-pink-500 rounded-2xl mb-3 sm:mb-4">
                  <Crown className="w-7 h-7 sm:w-8 sm:h-8 text-white" />
                </div>
                <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-1 sm:mb-2">Premium Membership</h2>
                <p className="text-gray-600 text-sm sm:text-base">Unlock all exclusive features</p>

                <div className="mt-4 sm:mt-6 inline-block">
                  <div className="bg-gray-50 rounded-xl px-4 sm:px-6 py-3 sm:py-4 border border-gray-200">
                    <div className="flex items-baseline justify-center gap-1 sm:gap-2">
                      <span className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900">
                        ₹{premiumPrice}
                      </span>
                    </div>
                    <p className="text-xs sm:text-sm text-gray-600 mt-1">{premiumDuration} Membership</p>
                  </div>
                </div>
              </div>

              {/* Features List */}
              <div className="space-y-3">
                <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-3 sm:mb-4 flex items-center gap-2">
                  <Zap className="w-4 h-4 sm:w-5 sm:h-5 text-amber-500" />
                  All Premium Features
                </h3>
                <div className="grid grid-cols-1 gap-2 sm:gap-3 max-h-72 sm:max-h-96 overflow-y-auto pr-2">
                  {premiumFeatures.map((feature, index) => (
                    <div key={index} className="flex items-start gap-2 sm:gap-3 bg-gray-50 rounded-lg p-2 sm:p-3 border border-gray-200">
                      <Check className="w-4 h-4 sm:w-5 sm:h-5 text-green-600 flex-shrink-0 mt-0.5" />
                      <span className="text-xs sm:text-sm text-gray-700 font-medium">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Why Premium Section */}
            <div className="bg-gray-50 border border-gray-200 rounded-2xl p-4 sm:p-6">
              <h3 className="text-base sm:text-lg md:text-xl font-bold text-gray-900 mb-3 sm:mb-4 flex items-center gap-2">
                <Shield className="w-4 h-4 sm:w-5 sm:h-5 text-gray-700" />
                Why Choose Premium?
              </h3>
              <div className="grid grid-cols-2 gap-3 sm:gap-4">
                <div className="flex items-center gap-2 text-gray-700">
                  <Users className="w-4 h-4 sm:w-5 sm:h-5" />
                  <span className="text-xs sm:text-sm">3x Visibility</span>
                </div>
                <div className="flex items-center gap-2 text-gray-700">
                  <MessageCircle className="w-4 h-4 sm:w-5 sm:h-5" />
                  <span className="text-xs sm:text-sm">Priority Support</span>
                </div>
                <div className="flex items-center gap-2 text-gray-700">
                  <Star className="w-4 h-4 sm:w-5 sm:h-5" />
                  <span className="text-xs sm:text-sm">Verified Badge</span>
                </div>
                <div className="flex items-center gap-2 text-gray-700">
                  <Heart className="w-4 h-4 sm:w-5 sm:h-5" />
                  <span className="text-xs sm:text-sm">Better Matches</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Section - Payment Form */}
          <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-4 sm:p-6 md:p-8 lg:sticky lg:top-6">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4 sm:mb-6 flex items-center gap-2">
              <CreditCard className="w-5 h-5 sm:w-6 sm:h-6 text-gray-700" />
              Complete Payment
            </h2>

            {/* Payment Summary */}
            <div className="bg-gray-50 rounded-xl p-3 sm:p-4 mb-4 sm:mb-6 border border-gray-200">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-xs sm:text-sm text-gray-600 mb-1">Total Amount</p>
                  <p className="text-2xl sm:text-3xl font-bold text-gray-900">
                    ₹{premiumPrice}
                  </p>
                  <p className="text-xs text-gray-600">{premiumDuration} Membership</p>
                </div>
              </div>
            </div>

            {/* Payment Method Selection */}
            <div className="mb-4 sm:mb-6">
              <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-2 sm:mb-3">Select Payment Method</label>
              <div className="grid grid-cols-3 gap-2 sm:gap-3">
                <button
                  type="button"
                  onClick={() => setPaymentMethod('card')}
                  className={`p-3 sm:p-4 rounded-lg border-2 transition-all ${
                    paymentMethod === 'card'
                      ? 'border-gray-900 bg-gray-50'
                      : 'border-gray-200 hover:border-gray-300 bg-white'
                  }`}
                >
                  <CreditCard className={`w-5 h-5 sm:w-6 sm:h-6 mx-auto mb-1 sm:mb-2 ${paymentMethod === 'card' ? 'text-gray-900' : 'text-gray-400'}`} />
                  <p className="text-xs font-medium text-gray-700">Card</p>
                </button>
                <button
                  type="button"
                  onClick={() => setPaymentMethod('upi')}
                  className={`p-3 sm:p-4 rounded-lg border-2 transition-all ${
                    paymentMethod === 'upi'
                      ? 'border-gray-900 bg-gray-50'
                      : 'border-gray-200 hover:border-gray-300 bg-white'
                  }`}
                >
                  <Smartphone className={`w-5 h-5 sm:w-6 sm:h-6 mx-auto mb-1 sm:mb-2 ${paymentMethod === 'upi' ? 'text-gray-900' : 'text-gray-400'}`} />
                  <p className="text-xs font-medium text-gray-700">UPI</p>
                </button>
                <button
                  type="button"
                  onClick={() => setPaymentMethod('netbanking')}
                  className={`p-3 sm:p-4 rounded-lg border-2 transition-all ${
                    paymentMethod === 'netbanking'
                      ? 'border-gray-900 bg-gray-50'
                      : 'border-gray-200 hover:border-gray-300 bg-white'
                  }`}
                >
                  <Building2 className={`w-5 h-5 sm:w-6 sm:h-6 mx-auto mb-1 sm:mb-2 ${paymentMethod === 'netbanking' ? 'text-gray-900' : 'text-gray-400'}`} />
                  <p className="text-xs font-medium text-gray-700">Banking</p>
                </button>
              </div>
            </div>

            {/* Payment Forms */}
            {paymentMethod === 'card' && (
              <div className="space-y-3 sm:space-y-4">
                <div>
                  <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-1 sm:mb-2">Card Number</label>
                  <input
                    type="text"
                    name="cardNumber"
                    value={formData.cardNumber}
                    onChange={handleChange}
                    placeholder="1234 5678 9012 3456"
                    className="w-full px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base rounded-lg border-2 border-gray-200 focus:border-gray-900 focus:ring-2 focus:ring-gray-100 outline-none transition"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3 sm:gap-4">
                  <div>
                    <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-1 sm:mb-2">Expiry</label>
                    <input
                      type="text"
                      name="expiryDate"
                      value={formData.expiryDate}
                      onChange={handleChange}
                      placeholder="MM/YY"
                      className="w-full px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base rounded-lg border-2 border-gray-200 focus:border-gray-900 focus:ring-2 focus:ring-gray-100 outline-none transition"
                    />
                  </div>
                  <div>
                    <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-1 sm:mb-2">CVV</label>
                    <input
                      type="text"
                      name="cvv"
                      value={formData.cvv}
                      onChange={handleChange}
                      placeholder="123"
                      maxLength={3}
                      className="w-full px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base rounded-lg border-2 border-gray-200 focus:border-gray-900 focus:ring-2 focus:ring-gray-100 outline-none transition"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-1 sm:mb-2">Cardholder Name</label>
                  <input
                    type="text"
                    name="cardholderName"
                    value={formData.cardholderName}
                    onChange={handleChange}
                    placeholder="John Doe"
                    className="w-full px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base rounded-lg border-2 border-gray-200 focus:border-gray-900 focus:ring-2 focus:ring-gray-100 outline-none transition"
                  />
                </div>
              </div>
            )}

            {paymentMethod === 'upi' && (
              <div>
                <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-1 sm:mb-2">UPI ID</label>
                <input
                  type="text"
                  name="upiId"
                  value={formData.upiId}
                  onChange={handleChange}
                  placeholder="yourname@upi"
                  className="w-full px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base rounded-lg border-2 border-gray-200 focus:border-gray-900 focus:ring-2 focus:ring-gray-100 outline-none transition"
                />
                <p className="text-xs text-gray-500 mt-2">Enter your UPI ID (Google Pay, PhonePe, Paytm, etc.)</p>
              </div>
            )}

            {paymentMethod === 'netbanking' && (
              <div>
                <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-1 sm:mb-2">Select Your Bank</label>
                <div className="relative">
                  <select
                    name="bankName"
                    value={formData.bankName}
                    onChange={handleChange}
                    className="w-full px-3 sm:px-4 py-2 sm:py-3 pl-10 sm:pl-12 pr-10 text-sm sm:text-base rounded-lg border-2 border-gray-200 focus:border-gray-900 focus:ring-2 focus:ring-gray-100 outline-none transition appearance-none bg-white cursor-pointer"
                    style={{
                      backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%23374151'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`,
                      backgroundRepeat: 'no-repeat',
                      backgroundPosition: 'right 0.75rem center',
                      backgroundSize: '1.25rem'
                    }}
                  >
                    {bankOptions.map((bank, index) => (
                      <option key={index} value={bank.name}>
                        {bank.name}
                      </option>
                    ))}
                  </select>
                  <div className="absolute left-2 sm:left-3 top-1/2 -translate-y-1/2 w-5 h-5 sm:w-6 sm:h-6 pointer-events-none flex items-center justify-center">
                    <img 
                      src={bankOptions.find(b => b.name === formData.bankName)?.icon} 
                      alt=""
                      className="w-full h-full object-contain"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Security Badge */}
            <div className="bg-blue-50 rounded-lg p-3 sm:p-4 my-4 sm:my-6 flex items-start gap-2 sm:gap-3 border border-blue-200">
              <Shield className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600 flex-shrink-0 mt-0.5" />
              <p className="text-xs sm:text-sm text-blue-900">
                <span className="font-semibold">100% Secure Payment.</span> Your data is encrypted with 256-bit SSL.
              </p>
            </div>

            {/* Pay Button */}
            <button
              type="button"
              onClick={handlePayment}
              disabled={isProcessing}
              className="w-full bg-gray-900 text-white py-3 sm:py-4 rounded-lg font-bold text-sm sm:text-base md:text-lg hover:bg-gray-800 transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 sm:gap-3"
            >
              {isProcessing ? (
                <>
                  <div className="w-5 h-5 sm:w-6 sm:h-6 border-3 border-white border-t-transparent rounded-full animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <Lock className="w-4 h-4 sm:w-5 sm:h-5" />
                  Pay ₹{premiumPrice} Securely
                  <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />
                </>
              )}
            </button>

            <p className="text-center text-xs text-gray-500 mt-3 sm:mt-4">
              By proceeding, you agree to our Terms & Conditions
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PremiumPayment;
