using backend.Model.Domain;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace backend.Data
{
    public class AppDbContext: IdentityDbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options): base(options)
        {
            
        }

        public DbSet<RefsGroup> RefsGroup { get; set; }
        public DbSet<Ref> Ref { get; set; }
        public DbSet<EmailVerification> EmailVerification { get; set; }

        protected override void OnModelCreating(ModelBuilder builder)
        {
            base.OnModelCreating(builder);

            var ordinaryUserId = "e7df795b-97bd-40fe-b7bc-2a908b1a61e9";


            var roles = new List<IdentityRole>()
            {
                new IdentityRole()
                {
                    Id = ordinaryUserId,
                    ConcurrencyStamp = ordinaryUserId,
                    Name = "ordinaryUser",
                    NormalizedName = "ordinaryUser".ToUpper()
                }
            };

            builder.Entity<IdentityRole>().HasData(roles);
        }
    }
}
