using backend.Model.DTO;
using backend.Model.DTO.AuthDTO;
using backend.Repository;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;

namespace backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly IUserRepository userRepository;

        public AuthController(UserManager<IdentityUser> userManager, IUserRepository userRepository)
        {
            this.userRepository = userRepository;
        }


        [HttpPost]
        [Route("register")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<IActionResult> Register([FromBody]RegisterRequestDTO registerDTO)
        {
            if (ModelState.IsValid)
            {
                if (await userRepository.UserNameIsUnique(registerDTO.UserName))
                {
                    if (await userRepository.EmailIsUnique(registerDTO.Email))
                    {
                        var user = await userRepository.Register(registerDTO);

                        if (user != null)
                        {
                            return Ok(user);
                        }

                        return BadRequest(new { message = "Something was wrong!" });
                    }

                    return BadRequest(new { message = "Email is not unique"});
                }

                return BadRequest(new { message = "Name is not unique"});
            }

            return BadRequest("Something was wrong!");
        }

        [HttpPost]
        [Route("login")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<IActionResult> Login([FromBody]LoginRequestDTO loginDTO)
        {
            if(ModelState.IsValid)
            {
                var user = await userRepository.Login(loginDTO);

                if(user.Token == "email")
                {
                    return NotFound(new { message = "email is not correct" });
                }
                else if(user.Token == "password")
                {
                    return BadRequest(new { message = "password is not correct"});
                }
                return Ok(user);
            }

            return BadRequest("Something was wrong!");
        }
    }
}
