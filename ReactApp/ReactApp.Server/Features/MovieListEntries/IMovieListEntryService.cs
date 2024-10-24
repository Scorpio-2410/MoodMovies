using ReactApp.Server.Models;

namespace ReactApp.Server.Features.MovieListEntries
{
    public interface IMovieListEntryService
    {
        Task<IEnumerable<MovieListEntry>> GetAllMovieListEntriesAsync(int userId);
        Task<MovieListEntry> CreateMovieListEntryAsync(MovieListEntry movieListEntry);
        Task<MovieListEntry> UpdateMovieListEntryAsync(int id, MovieListEntry movieListEntry);
        Task DeleteMovieListEntryAsync(int id, int userId);
    }
}
