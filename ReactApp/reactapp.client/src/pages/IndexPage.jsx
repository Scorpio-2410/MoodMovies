import React from 'react';
import { Link } from 'react-router-dom';

const IndexPage = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
      <h1 className="text-4xl font-bold mb-4">Welcome to MoviesByMood</h1>
      <p className="text-lg text-gray-700 mb-8">
        Discover movies that match your mood!
      </p>
      <Link to="/register" className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors">
        Get Started
      </Link>
    </div>
  );
};

export default IndexPage;

