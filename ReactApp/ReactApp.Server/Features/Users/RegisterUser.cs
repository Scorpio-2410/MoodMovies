using MediatR;
using FluentValidation;
using ReactApp.Server.Models;
using Microsoft.EntityFrameworkCore;


namespace ReactApp.Server.Features.Users
{
    public class RegisterUser : IRequest<RegisterUserResponse>
    {
        public string FullName { get; set; } = null!;
        public string UserName { get; set; } = null!;
        public string Email { get; set; } = null!;
        public DateTime Dob { get; set; }  
        public string Password { get; set; } = null!;
        public string? Bio { get; set; }  
    }

    public class RegisterUserResponse
    {
        public int UserId { get; set; }
        public string UserName { get; set; } = null!;
    }

    public class RegisterUserHandler : IRequestHandler<RegisterUser, RegisterUserResponse>
    {
        private readonly MoodMoviesContext _context;

        public RegisterUserHandler(MoodMoviesContext context)
        {
            _context = context;
        }

        public async Task<RegisterUserResponse> Handle(RegisterUser request, CancellationToken cancellationToken)
        {
            // Check if the username or email already exists
            var existingUser = await _context.Users
                .FirstOrDefaultAsync(u => u.UserName == request.UserName || u.Email == request.Email, cancellationToken);

            if (existingUser != null)
            {
                throw new ValidationException("A user with this username or email already exists.");
            }

            // Hash the password before saving
            var hashedPassword = BCrypt.Net.BCrypt.HashPassword(request.Password);

            // Create new user
            var newUser = new User
            {
                FullName = request.FullName,
                UserName = request.UserName,
                Email = request.Email,
                Dob = request.Dob,  // Use DateTime directly
                UserPassword = hashedPassword,
                Bio = request.Bio
            };

            _context.Users.Add(newUser);
            await _context.SaveChangesAsync(cancellationToken);

            // Return response with newly created user details
            return new RegisterUserResponse
            {
                UserId = newUser.UserId,
                UserName = newUser.UserName
            };
        }
    }
}