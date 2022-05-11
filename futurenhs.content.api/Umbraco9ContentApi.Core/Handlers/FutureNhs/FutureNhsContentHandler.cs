namespace Umbraco9ContentApi.Core.Handlers.FutureNhs
{
    using Interface;
    using Microsoft.Extensions.Configuration;
    using Newtonsoft.Json;
    using Services.FutureNhs.Interface;
    using Umbraco9ContentApi.Core.Models;
    using Umbraco9ContentApi.Core.Models.Content;
    using Umbraco9ContentApi.Core.Models.Response;

    /// <summary>
    /// The handler that handles content methods and calls the content service.
    /// </summary>
    /// <seealso cref="IFutureNhsContentHandler" />
    public sealed class FutureNhsContentHandler : IFutureNhsContentHandler
    {
        private readonly IConfiguration _config;
        private readonly IFutureNhsContentService _futureNhsContentService;
        private readonly IFutureNhsValidationService _futureNhsValidationService;
        private List<string> errorList = new List<string>();

        public FutureNhsContentHandler(IConfiguration config, IFutureNhsContentService futureNhsContentService, IFutureNhsValidationService futureNhsValidationService)
        {
            _config = config ?? throw new ArgumentNullException(nameof(config));
            _futureNhsContentService = futureNhsContentService ?? throw new ArgumentNullException(nameof(futureNhsContentService));
            _futureNhsValidationService = futureNhsValidationService ?? throw new ArgumentNullException(nameof(futureNhsValidationService));
        }

        /// <inheritdoc />
        public async Task<ApiResponse<string>> UpdateContentAsync(Guid id, string title, string description, PageModel pageContent, CancellationToken cancellationToken)
        {
            ApiResponse<string> response = new ApiResponse<string>();
            if (string.IsNullOrWhiteSpace(title) && string.IsNullOrWhiteSpace(description) && pageContent is null)
            {
                errorList.Add("No data provided.");
                return response.Failure(errorList, "Failed.");
            }

            _futureNhsValidationService.ValidatePageContentModel(pageContent);

            var groupWebPage = await _futureNhsContentService.GetDraftContentAsync(id, cancellationToken);

            if (!string.IsNullOrWhiteSpace(title))
            {
                groupWebPage.Name = title;
                groupWebPage.SetValue("title", title);
            }

            if (!string.IsNullOrWhiteSpace(description))
            {
                groupWebPage.SetValue("description", description);
            }

            if (pageContent is null)
            {
                groupWebPage.SetValue("pageContent", JsonConvert.SerializeObject(pageContent));
            }

            var result = await _futureNhsContentService.SaveContentAsync(groupWebPage, cancellationToken);

            if (result)
            {
                return response.Success(id.ToString(), "Success.");
            }

            errorList.Add("Error occured.");
            return response.Failure(errorList, "Failed.");
        }

        /// <inheritdoc />
        public async Task<ApiResponse<string>> UpdatePageAsync(Guid id, PageModel pageContent, CancellationToken cancellationToken)
        {
            ApiResponse<string> response = new ApiResponse<string>();

            _futureNhsValidationService.ValidatePageContentModel(pageContent);

            var groupWebPage = await _futureNhsContentService.GetDraftContentAsync(id, cancellationToken);

            if (groupWebPage is not null)
            {
                groupWebPage.Properties["pageContent"].SetValue(JsonConvert.SerializeObject(pageContent));

                var result = await _futureNhsContentService.SaveContentAsync(groupWebPage, cancellationToken);

                if (result)
                {
                    return response.Success(id.ToString(), "Success.");
                }
            }

            errorList.Add("Error occured.");
            return response.Failure(errorList, "Failed.");
        }

        /// <inheritdoc />
        public async Task<ApiResponse<string>> PublishContentAsync(Guid contentId, CancellationToken cancellationToken)
        {
            ApiResponse<string> response = new ApiResponse<string>();
            var result = await _futureNhsContentService.PublishContentAsync(contentId, cancellationToken);

            if (result)
            {
                return response.Success(result.ToString(), "Success.");
            }

            errorList.Add("Publish failed.");
            return response.Failure(errorList, "Failed.");
        }

        /// <inheritdoc />
        public async Task<ApiResponse<ContentModel>> GetPublishedContentAsync(Guid id, CancellationToken cancellationToken)
        {
            ApiResponse<ContentModel> response = new ApiResponse<ContentModel>();
            var content = await _futureNhsContentService.GetPublishedContentAsync(id, cancellationToken);
            var result = await _futureNhsContentService.ResolvePublishedContentAsync(content, "content", cancellationToken);

            if (result is not null)
            {
                return response.Success(result, "Success.");
            }

            errorList.Add("Could not retrieve content.");
            return response.Failure(errorList, "Failed.");
        }

        /// <inheritdoc />
        public async Task<ApiResponse<ContentModel>> GetDraftContentAsync(Guid id, CancellationToken cancellationToken)
        {
            ApiResponse<ContentModel> response = new ApiResponse<ContentModel>();
            var content = await _futureNhsContentService.GetDraftContentAsync(id, cancellationToken);
            var result = await _futureNhsContentService.ResolveDraftContentAsync(content, cancellationToken);

            if (result is not null)
            {
                return response.Success(result, "Success.");
            }

            errorList.Add("Could not retrieve content.");
            return response.Failure(errorList, "Failed.");
        }

        /// <inheritdoc />
        public async Task<ApiResponse<string>> DeleteContentAsync(Guid id, CancellationToken cancellationToken)
        {
            ApiResponse<string> response = new ApiResponse<string>();
            var result = await _futureNhsContentService.DeleteContentAsync(id, cancellationToken);

            if (result)
            {
                return response.Success(id.ToString(), "Success.");
            }

            errorList.Add("Could not delete content.");
            return response.Failure(errorList, "Failed.");
        }



        /// <inheritdoc />
        public async Task<ApiResponse<IEnumerable<ContentModel>>> GetAllPagesAsync(CancellationToken cancellationToken)
        {
            ApiResponse<IEnumerable<ContentModel>> response = new ApiResponse<IEnumerable<ContentModel>>();
            var contentModels = new List<ContentModel>();
            var pagesFolderGuid = _config.GetValue<Guid>("AppKeys:Folders:Groups");
            var publishedContent = await _futureNhsContentService.GetPublishedContentChildrenAsync(pagesFolderGuid, cancellationToken);

            if (publishedContent is not null && publishedContent.Any())
            {
                foreach (var content in publishedContent)
                {
                    contentModels.Add(await _futureNhsContentService.ResolvePublishedContentAsync(content, "content", cancellationToken));
                }
            }

            return response.Success(contentModels, "Success.");
        }
    }
}
