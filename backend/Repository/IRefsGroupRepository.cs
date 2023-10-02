using backend.Model.Domain;

namespace backend.Repository
{
    public interface IRefsGroupRepository
    {
        Task<List<RefsGroup>> getRefsGroup(string userId);
        Task<RefsGroup> createRefsGroup(RefsGroup refs);
        Task<RefsGroup> deleteRefsGroup(Guid refsId);
        Task<RefsGroup> updaterefsGroup(Guid refsId, string title);
    }
}
