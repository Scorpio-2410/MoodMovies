using Microsoft.AspNetCore.Mvc;
using MediatR;
using FluentValidation;
using ReactApp.Server.Features.Users;
using Microsoft.AspNetCore.Authorization;

namespace ReactApp.Server.Controllers
{
    [ApiController]
    [Route("user")]
    public class UserController : ControllerBase
    {
        private readonly IMediator _mediator;

        public UserController(IMediator mediator)
        {
            _mediator = mediator;
        }

        // Register a new user
        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] RegisterUser request)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            try
            {
                var result = await _mediator.Send(request);
                return Ok(result);
            }
            catch (ValidationException ex)
            {
                return BadRequest(ex.Message);
            }
        }

        // Login existing user
        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] UserLogin request)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            try
            {
                var result = await _mediator.Send(request);
                return Ok(result);
            }
            catch (ValidationException ex)
            {
                return BadRequest(ex.Message);
            }
        }

        // Verify user details (Username, Email, DOB)
        [HttpPost("verify-details")]
        public async Task<IActionResult> VerifyDetails([FromBody] VerifyUserDetails request)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            try
            {
                var result = await _mediator.Send(request);
                return Ok(result);
            }
            catch (ValidationException ex)
            {
                return BadRequest(ex.Message);
            }
        }

        // Reset user password
        [HttpPost("reset-password")]
        public async Task<IActionResult> ResetPassword([FromBody] ResetPassword request)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            try
            {
                var result = await _mediator.Send(request);
                return Ok(result);
            }
            catch (ValidationException ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpGet("profile-fetch")]
        [Authorize]  // Only allow access to authenticated users
        public async Task<IActionResult> GetProfile()
        {
            try
            {
                var userId = User.FindFirst("UserId")?.Value; // Ensure UserId is in the JWT token
                if (userId == null)
                {
                    return Unauthorized();  // Return unauthorized if UserId is not found
                }

                var request = new GetUserProfile { UserId = int.Parse(userId) };
                var result = await _mediator.Send(request);
                return Ok(result);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }


        // Update logged-in user's profile
        [HttpPut("profile-update")]
        [Authorize]
        public async Task<IActionResult> UpdateProfile([FromBody] UpdateUser request)
        {
            try
            {
                // Ensure the userId is extracted from the JWT token
                var userIdClaim = User.FindFirst("UserId")?.Value;
                if (string.IsNullOrEmpty(userIdClaim))
                {
                    return Unauthorized("User ID not found in the token.");
                }
                // Parse the userId from the token and assign it to the request
                request.UserId = int.Parse(userIdClaim);

                // Send the request to the handler
                var result = await _mediator.Send(request);
                return Ok(result);
            }
            catch (ValidationException ex)
            {
                return BadRequest(ex.Message);
            }
        }

        // Delete user
        [HttpDelete("profile-delete")]
        public async Task<IActionResult> DeleteUser()
        {
            try
            {
                var userId = User.FindFirst("UserId")?.Value; // Assuming UserId is stored in JWT token
                if (userId == null)
                {
                    return Unauthorized();
                }

                var request = new DeleteUser { UserId = int.Parse(userId) };
                var result = await _mediator.Send(request);
                return Ok(result);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }
    }
}
