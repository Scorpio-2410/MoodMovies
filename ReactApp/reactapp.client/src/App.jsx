import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Navbar from "./components/Navbar";
import HomePage from "./pages/HomePage.jsx";
import WeatherPage from "./pages/WeatherPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import IndexPage from "./pages/IndexPage"; 
import ForgotPasswordPage from "./pages/ForgotPasswordPage"; 
import NotFoundPage from "./pages/NotFoundPage"; // Import NotFoundPage
import { useState, useEffect } from "react";
import { Toaster } from "sonner";
import PrivateRoute from "./components/PrivateRoute";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsLoggedIn(false);
  };

  return (
    <Router>
      <div className="min-h-screen bg-gray-100">
        <Navbar isLoggedIn={isLoggedIn} handleLogout={handleLogout} />
        <Routes>
          <Route path="/" element={<IndexPage />} />
          <Route path="/login" element={<LoginPage setIsLoggedIn={setIsLoggedIn} />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />  
          <Route
            path="/home"
            element={
              <PrivateRoute isLoggedIn={isLoggedIn}>
                <HomePage />
              </PrivateRoute>
            }
          />
          <Route
            path="/weather"
            element={
              <PrivateRoute isLoggedIn={isLoggedIn}>
                <WeatherPage />
              </PrivateRoute>
            }
          />
          {/* Catch-all route for undefined paths */}
          <Route path="*" element={<NotFoundPage isLoggedIn={isLoggedIn} />} /> {/* Pass isLoggedIn prop */}
        </Routes>
        <Toaster />
      </div>
    </Router>
  );
}

export default App;

