using MediatR;
using ReactApp.Server.Models;
using FluentValidation;
using Microsoft.EntityFrameworkCore;

namespace ReactApp.Server.Features.Users
{
    public class DeleteUser : IRequest<DeleteUserResponse>
    {
        public int UserId { get; set; }
        public bool IsConfirmed { get; set; }
    }

    public class DeleteUserResponse
    {
        public bool IsSuccessful { get; set; }
    }

    public class DeleteUserValidator : AbstractValidator<DeleteUser>
    {
        public DeleteUserValidator()
        {
            RuleFor(x => x.IsConfirmed)
                .Equal(true).WithMessage("Profile deletion must be confirmed.");
        }
    }

    public interface IRepository<T> where T : class
    {
        Task<T?> GetByIdAsync(int id, CancellationToken cancellationToken);
        Task RemoveAsync(T entity, CancellationToken cancellationToken);
        Task RemoveRangeAsync(IEnumerable<T> entities, CancellationToken cancellationToken); // For deleting related data
        Task<IEnumerable<T>> GetByUserIdAsync(int userId, CancellationToken cancellationToken); // To get related records
    }

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

        public async Task RemoveRangeAsync(IEnumerable<T> entities, CancellationToken cancellationToken)
        {
            _entities.RemoveRange(entities);
            await _context.SaveChangesAsync(cancellationToken);
        }

        public async Task<IEnumerable<T>> GetByUserIdAsync(int userId, CancellationToken cancellationToken)
        {
            return await _entities.Where(e => EF.Property<int>(e, "UserId") == userId).ToListAsync(cancellationToken);
        }
    }

    public class DeleteUserHandler : IRequestHandler<DeleteUser, DeleteUserResponse>
    {
        private readonly IRepository<User> _userRepository;
        private readonly IRepository<Post> _socialRepository;
        private readonly IRepository<MovieListEntry> _movieListEntryRepository;

        public DeleteUserHandler(
            IRepository<User> userRepository,
            IRepository<Post> socialRepository,
            IRepository<MovieListEntry> movieListEntryRepository)
        {
            _userRepository = userRepository;
            _socialRepository = socialRepository;
            _movieListEntryRepository = movieListEntryRepository;
        }

        public async Task<DeleteUserResponse> Handle(DeleteUser request, CancellationToken cancellationToken)
        {
            if (!request.IsConfirmed)
            {
                throw new ValidationException("Deletion not confirmed by the user.");
            }

            var user = await _userRepository.GetByIdAsync(request.UserId, cancellationToken);
            if (user == null)
            {
                throw new ValidationException("User not found.");
            }

            var userPosts = await _socialRepository.GetByUserIdAsync(request.UserId, cancellationToken);
            var userMovies = await _movieListEntryRepository.GetByUserIdAsync(request.UserId, cancellationToken);

            await _socialRepository.RemoveRangeAsync(userPosts, cancellationToken);
            await _movieListEntryRepository.RemoveRangeAsync(userMovies, cancellationToken);

            await _userRepository.RemoveAsync(user, cancellationToken);

            return new DeleteUserResponse { IsSuccessful = true };
        }
    }
}
