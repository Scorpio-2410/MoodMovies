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
import PublicRoute from "./components/PublicRoute"; // Import PublicRoute

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true); // Add loading state

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      setIsLoggedIn(true);
    }
    setIsLoading(false); // Set loading to false once the check is complete
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsLoggedIn(false);
  };

  if (isLoading) {
    // While loading, show a spinner or placeholder to avoid flickering
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  return (
    <Router>
      <div className="min-h-screen bg-gray-100">
        <Navbar isLoggedIn={isLoggedIn} handleLogout={handleLogout} />
        <Routes>
          {/* Public Route for IndexPage, redirect to /home if logged in */}
          <Route
            path="/"
            element={
              <PublicRoute isLoggedIn={isLoggedIn}>
                <IndexPage />
              </PublicRoute>
            }
          />

          {/* Public Routes - Redirect logged-in users to home */}
          <Route
            path="/login"
            element={
              <PublicRoute isLoggedIn={isLoggedIn}>
                <LoginPage setIsLoggedIn={setIsLoggedIn} />
              </PublicRoute>
            }
          />
          <Route
            path="/register"
            element={
              <PublicRoute isLoggedIn={isLoggedIn}>
                <RegisterPage />
              </PublicRoute>
            }
          />
          <Route
            path="/forgot-password"
            element={
              <PublicRoute isLoggedIn={isLoggedIn}>
                <ForgotPasswordPage />
              </PublicRoute>
            }
          />

          {/* Private Routes - Only accessible when logged in */}
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
          <Route path="*" element={<NotFoundPage isLoggedIn={isLoggedIn} />} />
        </Routes>
        <Toaster />
      </div>
    </Router>
  );
}

export default App;

