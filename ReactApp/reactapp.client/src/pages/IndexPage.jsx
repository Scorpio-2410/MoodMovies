import React, { useState } from "react";
import "@/css/IndexPage.css"; // Import the CSS for animations

const moods = [
  {
    name: "Happy",
    emoji: "😊",
    bgColor: "bg-yellow-300",
    textColor: "text-yellow-900",
  },
  {
    name: "Sad",
    emoji: "😢",
    bgColor: "bg-blue-300",
    textColor: "text-blue-900",
  },
  {
    name: "Love",
    emoji: "❤️",
    bgColor: "bg-red-300",
    textColor: "text-red-900",
  },
  {
    name: "Anger",
    emoji: "😡",
    bgColor: "bg-orange-400",
    textColor: "text-orange-900",
  },
  {
    name: "Scared",
    emoji: "😨",
    bgColor: "bg-purple-300",
    textColor: "text-purple-900",
  },
  {
    name: "Adventurous",
    emoji: "🏔️",
    bgColor: "bg-gray-300",
    textColor: "text-gray-900",
  },
];

const faqs = [
  {
    question: "What is MoodByMovies?",
    answer:
      "MoodByMovies is a personalised movie suggestion app based on your current mood.",
  },
  {
    question: "How do I get started?",
    answer:
      "Simply select your mood and see movie recommendations tailored to how you feel.",
  },
  {
    question: "Can I save my favorite movies?",
    answer: "Yes! You can create your own movie list and view it at any time.",
  },
  {
    question: "How much does it cost?",
    answer: "MoodByMovies is completely free to use!",
  },
];

const reasonsToJoin = [
  { text: "Personalised movie suggestions", emoji: "🎬" },
  { text: "No subscription required", emoji: "❌" },
  { text: "Fun for all ages", emoji: "❤️" },
  { text: "Socialise with movies", emoji: "📱" },
];

const IndexPage = () => {
  const [activeMood, setActiveMood] = useState(null);
  const [showEmojis, setShowEmojis] = useState(false);
  const [activeFAQ, setActiveFAQ] = useState(null); // State to track which FAQ is active

  const handleMoodSelect = (mood) => {
    setActiveMood(mood);
    setShowEmojis(true);

    // Revert back to default background and hide emojis after 3 seconds
    setTimeout(() => {
      setActiveMood(null);
      setShowEmojis(false);
    }, 3000); // 3 seconds
  };

  const toggleFAQ = (index) => {
    setActiveFAQ(activeFAQ === index ? null : index); // Toggle between showing and hiding the answer
  };

  return (
    <div
      className={`min-h-screen flex flex-col items-center justify-center relative transition-all duration-500 ${
        activeMood ? activeMood.bgColor : "bg-gray-100"
      }`}
      style={{ scrollBehavior: "smooth" }} // Smooth scrolling CSS
    >
      <h1
        className={`text-5xl font-bold mb-8 transition-all duration-300 ${
          activeMood ? activeMood.textColor : "text-gray-900"
        }`}
      >
        Select Your Mood
      </h1>

      <div className="flex gap-x-6 gap-y-4 mb-8 flex-wrap">
        {moods.map((mood) => (
          <button
            key={mood.name}
            onClick={() => handleMoodSelect(mood)}
            className={`flex flex-col items-center justify-center p-4 w-28 h-28 rounded-lg transition-all duration-300 transform hover:scale-110 ${
              activeMood && activeMood.name === mood.name
                ? "bg-opacity-100"
                : "bg-opacity-75"
            } ${mood.bgColor} ${mood.textColor}`}
          >
            <span className="text-4xl">{mood.emoji}</span>
            <span className="mt-2 text-lg font-semibold">{mood.name}</span>
          </button>
        ))}
      </div>

      {/* Reasons to join MoodByMovies */}
      <h2 className="text-2xl font-bold mb-6">More reasons to join</h2>
      <div className="flex  gap-x-6 gap-y-4 flex-wrap mb-8">
        {reasonsToJoin.map((reason, index) => (
          <div
            key={index}
            className="flex flex-col items-center justify-center p-4 w-50 h-30 bg-blue-600 text-white rounded-lg"
          >
            <span className="text-3xl">{reason.emoji}</span>
            <span className="mt-2 text-center text-sm">{reason.text}</span>
          </div>
        ))}
      </div>

      {/* FAQ Section - Now blue background and white text */}
      <div className="w-full max-w-2xl mb-8">
        <h2 className="text-2xl font-bold mb-4 text-black">
          Frequently Asked Questions
        </h2>
        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div key={index} className="bg-blue-600 text-white p-4 rounded-lg">
              <button
                onClick={() => toggleFAQ(index)}
                className="flex justify-between w-full text-left"
              >
                <span>{faq.question}</span>
                <span>{activeFAQ === index ? "-" : "+"}</span>
              </button>
              {/* Show answer if the current FAQ is active */}
              {activeFAQ === index && <p className="mt-2">{faq.answer}</p>}
            </div>
          ))}
        </div>
      </div>

      {/* Get Started button */}
      <button
        onClick={() => (window.location.href = "/register")}
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
