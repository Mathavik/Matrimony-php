import React from 'react';

interface DefaultPageProps {
  section: string;
}

const DefaultPage: React.FC<DefaultPageProps> = ({ section }) => {
  return (
    <div className="bg-white rounded-2xl p-8 shadow-sm">
      <h2 className="text-2xl font-bold text-gray-800 mb-4 capitalize">{section}</h2>
      <p className="text-gray-600">Content for {section} will be displayed here...</p>
    </div>
  );
};
export default DefaultPage;