import { Link, useLocation } from "react-router-dom";
import { Film, User } from "lucide-react";
import { useState } from "react";

const Navbar = ({ isLoggedIn, handleLogout }) => {
  const location = useLocation();
  const [isProfileOpen, setIsProfileOpen] = useState(false); 

  const isIndexPage = location.pathname === '/';

  const toggleProfileDropdown = () => {
    setIsProfileOpen(!isProfileOpen);
  };

  return (
    <nav className="bg-primary p-4">
      <div className="container mx-auto flex justify-between items-center">
        <Link
          to={isLoggedIn ? "/home" : "/"}
          className="text-primary-foreground text-2xl font-bold flex items-center"
        >
          <Film className="mr-2" />
          MoviesByMood
        </Link>

        <div className="hidden md:flex space-x-6 items-center">
          {isIndexPage ? (
            <Link
              to="/login"
              className="text-white hover:text-gray-200 transition-colors"
            >
              Login
            </Link>
          ) : isLoggedIn ? (
            <>
              <Link
                to="/home"
                className="text-white hover:text-gray-200 transition-colors"
              >
                Home
              </Link>
              <Link
                to="/my-list"
                className="text-white hover:text-gray-200 transition-colors"
              >
                My List
              </Link>
              <Link
                to="/social"
                className="text-white hover:text-gray-200 transition-colors"
              >
                Socials
              </Link>

              {/* User Profile with dropdown */}
              <div className="relative">
                <button onClick={toggleProfileDropdown} className="text-white">
                  <User className="w-6 h-6" />
                </button>
                {isProfileOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white shadow-lg rounded-md py-2">
                    <Link
                      to="/update-profile"
                      className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                    >
                      Update Profile
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100"
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
            </>
          ) : null}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
