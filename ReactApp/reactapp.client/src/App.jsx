import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Navbar from "./components/Navbar";
import HomePage from "./pages/HomePage.jsx";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import IndexPage from "./pages/IndexPage"; 
import ForgotPasswordPage from "./pages/ForgotPasswordPage"; 
import NotFoundPage from "./pages/NotFoundPage";
import AllMoviesPage from './pages/AllMoviesPage'; 
import MyListPage from "./pages/MyListPage";
import SocialsPage from "./pages/SocialsPage";
import UpdateProfilePage from "./pages/UpdateProfilePage"; 
import { useState, useEffect } from "react";
import { Toaster } from "sonner";
import PrivateRoute from "./components/PrivateRoute";
import PublicRoute from "./components/PublicRoute"; 

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      setIsLoggedIn(true);
    }
    setIsLoading(false);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsLoggedIn(false);
  };

  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  return (
    <Router>
      <div className="min-h-screen bg-gray-100">
        <Navbar isLoggedIn={isLoggedIn} handleLogout={handleLogout} />
        <Routes>
          {/* Public Route for IndexPage */}
          <Route
            path="/"
            element={
              <PublicRoute isLoggedIn={isLoggedIn}>
                <IndexPage />
              </PublicRoute>
            }
          />

          {/* Public Routes */}
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

          {/* Private Routes */}
          <Route
            path="/home"
            element={
              <PrivateRoute isLoggedIn={isLoggedIn}>
                <HomePage />
              </PrivateRoute>
            }
          />
          <Route
            path="/all-movies"
            element={
              <PrivateRoute isLoggedIn={isLoggedIn}>
                <AllMoviesPage />
              </PrivateRoute>
            }
          />
          <Route
            path="/my-list"
            element={
              <PrivateRoute isLoggedIn={isLoggedIn}>
                <MyListPage />
              </PrivateRoute>
            }
          />
          <Route
            path="/social"
            element={
              <PrivateRoute isLoggedIn={isLoggedIn}>
                <SocialsPage />
              </PrivateRoute>
            }
          />
          <Route
            path="/update-profile"
            element={
              <PrivateRoute isLoggedIn={isLoggedIn}>
                <UpdateProfilePage />
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
