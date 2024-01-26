using backend.Model.Domain;
using backend.Model.DTO.RefDTO;

namespace backend.Repository
{
    public interface IRefRepository
    {
        Task<List<Ref>> getAllRefs(Guid refsId);
        Task<List<Ref>> deleteRef(Guid refId, Guid refGroupId);
        Task<bool> createNewRef(Guid refsGroupId, List<CreateRefDTO> refs, List<Ref> refsList);
        Task<List<Ref>> updateRef(Guid refsGroupId, List<UpdateDTO> refs);
        Task<List<Ref>> getAllRefsByRefsGroupName(string refsGroupName);
        Task<List<Ref>> UpdateDragAndDrop(Guid refGroupId, List<RefDTO> refDTOs);
    }
}
