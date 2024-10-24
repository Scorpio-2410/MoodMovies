using ReactApp.Server.Models;

namespace ReactApp.Server.Features.MovieListEntries
{
    public interface IMovieListEntryService
    {
        Task<IEnumerable<MovieListEntry>> GetAllMovieListEntriesAsync(int userId, string searchTerm = null, string statusFilter = null, string genreFilter = null);
        Task<MovieListEntry> CreateMovieListEntryAsync(MovieListEntry movieListEntry);
        Task<MovieListEntry> UpdateMovieListEntryAsync(int id, MovieListEntry movieListEntry);
        Task DeleteMovieListEntryAsync(int id, int userId);
    }
}
