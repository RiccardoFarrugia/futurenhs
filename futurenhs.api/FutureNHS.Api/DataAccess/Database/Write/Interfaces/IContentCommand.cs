using FutureNHS.Api.Models.Content;
using FutureNHS.Api.Models.Content.Requests;

namespace FutureNHS.Api.DataAccess.Repositories.Write.Interfaces
{
    public interface IContentCommand
    {
        /// <summary>
        /// Creates the content asynchronous.
        /// </summary>
        /// <param name="createRequest">The create request.</param>
        /// <returns></returns>
        Task<ApiResponse<string>> CreatePageAsync(CreatePageRequest createRequest, CancellationToken cancellationToken);
        /// <summary>
        /// Creates the block asynchronous.
        /// </summary>
        /// <param name="createRequest">The create request.</param>
        /// <param name="cancellationToken">The cancellation token.</param>
        /// <returns></returns>
        Task<ApiResponse<string>> CreateBlockAsync(CreateBlockRequest createRequest, CancellationToken cancellationToken);
        /// <summary>
        /// Updates the content asynchronous.
        /// </summary>
        /// <param name="contentId">The content identifier.</param>
        /// <param name="pageContent">Content of the page.</param>
        /// <param name="cancellationToken">The cancellation token.</param>
        /// <returns></returns>
        Task<ApiResponse<string>> UpdatePageAsync(Guid contentId, PageModel pageContent, CancellationToken cancellationToken);
        /// <summary>
        /// Updates the block asynchronous.
        /// </summary>
        /// <param name="blockId">The block identifier.</param>
        /// <param name="blockModel">The block model.</param>
        /// <param name="cancellationToken">The cancellation token.</param>
        /// <returns></returns>
        Task<ApiResponse<string>> UpdateBlockAsync(Guid blockId, ContentModel blockModel, CancellationToken cancellationToken);
        /// <summary>
        /// Deletes the content asynchronous.
        /// </summary>
        /// <param name="contentId">The content identifier.</param>
        /// <returns></returns>
        Task<ApiResponse<string>> DeleteContentAsync(Guid contentId, CancellationToken cancellationToken);
        /// <summary>
        /// Publishes the content asynchronous.
        /// </summary>
        /// <param name="contentId">The content identifier.</param>
        /// <returns></returns>
        Task<ApiResponse<string>> PublishContentAsync(Guid contentId, CancellationToken cancellationToken);
    }
}
