import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Smile, Frown, Laugh, Heart, Star, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "sonner";

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
  // const navigate = useNavigate();

  const handleMoodSelect = (mood) => {
    setSelectedMood(mood);
    // Need to implement API call to get movie recommendations based on mood
    // Using dummy data for now
    const moodRecommendations = {
      Happy: [
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
          title: "Schindler's List",
          poster:
            "https://image.tmdb.org/t/p/w500/sF1U4EUQS8YHUYjNl3pMGNIQyr0.jpg",
          rating: 8.9,
          synopsis:
            "In German-occupied Poland during World War II, industrialist Oskar Schindler gradually becomes concerned for his Jewish workforce after witnessing their persecution by the Nazis.",
        },
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
          title: "Schindler's List",
          poster:
            "https://image.tmdb.org/t/p/w500/sF1U4EUQS8YHUYjNl3pMGNIQyr0.jpg",
          rating: 8.9,
          synopsis:
            "In German-occupied Poland during World War II, industrialist Oskar Schindler gradually becomes concerned for his Jewish workforce after witnessing their persecution by the Nazis.",
        },
      ],
      Sad: [
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
          title: "Schindler's List",
          poster:
            "https://image.tmdb.org/t/p/w500/sF1U4EUQS8YHUYjNl3pMGNIQyr0.jpg",
          rating: 8.9,
          synopsis:
            "In German-occupied Poland during World War II, industrialist Oskar Schindler gradually becomes concerned for his Jewish workforce after witnessing their persecution by the Nazis.",
        },
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
          title: "Schindler's List",
          poster:
            "https://image.tmdb.org/t/p/w500/sF1U4EUQS8YHUYjNl3pMGNIQyr0.jpg",
          rating: 8.9,
          synopsis:
            "In German-occupied Poland during World War II, industrialist Oskar Schindler gradually becomes concerned for his Jewish workforce after witnessing their persecution by the Nazis.",
        },
      ],
      Excited: [
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
          id: 4,
          title: "Inception",
          poster:
            "https://image.tmdb.org/t/p/w500/9gk7adHYeDvHkCSEqAvQNLV5Uge.jpg",
          rating: 8.8,
          synopsis:
            "A thief who steals corporate secrets through the use of dream-sharing technology is given the inverse task of planting an idea into the mind of a C.E.O.",
        },
      ],
    };

    setRecommendations(moodRecommendations[mood] || []);
  };

  // const handleMovieClick = (movieId) => {
  //   navigate(`/movie/${movieId}`);
  // };

  const handleAddToList = (event, movieId, movieTitle) => {
    event.stopPropagation();
    // Need to implement add to list functionality
    console.log(`Added movie ${movieTitle} to list`);
    toast.success(`Added "${movieTitle}" to your list`, {
      duration: 2000,
    });
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
                        onClick={(e) =>
                          handleAddToList(e, movie.id, movie.title)
                        }
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
