﻿using Newtonsoft.Json;

namespace FutureNHS.Api.Models.Content
{
    public class ApiResponse<T> where T : class
    {
        [JsonProperty("succeeded")]
        public bool Succeeded { get; set; }
        [JsonProperty("message")]
        public string Message { get; set; }
        [JsonProperty("errors")]
        public IEnumerable<string> Errors { get; set; }
        [JsonProperty("payload")]
        public T Payload { get; set; }
    }
}