import { Button } from "../components/ui/button";
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "../components/ui/dialog";
import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import axios from 'axios';
import debounce from 'lodash/debounce';

const TMDB_API_KEY = "f25f87cdd05107e089c4834ff8903582";
const TMDB_IMAGE_BASE_URL = "https://image.tmdb.org/t/p/w92";

const SocialsPage = () => {
  const [newPost, setNewPost] = useState({ title: '', content: '' });
  const [posts, setPosts] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [statusFilter, setStatusFilter] = useState("All Posts");
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [user, setUser] = useState(null);

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setNewPost({ title: '', content: '' });
    setSelectedMovie(null);
    setSearchTerm('');
  };

  const fetchUser = async () => {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      const response = await axios.get('/api/user/profile-fetch', {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (response.data && response.data.userName) {
        setUser(response.data);
      }
    } catch (error) {
      console.error("Error fetching user profile:", error);
      toast.error("Failed to fetch user profile.");
    }
  };

  const fetchPosts = async () => {
    try {
      const response = await axios.get('/api/Post/all');
      const postsWithMovies = await Promise.all(response.data.map(async (post) => {
        if (post.movieId) {
          const movie = await fetchMovieById(post.movieId);
          return { ...post, movie };
        }
        return post;
      }));
      setPosts(postsWithMovies.reverse());
    } catch (error) {
      console.error("Error fetching posts:", error);
      toast.error("Failed to fetch posts.");
    }
  };

  const fetchMovieById = async (movieId) => {
    try {
      const response = await axios.get(`https://api.themoviedb.org/3/movie/${movieId}?api_key=${TMDB_API_KEY}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching movie by ID:', error);
      return null;
    }
  };

  useEffect(() => {
    fetchUser();
    fetchPosts();
  }, []);

  const fetchMovies = async (query) => {
    if (!query) return;
    setLoading(true);
    try {
      const url = `https://api.themoviedb.org/3/search/movie?api_key=${TMDB_API_KEY}&query=${query}`;
      const response = await axios.get(url);
      setSearchResults(response.data.results);
    } catch (error) {
      console.error('Error fetching movies:', error);
      toast.error('Failed to fetch movies.');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = debounce((query) => {
    if (query.length > 0) {
      fetchMovies(query);
      setShowSuggestions(true);
    } else {
      setShowSuggestions(false);
    }
  }, 200);

  const handleSearchChange = (e) => {
    const query = e.target.value;
    setSearchTerm(query);
    setSelectedMovie(null);
    handleInputChange(query);
  };

  const handleSuggestionClick = (movie) => {
    setSelectedMovie(movie);
    setSearchTerm(movie.title);
    setShowSuggestions(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem("token");
    if (!token || !user) {
      toast.error("Please log in to create a new post.");
      return;
    }

    // Create a new post entry including user information and description
    const newPostEntry = {
      movieId: selectedMovie?.id || null,
      postDateTime: new Date().toISOString(),
      description: newPost.content,
      userName: user.userName, // Include userName in the post
      movie: selectedMovie,
    };

    try {
      const response = await axios.post('/api/Post', newPostEntry, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.status === 201) {
        setPosts((prevPosts) => [newPostEntry, ...prevPosts]); // Add new post to top
        toast.success("Post has been created!");
      } else {
        toast.error("Failed to create post. Please try again.");
      }
    } catch (error) {
      console.error("Error creating post:", error);
      toast.error("An error occurred while creating the post.");
    }

    handleCloseModal();
  };

  const handleDelete = async (postId) => {
    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("Please log in to delete a post.");
      return;
    }
  
    try {
      await axios.delete(`/api/Post/${postId}`, {
        headers: { Authorization: `Bearer ${token}` },
        data: { postId },
      });
      setPosts((prevPosts) => prevPosts.filter((post) => post.postId !== postId));
      toast.success("Post deleted successfully.");
    } catch (error) {
      console.error("Error deleting post:", error);
      toast.error("Failed to delete post.");
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 min-h-screen">
      <h1 className="text-4xl font-bold text-center mb-8">Social Feed</h1>
      <div className="flex justify-center mb-8">
        <div className="flex gap-2">
          {["All Posts", "Your Posts"].map((status) => (
            <Button
              key={status}
              variant={statusFilter.toLowerCase() === status.toLowerCase() ? "default" : "outline"}
              className="text-sm"
              onClick={() => setStatusFilter(status)}
            >
              {status}
            </Button>
          ))}
        </div>
      </div>

      <div className="mt-8">
        {posts.length === 0 ? (
          <p className="text-gray-500">No posts to display. Be the first to create a post!</p>
        ) : (
          <div className="space-y-4">
            {posts.map((post) => (
              <div key={post.postId} className="border p-4 rounded-lg shadow-md flex">
                {post.movie ? (
                  <img
                    src={`${TMDB_IMAGE_BASE_URL}${post.movie.poster_path}`}
                    alt={post.movie.title}
                    className="w-20 h-30 rounded mr-4"
                  />
                ) : (
                  <div className="w-20 h-30 bg-gray-300 rounded mr-4 flex items-center justify-center">
                    <span className="text-xs text-gray-500">No Image</span>
                  </div>
                )}
                <div className="flex-1">
                  <h2 className="font-semibold text-lg">{post.userName || "Anonymous"}</h2>
                  <h3 className="font-semibold text-md text-blue-500">{post.movie?.title || "No Movie Selected"}</h3>
                  <p className="text-gray-700">{post.description}</p>
                  <p className="text-sm text-gray-500">{new Date(post.postDateTime).toLocaleString()}</p>
                  <div className="flex items-center mt-2">
                    <Button className="ml-4" onClick={() => handleDelete(post.postId)}>
                      Delete
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <Button className="fixed bottom-8 right-8 bg-blue-500 text-white p-4 rounded-full" onClick={() => setIsModalOpen(true)}>
        +
      </Button>

      <Dialog open={isModalOpen} onOpenChange={handleCloseModal}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogTitle>Create a New Post</DialogTitle>
          <DialogDescription>Share your thoughts about a movie!</DialogDescription>
          <form onSubmit={handleSubmit} className="space-y-4 mt-4">
            <div className="relative mb-8">
              <input
                type="text"
                placeholder="Search movie..."
                value={searchTerm}
                onChange={handleSearchChange}
                className="border rounded-lg p-2 w-full"
              />
              {showSuggestions && searchResults.length > 0 && (
                <div className="absolute top-full left-0 right-0 bg-white border rounded-lg mt-1 z-10 max-h-60 overflow-y-auto shadow-lg">
                  {loading ? (
                    <p className="p-4 text-center">Loading...</p>
                  ) : (
                    searchResults.slice(0, 4).map((movie) => (
                      <div
                        key={movie.id}
                        className="flex items-center p-2 hover:bg-gray-100 cursor-pointer"
                        onClick={() => handleSuggestionClick(movie)}
                      >
                        {movie.poster_path ? (
                          <img
                            src={`${TMDB_IMAGE_BASE_URL}${movie.poster_path}`}
                            alt={movie.title}
                            className="w-10 h-15 rounded mr-4"
                          />
                        ) : (
                          <div className="w-12 h-18 bg-gray-300 rounded mr-4 flex items-center justify-center">
                            <span className="text-xs text-gray-500">N/A</span>
                          </div>
                        )}
                        <span className="text-sm">{movie.title}</span>
                      </div>
                    ))
                  )}
                </div>
              )}
            </div>

            {selectedMovie && (
              <div className="flex items-center mt-4">
                <img
                  src={`${TMDB_IMAGE_BASE_URL}${selectedMovie.poster_path}`}
                  alt={selectedMovie.title}
                  className="w-20 h-30 rounded mr-4"
                />
                <span className="text-lg font-semibold">{selectedMovie.title}</span>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700">Content</label>
              <textarea
                name="content"
                value={newPost.content}
                onChange={(e) => setNewPost({ ...newPost, content: e.target.value })}
                className="w-full px-3 py-2 mt-1 border rounded-md"
                placeholder="What did you think of the movie?"
                required
              />
            </div>

            <Button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded-md">
              Post
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default SocialsPage;
