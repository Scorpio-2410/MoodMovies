using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using NUnit.Framework;
using ReactApp.Server.Features.Posts;
using ReactApp.Server.Models;
using System.Threading.Tasks;

namespace ReactApp.Server.Controllers
{
    [Route("[controller]")]
    [ApiController]
    public class PostController : ControllerBase
    {
        private readonly IPostService _postService;

        public PostController(IPostService postService)
        {
            _postService = postService;
        }

        // GET: api/Post
        [HttpGet]
        public async Task<IActionResult> GetPosts(int userId, string searchTerm = null)
        {
            var posts = await _postService.GetAllPostsAsync(userId, searchTerm);
            return Ok(posts);
        }

        // GET: api/Post/{id}
        [HttpGet("{id}")]
        public async Task<IActionResult> GetPost(int id)
        {
            try
            {
                var post = await _postService.GetPostByIdAsync(id);
                return Ok(post);
            }
            catch (KeyNotFoundException)
            {
                return NotFound("Post not found.");
            }
        }

        // POST: api/Post
        [HttpPost]
        [Authorize]
        public async Task<IActionResult> CreatePost([FromBody] Post post)
        {
            var createdPost = await _postService.CreatePostAsync(post);
            return CreatedAtAction("GetPost", new { id = createdPost.PostId }, createdPost);
        }

        // PUT: api/Post/{id}
        [HttpPut("{id}")]
        [Authorize]
        public async Task<IActionResult> UpdatePost(int id, [FromBody] Post updatedPost)
        {
            try
            {
                var post = await _postService.UpdatePostAsync(id, updatedPost);
                return NoContent();
            }
            catch (KeyNotFoundException)
            {
                return NotFound("Post not found.");
            }
            catch (UnauthorizedAccessException)
            {
                return Unauthorized("You don't have permission to update this post.");
            }
        }

        // DELETE: api/Post/{id}
        [HttpDelete("{id}")]
        [Authorize]
        public async Task<IActionResult> DeletePost(int id, int userId)
        {
            try
            {
                await _postService.DeletePostAsync(id, userId);
                return NoContent();
            }
            catch (KeyNotFoundException)
            {
                return NotFound("Post not found.");
            }
            catch (UnauthorizedAccessException)
            {
                return Unauthorized("You don't have permission to delete this post.");
            }
        }
    }
}
