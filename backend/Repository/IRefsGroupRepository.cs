using backend.Model.Domain;
using backend.Model.DTO;

namespace backend.Repository
{
    public interface IRefsGroupRepository
    {
        Task<List<RefsGroup>> getRefsGroup(string userId);
        Task<string> getRefsGroupName(Guid refsGroupId);
        Task<RefsGroup> createRefsGroup(RefsGroup refs);
        Task<RefsGroup> deleteRefsGroup(Guid refsId);
        Task<RefsGroup> updaterefsGroup(Guid refsId, string title);
        Task<bool> uploadPhoto(Guid refsId, ImageForm image);
        Task<byte[]> getImage(Guid refsId);
        Task<byte[]> getImageByName(string name);
    }
}
