using Microsoft.AspNetCore.Identity;

namespace backend.Model.Domain
{
    public class RefsGroup
    {
        public Guid Id { get; set; }
        public string Name { get; set; }
        public string UserId { get; set; }

        public IdentityUser User { get; set; }
    }
}
