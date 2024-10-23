using Moq;
using ReactApp.Server.Features.Users;
using ReactApp.Server.Models;
using FluentValidation;

namespace ReactServerTests
{
    [TestFixture]
    public class DeleteUserTests
    {
        [Test]
        public async Task DeleteUser_SuccessfullyDeletesUser_WhenConfirmed()
        {
            // Arrange
            var userId = 1;
            var user = new User { UserId = userId };

            var mockRepository = new Mock<IRepository<User>>();
            mockRepository.Setup(repo => repo.GetByIdAsync(userId, It.IsAny<CancellationToken>())).ReturnsAsync(user);

            var request = new DeleteUser { UserId = userId, IsConfirmed = true };
            var handler = new DeleteUserHandler(mockRepository.Object);

            // Act
            var response = await handler.Handle(request, CancellationToken.None);

            // Assert
            Assert.IsTrue(response.IsSuccessful);
            mockRepository.Verify(repo => repo.RemoveAsync(user, It.IsAny<CancellationToken>()), Times.Once);
        }

        [Test]
        public void DeleteUser_Fails_WhenNotConfirmed()
        {
            // Arrange
            var userId = 1;
            var request = new DeleteUser { UserId = userId, IsConfirmed = false };
            var mockRepository = new Mock<IRepository<User>>();

            var handler = new DeleteUserHandler(mockRepository.Object);

            // Act & Assert
            var ex = Assert.ThrowsAsync<ValidationException>(() => handler.Handle(request, CancellationToken.None));
            Assert.AreEqual("Deletion not confirmed by the user.", ex.Message);
        }

        [Test]
        public void DeleteUser_Fails_WhenUserNotFound()
        {
            // Arrange
            var userId = 999;
            var request = new DeleteUser { UserId = userId, IsConfirmed = true };
            var mockRepository = new Mock<IRepository<User>>();
            mockRepository.Setup(repo => repo.GetByIdAsync(userId, It.IsAny<CancellationToken>())).ReturnsAsync((User)null);

            var handler = new DeleteUserHandler(mockRepository.Object);

            // Act & Assert
            var ex = Assert.ThrowsAsync<ValidationException>(() => handler.Handle(request, CancellationToken.None));
            Assert.AreEqual("User not found.", ex.Message);
        }
    }
}
