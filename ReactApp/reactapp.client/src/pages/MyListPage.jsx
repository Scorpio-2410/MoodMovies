import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Pencil, Trash2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import axios from "axios";
import { toast } from "sonner";

import MovieListEntryModal from "@/components/MovieListEntryModal";

// Dummy data
const dummyMovies = [
  {
    id: 1,
    userId: "user123",
    title: "Inception",
    genre: "Sci-Fi",
    rating: 8.8,
    status: "watched",
    poster: "/9gk7adHYeDvHkCSEqAvQNLV5Uge.jpg",
    notes: "Mind-bending plot, great visuals.",
  },
  {
    id: 2,
    userId: "user123",
    title: "The Shawshank Redemption",
    genre: "Drama",
    rating: 9.3,
    status: "watching",
    poster: "/q6y0Go1tsGEsmtFryDOJo3dEmqu.jpg",
    notes: "Powerful story of hope and friendship.",
  },
  {
    id: 3,
    userId: "user123",
    title: "Pulp Fiction",
    genre: "Crime",
    rating: 8.9,
    status: "watching",
    poster: "/d5iIlFn5s0ImszYzBPb8JPIfbXD.jpg",
    notes: "Quirky dialogue, non-linear storytelling.",
  },
  {
    id: 4,
    userId: "user456",
    title: "The Godfather",
    genre: "Crime",
    rating: 9.2,
    status: "planning",
    poster: "/3bhkrj58Vtu7enYsRolD1fZdja1.jpg",
    notes: "Classic mafia epic, must-watch.",
  },
  {
    id: 5,
    userId: "user123",
    title: "The Dark Knight",
    genre: "Action",
    rating: 9.0,
    status: "watched",
    poster: "/qJ2tW6WMUDux911r6m7haRef0WH.jpg",
    notes: "Heath Ledger's Joker is unforgettable.",
  },
  {
    id: 6,
    userId: "user123",
    title: "Forrest Gump",
    genre: "Drama",
    rating: 8.8,
    status: "planning",
    poster: "/arw2vcBveWOVZr6pxd9XTd1TdQa.jpg",
    notes: "Heartwarming journey through history.",
  },
];

const MyListPage = () => {
  // State management
  const [movies, setMovies] = useState([]);
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [genreFilter, setGenreFilter] = useState("All");
  const [isLoading, setIsLoading] = useState(false);

  // List of available genres for filtering
  const genres = [
    "All",
    "Action",
    "Comedy",
    "Drama",
    "Sci-Fi",
    "Thriller",
    "Horror",
    "Crime",
  ];

  // Helper function to display status emoji
  const getStatusEmoji = (status) => {
    switch (status) {
      case "watched":
        return "✅";
      case "watching":
        return "👀";
      case "planning":
        return "🗓️";
      default:
        return "🎬";
    }
  };

  // Fetch movies when search term or filters change
  useEffect(() => {
    fetchMovies();
  }, []);

  const fetchMovies = async () => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("No token found");
      }

      const response = await axios.get("/api/MovieListEntry", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setMovies(response.data);
      console.log("Movies:", response.data);
    } catch (error) {
      console.error("Error fetching movies:", error);
      // Handle error (e.g., show error message to user)
    } finally {
      setIsLoading(false);
    }
  };

  // Handler for updating a movie
  const handleUpdateMovie = async (updatedMovie) => {
    setMovies((prevMovies) =>
      prevMovies.map((movie) =>
        // Replace the movie with the updated movie
        movie.entryId === updatedMovie.entryId ? updatedMovie : movie,
      ),
    );
  };

  // Handler for deleting a movie
  const handleDeleteMovie = async (movieId) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("No token found");
      }

      await axios.delete(`/api/MovieListEntry/${movieId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setMovies((prevMovies) =>
        prevMovies.filter((movie) => movie.entryId !== movieId),
      );
      toast.success("Movie removed from your list");
    } catch (error) {
      console.error("Error deleting movie:", error);
      toast.error("Failed to delete movie. Please try again.");
    }
  };

  return (
    <div className="min-h-screen p-8">
      <h1 className="text-4xl font-bold text-black mb-8 text-center">
        My Movie List 🍿
      </h1>

      {/* Search and filter controls */}
      <div className="mb-6 flex flex-col sm:flex-row items-centre justify-center gap-4">
        <Input
          type="text"
          placeholder="Search movies..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full sm:w-64 bg-white"
        />
        <Select value={genreFilter} onValueChange={setGenreFilter}>
          <SelectTrigger className="w-[180px] bg-white">
            <SelectValue placeholder="Select genre" />
          </SelectTrigger>
          <SelectContent>
            {genres.map((genre) => (
              <SelectItem key={genre} value={genre.toLowerCase()}>
                {genre}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <div className="flex gap-2">
          {["All", "Watching", "Watched", "Planning"].map((status) => (
            <Button
              key={status}
              variant={statusFilter === status ? "default" : "outline"}
              onClick={() => setStatusFilter(status)}
              className="text-sm"
            >
              {status}
            </Button>
          ))}
        </div>
      </div>

      {/* Display loading message or movie grid */}
      {isLoading ? (
        <div className="text-center">Loading...</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {movies.map((movie) => (
            <div
              key={movie.entryId}
              className="bg-white bg-opacity-90 backdrop-blur-sm rounded-xl shadow-lg overflow-hidden flex flex-col transition-all duration-300 hover:shadow-xl hover:scale-105"
            >
              <div className="relative">
                <img
                  src={`https://image.tmdb.org/t/p/w500${movie.moviePosterPath}`}
                  alt={movie.movieTitle}
                  className="w-full h-56 object-cover"
                />
                <div className="absolute top-2 right-2 bg-black bg-opacity-50 text-yellow-400 px-2 py-1 rounded-full text-sm">
                  ⭐ {movie.userRating?.toFixed(1) || "N/A"}
                </div>
              </div>
              <div className="p-4 flex-grow flex flex-col">
                <h3 className="text-xl font-semibold mb-1 text-gray-800">
                  {movie.movieTitle}
                </h3>
                <p className="text-gray-600 text-sm mb-1">{movie.movieGenre}</p>
                <p className="text-gray-500 text-xs italic mb-2">
                  {movie.notes}
                </p>
                <div className="mt-auto flex justify-between items-centre">
                  <span className="text-2xl">
                    {getStatusEmoji(movie.status)}
                  </span>
                  <div className="flex space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="bg-transparent border-2 border-blue-500 text-blue-500 hover:bg-blue-500 hover:text-white transition-colors duration-300"
                      onClick={() => setSelectedMovie(movie)}
                    >
                      <Pencil className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="bg-transparent border-2 border-red-500 text-red-500 hover:bg-red-500 hover:text-white transition-colors duration-300"
                      onClick={() => handleDeleteMovie(movie.entryId)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal for editing a movie */}
      <Dialog
        open={selectedMovie !== null}
        onOpenChange={(open) => !open && setSelectedMovie(null)}
      >
        <DialogContent className="sm:max-w-[600px]">
          {selectedMovie && (
            <MovieListEntryModal
              movie={selectedMovie}
              onClose={() => setSelectedMovie(null)}
              onUpdate={handleUpdateMovie}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default MyListPage;
