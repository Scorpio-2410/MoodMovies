using MediatR;
using FluentValidation;
using ReactApp.Server.Models;
using Microsoft.EntityFrameworkCore;

namespace ReactApp.Server.Features.Users
{
    public class VerifyUserDetails : IRequest<VerifyUserDetailsResponse>
    {
        public string UserName { get; set; } = null!;
        public string Email { get; set; } = null!;
        public DateTime Dob { get; set; }
    }

    public class VerifyUserDetailsResponse
    {
        public bool IsVerified { get; set; }
    }

    public class VerifyUserDetailsValidator : AbstractValidator<VerifyUserDetails>
    {
        public VerifyUserDetailsValidator()
        {
            RuleFor(x => x.UserName).NotEmpty().WithMessage("Username is required.");
            RuleFor(x => x.Email).NotEmpty().WithMessage("Email is required.");
            RuleFor(x => x.Dob).NotEmpty().WithMessage("Date of Birth is required.");
        }
    }

    public class VerifyUserDetailsHandler : IRequestHandler<VerifyUserDetails, VerifyUserDetailsResponse>
    {
        private readonly MoodMoviesContext _context;

        public VerifyUserDetailsHandler(MoodMoviesContext context)
        {
            _context = context;
        }

        public async Task<VerifyUserDetailsResponse> Handle(VerifyUserDetails request, CancellationToken cancellationToken)
        {
            var user = await _context.Users
                .FirstOrDefaultAsync(u => u.UserName == request.UserName && u.Email == request.Email && u.Dob == request.Dob, cancellationToken);

            if (user == null)
            {
                throw new ValidationException("The provided details do not match any user.");
            }

            return new VerifyUserDetailsResponse { IsVerified = true };
        }
    }
}
