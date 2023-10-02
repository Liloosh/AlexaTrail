using backend.Data;
using backend.Model.Domain;
using backend.Model.DTO.RefDTO;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace backend.Repository
{
    public class RefRepository: IRefRepository
    {
        private readonly AppDbContext dbContext;

        public RefRepository(AppDbContext dbContext)
        {
            this.dbContext = dbContext;
        }

        public async Task<List<Ref>> getAllRefs(Guid refsId)
        {
            var refs = await dbContext.Ref.Where(e => e.RefsGroupId == refsId).OrderBy(x => x.Order).ToListAsync();
            return refs;
        }

        public async Task<List<Ref>> getAllRefsByRefsGroupName(string refsGroupName)
        {
            var refsGroup = await dbContext.RefsGroup.FirstOrDefaultAsync(x => x.Name == refsGroupName);

            if(refsGroup == null)
            {
                return null;
            }

            var refs = await dbContext.Ref.Where(e => e.RefsGroupId == refsGroup.Id).OrderBy(x => x.Order).ToListAsync();

            if(refs.Count == 0)
            {
                return null;
            }

            return refs;
        }

        public async Task<Ref> deleteRef(Guid refId)
        {
            var Ref = await dbContext.Ref.FirstOrDefaultAsync(e => e.Id == refId);
            if (Ref != null)
            {
                dbContext.Ref.Remove(Ref);
                await dbContext.SaveChangesAsync();
            }

            return Ref;
        }

        public async Task<RefDTO> createNewRef(Ref Ref)
        {
            await dbContext.Ref.AddAsync(Ref);
            await dbContext.SaveChangesAsync();

            var refDTO = new RefDTO()
            {
                Id = Ref.Id,
                Text = Ref.Text,
                Type = Ref.Type,
                Order = Ref.Order,
            };
            return refDTO;
        }

        public async Task<Ref> updateRef(Guid refId, RefDTO Ref)
        {
            var existedRef = await dbContext.Ref.FirstOrDefaultAsync(x => x.Id == Ref.Id);

            var start_order = existedRef.Order;
            var end_order = Ref.Order;
            if (existedRef.Order != Ref.Order)
            {
                List<Ref> refs = await dbContext.Ref.Where(x => x.RefsGroupId == existedRef.RefsGroupId).OrderBy(x => x.Order).ToListAsync();

                if (existedRef.Order < Ref.Order)
                {
                    for (int i = start_order; i < end_order; i++)
                    {
                        refs[i].Order = refs[i].Order - 1;
                        dbContext.Ref.Update(refs[i]);
                        dbContext.SaveChanges();
                    }
                }
                else if (existedRef.Order > Ref.Order)
                {
                    for (int i = end_order; i < start_order; i++)
                    {
                        refs[i - 1].Order = refs[i - 1].Order + 1;
                        dbContext.Ref.Update(refs[i -1]);
                        dbContext.SaveChanges();
                    }
                }
            }

            if (existedRef != null)
            {
                existedRef.Text = Ref.Text;
                existedRef.URL = Ref.URL;
                existedRef.Type = Ref.Type;
                existedRef.Order = Ref.Order;

                dbContext.Ref.Update(existedRef);
                dbContext.SaveChanges();

                return existedRef;
            }

            return null;

        }
    }
}
