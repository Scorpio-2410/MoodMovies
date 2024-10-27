using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using ReactApp.Server.Models;

namespace ReactApp.Server.Features.Posts
{
    public class PostService : IPostService
    {
        private readonly MoodMoviesContext _context;

        public PostService(MoodMoviesContext context)
        {
            _context = context;
        }

        // Retrieve all posts for a specific user with optional search filter
        public async Task<IEnumerable<Post>> GetAllPostsAsync(int userId, string searchTerm = null)
        {
            var query = _context.Posts.Where(p => p.UserId == userId);

            // Apply search term filter
            if (!string.IsNullOrWhiteSpace(searchTerm))
            {
                searchTerm = searchTerm.ToLower();
                query = query.Where(p => EF.Functions.Like(p.MovieId.ToString().ToLower(), $"%{searchTerm}%") ||
                                         EF.Functions.Like(p.User.UserName.ToLower(), $"%{searchTerm}%"));
            }

            return await query.Include(p => p.User).ToListAsync();
        }

        // Retrieve a single post by ID
        public async Task<Post> GetPostByIdAsync(int id)
        {
            var post = await _context.Posts.Include(p => p.User)
                                            .FirstOrDefaultAsync(p => p.PostId == id);

            if (post == null)
            {
                throw new KeyNotFoundException("Post not found.");
            }

            return post;
        }

        // Create a new post
        public async Task<Post> CreatePostAsync(Post post)
        {
            post.PostDateTime = DateTime.UtcNow; // Set the post date to the current UTC time
            post.NumberOfLikes = 0; // Initialize likes and dislikes to zero
            post.NumberOfDislikes = 0;

            // Add the post to the context and save changes
            _context.Posts.Add(post);
            await _context.SaveChangesAsync();

            return post;
        }

        // Update an existing post
        public async Task<Post> UpdatePostAsync(int id, Post updatedPost)
        {
            var existingPost = await _context.Posts.FindAsync(id);

            if (existingPost == null)
            {
                throw new KeyNotFoundException("Post not found.");
            }

            if (existingPost.UserId != updatedPost.UserId)
            {
                throw new UnauthorizedAccessException("You don't have permission to update this post.");
            }

            // Update post fields
            existingPost.NumberOfLikes = updatedPost.NumberOfLikes;
            existingPost.NumberOfDislikes = updatedPost.NumberOfDislikes;

            await _context.SaveChangesAsync();

            return existingPost;
        }

        // Delete a post
        public async Task DeletePostAsync(int id, int userId)
        {
            var post = await _context.Posts.FindAsync(id);

            if (post == null)
            {
                throw new KeyNotFoundException("Post not found.");
            }

            if (post.UserId != userId)
            {
                throw new UnauthorizedAccessException("You don't have permission to delete this post.");
            }

            _context.Posts.Remove(post);
            await _context.SaveChangesAsync();
        }
    }
}