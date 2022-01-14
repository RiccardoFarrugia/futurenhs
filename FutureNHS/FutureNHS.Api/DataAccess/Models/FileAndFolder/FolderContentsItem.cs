﻿using FutureNHS.Api.DataAccess.Models.User;

namespace FutureNHS.Api.DataAccess.Models.FileAndFolder
{
    public record FolderContentsItem
    {
        public Guid Id { get; init; }
        public string Type { get; init; }
        public string Name { get; init; }
        public string Description { get; init; }
        public Properties FirstRegistered { get; init; }
        public Properties LastUpdated  { get; init; }
        public FileProperties AdditionalMetadata { get; init; }
    }
}
