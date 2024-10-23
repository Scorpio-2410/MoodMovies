using MediatR;
using ReactApp.Server.Models;
using Microsoft.EntityFrameworkCore;

namespace ReactApp.Server.Features.Users
{
    // Interface for retrieving user profiles
    public interface IUserProfileService
    {
        Task<GetUserProfileResponse> GetUserProfileAsync(int userId, CancellationToken cancellationToken);
    }

    // Request class
    public class GetUserProfile : IRequest<GetUserProfileResponse>
    {
        public int UserId { get; set; }
    }

    // Response class
    public class GetUserProfileResponse
    {
        public string UserName { get; set; } = string.Empty;
        public string FullName { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public DateTime? Dob { get; set; }
        public string? Bio { get; set; }
    }

    // Handler implementing the interface and using LINQ
    public class GetUserProfileHandler : IRequestHandler<GetUserProfile, GetUserProfileResponse>, IUserProfileService
    {
        private readonly MoodMoviesContext _context;

        public GetUserProfileHandler(MoodMoviesContext context)
        {
            _context = context;
        }

        // Handle method for MediatR
        public async Task<GetUserProfileResponse> Handle(GetUserProfile request, CancellationToken cancellationToken)
        {
            return await GetUserProfileAsync(request.UserId, cancellationToken);
        }

        // Implementation of IUserProfileService method using LINQ
        public async Task<GetUserProfileResponse> GetUserProfileAsync(int userId, CancellationToken cancellationToken)
        {
            // Use LINQ with lambda expression
            var user = await _context.Users
                .Where(u => u.UserId == userId)
                .Select(u => new GetUserProfileResponse
                {
                    UserName = u.UserName,
                    FullName = u.FullName ?? string.Empty,
                    Email = u.Email ?? string.Empty,
                    Dob = u.Dob,
                    Bio = u.Bio
                })
                .FirstOrDefaultAsync(cancellationToken);

            if (user == null)
            {
                throw new KeyNotFoundException("User not found.");
            }

            return user;
        }
    }
}
