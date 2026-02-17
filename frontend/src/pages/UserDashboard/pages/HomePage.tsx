import React from 'react';
import { Video, Radio, Facebook, Twitter, Instagram, Globe } from 'lucide-react';

const HomePage: React.FC = () => {
  return (
    <div className="space-y-6">
      {/* Profile Card */}
      <div className="bg-white rounded-2xl p-8 shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-6">
            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-yellow-300 to-orange-400 flex items-center justify-center text-4xl">
              👤
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-800">Maher Zain</h2>
              <p className="text-gray-500">
                <span className="font-semibold">55k</span> Followers · <span className="font-semibold">94</span> Following
              </p>
            </div>
          </div>
          <button className="bg-yellow-400 hover:bg-yellow-500 text-gray-800 font-semibold px-6 py-3 rounded-lg transition">
            Edit Profile
          </button>
        </div>
        
        <div className="flex gap-8 border-b border-gray-200">
          <button className="pb-3 border-b-2 border-gray-800 font-semibold">0 Video</button>
          <button className="pb-3 text-gray-500 hover:text-gray-800">16 Favorite</button>
          <button className="pb-3 text-gray-500 hover:text-gray-800">36 Liked</button>
        </div>
      </div>

      {/* Action Cards */}
      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl p-8 text-center shadow-sm hover:shadow-md transition">
          <div className="w-20 h-20 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
            <Video size={32} className="text-gray-400" />
          </div>
          <h3 className="font-semibold text-gray-800 mb-2">
            Drop Your First Video, or <span className="text-orange-500">browse</span>
          </h3>
          <p className="text-sm text-gray-500">Supports: MP4, MOV, MKV</p>
        </div>

        <div className="bg-white rounded-2xl p-8 text-center shadow-sm hover:shadow-md transition">
          <div className="w-20 h-20 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
            <Radio size={32} className="text-gray-400" />
          </div>
          <h3 className="font-semibold text-gray-800 mb-2">Start a Live Video</h3>
          <p className="text-sm text-gray-500">Setup your content to start a new live video now</p>
        </div>
      </div>

      {/* Social Media & Downloads */}
      <div className="bg-white rounded-2xl p-8 shadow-sm">
        <h3 className="font-semibold text-gray-800 mb-4">Follow me on Social Media:</h3>
        <div className="flex gap-3 mb-6">
          <button className="w-10 h-10 rounded-full bg-blue-500 text-white flex items-center justify-center hover:bg-blue-600">
            <Facebook size={20} />
          </button>
          <button className="w-10 h-10 rounded-full bg-sky-400 text-white flex items-center justify-center hover:bg-sky-500">
            <Twitter size={20} />
          </button>
          <button className="w-10 h-10 rounded-full bg-red-500 text-white flex items-center justify-center hover:bg-red-600">
            <Globe size={20} />
          </button>
          <button className="w-10 h-10 rounded-full bg-gray-300 text-gray-600 flex items-center justify-center hover:bg-gray-400">
            <Instagram size={20} />
          </button>
        </div>

        <h3 className="font-semibold text-gray-800 mb-4">Download App</h3>
        <div className="flex gap-3">
          <div className="bg-black text-white px-4 py-2 rounded-lg text-sm font-semibold">Google Play</div>
          <div className="bg-black text-white px-4 py-2 rounded-lg text-sm font-semibold">App Store</div>
          <div className="bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-semibold">AppGallery</div>
        </div>
      </div>
    </div>
  );
};
export default HomePage;