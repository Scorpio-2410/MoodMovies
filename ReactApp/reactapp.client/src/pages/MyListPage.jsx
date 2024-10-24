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

const MyListPage = () => {
  // State management
  const [movieListEntries, setMovieListEntries] = useState([]);
  const [selectedMovieListEntry, setSelectedMovieListEntry] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [genreFilter, setGenreFilter] = useState("all");
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
    fetchMovieListEntries();
  }, [searchTerm, statusFilter, genreFilter]);

  const fetchMovieListEntries = async () => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("No token found");
      }

      // Setup Url Params
      const params = new URLSearchParams();
      if (searchTerm) params.append("searchTerm", searchTerm);
      if (statusFilter !== "all") params.append("statusFilter", statusFilter);
      if (genreFilter !== "all") params.append("genreFilter", genreFilter);

      // Get request to fetch movie list entries
      const response = await axios.get("/api/MovieListEntry", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params: params,
      });

      setMovieListEntries(response.data);
      console.log("Movie List Entries:", response.data);
    } catch (error) {
      console.error("Error fetching movie list entries:", error);
      if (error.response) {
        toast.error(
          `Error: ${error.response.data.message || "Failed to fetch movies"}`,
        );
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Handler for updating a movie list entry
  const handleUpdateMovieListEntry = async (updatedMovieListEntry) => {
    setMovieListEntries((prevEntries) =>
      prevEntries.map((entry) =>
        // Replace the movie with the updated movie
        entry.entryId === updatedMovieListEntry.entryId
          ? updatedMovieListEntry
          : entry,
      ),
    );
  };

  // Handler for deleting a movie list entry
  const handleDeleteMovieListEntry = async (entryId) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("No token found");
      }

      await axios.delete(`/api/MovieListEntry/${entryId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setMovieListEntries((prevEntries) =>
        prevEntries.filter((entry) => entry.entryId !== entryId),
      );
      toast.success("Movie removed from your list");
    } catch (error) {
      console.error("Error deleting movie list entry:", error);
      toast.error("Failed to delete movie list entry. Please try again.");
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
          {["All", "Planning", "Watching", "Watched"].map((status) => (
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

      {/* Display loading message or movie list entry grid */}
      {isLoading ? (
        <div className="text-center">Loading...</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {movieListEntries.map((entry) => (
            <div
              key={entry.entryId}
              className="bg-white bg-opacity-90 backdrop-blur-sm rounded-xl shadow-lg overflow-hidden flex flex-col transition-all duration-300 hover:shadow-xl hover:scale-105"
            >
              <div className="relative">
                <img
                  src={`https://image.tmdb.org/t/p/w500${entry.moviePosterPath}`}
                  alt={entry.movieTitle}
                  className="w-full h-56 object-cover"
                />
                <div className="absolute top-2 right-2 bg-black bg-opacity-50 text-yellow-400 px-2 py-1 rounded-full text-sm">
                  ⭐ {entry.userRating?.toFixed(1) || "N/A"}
                </div>
              </div>
              <div className="p-4 flex-grow flex flex-col">
                <h3 className="text-xl font-semibold mb-1 text-gray-800">
                  {entry.movieTitle}
                </h3>
                <p className="text-gray-600 text-sm mb-1">{entry.movieGenre}</p>
                <p className="text-gray-500 text-xs italic mb-2">
                  {entry.notes}
                </p>
                <div className="mt-auto flex justify-between items-centre">
                  <span className="text-2xl">
                    {getStatusEmoji(entry.status)}
                  </span>
                  <div className="flex space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="bg-transparent border-2 border-blue-500 text-blue-500 hover:bg-blue-500 hover:text-white transition-colors duration-300"
                      onClick={() => setSelectedMovieListEntry(entry)}
                    >
                      <Pencil className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="bg-transparent border-2 border-red-500 text-red-500 hover:bg-red-500 hover:text-white transition-colors duration-300"
                      onClick={() => handleDeleteMovieListEntry(entry.entryId)}
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

      {/* Modal for editing a movie list entry */}
      <Dialog
        open={selectedMovieListEntry !== null}
        onOpenChange={(open) => !open && setSelectedMovieListEntry(null)}
      >
        <DialogContent className="sm:max-w-[600px]">
          {selectedMovieListEntry && (
            <MovieListEntryModal
              movieListEntry={selectedMovieListEntry}
              onClose={() => setSelectedMovieListEntry(null)}
              onUpdate={handleUpdateMovieListEntry}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default MyListPage;
