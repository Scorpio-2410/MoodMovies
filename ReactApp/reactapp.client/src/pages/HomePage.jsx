import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "sonner";
import axios from "axios";

// Use your actual TMDB API key here
const API_KEY = 'f25f87cdd05107e089c4834ff8903582'; // Replace this with your TMDB API key

const moods = [
  { name: 'Happy', emoji: '😊', genre: 35, bgColor: 'bg-yellow-300', textColor: 'text-yellow-900' },
  { name: 'Sad', emoji: '😢', genre: 18, bgColor: 'bg-blue-300', textColor: 'text-blue-900' },
  { name: 'Love', emoji: '❤️', genre: 10749, bgColor: 'bg-red-300', textColor: 'text-red-900' },
  { name: 'Anger', emoji: '😡', genre: 28, bgColor: 'bg-orange-400', textColor: 'text-orange-900' },
  { name: 'Adventurous', emoji: '🏔️', genre: 12, bgColor: 'bg-gray-300', textColor: 'text-gray-900' },
  { name: 'Something New', emoji: '🆕', genre: 878, bgColor: 'bg-green-300', textColor: 'text-green-900' },
];

const HomePage = () => {
  const [selectedMood, setSelectedMood] = useState("");
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1); // Track page number for new API results

  useEffect(() => {
    const randomMood = moods[Math.floor(Math.random() * moods.length)];
    handleMoodSelect(randomMood.name);
  }, []);

  const handleMoodSelect = (mood) => {
    setSelectedMood(mood);
    setPage(1); // Reset page to 1 when changing moods
    const selectedGenre = moods.find((m) => m.name === mood).genre;
    fetchMoviesByMood(selectedGenre, 1); // Fetch movies from page 1
  };

  const fetchMoviesByMood = async (genreId, pageNum) => {
    setLoading(true);
    try {
      const response = await axios.get(
        `https://api.themoviedb.org/3/discover/movie?api_key=${API_KEY}&with_genres=${genreId}&page=${pageNum}`
      );

      if (response.data.results.length === 0) {
        // Fallback if no results are found
        toast.error("No results found. Try refreshing or selecting another mood.");
      } else {
        setRecommendations(response.data.results.slice(0, 4)); // Show 4 movies at a time
      }
    } catch (error) {
      console.error("Error fetching movies:", error);
      toast.error("Failed to fetch movie recommendations.");
    } finally {
      setLoading(false);
    }
  };

  const refreshMovies = () => {
    const selectedGenre = moods.find((m) => m.name === selectedMood).genre;
    const newPage = page + 1; // Increment the page for a fresh set of results
    setPage(newPage); // Update page state
    fetchMoviesByMood(selectedGenre, newPage); // Fetch new movies with the updated page number
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold text-center mb-8">Select Your Mood</h1>

      {/* Mood selection buttons */}
      <div className="flex justify-center mb-8 space-x-4 flex-wrap">
        {moods.map((mood) => (
          <div
            key={mood.name}
            className={`p-4 rounded-lg border shadow-md cursor-pointer flex flex-col items-center justify-center transition-all duration-200
              ${selectedMood === mood.name ? `bg-opacity-100 ${mood.bgColor}` : `bg-opacity-50 ${mood.bgColor}`}
              ${mood.textColor}`}
            onClick={() => handleMoodSelect(mood.name)}
          >
            <span className="text-5xl mb-2">{mood.emoji}</span>
            <span className="font-semibold">{mood.name}</span>
          </div>
        ))}
      </div>

      {loading && <p className="text-center">Loading...</p>}

      {recommendations.length > 0 && !loading && (
        <div>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold">
              Recommended Movies for {selectedMood} {moods.find((m) => m.name === selectedMood).emoji}
            </h2>
            <Button variant="outline" onClick={refreshMovies} className="flex items-center">
              <span className="mr-1">🔄</span>
              Refresh
            </Button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {recommendations.map((movie) => (
              <Card
                key={movie.id}
                className="cursor-pointer relative overflow-hidden"
                onClick={() => window.open(`https://www.themoviedb.org/movie/${movie.id}`, "_blank")}
              >
                <CardContent className="p-0">
                  <img
                    src={`https://image.tmdb.org/t/p/w500/${movie.poster_path}`}
                    alt={movie.title}
                    className="w-full h-96"
                  />
                  <div className="p-4">
                    <h3 className="font-semibold text-lg mb-2 truncate">{movie.title}</h3>
                    <p className="text-sm text-gray-600 mb-2 line-clamp-3">{movie.overview}</p>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-yellow-500">★ {movie.vote_average.toFixed(1)}</span>
                      <Button
                        size="sm"
                        variant="outline"
                        className="text-xs"
                        onClick={(e) => {
                          e.stopPropagation();
                          toast.success(`Added "${movie.title}" to your list`, { duration: 2000 });
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

      {/* Error message if no movies */}
      {recommendations.length === 0 && !loading && (
        <p className="text-center text-gray-500">No recommendations available for this mood. Try refreshing or select a different mood.</p>
      )}
    </div>
  );
};

export default HomePage;

