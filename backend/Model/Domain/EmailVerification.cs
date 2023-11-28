using Microsoft.AspNetCore.Identity;

namespace backend.Model.Domain
{
    public class EmailVerification
    {
        public Guid Id { get; set; }
        public string VerificationToken { get; set; } = string.Empty;
        public string UserId { get; set; }

        public IdentityUser User { get; set; }
    }
}
