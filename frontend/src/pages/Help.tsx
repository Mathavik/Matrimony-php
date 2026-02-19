import React, { useState } from 'react';
import axios from 'axios';
import { Mail, Phone, MapPin, Send, Heart } from 'lucide-react';
import axiosInstance from '../axiosInstance';

// Define the shape of the form data
interface HelpFormData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

// const API_URL = 'http://localhost:5000/api/help';

// --- WedAura Logo Component ---
const WedAuraLogo: React.FC = () => (
  <div className="flex items-center space-x-1">
    {/* Custom SVG icon representing the 'Aura' or a subtle heart element */}
    <Heart className="w-7 h-7 text-pink-600 fill-pink-300" />
    <span className="text-3xl font-serif font-bold text-gray-800">Wed</span>
    <span className="text-3xl font-serif font-extrabold text-pink-600">Aura</span>
  </div>
);

// --- Help Component ---
const Help: React.FC = () => {
  const [formData, setFormData] = useState<HelpFormData>({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  // Handle form field changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setStatus('loading');
  setMessage('');

  try {
    const response = await axiosInstance.post(
      '/api/Help/createHelp.php',
      formData
    );

    if (response.data.status === 'success') {
      setStatus('success');
      setMessage('Your request has been sent successfully! We will get back to you soon.');
      setFormData({ name: '', email: '', subject: '', message: '' });
    } else {
      setStatus('error');
      setMessage(response.data.message || 'Something went wrong.');
    }
  } catch (error) {
    console.error('Submission Error:', error);
    setStatus('error');
    setMessage('Failed to send your request. Please check your connection and try again.');
  }
};


  // Basic Card component for contact info
  const ContactCard: React.FC<{ icon: React.ReactNode; title: string; detail: string }> = ({ icon, title, detail }) => (
    <div className="bg-white p-6 rounded-xl shadow-lg flex flex-col items-center text-center transition duration-300 hover:shadow-2xl border border-pink-100">
      <div className="text-pink-600 mb-3 p-3 bg-pink-50 rounded-full">{icon}</div>
      <h3 className="text-xl font-semibold text-gray-800 mb-1">{title}</h3>
      <p className="text-gray-600 text-sm">{detail}</p>
    </div>
  );

  return (
    // Main container with a subtle background texture/gradient
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-white py-12 px-4 sm:px-6 lg:px-8 font-inter">
      <div className="max-w-6xl mx-auto">
        
        {/* Header Section with Logo */}
        <header className="flex justify-center md:justify-start mb-10 md:mb-16">
          <WedAuraLogo />
        </header>

        {/* Hero Text */}
        <div className="text-center mb-16">
          <h1 className="text-5xl md:text-6xl font-extrabold text-pink-800 tracking-tight mb-4">
            How Can We Help You?
          </h1>
          <p className="mt-4 text-xl text-gray-600 max-w-2xl mx-auto">
            Your journey to finding the perfect match is important to us. Submit your query, and the WedAura support team will respond quickly.
          </p>
        </div>

        {/* Contact Information Cards (Responsive Grid) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          <ContactCard icon={<Mail size={24} />} title="Email Support" detail="support@wedaura.com (24/7 Response)" />
          <ContactCard icon={<Phone size={24} />} title="Call Us Directly" detail="+91 98765 43210 (Mon-Fri, 9am-5pm IST)" />
          <ContactCard icon={<MapPin size={24} />} title="Corporate Office" detail="WedAura HQ, Chennai, Tamil Nadu, India" />
        </div>

        {/* Contact Form Section (Primary Focus) */}
        <div className="bg-white p-8 md:p-16 rounded-3xl shadow-2xl shadow-pink-100 border border-pink-200">
          <h2 className="text-3xl font-bold text-gray-800 mb-8 pb-3 border-b border-pink-100">Send Us a Direct Message</h2>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Name Field */}
              <InputField id="name" name="name" label="Your Full Name" type="text" value={formData.name} onChange={handleChange} required />
              {/* Email Field */}
              <InputField id="email" name="email" label="Email Address" type="email" value={formData.email} onChange={handleChange} required />
            </div>

            {/* Subject Field */}
            <InputField id="subject" name="subject" label="Subject of Query (e.g., Profile Verification, Payment Issue)" type="text" value={formData.subject} onChange={handleChange} required />

            {/* Message Field */}
            <div>
              <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">Detailed Message / Query</label>
              <textarea
                name="message"
                id="message"
                rows={5}
                placeholder="Describe your issue or question here..."
                value={formData.message}
                onChange={handleChange}
                required
                className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-xl shadow-inner focus:ring-pink-500 focus:border-pink-500 text-gray-900 transition duration-150 placeholder:text-gray-400"
              ></textarea>
            </div>

            {/* Status Message */}
            {message && (
              <p className={`p-4 rounded-xl text-base font-medium transition-all duration-300 ${
                status === 'success' ? 'bg-green-100 text-green-700 border border-green-300' : 'bg-red-100 text-red-700 border border-red-300'
              }`}>
                {message}
              </p>
            )}

            {/* Submit Button */}
            <div>
              <button
                type="submit"
                disabled={status === 'loading'}
                className={`w-full flex items-center justify-center space-x-2 px-6 py-4 border border-transparent text-lg font-bold rounded-full shadow-xl shadow-pink-200 text-white ${
                  status === 'loading' ? 'bg-pink-400 cursor-not-allowed' : 'bg-pink-600 hover:bg-pink-700 transition duration-300 transform hover:scale-[1.01]'
                } focus:outline-none focus:ring-4 focus:ring-offset-2 focus:ring-pink-500/50`}
              >
                {status === 'loading' ? (
                  <>
                    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Sending Request...
                  </>
                ) : (
                  <>
                    <Send size={20} />
                    <span>Send Message</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

// Helper component for input fields
const InputField: React.FC<{
  id: string;
  name: string;
  label: string;
  type: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  required?: boolean;
}> = ({ id, name, label, type, value, onChange, required = false }) => (
  <div>
    <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
    <input
      type={type}
      name={name}
      id={id}
      value={value}
      onChange={onChange}
      required={required}
      placeholder={`Enter your ${name}...`}
      className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-xl shadow-inner focus:ring-pink-500 focus:border-pink-500 text-gray-900 transition duration-150 placeholder:text-gray-400"
    />
  </div>
);

export default Help;