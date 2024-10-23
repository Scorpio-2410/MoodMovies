using MediatR;
using FluentValidation;
using ReactApp.Server.Models;
using Microsoft.EntityFrameworkCore;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using Microsoft.IdentityModel.Tokens;
using System.Text;

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
        public string Token { get; set; } = null!;  // JWT Token to be returned
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
        private readonly IConfiguration _configuration;

        public UserLoginHandler(MoodMoviesContext context, IConfiguration configuration)
        {
            _context = context;
            _configuration = configuration;
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

            // JWT Token Generation
            var tokenHandler = new JwtSecurityTokenHandler();
            var key = Encoding.ASCII.GetBytes(_configuration["Jwt:Key"]);  // Fetch secret key from config
            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(new[] { new Claim("UserId", user.UserId.ToString()) }),
                Expires = DateTime.UtcNow.AddDays(7),
                Audience = _configuration["Jwt:Audience"],  // Set audience in token
                Issuer = _configuration["Jwt:Issuer"],  // Set issuer in token
                SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256Signature)
            };
            var token = tokenHandler.CreateToken(tokenDescriptor);
            var tokenString = tokenHandler.WriteToken(token);

            // Return UserId and Token in response
            return new UserLoginResponse
            {
                UserId = user.UserId,
                Token = tokenString  // Return the generated token
            };
        }
    }
}
