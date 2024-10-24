import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "sonner";
import axios from "axios";

// TMDB API key
const TMDB_API_KEY = "f25f87cdd05107e089c4834ff8903582"; // Replace this with your TMDB API key

// Predefined moods and genres
const predefinedMoods = [
  {
    name: "Happy",
    emoji: "😊",
    genre: 35,
    bgColor: "bg-yellow-300",
    textColor: "text-yellow-900",
  }, // Comedy
  {
    name: "Sad",
    emoji: "😢",
    genre: 18,
    bgColor: "bg-blue-300",
    textColor: "text-blue-900",
  }, // Drama
  {
    name: "Love",
    emoji: "❤️",
    genre: 10749,
    bgColor: "bg-red-300",
    textColor: "text-red-900",
  }, // Romance
  {
    name: "Anger",
    emoji: "😡",
    genre: 28,
    bgColor: "bg-orange-400",
    textColor: "text-orange-900",
  }, // Action
  {
    name: "Scared",
    emoji: "😨",
    genre: 27,
    bgColor: "bg-purple-300",
    textColor: "text-purple-900",
  }, // Horror
  {
    name: "Adventurous",
    emoji: "🏔️",
    genre: 12,
    bgColor: "bg-gray-300",
    textColor: "text-gray-900",
  }, // Adventure
];

// Function to fetch movies based on the selected mood's genre
const fetchMoviesByMood = async (genreId, pageNum = 1) => {
  try {
    const response = await axios.get(
      `https://api.themoviedb.org/3/discover/movie?api_key=${TMDB_API_KEY}&with_genres=${genreId}&page=${pageNum}`,
    );
    return response.data.results.slice(0, 4); // Return top 4 movies
  } catch (error) {
    console.error("Error fetching movies:", error);
    toast.error("Failed to fetch movie recommendations.");
    return [];
  }
};

const HomePage = () => {
  const [selectedMood, setSelectedMood] = useState("");
  const [recommendations, setRecommendations] = useState([]); // Movie recommendations
  const [loading, setLoading] = useState(false); // Loading state
  const [page, setPage] = useState(1); // Pagination for movies

  const handleMoodSelect = async (mood) => {
    setSelectedMood(mood.name);
    setPage(1); // Reset to page 1
    setLoading(true); // Show loading indicator
    const movies = await fetchMoviesByMood(mood.genre, 1);
    setRecommendations(movies); // Set movie recommendations
    setLoading(false); // Turn off loading
  };

  const refreshMovies = async () => {
    const selectedGenre = predefinedMoods.find(
      (m) => m.name === selectedMood,
    ).genre;
    const newPage = page + 1; // Fetch next page of movies
    setPage(newPage);
    setLoading(true); // Show loading indicator
    const movies = await fetchMoviesByMood(selectedGenre, newPage);
    setRecommendations(movies); // Update movie recommendations
    setLoading(false); // Turn off loading
  };

  const handleAddToList = async (movie) => {
    try {
      // Check if the user is logged in
      const token = localStorage.getItem("token");
      if (!token) {
        toast.error("Please log in to add movies to your list.");
        return;
      }

      // Send post request
      const response = await axios.post(
        "/api/MovieListEntry",
        {
          MovieTitle: movie.title,
          MovieGenre: movie.genre_ids.map((id) => genreIdToName(id)).join(", "), // Convert genre IDs to names
          MoviePosterPath: movie.poster_path,
          Status: "planning", // Default status
          IsFavorite: false,
          Notes: "",
          UserRating: 0,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      // Check if successful
      if (response.status === 201) {
        toast.success(`${movie.title} added to your list!`);
      } else {
        toast.error("Failed to add movie to your list. Please try again.");
      }
    } catch (error) {
      console.error("Error adding movie to list:", error);
      // Handle different error scenarios
      if (error.response) {
        switch (error.response.status) {
          case 401:
            toast.error("Your session has expired. Please log in again.");
            break;
          case 409:
            toast.info("This movie is already in your list.");
            break;
          default:
            toast.error("An error occurred. Please try again later.");
        }
      }
    }
  };

  // Helper function to convert genre ID to name
  const genreIdToName = (id) => {
    const genres = {
      27: "Horror",
      878: "Science Fiction",
      35: "Comedy",
      10749: "Romance",
      18: "Drama",
      28: "Action",
      12: "Adventure",
      53: "Thriller",
      80: "Crime",
      9648: "Mystery",
      16: "Animation",
      14: "Fantasy",
      10751: "Family",
      36: "History",
      99: "Documentary",
      10402: "Music",
      37: "Western",
      10770: "TV Movie",
      10752: "War",
    };
    return genres[id] || "Unknown";
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold text-center mb-8">Select Your Mood</h1>

      {/* Mood selection buttons */}
      <div className="flex justify-center mb-8 space-x-4 flex-wrap">
        {predefinedMoods.map((mood) => (
          <div
            key={mood.name}
            className={`w-32 h-32 p-4 rounded-lg border shadow-md cursor-pointer flex flex-col items-center justify-center transition-all duration-200
              ${
                selectedMood === mood.name
                  ? `bg-opacity-100 ${mood.bgColor}`
                  : `bg-opacity-50 ${mood.bgColor}`
              }
              ${mood.textColor}`}
            onClick={() => handleMoodSelect(mood)}
          >
            <span className="text-5xl mb-2">{mood.emoji}</span>
            <span className="font-semibold text-center">{mood.name}</span>
          </div>
        ))}
      </div>

      {/* No mood selected message */}
      {!selectedMood && !loading && (
        <p className="text-center text-gray-500">
          Please select a mood to be recommended movies.
        </p>
      )}

      {/* Loading indicator */}
      {loading && <p className="text-center">Loading...</p>}

      {/* Recommendations section */}
      {recommendations.length > 0 && !loading && (
        <div>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold">
              Recommended Movies for {selectedMood}{" "}
              {predefinedMoods.find((m) => m.name === selectedMood).emoji}
            </h2>
            <Button
              variant="outline"
              onClick={refreshMovies}
              className="flex items-center"
            >
              <span className="mr-1">🔄</span>
              Refresh
            </Button>
          </div>

          {/* Movie Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {recommendations.map((movie) => (
              <Card
                key={movie.id}
                className="cursor-pointer relative overflow-hidden"
                onClick={() =>
                  window.open(
                    `https://www.themoviedb.org/movie/${movie.id}`,
                    "_blank",
                  )
                }
              >
                <CardContent className="p-0">
                  <img
                    src={`https://image.tmdb.org/t/p/w500/${movie.poster_path}`}
                    alt={movie.title}
                    className="w-full h-96"
                  />
                  <div className="p-4">
                    <h3 className="font-semibold text-lg mb-2 truncate">
                      {movie.title}
                    </h3>
                    <p className="text-sm text-gray-600 mb-2 line-clamp-3">
                      {movie.overview}
                    </p>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-yellow-400">
                        ⭐ {movie.vote_average.toFixed(1)}
                      </span>
                      <Button
                        variant="outline"
                        size="sm"
                        className="bg-transparent border-2 border-blue-500 text-blue-500 hover:bg-blue-500 hover:text-white transition-colors duration-300"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleAddToList(movie);
                        }}
                      >
                        Add to List
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* No recommendations */}
      {!loading && recommendations.length === 0 && selectedMood && (
        <p className="text-center text-gray-500">
          No recommendations available for this mood. Please try again.
        </p>
      )}
    </div>
  );
};

export default HomePage;
