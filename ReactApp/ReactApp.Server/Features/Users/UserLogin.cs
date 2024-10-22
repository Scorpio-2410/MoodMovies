using MediatR;
using FluentValidation;
using ReactApp.Server.Models;
using Microsoft.EntityFrameworkCore;


namespace ReactApp.Server.Features.Users
{
    public class UserLogin : IRequest<UserLoginResponse>
    {
        public string UserName { get; set; } = null!;
        public string UserPassword { get; set; } = null!;
    }

    public class UserLoginResponse
    {
        public int UserId { get; set; }
    }

    public class UserLoginValidator : AbstractValidator<UserLogin>
    {
        public UserLoginValidator()
        {
            RuleFor(x => x.UserName)
                .NotEmpty().WithMessage("Username is required.")
                .Length(3, 50).WithMessage("Username must be between 3 and 50 characters.");

            RuleFor(x => x.UserPassword)
                .NotEmpty().WithMessage("Password is required.")
                .MinimumLength(6).WithMessage("Password must be at least 6 characters long.");
        }
    }

    public class UserLoginHandler : IRequestHandler<UserLogin, UserLoginResponse>
    {
        private readonly MoodMoviesContext _context;

        public UserLoginHandler(MoodMoviesContext context)
        {
            _context = context;
        }

        public async Task<UserLoginResponse> Handle(UserLogin request, CancellationToken cancellationToken)
        {
            // Check if the user exists in the database
            var user = await _context.Users
                .FirstOrDefaultAsync(u => u.UserName == request.UserName, cancellationToken);

            // If user is not found
            if (user == null)
            {
                throw new ValidationException("Invalid username or password.");
            }

            // Check if the password matches using BCrypt
            if (!BCrypt.Net.BCrypt.Verify(request.UserPassword, user.UserPassword))
            {
                throw new ValidationException("Invalid username or password.");
            }

            // If credentials are valid, return the UserId
            return new UserLoginResponse
            {
                UserId = user.UserId
            };
        }
    }
}
