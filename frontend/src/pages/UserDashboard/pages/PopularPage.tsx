import { Video } from 'lucide-react';
import React from 'react';

const PopularPage: React.FC = () => {
  return (
    <div className="bg-white rounded-2xl p-8 shadow-sm">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">Popular Videos</h2>
      <p className="text-gray-600">Popular video content will be displayed here...</p>
      <div className="grid grid-cols-3 gap-4 mt-6">
        {[1, 2, 3, 4, 5, 6].map((item) => (
          <div key={item} className="aspect-video bg-gray-100 rounded-lg flex items-center justify-center">
            <Video size={48} className="text-gray-400" />
          </div>
        ))}
      </div>
    </div>
  );
};
export default PopularPage;