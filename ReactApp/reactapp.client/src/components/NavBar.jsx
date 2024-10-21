import { Link, useLocation } from "react-router-dom";
import { Film } from "lucide-react";

const Navbar = ({ isLoggedIn, handleLogout }) => {
  const location = useLocation();

  const isIndexPage = location.pathname === '/';

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

        <div className="hidden md:flex space-x-6">
          {isIndexPage ? (
            // Show "Login" button only on the welcome page
            <Link
              to="/login"
              className="text-white hover:text-gray-200 transition-colors"
            >
              Login
            </Link>
          ) : isLoggedIn ? (
            <>
              {/* Only show these when the user is logged in */}
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
              <button
                onClick={handleLogout}
                className="text-white hover:text-gray-200 transition-colors"
              >
                Logout
              </button>
            </>
          ) : null}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;



