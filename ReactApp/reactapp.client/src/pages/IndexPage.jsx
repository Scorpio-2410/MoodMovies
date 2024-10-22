import React, { useState } from 'react';
import '@/css/IndexPage.css'; // Import the CSS for animations

const moods = [
  { name: 'Happy', emoji: '😊', bgColor: 'bg-yellow-300', textColor: 'text-yellow-900' },
  { name: 'Sad', emoji: '😢', bgColor: 'bg-blue-300', textColor: 'text-blue-900' },
  { name: 'Love', emoji: '❤️', bgColor: 'bg-red-300', textColor: 'text-red-900' },
  { name: 'Anger', emoji: '😡', bgColor: 'bg-orange-400', textColor: 'text-orange-900' },
  { name: 'Scared', emoji: '😨', bgColor: 'bg-purple-300', textColor: 'text-purple-900' },
  { name: 'Adventurous', emoji: '🏔️', bgColor: 'bg-gray-300', textColor: 'text-gray-900' },
];

const IndexPage = () => {
  const [activeMood, setActiveMood] = useState(null);
  const [showEmojis, setShowEmojis] = useState(false);

  const handleMoodSelect = (mood) => {
    setActiveMood(mood);
    setShowEmojis(true);

    // Revert back to default background and hide emojis after 3 seconds
    setTimeout(() => {
      setActiveMood(null);
      setShowEmojis(false);
    }, 3000); // 3 seconds
  };

  return (
    <div
      className={`min-h-screen flex flex-col items-center justify-center relative transition-all duration-500 ${
        activeMood ? activeMood.bgColor : 'bg-gray-100'
      }`}
    >
      <h1 className={`text-5xl font-bold mb-8 transition-all duration-300 ${activeMood ? activeMood.textColor : 'text-gray-900'}`}>
        Select Your Mood
      </h1>

      <div className="flex space-x-6 mb-8">
        {moods.map((mood) => (
          <button
            key={mood.name}
            onClick={() => handleMoodSelect(mood)}
            className={`flex flex-col items-center justify-center p-4 w-28 h-28 rounded-lg transition-all duration-300 transform hover:scale-110 ${
              activeMood && activeMood.name === mood.name ? 'bg-opacity-100' : 'bg-opacity-75'
            } ${mood.bgColor} ${mood.textColor}`}
          >
            <span className="text-4xl">{mood.emoji}</span>
            <span className="mt-2 text-lg font-semibold">{mood.name}</span>
          </button>
        ))}
      </div>

      {/* Get Started button */}
      <button
        onClick={() => (window.location.href = '/register')}
        className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors duration-300"
      >
        Get Started
      </button>

      {/* Emoji Rain */}
      {showEmojis && (
        <div className="emoji-rain-container">
          {[...Array(30)].map((_, index) => (
            <span
              key={index}
              className="emoji-rain"
              style={{
                left: `${Math.random() * 100}vw`, // Random horizontal position
                animationDelay: `${Math.random() * 1.5}s`, // Random delay for staggered rain effect
              }}
            >
              {activeMood.emoji}
            </span>
          ))}
        </div>
      )}
    </div>
  );
};

export default IndexPage;
