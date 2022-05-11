using Umbraco9ContentApi.Core.Models;
using Umbraco9ContentApi.Core.Models.Response;

namespace Umbraco9ContentApi.Core.Handlers.FutureNhs.Interface
{
    public interface IFutureNhsPageHandler
    {

        /// <summary>
        /// Creates the content asynchronous.
        /// </summary>
        /// <param name="pageName">Name of the page.</param>
        /// <param name="pageParentId">The page parent identifier.</param>
        /// <param name="cancellationToken">The cancellation token.</param>
        /// <returns></returns>
        Task<ApiResponse<string>> CreatePageAsync(string pageName, string pageParentId, CancellationToken cancellationToken);

        /// <summary>
        /// Updates the page asynchronous.
        /// </summary>
        /// <param name="id">The identifier.</param>
        /// <param name="pageModel">The page model.</param>
        /// <param name="cancellationToken">The cancellation token.</param>
        /// <returns></returns>
        Task<ApiResponse<string>> UpdatePageAsync(Guid id, PageModel pageModel, CancellationToken cancellationToken);
    }
}
