﻿namespace Umbraco9ContentApi.Core.Handlers.FutureNhs
{
    using Interface;
    using Microsoft.Extensions.Configuration;
    using Services.FutureNhs.Interface;
    using Umbraco9ContentApi.Core.Models.Response;
    using ContentModel = UmbracoContentApi.Core.Models.ContentModel;


    /// <summary>
    /// The handler that handles block methods and calls the content service.
    /// </summary>
    /// <seealso cref="IFutureNhsBlockHandler" />
    public sealed class FutureNhsBlockHandler : IFutureNhsBlockHandler
    {
        private readonly IConfiguration _config;
        private readonly IFutureNhsContentService _futureNhsContentService;
        private List<string>? errorList = null;

        /// <summary>
        /// Initializes a new instance of the <see cref="FutureNhsBlockHandler"/> class.
        /// </summary>
        /// <param name="futureNhsContentService">The future NHS content service.</param>
        /// <param name="config">The configuration.</param>
        public FutureNhsBlockHandler(IFutureNhsContentService futureNhsContentService, IConfiguration config)
        {
            _futureNhsContentService = futureNhsContentService;
            _config = config;
        }

        /// <inheritdoc />
        public async Task<ApiResponse<IEnumerable<ContentModel>>> GetAllBlocksAsync()
        {
            ApiResponse<IEnumerable<ContentModel>> response = new ApiResponse<IEnumerable<ContentModel>>();
            var contentModels = new List<ContentModel>();
            var blocksFolderGuid = _config.GetValue<Guid>("AppKeys:Folders:Blocks");
            var publishedBlocks = await _futureNhsContentService.GetPublishedChildrenAsync(blocksFolderGuid);

            if (publishedBlocks is not null && publishedBlocks.Any())
            {
                foreach (var block in publishedBlocks)
                {
                    contentModels.Add(await _futureNhsContentService.ResolveAsync(block));
                }
            }

            return response.Success(contentModels, "Success.");
        }
    }
}