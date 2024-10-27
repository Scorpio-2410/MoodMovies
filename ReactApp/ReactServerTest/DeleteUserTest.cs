using Moq;
using NUnit.Framework;
using ReactApp.Server.Features.Users;
using ReactApp.Server.Models;
using FluentValidation;
using System.Threading;
using System.Threading.Tasks;
using System.Collections.Generic;

namespace ReactServerTests
{
    [TestFixture]
    public class DeleteUserTests
    {
        private Mock<IRepository<User>> _mockUserRepository;
        private Mock<IRepository<Post>> _mockPostRepository;
        private Mock<IRepository<MovieListEntry>> _mockMovieListEntryRepository;
        private DeleteUserHandler _handler;

        [SetUp]
        public void SetUp()
        {
            _mockUserRepository = new Mock<IRepository<User>>();
            _mockPostRepository = new Mock<IRepository<Post>>();
            _mockMovieListEntryRepository = new Mock<IRepository<MovieListEntry>>();

            _handler = new DeleteUserHandler(
                _mockUserRepository.Object,
                _mockPostRepository.Object,
                _mockMovieListEntryRepository.Object
            );
        }

        [Test]
        public async Task DeleteUser_SuccessfullyDeletesUser_WhenConfirmed()
        {
            // Arrange
            var userId = 1;
            var user = new User { UserId = userId };
            var userPosts = new List<Post> { new Post { UserId = userId } };
            var userMovies = new List<MovieListEntry> { new MovieListEntry { UserId = userId } };

            _mockUserRepository.Setup(repo => repo.GetByIdAsync(userId, It.IsAny<CancellationToken>())).ReturnsAsync(user);
            _mockPostRepository.Setup(repo => repo.GetByUserIdAsync(userId, It.IsAny<CancellationToken>())).ReturnsAsync(userPosts);
            _mockMovieListEntryRepository.Setup(repo => repo.GetByUserIdAsync(userId, It.IsAny<CancellationToken>())).ReturnsAsync(userMovies);

            var request = new DeleteUser { UserId = userId, IsConfirmed = true };

            // Act
            var response = await _handler.Handle(request, CancellationToken.None);

            // Assert
            Assert.IsTrue(response.IsSuccessful);
            _mockPostRepository.Verify(repo => repo.RemoveRangeAsync(userPosts, It.IsAny<CancellationToken>()), Times.Once);
            _mockMovieListEntryRepository.Verify(repo => repo.RemoveRangeAsync(userMovies, It.IsAny<CancellationToken>()), Times.Once);
            _mockUserRepository.Verify(repo => repo.RemoveAsync(user, It.IsAny<CancellationToken>()), Times.Once);
        }

        [Test]
        public void DeleteUser_Fails_WhenNotConfirmed()
        {
            // Arrange
            var userId = 1;
            var request = new DeleteUser { UserId = userId, IsConfirmed = false };

            // Act & Assert
            var ex = Assert.ThrowsAsync<ValidationException>(() => _handler.Handle(request, CancellationToken.None));
            Assert.AreEqual("Deletion not confirmed by the user.", ex.Message);
        }

        [Test]
        public void DeleteUser_Fails_WhenUserNotFound()
        {
            // Arrange
            var userId = 999;
            var request = new DeleteUser { UserId = userId, IsConfirmed = true };

            _mockUserRepository.Setup(repo => repo.GetByIdAsync(userId, It.IsAny<CancellationToken>())).ReturnsAsync((User)null);

            // Act & Assert
            var ex = Assert.ThrowsAsync<ValidationException>(() => _handler.Handle(request, CancellationToken.None));
            Assert.AreEqual("User not found.", ex.Message);
        }
    }
}


