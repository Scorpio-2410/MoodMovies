import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Smile, Frown, Laugh, Heart, Star, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const moods = [
  { name: "Happy", icon: Smile },
  { name: "Sad", icon: Frown },
  { name: "Humorous", icon: Laugh },
  { name: "Romantic", icon: Heart },
  { name: "Excited", icon: Star },
];

const HomePage = () => {
  const [selectedMood, setSelectedMood] = useState("");
  const [recommendations, setRecommendations] = useState([]);
  const navigate = useNavigate();

  const handleMoodSelect = (mood) => {
    setSelectedMood(mood);
    // Need to implement API call to get movie recommendations based on mood
    // Using dummy data for now
    setRecommendations([
      {
        id: 1,
        title: "The Shawshank Redemption",
        poster:
          "https://image.tmdb.org/t/p/w500/q6y0Go1tsGEsmtFryDOJo3dEmqu.jpg",
        rating: 9.3,
        synopsis:
          "Two imprisoned men bond over a number of years, finding solace and eventual redemption through acts of common decency.",
      },
      {
        id: 2,
        title: "The Godfather",
        poster:
          "https://image.tmdb.org/t/p/w500/3bhkrj58Vtu7enYsRolD1fZdja1.jpg",
        rating: 9.2,
        synopsis:
          "The aging patriarch of an organized crime dynasty transfers control of his clandestine empire to his reluctant son.",
      },
      {
        id: 3,
        title: "The Dark Knight",
        poster:
          "https://image.tmdb.org/t/p/w500/qJ2tW6WMUDux911r6m7haRef0WH.jpg",
        rating: 9.0,
        synopsis:
          "When the menace known as the Joker wreaks havoc and chaos on the people of Gotham, Batman must accept one of the greatest psychological and physical tests of his ability to fight injustice.",
      },
      {
        id: 3,
        title: "The Dark Knight",
        poster:
          "https://image.tmdb.org/t/p/w500/qJ2tW6WMUDux911r6m7haRef0WH.jpg",
        rating: 9.0,
        synopsis:
          "When the menace known as the Joker wreaks havoc and chaos on the people of Gotham, Batman must accept one of the greatest psychological and physical tests of his ability to fight injustice.",
      },
    ]);
  };

  const handleMovieClick = (movieId) => {
    navigate(`/movie/${movieId}`);
  };

  const handleAddToList = (event, movieId) => {
    event.stopPropagation();
    // Need to implement add to list functionality
    console.log(`Added movie ${movieId} to list`);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">How are you feeling today?</h1>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4 mb-8">
        {moods.map((mood) => (
          <Button
            key={mood.name}
            onClick={() => handleMoodSelect(mood.name)}
            variant={selectedMood === mood.name ? "default" : "outline"}
            className="h-auto flex flex-col items-center justify-center p-4"
          >
            <mood.icon className="h-8 w-8 mb-2" />
            <span>{mood.name}</span>
          </Button>
        ))}
      </div>
      {recommendations.length > 0 && (
        <div>
          <h2 className="text-2xl font-bold mb-4">Recommended Movies</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2  lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {recommendations.map((movie) => (
              <Card
                key={movie.id}
                className="cursor-pointer relative overflow-hidden"
                onClick={() => handleMovieClick(movie.id)}
              >
                <CardContent className="p-0">
                  <img
                    src={movie.poster}
                    alt={movie.title}
                    className="w-full h-96 "
                  />
                  <div className="p-4">
                    <h3 className="font-semibold text-lg mb-2 truncate">
                      {movie.title}
                    </h3>
                    <p className="text-sm text-gray-600 mb-2 line-clamp-3">
                      {movie.synopsis}
                    </p>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-yellow-500">
                        ★ {movie.rating.toFixed(1)}
                      </span>
                      <Button
                        size="sm"
                        variant="outline"
                        className="text-xs"
                        onClick={(e) => handleAddToList(e, movie.id)}
                      >
                        <Plus className="h-4 w-4 mr-1" />
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
    </div>
  );
};

export default HomePage;
