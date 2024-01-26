using backend.Data;
using backend.Model.Domain;
using backend.Model.DTO;
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

        public async Task<string> getRefsGroupName(Guid refsGroupId)
        {
            var refGroup = await dbContext.RefsGroup.FirstOrDefaultAsync(r => r.Id == refsGroupId);

            return refGroup.Name;
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
            if (!(await dbContext.RefsGroup.AnyAsync(x => x.Name == title)))
            {
                var existerRefsGroup = await dbContext.RefsGroup.FirstOrDefaultAsync(e => e.Id == refsId);

                if (existerRefsGroup != null)
                {
                    existerRefsGroup.Name = title;
                    dbContext.Update(existerRefsGroup);
                    await dbContext.SaveChangesAsync();
                }
                return existerRefsGroup;
            }
            return null;
         }

        public async Task<bool> uploadPhoto(Guid refsId, ImageForm image)
        {
            await using var streamMemory = new MemoryStream();
            await image.myImage.CopyToAsync(streamMemory);
            var photoArray = streamMemory.ToArray();

            var refsGroup = await dbContext.RefsGroup.FirstOrDefaultAsync(e => e.Id == refsId);
            if (refsGroup != null)
            {
                refsGroup.Photo = photoArray;
                dbContext.Update(refsGroup);
                await dbContext.SaveChangesAsync();
                return true;
            }
            return false;
        }

        public async Task<byte[]> getImage(Guid refsId)
        {
            var refsGroup = await dbContext.RefsGroup.FirstOrDefaultAsync(e => e.Id == refsId);

            return refsGroup.Photo;
        }

        public async Task<byte[]> getImageByName(string name)
        {
            var refsGroup = await dbContext.RefsGroup.FirstOrDefaultAsync(e => e.Name == name);

            if (refsGroup == null) {
                return null;
            }

            return refsGroup.Photo;
        }
    }
}
