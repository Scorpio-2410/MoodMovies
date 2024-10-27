using ReactApp.Server.Models;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace ReactApp.Server.Features.Posts
{
    public interface IPostService
    {
        Task<IEnumerable<Post>> GetAllPostsAsync(); // Retrieve all posts without filtering by user
        Task<IEnumerable<Post>> GetPostsByUserAsync(int userId); // Retrieve user-specific posts
        Task<Post> GetPostByIdAsync(int id);
        Task<Post> CreatePostAsync(Post post);
        Task<Post> UpdatePostAsync(int id, Post updatedPost, int userId);
        Task DeletePostAsync(int id, int userId);
    }
}

