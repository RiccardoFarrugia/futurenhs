﻿//-----------------------------------------------------------------------
// <copyright file="IConfigurationProvider.cs" company="CDS">
// Copyright (c) CDS. All rights reserved.
// </copyright>
//-----------------------------------------------------------------------
namespace MvcForum.Core.Interfaces.Providers
{
    public interface IConfigurationProvider
    {
        string GetReadOnlyConnectionString();
        string GetWriteConnectionString();
        int GetRetryAttempts();
        int GetRetryDelay();
    }
}
