import React from 'react';
import { TrendingUp } from 'lucide-react';

const TrendyPage: React.FC = () => {
  return (
    <div className="bg-white rounded-2xl p-8 shadow-sm">
      <div className="flex items-center gap-3 mb-4">
        <TrendingUp size={32} className="text-orange-500" />
        <h2 className="text-2xl font-bold text-gray-800">Trending Content</h2>
      </div>
      <p className="text-gray-600 mb-6">Trending videos and stories will appear here...</p>
      <div className="space-y-4">
        {[1, 2, 3].map((item) => (
          <div key={item} className="flex gap-4 p-4 border border-gray-200 rounded-lg hover:bg-gray-50">
            <div className="w-32 h-20 bg-gray-100 rounded flex items-center justify-center">
              <TrendingUp size={24} className="text-gray-400" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-gray-800">Trending Video Title {item}</h3>
              <p className="text-sm text-gray-500">10k views • 2 hours ago</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TrendyPage;