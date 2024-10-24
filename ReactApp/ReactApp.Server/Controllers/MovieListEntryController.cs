using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using ReactApp.Server.Features.MovieListEntries;
using ReactApp.Server.Models;

namespace ReactApp.Server.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class MovieListEntryController : ControllerBase
    {
        private readonly IMovieListEntryService _movieListEntryService;

        public MovieListEntryController(IMovieListEntryService movieListEntryService)
        {
            _movieListEntryService = movieListEntryService;
        }

        // Helper method to extract and validate the user ID from the JWT token
        private int GetUserId()
        {
            var userId = User.FindFirst("UserId")?.Value;
            if (string.IsNullOrEmpty(userId))
            {
                throw new UnauthorizedAccessException("Invalid user token");
            }
            return int.Parse(userId);
        }

        // Get all movie list entries for the authenticated user
        [Authorize]
        [HttpGet]
        public async Task<ActionResult<IEnumerable<MovieListEntry>>> GetAllMovieListEntries()
        {
            try
            {
                int userId = GetUserId();
                var entries = await _movieListEntryService.GetAllMovieListEntriesAsync(userId);
                return Ok(entries);
            }
            catch (UnauthorizedAccessException)
            {
                return Unauthorized("Invalid user token");
            }
        }

        // Create a new movie list entry for the authenticated user
        [Authorize]
        [HttpPost]
        public async Task<ActionResult<MovieListEntry>> CreateMovieListEntry([FromBody] MovieListEntry movieListEntry)
        {
            try
            {
                int userId = GetUserId();
                movieListEntry.UserId = userId;
                var createdEntry = await _movieListEntryService.CreateMovieListEntryAsync(movieListEntry);
                // Return 201 Created status with the location of the new resource
                return CreatedAtAction(nameof(GetAllMovieListEntries), new { id = createdEntry.EntryId }, createdEntry);
            }
            catch (UnauthorizedAccessException)
            {
                return Unauthorized("Invalid user token");
            }
            catch (InvalidOperationException ex)
            {
                // Return 409 Conflict if there's a conflict with existing data
                return Conflict(ex.Message);
            }
        }

        // Update an existing movie list entry for the authenticated user
        [Authorize]
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateMovieListEntry(int id, [FromBody] MovieListEntry movieListEntry)
        {
            try
            {
                int userId = GetUserId();
                movieListEntry.UserId = userId;
                var updatedEntry = await _movieListEntryService.UpdateMovieListEntryAsync(id, movieListEntry);
                return Ok(updatedEntry);
            }
            catch (UnauthorizedAccessException)
            {
                return Unauthorized("Invalid user token");
            }
            catch (KeyNotFoundException)
            {
                // Return 404 Not Found if the entry doesn't exist
                return NotFound();
            }
        }

        // Delete a movie list entry for the authenticated user
        [Authorize]
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteMovieListEntry(int id)
        {
            try
            {
                int userId = GetUserId();
                await _movieListEntryService.DeleteMovieListEntryAsync(id, userId);
                // Return 204 No Content on successful deletion
                return NoContent();
            }
            catch (UnauthorizedAccessException)
            {
                return Unauthorized("Invalid user token");
            }
            catch (KeyNotFoundException)
            {
                // Return 404 Not Found if the entry doesn't exist
                return NotFound();
            }
        }
    }
}
