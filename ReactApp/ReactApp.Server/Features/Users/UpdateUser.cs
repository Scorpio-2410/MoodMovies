using MediatR;
using FluentValidation;
using ReactApp.Server.Models;
using Microsoft.EntityFrameworkCore;

namespace ReactApp.Server.Features.Users
{
    // Interface for user updating operations
    public interface IUpdateUserService
    {
        Task<UpdateUserResponse> UpdateUserAsync(UpdateUser request, CancellationToken cancellationToken);
    }

    // UpdateUser request and response classes
    public class UpdateUser : IRequest<UpdateUserResponse>
    {
        public int UserId { get; set; }
        public string? Bio { get; set; } = null;  // Optional bio change
        public string? NewPassword { get; set; } = null;  // Optional password change
    }

    public class UpdateUserResponse
    {
        public bool IsSuccessful { get; set; }
    }

    // Validator for UpdateUser request
    public class UpdateUserValidator : AbstractValidator<UpdateUser>
    {
        public UpdateUserValidator()
        {
            // Bio is optional but if provided, should meet length requirements
            RuleFor(x => x.Bio)
                .MaximumLength(500).WithMessage("Bio must be less than 500 characters.")
                .When(x => !string.IsNullOrEmpty(x.Bio));

            // Validate password only if provided
            RuleFor(x => x.NewPassword)
                .MinimumLength(6).WithMessage("Password must be at least 6 characters long.")
                .When(x => !string.IsNullOrEmpty(x.NewPassword));
        }
    }

    // Handler for UpdateUser request implementing the IUpdateUserService interface
    public class UpdateUserHandler : IRequestHandler<UpdateUser, UpdateUserResponse>, IUpdateUserService
    {
        private readonly MoodMoviesContext _context;

        public UpdateUserHandler(MoodMoviesContext context)
        {
            _context = context;
        }

        // Implementation of the UpdateUserAsync method from the IUpdateUserService interface
        public async Task<UpdateUserResponse> Handle(UpdateUser request, CancellationToken cancellationToken)
        {
            return await UpdateUserAsync(request, cancellationToken);
        }

        public async Task<UpdateUserResponse> UpdateUserAsync(UpdateUser request, CancellationToken cancellationToken)
        {
            // LINQ query using an anonymous method with a lambda expression
            var user = await _context.Users
                .Where(u => u.UserId == request.UserId)
                .Select(u => new { u.UserId, u.Bio, u.UserPassword })  // Anonymous projection of only required fields
                .FirstOrDefaultAsync();

            if (user == null)
            {
                throw new ValidationException("User not found.");
            }

            // Fetch the actual user entity for updates
            var userEntity = await _context.Users
                .FirstOrDefaultAsync(u => u.UserId == request.UserId, cancellationToken);

            if (userEntity == null)
            {
                throw new ValidationException("User entity not found.");
            }

            // Update bio only if provided
            if (!string.IsNullOrEmpty(request.Bio))
            {
                userEntity.Bio = request.Bio;
            }

            // Update password only if a new one is provided
            if (!string.IsNullOrEmpty(request.NewPassword))
            {
                userEntity.UserPassword = BCrypt.Net.BCrypt.HashPassword(request.NewPassword);
            }

            await _context.SaveChangesAsync(cancellationToken);

            return new UpdateUserResponse { IsSuccessful = true };
        }
    }
}