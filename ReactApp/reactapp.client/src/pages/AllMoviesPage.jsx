import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { toast } from 'sonner';
import axios from 'axios';

// TMDB API key
const TMDB_API_KEY = "f25f87cdd05107e089c4834ff8903582"; // Replace this with your TMDB API key

const AllMoviesPage = () => {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState(''); // Search term for movie search
  const [filters, setFilters] = useState({
    rating: '',
    year: '',
    trending: false,
    favorite: false,
  });
  const [currentPage, setCurrentPage] = useState(1); // Page tracking

  // Fetch movies based on search term and filters
  const fetchMovies = async (page = 1) => {
    setLoading(true);
    try {
      let url = `https://api.themoviedb.org/3/discover/movie?api_key=${TMDB_API_KEY}&page=${page}`;

      // Apply search term
      if (searchTerm) {
        url = `https://api.themoviedb.org/3/search/movie?api_key=${TMDB_API_KEY}&query=${searchTerm}&page=${page}`;
      }

      // Apply filters
      if (filters.rating) {
        switch (filters.rating) {
          case "0-4":
            url += `&vote_average.lte=4`;
            break;
          case "4-8":
            url += `&vote_average.gte=4&vote_average.lte=8`;
            break;
          case "8+":
            url += `&vote_average.gte=8`;
            break;
          default:
            break;
        }
      }
      if (filters.year) {
        url += `&primary_release_year=${filters.year}`;
      }
      if (filters.trending) {
        url = `https://api.themoviedb.org/3/movie/popular?api_key=${TMDB_API_KEY}&page=${page}`;
      }
      if (filters.favorite) {
        url = `https://api.themoviedb.org/3/movie/top_rated?api_key=${TMDB_API_KEY}&page=${page}`;
      }

      const response = await axios.get(url);
      setMovies(response.data.results);
    } catch (error) {
      console.error('Error fetching movies:', error);
      toast.error('Failed to fetch movies.');
    } finally {
      setLoading(false);
      window.scrollTo({ top: 0, behavior: 'smooth' }); // Scroll to top when page changes
    }
  };

  // Handle filter changes
  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  // Handle checkbox changes for trending and favorite
  const handleCheckboxChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.checked });
  };

  // Clear filters
  const clearFilters = () => {
    setFilters({
      rating: '',
      year: '',
      trending: false,
      favorite: false,
    });
    setSearchTerm(''); // Reset search term
    setCurrentPage(1);
    fetchMovies(1);
  };

  // Handle pagination
  const handlePageChange = (page) => {
    setCurrentPage(page);
    fetchMovies(page);
  };

  // Handle Add to List functionality
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
        }
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

  useEffect(() => {
    fetchMovies(currentPage);
  }, []);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold text-center mb-8">All Movies</h1>

      {/* Search and Filter Section */}
      <div className="flex flex-col md:flex-row items-center justify-between mb-8 space-y-4 md:space-y-0">
        
        {/* Search input */}
        <input
          type="text"
          placeholder="Search movie..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="border rounded-lg p-2 w-64"
        />

        {/* Filters */}
        <div className="flex space-x-4">
          {/* Rating Filter */}
          <select
            name="rating"
            value={filters.rating}
            onChange={handleFilterChange}
            className="border rounded-lg p-2"
          >
            <option value="">Rating</option>
            <option value="0-4">0-4</option>
            <option value="4-8">4-8</option>
            <option value="8+">8+</option>
          </select>

          {/* Year Filter */}
          <input
            type="number"
            name="year"
            placeholder="Year"
            value={filters.year}
            onChange={handleFilterChange}
            className="border rounded-lg p-2"
          />

          {/* Trending and Favorite Checkboxes */}
          <div className="flex flex-col">
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                name="trending"
                checked={filters.trending}
                onChange={handleCheckboxChange}
              />
              <span>Trending</span>
            </label>
            <label className="flex items-center space-x-2 mt-2">
              <input
                type="checkbox"
                name="favorite"
                checked={filters.favorite}
                onChange={handleCheckboxChange}
              />
              <span>Favourite</span>
            </label>
          </div>
        </div>

        {/* Search and Clear Filters Button */}
        <div className="flex space-x-4">
          <Button
            variant="outline"
            className="bg-red-500 text-white px-4 py-2 rounded-lg"
            onClick={clearFilters}
          >
            Clear Filters
          </Button>

          <Button
            variant="outline"
            className="bg-blue-500 text-white px-4 py-2 rounded-lg"
            onClick={() => fetchMovies(1)}
          >
            Search
          </Button>
        </div>
      </div>

      {/* Movies List */}
      {loading ? (
        <p className="text-center">Loading...</p>
      ) : (
        <div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {movies.map((movie) => (
              <Card
                key={movie.id}
                className="cursor-pointer relative overflow-hidden"
                onClick={() =>
                  window.open(
                    `https://www.themoviedb.org/movie/${movie.id}`,
                    "_blank"
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

      {/* Pagination */}
      <div className="flex justify-center mt-8">
        {[1, 2, 3, 4, 5].map((page) => (
          <Button
            key={page}
            variant="outline"
            className={`mx-2 px-4 py-2 ${
              currentPage === page
                ? "bg-blue-500 text-white"
                : "bg-transparent text-blue-500 border-blue-500"
            }`}
            onClick={() => handlePageChange(page)}
          >
            {page}
          </Button>
        ))}
      </div>
    </div>
  );
};

export default AllMoviesPage;
