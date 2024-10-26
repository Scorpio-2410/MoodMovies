import { Link } from "react-router-dom";
import { Film, User, Menu } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { toast } from "sonner"; // Import toast

const Navbar = ({ isLoggedIn, handleLogout }) => {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const dropdownRef = useRef(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false); // New state for mobile menu

  const toggleProfileDropdown = () => {
    setIsProfileOpen(!isProfileOpen);
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  // Close dropdown if clicked outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsProfileOpen(false);
      }
    };

    if (isProfileOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isProfileOpen]);

  const handleLogoutAndToast = () => {
    handleLogout();
    toast.success("Successfully Logged Out!");
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

        {/* Mobile menu button */}
        <button className="md:hidden text-white" onClick={toggleMobileMenu}>
          {/* Hamburger icon */}
          <Menu className="h-6 w-6" />
        </button>

        {/* Desktop menu */}
        <div className="hidden md:flex space-x-6 items-center">
          {isLoggedIn ? (
            <>
              <Link
                to="/home"
                className="text-white hover:text-gray-200 transition-colors"
              >
                Home
              </Link>
              <Link
                to="/all-movies"
                className="text-white hover:text-gray-200 transition-colors"
              >
                All Movies
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
              <div className="relative" ref={dropdownRef}>
                <button onClick={toggleProfileDropdown} className="text-white">
                  <User className="w-6 h-6" />
                </button>
                {isProfileOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white shadow-lg rounded-md py-2">
                    <Link
                      to="/update-profile"
                      className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                      onClick={() => setIsProfileOpen(false)} // Close dropdown on click
                    >
                      Update Profile
                    </Link>
                    <button
                      onClick={() => {
                        handleLogoutAndToast();
                        setIsProfileOpen(false); // Close dropdown on logout
                      }}
                      className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100"
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
            </>
          ) : (
            <Link
              to="/login"
              className="text-white hover:text-gray-200 transition-colors"
            >
              Login
            </Link>
          )}
        </div>
      </div>

      {/* Mobile menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-primary ">
          <div className="flex flex-col space-y-2 p-4">
            {isLoggedIn ? (
              <>
                <Link
                  to="/home"
                  className="text-white hover:text-gray-200 transition-colors"
                  onClick={toggleMobileMenu} // Close menu on click
                >
                  Home
                </Link>
                <Link
                  to="/all-movies"
                  className="text-white hover:text-gray-200 transition-colors"
                  onClick={toggleMobileMenu} // Close menu on click
                >
                  All Movies
                </Link>
                <Link
                  to="/my-list"
                  className="text-white hover:text-gray-200 transition-colors"
                  onClick={toggleMobileMenu} // Close menu on click
                >
                  My List
                </Link>
                <Link
                  to="/social"
                  className="text-white hover:text-gray-200 transition-colors"
                  onClick={toggleMobileMenu} // Close menu on click
                >
                  Socials
                </Link>
                <Link
                  to="/update-profile"
                  className="text-white hover:text-gray-200 transition-colors"
                  onClick={toggleMobileMenu} // Close menu on click
                >
                  Update Profile
                </Link>
                <button
                  onClick={() => {
                    handleLogoutAndToast();
                    toggleMobileMenu(); // Close menu on logout
                  }}
                  className="text-white hover:text-gray-200 transition-colors"
                >
                  Logout
                </button>
              </>
            ) : (
              <Link
                to="/login"
                className="text-white hover:text-gray-200 transition-colors"
                onClick={toggleMobileMenu} // Close menu on click
              >
                Login
              </Link>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
