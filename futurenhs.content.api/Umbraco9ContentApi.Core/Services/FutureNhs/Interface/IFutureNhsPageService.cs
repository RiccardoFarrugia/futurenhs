using Umbraco.Cms.Core.Models;

namespace Umbraco9ContentApi.Core.Services.FutureNhs.Interface
{
    public interface IFutureNhsPageService
    {
        Task<bool> AddPublishedBlockToPageDraft(IContent page, Guid blockId, CancellationToken cancellationToken);
    }
}
