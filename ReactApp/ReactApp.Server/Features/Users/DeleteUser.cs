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

    // Handler for DeleteUser request
    public class DeleteUserHandler : IRequestHandler<DeleteUser, DeleteUserResponse>
    {
        private readonly MoodMoviesContext _context;

        public DeleteUserHandler(MoodMoviesContext context)
        {
            _context = context;
        }

        public async Task<DeleteUserResponse> Handle(DeleteUser request, CancellationToken cancellationToken)
        {
            // Validate confirmation
            if (!request.IsConfirmed)
            {
                throw new ValidationException("Deletion not confirmed by the user.");
            }

            var user = await _context.Users
                .FirstOrDefaultAsync(u => u.UserId == request.UserId, cancellationToken);

            // If user is not found
            if (user == null)
            {
                throw new ValidationException("User not found.");
            }

            // Delete the user
            _context.Users.Remove(user);
            await _context.SaveChangesAsync(cancellationToken);

            // Return a successful response
            return new DeleteUserResponse { IsSuccessful = true };
        }
    }
}

