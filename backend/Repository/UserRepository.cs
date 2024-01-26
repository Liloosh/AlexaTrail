using backend.Data;
using backend.Model.Domain;
using backend.Model.DTO.AuthDTO;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using MimeKit;
using System.IdentityModel.Tokens.Jwt;
using System.Net.Mail;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;

namespace backend.Repository
{
    public class UserRepository: IUserRepository
    {
        private readonly UserManager<IdentityUser> userManager;
        private readonly IConfiguration configuration;
        private readonly AppDbContext context;
        public UserRepository(UserManager<IdentityUser> userManager, IConfiguration configuration, AppDbContext context)
        {
            this.userManager = userManager;
            this.configuration = configuration;
            this.context = context;
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

        private bool sendConfirmEmail(string userEmail, string verificationToken)
        {
            try
            {
                var email = new MimeMessage();
                email.From.Add(MailboxAddress.Parse("laurie.larson@ethereal.email"));
                email.To.Add(MailboxAddress.Parse(userEmail));
                email.Subject = "Confirmation Email";
                email.Body = new TextPart(MimeKit.Text.TextFormat.Html)
                {
                    Text = $"<h2><a href=\"http://localhost:3000/verificationToken/{
                        System.Web.HttpUtility.UrlEncode(verificationToken, System.Text.Encoding.UTF8)
                        }\">Click here to comfim your email. Have a nice day!)</a>"
                };

                var smtp = new MailKit.Net.Smtp.SmtpClient();
                smtp.Connect("smtp.ethereal.email", 587, MailKit.Security.SecureSocketOptions.StartTls);
                smtp.Authenticate("laurie.larson@ethereal.email", "SUYCMc2fBtsZu9Kcbm");
                smtp.Send(email);
                smtp.Disconnect(true);

                return true;
            } catch (Exception ex)
            {
                return false;
            }
        }

        public async Task<RegisterResponseDTO> Register(RegisterRequestDTO model)
        {
            var user = new IdentityUser()
            {
                UserName = model.UserName,
                Email = model.Email,
            };
            var identityResult = await userManager.CreateAsync(user, model.Password);

            var verificationToken = await userManager.GenerateEmailConfirmationTokenAsync(user);

            sendConfirmEmail(user.Email, verificationToken);
            
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

        public async Task<bool> VerifyUser(string email, string verificationToken)
        {
            var user = await userManager.FindByEmailAsync(email);

            if(user == null)
            {
                return true;
            }


            Console.WriteLine(verificationToken);
            var result = await userManager.ConfirmEmailAsync(user, verificationToken);


            return result.Succeeded;
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
