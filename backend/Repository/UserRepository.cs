using backend.Model.DTO.AuthDTO;
using Microsoft.AspNetCore.Identity;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace backend.Repository
{
    public class UserRepository: IUserRepository
    {
        private readonly UserManager<IdentityUser> userManager;
        private readonly IConfiguration configuration;
        public UserRepository(UserManager<IdentityUser> userManager, IConfiguration configuration)
        {
            this.userManager = userManager;
            this.configuration = configuration;
        }

        public async Task<bool> UserNameIsUnique(string userName)
        {
            var user = await userManager.FindByNameAsync(userName);
            if (user == null)
            {
                return true;
            }
            return false;
        }

        public async Task<bool> EmailIsUnique(string email)
        {
            var user = await userManager.FindByEmailAsync(email);
            if (user == null)
            {
                return true;
            }
            return false;
        }

        public async Task<RegisterResponseDTO> Register(RegisterRequestDTO model)
        {
            var user = new IdentityUser()
            {
                UserName = model.UserName,
                Email = model.Email,
            };

            var identityResult = await userManager.CreateAsync(user, model.Password);

            if (identityResult.Succeeded)
            {
                identityResult = await userManager.AddToRoleAsync(user, "ordinaryUser");

                if (identityResult.Succeeded)
                {
                    user = await userManager.FindByEmailAsync(model.Email);

                    if (user == null)
                    {
                        return null;
                    }

                    var token = CreateToken(user);

                    return new RegisterResponseDTO
                    {
                        id = user.Id,
                        Token = token,
                    };
                }
            }

            return null;
        }

        public async Task<LoginResponseDTO> Login(LoginRequestDTO model)
        {
            var user = await userManager.FindByEmailAsync(model.Email);

            if (user != null)
            {
                var passwordCheck = await userManager.CheckPasswordAsync(user, model.Password);

                if (passwordCheck)
                {
                    var token = CreateToken(user);

                    return new LoginResponseDTO
                    {
                        id =  user.Id,
                        Token = token,
                    };
                }

                return new LoginResponseDTO
                {
                    id = "0",
                    Token = "password"
                };
            }

            return new LoginResponseDTO
            {
                id = "0",
                Token = "email"
            };
        }

        private string CreateToken(IdentityUser user)
        {
            var jwtTokenHandler = new JwtSecurityTokenHandler();

            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(configuration["Jwt:Key"]));

            var tokenDescriptior = new SecurityTokenDescriptor()
            {
                Subject = new ClaimsIdentity(new Claim[]{
                    new Claim(ClaimTypes.Name, user.UserName),
                    new Claim(ClaimTypes.NameIdentifier, user.Id)
                }),
                Issuer = configuration["Jwt:Issuer"],
                Audience = configuration["Jwt:Audience"],
                Expires = DateTime.UtcNow.AddDays(1),
                SigningCredentials = new SigningCredentials(key, SecurityAlgorithms.HmacSha256)
            };

            var token = jwtTokenHandler.CreateToken(tokenDescriptior);

            return jwtTokenHandler.WriteToken(token);
        }
    }
}
