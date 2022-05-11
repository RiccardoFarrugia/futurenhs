namespace Umbraco9ContentApi.Core.Handlers.FutureNhs
{
    using Interface;
    using Microsoft.Extensions.Configuration;
    using Newtonsoft.Json;
    using Services.FutureNhs.Interface;
    using Umbraco.Cms.Core;
    using Umbraco.Cms.Core.Services;
    using Umbraco9ContentApi.Core.Models.Content;
    using Umbraco9ContentApi.Core.Models.Requests;
    using Umbraco9ContentApi.Core.Models.Response;
    using static Umbraco.Cms.Core.Constants;

    /// <summary>
    /// The handler that handles block methods and calls the content service.
    /// </summary>
    /// <seealso cref="IFutureNhsBlockHandler" />
    public sealed class FutureNhsBlockHandler : IFutureNhsBlockHandler
    {
        private readonly IConfiguration _config;
        private readonly IFutureNhsContentService _futureNhsContentService;
        private readonly IFutureNhsBlockService _futureNhsBlockService;
        private readonly IFutureNhsValidationService _futureNhsValidationService;
        private readonly IFutureNhsPageService _futureNhsPageService;
        private readonly IContentTypeService _contentTypeService;
        private List<string> errorList = new List<string>();

        public FutureNhsBlockHandler(IConfiguration config, IFutureNhsContentService futureNhsContentService, IFutureNhsBlockService futureNhsBlockService, IFutureNhsValidationService futureNhsValidationService, IContentTypeService contentTypeService, IFutureNhsPageService futureNhsPageService)
        {
            _config = config;
            _futureNhsContentService = futureNhsContentService;
            _futureNhsBlockService = futureNhsBlockService;
            _futureNhsValidationService = futureNhsValidationService;
            _contentTypeService = contentTypeService;
            _futureNhsPageService = futureNhsPageService;
        }

        /// <inheritdoc />
        public async Task<ApiResponse<IEnumerable<ContentModel>>> GetAllBlocksAsync(CancellationToken cancellationToken)
        {
            ApiResponse<IEnumerable<ContentModel>> response = new ApiResponse<IEnumerable<ContentModel>>();
            var ContentModels = new List<ContentModel>();
            var blocksFolderGuid = _config.GetValue<Guid>("AppKeys:Folders:PlaceholderBlocks");
            var publishedBlocks = await _futureNhsContentService.GetPublishedContentChildrenAsync(blocksFolderGuid, cancellationToken);

            if (publishedBlocks is not null && publishedBlocks.Any())
            {
                foreach (var block in publishedBlocks)
                {
                    ContentModels.Add(await _futureNhsContentService.ResolvePublishedContentAsync(block, "content", cancellationToken));
                }
            }

            return response.Success(ContentModels, "Success.");
        }

        /// <inheritdoc />
        public async Task<ApiResponse<ContentModel>> GetBlockAsync(Guid blockId, CancellationToken cancellationToken)
        {
            ApiResponse<ContentModel> response = new ApiResponse<ContentModel>();
            var block = await _futureNhsContentService.GetPublishedContentAsync(blockId, cancellationToken);
            var result = await _futureNhsContentService.ResolvePublishedContentAsync(block, "content", cancellationToken);

            if (result is not null)
            {
                return response.Success(result, "Success.");
            }

            errorList.Add("Could not retrieve block.");
            return response.Failure(errorList, "Failed.");
        }

        /// <inheritdoc />
        public async Task<ApiResponse<IEnumerable<string?>>> GetBlockPlaceholderValuesAsync(Guid blockId, string propertyGroupAlias, CancellationToken cancellationToken)
        {
            ApiResponse<IEnumerable<string?>> response = new ApiResponse<IEnumerable<string?>>();
            var blockPlaceholderValues = await _futureNhsBlockService.GetBlockPlaceholderValuesAsync(blockId, propertyGroupAlias, cancellationToken);
            return response.Success(blockPlaceholderValues, "Success.");
        }

        /// <inheritdoc />
        public async Task<ApiResponse<IEnumerable<string>>> GetBlockContentAsync(Guid blockId, CancellationToken cancellationToken)
        {
            ApiResponse<IEnumerable<string>> response = new ApiResponse<IEnumerable<string>>();
            var block = await _futureNhsContentService.GetPublishedContentAsync(blockId, cancellationToken);
            var result = await _futureNhsContentService.ResolvePublishedContentAsync(block, "content", cancellationToken);

            if (result is not null)
            {
                return response.Success(result.Content.Keys, "Success.");
            }

            errorList.Add("Could not retrieve block content.");
            return response.Failure(errorList, "Failed.");
        }

        /// <inheritdoc />
        public async Task<ApiResponse<IEnumerable<string>>> GetBlockLabelsAsync(Guid blockId, CancellationToken cancellationToken)
        {
            ApiResponse<IEnumerable<string>> response = new ApiResponse<IEnumerable<string>>();
            var block = await _futureNhsContentService.GetPublishedContentAsync(blockId, cancellationToken);
            var result = await _futureNhsContentService.ResolvePublishedContentAsync(block, "labels", cancellationToken);

            if (result is not null)
            {
                return response.Success(result.Content.Keys, "Success.");
            }

            errorList.Add("Could not retrieve block labels.");
            return response.Failure(errorList, "Failed.");
        }

        /// <inheritdoc />
        public async Task<ApiResponse<string>> CreateBlockAsync(CreateBlockRequest createRequest, CancellationToken cancellationToken)
        {
            ApiResponse<string> response = new ApiResponse<string>();

            var BlocksDataSourceFolderGuid = _config.GetValue<Guid>("AppKeys:Folders:BlocksDataSource");
            var createdBlock = await _futureNhsBlockService.CreateBlockAsync(createRequest, BlocksDataSourceFolderGuid, cancellationToken);
            var pageDraft = await _futureNhsContentService.GetDraftContentAsync(createRequest.pageId, cancellationToken);
            var result = await _futureNhsPageService.AddPublishedBlockToPageDraft(pageDraft, createdBlock.Key, cancellationToken);

            if (result)
            {
                return response.Success(createdBlock.Key.ToString(), "Success.");
            }

            errorList.Add("Error occured.");
            return response.Failure(errorList, "Failed.");
        }

        /// <inheritdoc />
        public async Task<ApiResponse<string>> UpdateBlockAsync(Guid blockId, ContentModel blockModel, CancellationToken cancellationToken)
        {
            ApiResponse<string> response = new ApiResponse<string>();

            if (blockModel is null || blockModel.Item is null)
            {
                errorList.Add("No data provided.");
                return response.Failure(errorList, "Failed.");
            }

            _futureNhsValidationService.ValidateContentModel(blockModel);

            var blockToUpdate = await _futureNhsContentService.GetDraftContentAsync(blockModel.Item.Id, cancellationToken);

            // Get the block blockType
            var blockType = _contentTypeService.Get(blockModel.Item?.ContentType);

            // Loop through the blockType properties
            foreach (var property in blockType.PropertyTypes)
            {
                var updateValue = blockModel.Content.Where(p => p.Key == property.Alias).Select(x => x.Value).FirstOrDefault();

                // If the property has child/nested block we set the value appropriately
                if (property.PropertyEditorAlias is "Umbraco.MultiNodeTreePicker")
                {
                    List<string> blockUdisList = new List<string>();

                    var blockModelsObject = JsonConvert.SerializeObject(updateValue);
                    var blockModels = JsonConvert.DeserializeObject<List<ContentModel>>(blockModelsObject);

                    if (blockModels is not null)
                    {
                        foreach (var model in blockModels)
                        {
                            // Convert block item guid to a udi (required by umbraco)
                            string blockUdi = Udi.Create(UdiEntityType.Document, model.Item.Id).ToString();
                            blockUdisList.Add(blockUdi);
                        }

                        blockToUpdate.Properties[$"{property.Alias}"].SetValue(string.Join(",", blockUdisList));
                    }
                }
                else
                {
                    blockToUpdate.Properties[$"{property.Alias}"].SetValue(updateValue);
                }
            }

            var result = await _futureNhsContentService.SaveContentAsync(blockToUpdate, cancellationToken);

            if (result)
            {
                return response.Success(blockId.ToString(), "Success.");
            }

            errorList.Add("Error occured.");
            return response.Failure(errorList, "Failed.");
        }
    }
}
