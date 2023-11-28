using backend.Model.DTO.AuthDTO;

namespace backend.Repository
{
    public interface IUserRepository
    {
        Task<bool> EmailIsUnique(string email);
        Task<bool> UserNameIsUnique(string userName);
        Task<LoginResponseDTO> Login(LoginRequestDTO model);
        Task<RegisterResponseDTO> Register(RegisterRequestDTO model);
        Task<bool> VerifyUser(string email, string verificationToken);

    }
}
