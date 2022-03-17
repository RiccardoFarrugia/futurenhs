using FutureNHS.Api.DataAccess.Models;
using System.ComponentModel.DataAnnotations;

namespace FutureNHS.Api.Models.Folder
{
    public sealed record Folder : BaseData
    {
        [Required]
        [MaxLength(200)]
        public string Name { get; set; }

        [MaxLength(4000)]
        public string Description { get; set; }
    }
}
