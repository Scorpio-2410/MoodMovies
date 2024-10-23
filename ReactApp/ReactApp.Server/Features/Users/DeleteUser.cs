using MediatR;
using ReactApp.Server.Models;
using FluentValidation;
using Microsoft.EntityFrameworkCore;

namespace ReactApp.Server.Features.Users
{
    // DeleteUser request and response classes
    public class DeleteUser : IRequest<DeleteUserResponse>
    {
        public int UserId { get; set; }
        public bool IsConfirmed { get; set; } // Confirmation flag
    }

    public class DeleteUserResponse
    {
        public bool IsSuccessful { get; set; }
    }

    // Validator for DeleteUser request
    public class DeleteUserValidator : AbstractValidator<DeleteUser>
    {
        public DeleteUserValidator()
        {
            RuleFor(x => x.IsConfirmed)
                .Equal(true).WithMessage("Profile deletion must be confirmed."); // Ensure user confirmed deletion
        }
    }

    // Generic repository interface for CRUD operations
    public interface IRepository<T> where T : class
    {
        Task<T?> GetByIdAsync(int id, CancellationToken cancellationToken);
        Task RemoveAsync(T entity, CancellationToken cancellationToken);
    }

    // Generic repository implementation using Entity Framework Core
    public class Repository<T> : IRepository<T> where T : class
    {
        private readonly MoodMoviesContext _context;
        private readonly DbSet<T> _entities;

        public Repository(MoodMoviesContext context)
        {
            _context = context;
            _entities = _context.Set<T>();
        }

        public async Task<T?> GetByIdAsync(int id, CancellationToken cancellationToken)
        {
            return await _entities.FindAsync(new object[] { id }, cancellationToken);
        }

        public async Task RemoveAsync(T entity, CancellationToken cancellationToken)
        {
            _entities.Remove(entity);
            await _context.SaveChangesAsync(cancellationToken);
        }
    }

    // Handler for DeleteUser request using the generic repository
    public class DeleteUserHandler : IRequestHandler<DeleteUser, DeleteUserResponse>
    {
        private readonly IRepository<User> _userRepository;

        public DeleteUserHandler(IRepository<User> userRepository)
        {
            _userRepository = userRepository;
        }

        public async Task<DeleteUserResponse> Handle(DeleteUser request, CancellationToken cancellationToken)
        {
            // Validate confirmation
            if (!request.IsConfirmed)
            {
                throw new ValidationException("Deletion not confirmed by the user.");
            }

            // LINQ query to fetch user
            var user = await _userRepository.GetByIdAsync(request.UserId, cancellationToken);

            // If user is not found
            if (user == null)
            {
                throw new ValidationException("User not found.");
            }

            // Delete the user using the generic repository
            await _userRepository.RemoveAsync(user, cancellationToken);

            // Return a successful response
            return new DeleteUserResponse { IsSuccessful = true };
        }
    }
}