using backend.Data;
using backend.Model.Domain;
using backend.Model.DTO.RefDTO;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Org.BouncyCastle.Ocsp;
using Org.BouncyCastle.Pqc.Crypto.Utilities;
using System;

namespace backend.Repository
{
    public class RefRepository : IRefRepository
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

            if (refsGroup == null)
            {
                return null;
            }

            var refs = await dbContext.Ref.Where(e => e.RefsGroupId == refsGroup.Id).OrderBy(x => x.Order).ToListAsync();

            if (refs.Count == 0)
            {
                return null;
            }

            return refs;
        }

        public async Task<List<Ref>> deleteRef(Guid refId, Guid refGroupId)
        {
            var Ref = await dbContext.Ref.FirstOrDefaultAsync(e => e.Id == refId);
            int order = Ref.Order;
            if (Ref != null)
            {
                if (Ref.DoubleRef == true)
                {
                    dbContext.Ref.Remove(Ref);
                    await dbContext.SaveChangesAsync();

                    var secondRef = await dbContext.Ref.FirstOrDefaultAsync(e => e.RefsGroupId == refGroupId && e.Order == order);

                    dbContext.Ref.Remove(secondRef);
                    await dbContext.SaveChangesAsync();

                }
                else
                {
                    dbContext.Ref.Remove(Ref);
                    await dbContext.SaveChangesAsync();
                }

                var refLIst = await dbContext.Ref.Where(e => e.RefsGroupId == refGroupId).ToListAsync();

                if (refLIst.Count == 0)
                {
                    return null;
                }

                foreach (var item in refLIst)
                {
                    if (item.Order < order)
                    {
                        continue;
                    }

                    item.Order = item.Order - 1;
                }

                dbContext.Ref.UpdateRange(refLIst);
                await dbContext.SaveChangesAsync();

                var newRefLIst = await dbContext.Ref.Where(e => e.RefsGroupId == refGroupId).ToListAsync();

                return newRefLIst;
            }

            return null;
        }

        public async Task<bool> createNewRef(Guid refsGroupId, List<CreateRefDTO> refs,  List<Ref> refsList)
        {
            switch (refs.Count)
            {
                case 1:
                    if (refsList.Count == 0)
                    {
                        refs[0].Order = 1;
                    }
                    else if (refsList[refsList.Count - 1].Order < refs[0].Order)
                    {
                        refs[0].Order = refsList[refsList.Count - 1].Order + 1;
                    }
                    break;
                case 2:
                    if (refsList.Count == 0)
                    {
                        refs[0].Order = 1;
                        refs[1].Order = 1;
                    }
                    else if (refsList[refsList.Count - 1].Order < refs[0].Order)
                    {
                        refs[0].Order = refsList[refsList.Count - 1].Order + 1;
                        refs[1].Order = refsList[refsList.Count - 1].Order + 1;
                    }
                    break;
            }

            if (refsList.Count != 0 && refsList[refsList.Count - 1].Order >= refs[0].Order)
            {
                int index = 0;

                for (int i = 0; i < refsList.Count; i++)
                {
                    if (refsList[i].Order == refs[0].Order)
                    {
                        index = i; break;
                    }
                }

                for (int i = index; i < refsList.Count; i++)
                {
                    refsList[i].Order = refsList[i].Order + 1;
                }

                dbContext.Ref.UpdateRange(refsList);
                await dbContext.SaveChangesAsync();
            }

            switch (refs.Count)
            {
                case 1:
                    var Ref1 = new Ref()
                    {
                        URL = refs[0].URL,
                        Text = refs[0].Text,
                        Type = refs[0].Type,
                        Order = refs[0].Order,
                        RefsGroupId = refsGroupId
                    };
                    await dbContext.AddAsync(Ref1);
                    await dbContext.SaveChangesAsync();
                    break;
                case 2:
                    var Ref11 = new Ref()
                    {
                        URL = refs[0].URL,
                        Text = refs[0].Text,
                        Type = refs[0].Type,
                        Order = refs[0].Order,
                        DoubleRef = true,
                        OrderInRef = 1,
                        RefsGroupId = refsGroupId
                    };

                    await dbContext.AddAsync(Ref11);
                    await dbContext.SaveChangesAsync();
                    var Ref2 = new Ref()
                    {
                        URL = refs[1].URL,
                        Text = refs[1].Text,
                        Type = refs[1].Type,
                        Order = refs[1].Order,
                        DoubleRef = true,
                        OrderInRef = 2,
                        RefsGroupId = refsGroupId
                    };

                    await dbContext.AddAsync(Ref2);
                    await dbContext.SaveChangesAsync();
                    break;
            }
            return true;
        }

        public async Task<List<Ref>> updateRef(Guid refsGroupId, List<UpdateDTO> refs)
        {
            var refsList = await getAllRefs(refsGroupId);


            int previousOrder = 0;
            int startOrder = 0;
            int endIndex = 0;

            for (int i = 0; i < refsList.Count; i++)
            {
                if (refs[0].Id == refsList[i].Id)
                {
                    if (refsList[i].Order < refs[0].Order)
                    {
                        startOrder = refsList[i].Order + 1;
                        previousOrder = refsList[i].Order;
                    }
                    else if (refsList[i].Order >= refs[0].Order)
                    {
                        startOrder = refsList[i].Order;
                        endIndex = i;
                        previousOrder = refsList[i].Order;
                    }
                    break;
                }
            }

            int index = 0;

            if (previousOrder < refs[0].Order)
            {

                for (int i = 0; i < refsList.Count; i++)
                {
                    if (startOrder == refsList[i].Order)
                    {
                        index = i;
                        break;
                    }
                }

                foreach (var refDTO in refsList)
                {
                    if (refDTO.Order < startOrder || refDTO.Order > refs[0].Order)
                    {
                        continue;
                    }
                    refDTO.Order = refDTO.Order - 1;
                }
            }
            else if (previousOrder > refs[0].Order)
            {
                for (int i = 0; i < refsList.Count; i++)
                {
                    if (refs[0].Order == refsList[i].Order)
                    {
                        index = i;
                        break;
                    }
                }

                foreach (var refDTO in refsList)
                {
                    if (refDTO.Order > startOrder - 1 || refDTO.Order < refs[0].Order)
                    {
                        continue;
                    }
                    refDTO.Order = refDTO.Order + 1;
                }
            }



            switch (refs.Count)
            {
                case 1:
                    if (previousOrder < refs[0].Order)
                    {
                        refsList[index - 1].Order = refs[0].Order;
                        refsList[index - 1].URL = refs[0].URL;
                        refsList[index - 1].Text = refs[0].Text;
                        refsList[index - 1].Type = refs[0].Type;
                    }
                    else if (previousOrder >= refs[0].Order)
                    {
                        refsList[endIndex].Order = refs[0].Order;
                        refsList[endIndex].URL = refs[0].URL;
                        refsList[endIndex].Text = refs[0].Text;
                        refsList[endIndex].Type = refs[0].Type;
                    }
                    break;
                case 2:
                    if (previousOrder < refs[0].Order)
                    {
                        refsList[index - 2].Order = refs[0].Order;
                        refsList[index - 2].URL = refs[0].URL;
                        refsList[index - 2].Text = refs[0].Text;
                        refsList[index - 2].Type = refs[0].Type;

                        refsList[index - 1].Order = refs[1].Order;
                        refsList[index - 1].URL = refs[1].URL;
                        refsList[index - 1].Text = refs[1].Text;
                        refsList[index - 1].Type = refs[1].Type;
                    }
                    else if (previousOrder >= refs[0].Order)
                    {
                        refsList[endIndex].Order = refs[0].Order;
                        refsList[endIndex].URL = refs[0].URL;
                        refsList[endIndex].Text = refs[0].Text;
                        refsList[endIndex].Type = refs[0].Type;

                        refsList[endIndex + 1].Order = refs[1].Order;
                        refsList[endIndex + 1].URL = refs[1].URL;
                        refsList[endIndex + 1].Text = refs[1].Text;
                        refsList[endIndex + 1].Type = refs[1].Type;
                    }
                    break;
            }

            dbContext.UpdateRange(refsList);
            await dbContext.SaveChangesAsync();

            var refss = await dbContext.Ref.Where(r => r.RefsGroupId == refsGroupId).OrderBy(r => r.Order).ToListAsync();

            return refss;
        }
        
        public async Task<List<Ref>> UpdateDragAndDrop(Guid refGroupId, List<RefDTO> refDTOs)
        {
            var refs = await dbContext.Ref.Where(r => r.RefsGroupId == refGroupId).OrderBy(r => r.Order).ToListAsync();

            
            if(refs.Count != 0)
            {
                for(int i = 0; i < refs.Count; i++)
                {
                    refs[i].Order = refDTOs[i].Order;
                }

                foreach(Ref Refs in refs)
                {
                    dbContext.Update(Refs);
                }

                await dbContext.SaveChangesAsync();
                return refs;
            }

            return null;
        }
    }
}
