using backend.Data;
using backend.Model.Domain;
using Microsoft.EntityFrameworkCore;

namespace backend.Repository
{
    public class RefsGroupRepository: IRefsGroupRepository
    {
        private readonly AppDbContext dbContext;

        public RefsGroupRepository(AppDbContext dbContext)
        {
            this.dbContext = dbContext;
        }
        public async Task<List<RefsGroup>> getRefsGroup(string userId)
        {
            var refs = await dbContext.RefsGroup.Where(e => e.UserId == userId).ToListAsync();

            return refs;
        }

        public async Task<RefsGroup> createRefsGroup(RefsGroup refs)
        {
            if (!(await dbContext.RefsGroup.AnyAsync(x => x.Name == refs.Name)))
            {
                await dbContext.RefsGroup.AddAsync(refs);
                await dbContext.SaveChangesAsync();
                return refs;
            }
            return null;
        }

        public async Task<RefsGroup> deleteRefsGroup(Guid refsId)
        {
            var existRef = await dbContext.RefsGroup.FirstOrDefaultAsync(e => e.Id == refsId);

            if (existRef != null)
            {
                dbContext.RefsGroup.Remove(existRef);
                await dbContext.SaveChangesAsync();
            }

            return existRef;
        }

        public async Task<RefsGroup> updaterefsGroup(Guid refsId, string title)
        {
            var  existerRefsGroup = await dbContext.RefsGroup.FirstOrDefaultAsync(e => e.Id == refsId);

            if (existerRefsGroup != null)
            {
                existerRefsGroup.Name = title;
                dbContext.Update(existerRefsGroup);
                await dbContext.SaveChangesAsync();
            }
            return existerRefsGroup;
        }
    }
}
