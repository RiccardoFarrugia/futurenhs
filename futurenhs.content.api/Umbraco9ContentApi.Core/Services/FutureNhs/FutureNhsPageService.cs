using Umbraco.Cms.Core;
using Umbraco.Cms.Core.Models;
using Umbraco.Cms.Core.Services;
using Umbraco9ContentApi.Core.Services.FutureNhs.Interface;
using static Umbraco.Cms.Core.Constants;

namespace Umbraco9ContentApi.Core.Services.FutureNhs
{
    public class FutureNhsPageService : IFutureNhsPageService
    {
        private readonly IContentService _contentService;

        public FutureNhsPageService(IContentService contentService)
        {
            _contentService = contentService;
        }

        public async Task<bool> AddPublishedBlockToPageDraft(IContent pageDraft, Guid blockId, CancellationToken cancellationToken)
        {
            if (pageDraft is null)
                return false;

            pageDraft.Properties.TryGetValue("pageContent", out IProperty pageContent);
            var udiList = pageContent is not null ? pageContent.GetValue()?
                                                               .ToString()?
                                                               .Split(',')
                                                               .ToList() : new List<string>();

            string blockUdi = Udi.Create(UdiEntityType.Document, blockId).ToString();
            udiList.Add(blockUdi);
            pageDraft.Properties[$"pageContent"].SetValue(string.Join(",", udiList));
            var result = _contentService.Save(pageDraft);

            return result.Success;
        }
    }
}
