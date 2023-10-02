using backend.Model.Domain;
using backend.Model.DTO.RefDTO;

namespace backend.Repository
{
    public interface IRefRepository
    {
        Task<List<Ref>> getAllRefs(Guid refsId);
        Task<Ref> deleteRef(Guid refId);
        Task<RefDTO> createNewRef(Ref Ref);
        Task<Ref> updateRef(Guid refId, RefDTO Ref);
        Task<List<Ref>> getAllRefsByRefsGroupName(string refsGroupName);
    }
}
