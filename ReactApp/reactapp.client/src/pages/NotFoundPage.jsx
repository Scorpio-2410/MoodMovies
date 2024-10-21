import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const NotFoundPage = ({ isLoggedIn }) => {
  const [countdown, setCountdown] = useState(3); // Countdown starts at 3
  const [exploded, setExploded] = useState(false); // To trigger explosion effect
  const navigate = useNavigate();

  useEffect(() => {
    if (countdown > 0) {
      const interval = setInterval(() => {
        setCountdown((prevCountdown) => prevCountdown - 1);
      }, 1000);
      return () => clearInterval(interval); // Cleanup the interval timer
    } else if (countdown === 0) {
      // Trigger explosion effect at 0
      setExploded(true);

      // Redirect after 0.8 seconds to allow the explosion animation to finish
      setTimeout(() => {
        if (isLoggedIn) {
          navigate('/home');
        } else {
          navigate('/');
        }
      }, 800); // Delay to allow explosion animation
    }
  }, [countdown, isLoggedIn, navigate]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 pt-20">
      <h1 className="text-5xl font-bold text-red-600 mb-4">404 - Page Not Found</h1>

      {/* Countdown Timer */}
      <p className="text-lg text-gray-700 mb-8">Redirecting in <strong>{countdown}</strong>...</p>

      {/* Swearing emoji with explode effect */}
      <div className={`emoji-container ${exploded ? 'explode' : ''}`}>
        <span className="text-8xl">🤬</span>
      </div>
    </div>
  );
};

export default NotFoundPage;




