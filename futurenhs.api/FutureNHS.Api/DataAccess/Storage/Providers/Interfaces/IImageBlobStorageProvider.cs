﻿using Azure.Storage.Sas;
using Microsoft.Azure.Storage.Blob;

namespace FutureNHS.Api.DataAccess.Storage.Providers.Interfaces
{
    public interface IImageBlobStorageProvider
    {
        Task<string?> UploadFileAsync(Stream stream, string blobName, string contentType,
            CancellationToken cancellationToken);

        Task<string?> UploadFileAsync(byte[] bytes, string blobName, string contentType, CancellationToken cancellationToken);

        Task DeleteFileAsync(string blobName);

        string GetRelativeDownloadUrl(string blobName, string fileName, SharedAccessBlobPermissions downloadPermissions,
            CancellationToken cancellationToken);
    }
}
