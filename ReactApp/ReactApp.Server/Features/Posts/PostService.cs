using Microsoft.EntityFrameworkCore;
using ReactApp.Server.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ReactApp.Server.Features.Posts
{
    public class PostService : IPostService
    {
        private readonly MoodMoviesContext _context;

        public PostService(MoodMoviesContext context)
        {
            _context = context;
        }

        // Retrieve all posts
        public async Task<IEnumerable<Post>> GetAllPostsAsync()
        {
            return await _context.Posts.Include(p => p.User).ToListAsync();
        }

        // Retrieve posts for a specific user
        public async Task<IEnumerable<Post>> GetPostsByUserAsync(int userId)
        {
            return await _context.Posts.Where(p => p.UserId == userId).Include(p => p.User).ToListAsync();
        }

        public async Task<Post> GetPostByIdAsync(int id)
        {
            var post = await _context.Posts.Include(p => p.User).FirstOrDefaultAsync(p => p.PostId == id);
            if (post == null) throw new KeyNotFoundException("Post not found.");
            return post;
        }

        public async Task<Post> CreatePostAsync(Post post)
        {
            post.PostDateTime = DateTime.UtcNow;
            post.NumberOfLikes = 0;
            post.NumberOfDislikes = 0;

            var user = await _context.Users.FindAsync(post.UserId);
            if (user == null) throw new Exception("User not found.");

            post.User = user;
            _context.Posts.Add(post);
            await _context.SaveChangesAsync();
            return post;
        }

        public async Task<Post> UpdatePostAsync(int id, Post updatedPost, int userId)
        {
            var existingPost = await _context.Posts.FindAsync(id);
            if (existingPost == null) throw new KeyNotFoundException("Post not found.");
            if (existingPost.UserId != userId) throw new UnauthorizedAccessException("You don't have permission to update this post.");

            existingPost.NumberOfLikes = updatedPost.NumberOfLikes;
            existingPost.NumberOfDislikes = updatedPost.NumberOfDislikes;
            existingPost.MovieThoughts = updatedPost.MovieThoughts;

            await _context.SaveChangesAsync();
            return existingPost;
        }

        public async Task DeletePostAsync(int id, int userId)
        {
            var post = await _context.Posts.FindAsync(id);
            if (post == null) throw new KeyNotFoundException("Post not found.");
            if (post.UserId != userId) throw new UnauthorizedAccessException("You don't have permission to delete this post.");

            _context.Posts.Remove(post);
            await _context.SaveChangesAsync();
        }
    }
}

