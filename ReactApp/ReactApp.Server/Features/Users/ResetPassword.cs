using MediatR;
using FluentValidation;
using ReactApp.Server.Models;
using Microsoft.EntityFrameworkCore;
using System.Threading.Tasks;
using System.Threading;

namespace ReactApp.Server.Features.Users
{
    // ResetPassword request and response classes
    public class ResetPassword : IRequest<ResetPasswordResponse>
    {
        public string UserName { get; set; } = null!;
        public string NewPassword { get; set; } = null!;
    }

    public class ResetPasswordResponse
    {
        public bool IsSuccessful { get; set; }
    }

    // Validator for ResetPassword request
    public class ResetPasswordValidator : AbstractValidator<ResetPassword>
    {
        public ResetPasswordValidator()
        {
            RuleFor(x => x.UserName)
                .NotEmpty().WithMessage("Username is required.")
                .Length(3, 50).WithMessage("Username must be between 3 and 50 characters.");

            RuleFor(x => x.NewPassword)
                .NotEmpty().WithMessage("New password is required.")
                .MinimumLength(6).WithMessage("New password must be at least 6 characters long.");
        }
    }

    // Handler for ResetPassword request
    public class ResetPasswordHandler : IRequestHandler<ResetPassword, ResetPasswordResponse>
    {
        private readonly MoodMoviesContext _context;

        public ResetPasswordHandler(MoodMoviesContext context)
        {
            _context = context;
        }

        public async Task<ResetPasswordResponse> Handle(ResetPassword request, CancellationToken cancellationToken)
        {
            // Find the user by username
            var user = await _context.Users
                .FirstOrDefaultAsync(u => u.UserName == request.UserName, cancellationToken);

            // If user is not found
            if (user == null)
            {
                throw new ValidationException("User not found.");
            }

            // Update the user's password (hash the password ideally)
            user.UserPassword = request.NewPassword; // Hashing the password should be done here for security
            await _context.SaveChangesAsync(cancellationToken);

            // Return a successful response
            return new ResetPasswordResponse { IsSuccessful = true };
        }
    }
}
