using NUnit.Framework;
using ReactApp.Server.Features.MovieListEntries;
using ReactApp.Server.Models;
using Microsoft.EntityFrameworkCore;
using System;
using System.Threading.Tasks;

namespace ReactServerTests
{
    [TestFixture]
    public class CreateMovieListEntryTests
    {
        private MoodMoviesContext _context;
        private MovieListEntryService _service;

        [SetUp]
        public async Task Setup()
        {
            // Use a separate test database
            var options = new DbContextOptionsBuilder<MoodMoviesContext>()
                .UseSqlite("Data Source=test_mood_movies.db")
                .Options;

            _context = new MoodMoviesContext(options);
            _context.Database.EnsureCreated();
            _service = new MovieListEntryService(_context);

            // Create a test user for its UserId
            var testUser = new User
            {
                UserName = "TestUser",
                UserPassword = "TestPassword",
                Email = "test@example.com"
            };
            _context.Users.Add(testUser);
            await _context.SaveChangesAsync();
        }

        [TearDown]
        public void TearDown()
        {
            // Clean up the test database 
            _context.Database.EnsureDeleted();
            _context.Dispose();
        }

        [Test]
        public async Task CreateMovieListEntry_SuccessfullyCreatesEntry_WhenNotExists()
        {
            // Arrange 
            var testUser = await _context.Users.FirstOrDefaultAsync(u => u.UserName == "TestUser");
            Assert.IsNotNull(testUser, "Test user not found");

            var newEntry = new MovieListEntry
            {
                UserId = testUser.UserId,
                MovieTitle = "Test Movie",
                MovieGenre = "Action",
                Status = "planning"
            };

            // Act
            var result = await _service.CreateMovieListEntryAsync(newEntry);

            // Assert
            Assert.IsNotNull(result);
            Assert.That(result.MovieTitle, Is.EqualTo("Test Movie"));
            Assert.That(result.MovieGenre, Is.EqualTo("Action"));
            Assert.That(result.Status, Is.EqualTo("planning"));
            Assert.That(result.DateAdded, Is.Not.Null);

            // Check if actually added into database
            var savedEntry = await _context.MovieListEntries.FirstOrDefaultAsync(m => m.MovieTitle == "Test Movie");
            Assert.IsNotNull(savedEntry);
        }

    }
}
