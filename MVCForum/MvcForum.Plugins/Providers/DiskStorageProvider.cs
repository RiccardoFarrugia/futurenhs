﻿namespace MvcForum.Plugins.Providers
{
    using System;
    using System.Collections.Generic;
    using System.IO;
    using System.Web;
    using System.Web.Hosting;
    using Core;
    using Core.Interfaces.Providers;

    public class DiskStorageProvider : IStorageProvider
    {
        public string BuildFileUrl(params object[] subPath)
        {
            var joinString = string.Join("", subPath);
            return VirtualPathUtility.ToAbsolute(string.Concat(ForumConfiguration.Instance.UploadFolderPath, joinString));
        }

        public string GetUploadFolderPath(bool createIfNotExist, params object[] subFolders)
        {
            var sf = new List<object>();
            sf.AddRange(subFolders);

            var folder =
                HostingEnvironment.MapPath(
                    string.Concat(ForumConfiguration.Instance.UploadFolderPath, string.Join("\\", sf)));

            if (createIfNotExist && !Directory.Exists(folder))
            {
                Directory.CreateDirectory(folder);
            }

            return folder;
        }

        public string SaveAs(string uploadFolderPath, string fileName, Stream file)
        {
            if (string.IsNullOrWhiteSpace(uploadFolderPath)) throw new ArgumentNullException(nameof(uploadFolderPath));
            if (!Directory.Exists(uploadFolderPath)) {
                Directory.CreateDirectory(uploadFolderPath);
            }

            var path = Path.Combine(uploadFolderPath, fileName);

            using (var fileStream = File.Create(path)) {
                file.Seek(0, SeekOrigin.Begin);
                file.CopyTo(fileStream);
            }

            file.Dispose();

            var hostingRoot = HostingEnvironment.MapPath("~/") ?? "";
            return path.Substring(hostingRoot.Length).Replace('\\', '/').Insert(0, "/");
        }
    }
}