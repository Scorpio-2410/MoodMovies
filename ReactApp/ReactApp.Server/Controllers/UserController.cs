
using Microsoft.AspNetCore.Mvc;
using MediatR;
using FluentValidation;
using ReactApp.Server.Features.Users;

namespace ReactApp.Server.Controllers
{
    [ApiController]
    [Route("User")]
    public class UserController : ControllerBase
    {
        private readonly IMediator _mediator;

        // Inject IMediator via constructor
        public UserController(IMediator mediator)
        {
            _mediator = mediator;
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] UserLogin request)
        {
            // Validate the request model
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            try
            {
                // Send the login request to the MediatR handler
                var result = await _mediator.Send(request);

                // If successful, return the UserId
                return Ok(result);
            }
            catch (ValidationException ex)
            {
                // Return validation errors
                return BadRequest(ex.Message);
            }
        }
    }
}