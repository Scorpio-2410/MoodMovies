using Microsoft.EntityFrameworkCore;
using ReactApp.Server.Models;

namespace ReactApp.Server.Features.MovieListEntries
{
    public class MovieListEntryService : IMovieListEntryService
    {
        private readonly MoodMoviesContext _context;

        public MovieListEntryService(MoodMoviesContext context)
        {
            _context = context;
        }

        // Retrieve all movie list entries for a specific user
        public async Task<IEnumerable<MovieListEntry>> GetAllMovieListEntriesAsync(int userId)
        {
            return await _context.MovieListEntries
                .Where(e => e.UserId == userId)
                .ToListAsync();
        }

        // Create a new movie list entry
        public async Task<MovieListEntry> CreateMovieListEntryAsync(MovieListEntry movieListEntry)
        {
            // Check if the movie already exists in the user's list
            var existingEntry = await _context.MovieListEntries
                .FirstOrDefaultAsync(e => e.UserId == movieListEntry.UserId && e.MovieTitle == movieListEntry.MovieTitle);

            if (existingEntry != null)
            {
                throw new InvalidOperationException("This movie is already in your list.");
            }

            // Set the date added to the current UTC time
            movieListEntry.DateAdded = DateTime.UtcNow;

            // Add the new entry to the context and save changes
            _context.MovieListEntries.Add(movieListEntry);
            await _context.SaveChangesAsync();

            return movieListEntry;
        }

        // Update an existing movie list entry
        public async Task<MovieListEntry> UpdateMovieListEntryAsync(int id, MovieListEntry movieListEntry)
        {
            // Find the existing entry
            var existingEntry = await _context.MovieListEntries.FindAsync(id);
            if (existingEntry == null)
            {
                throw new KeyNotFoundException("Movie list entry not found.");
            }

            // Check if the user has permission to update this entry
            if (existingEntry.UserId != movieListEntry.UserId)
            {
                throw new UnauthorizedAccessException("You don't have permission to update this entry.");
            }

            // Update all fields
            existingEntry.Status = movieListEntry.Status;
            existingEntry.UserRating = movieListEntry.UserRating;
            existingEntry.Notes = movieListEntry.Notes;
            existingEntry.IsFavorite = movieListEntry.IsFavorite;

            // Save changes to the database
            await _context.SaveChangesAsync();

            return existingEntry;
        }

        // Delete a movie list entry
        public async Task DeleteMovieListEntryAsync(int id, int userId)
        {
            // Find the movie list entry
            var movieListEntry = await _context.MovieListEntries.FindAsync(id);
            if (movieListEntry == null)
            {
                throw new KeyNotFoundException("Movie list entry not found.");
            }

            // Check if the user has permission to delete this entry
            if (movieListEntry.UserId != userId)
            {
                throw new UnauthorizedAccessException("You don't have permission to delete this entry.");
            }

            // Remove the entry from the context and save changes
            _context.MovieListEntries.Remove(movieListEntry);
            await _context.SaveChangesAsync();
        }
    }
}
