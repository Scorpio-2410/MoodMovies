import { Link } from "react-router-dom";
import { Film, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

const Navbar = () => {
  return (
    <nav className="bg-primary p-4">
      <div className="container mx-auto flex justify-between items-center">
        <Link
          to="/home"
          className="text-primary-foreground text-2xl font-bold flex items-center"
        >
          <Film className="mr-2" />
          MoviesByMood
        </Link>
        <div className="hidden md:flex space-x-6">
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
            to="/"
            className="text-white hover:text-gray-200 transition-colors"
          >
            Logout
          </Link>
        </div>
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="md:hidden">
              <Menu className="h-6 w-6" />
            </Button>
          </SheetTrigger>
          <SheetContent>
            <div className="flex flex-col space-y-4 mt-4">
              <Link
                to="/home"
                className="text-foreground hover:text-primary transition-colors"
              >
                Home
              </Link>
              <Link
                to="/my-list"
                className="text-foreground hover:text-primary transition-colors"
              >
                My List
              </Link>
              <Link
                to="/"
                className="text-foreground hover:text-primary transition-colors"
              >
                Logout
              </Link>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </nav>
  );
};

export default Navbar;
