using MediatR;
using ReactApp.Server.Models;
using Microsoft.EntityFrameworkCore;

namespace ReactApp.Server.Features.Users
{
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

    // Handler for GetUserProfile
    public class GetUserProfileHandler : IRequestHandler<GetUserProfile, GetUserProfileResponse>
    {
        private readonly MoodMoviesContext _context;

        public GetUserProfileHandler(MoodMoviesContext context)
        {
            _context = context;
        }

        public async Task<GetUserProfileResponse> Handle(GetUserProfile request, CancellationToken cancellationToken)
        {
            var user = await _context.Users
                .FirstOrDefaultAsync(u => u.UserId == request.UserId, cancellationToken);

            if (user == null)
            {
                throw new KeyNotFoundException("User not found.");
            }

            return new GetUserProfileResponse
            {
                UserName = user.UserName,
                FullName = user.FullName ?? string.Empty,
                Email = user.Email ?? string.Empty,
                Dob = user.Dob,
                Bio = user.Bio
            };
        }
    }
}


