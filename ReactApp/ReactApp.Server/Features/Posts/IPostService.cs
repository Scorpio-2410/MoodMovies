using ReactApp.Server.Models;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace ReactApp.Server.Features.Posts
{
    public interface IPostService
    {
        Task<IEnumerable<Post>> GetAllPostsAsync(int userId, string searchTerm = null);
        Task<Post> GetPostByIdAsync(int id);
        Task<Post> CreatePostAsync(Post post);
        Task<Post> UpdatePostAsync(int id, Post post);
        Task DeletePostAsync(int id, int userId);
    }
}