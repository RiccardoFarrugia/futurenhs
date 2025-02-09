using FutureNHS.Api.Attributes;
using FutureNHS.Api.DataAccess.Database.Read.Interfaces;
using FutureNHS.Api.Helpers;
using FutureNHS.Api.Services.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace FutureNHS.Api.Controllers
{
    [Route("api/v{version:apiVersion}")]
    [ApiController]
    [ApiVersion("1.0")]
    public sealed class UsersController : ControllerBase
    {
        private readonly ILogger<UsersController> _logger;
        private readonly IPermissionsService _permissionsService;
        private readonly IUserDataProvider _userDataProvider;
        private readonly IUserService _userService;
        private readonly IEtagService _etagService;

        public UsersController(ILogger<UsersController> logger, IPermissionsService permissionsService, IUserDataProvider userDataProvider, IUserService userService, IEtagService etagService)
        {
            _logger = logger;
            _permissionsService = permissionsService;
            _userDataProvider = userDataProvider;
            _userService = userService;
            _etagService = etagService;
        }

        [HttpGet]
        [Route("users/{userId:guid}/actions")]
        public async Task<IActionResult> GetActionsUserCanPerformInGroupAsync(Guid userId, CancellationToken cancellationToken)
        {
            var permissions = await _permissionsService.GetUserPermissionsAsync(userId, cancellationToken);

            if (permissions is null)
            {
                return NotFound();
            }

            return Ok(permissions);
        }

        [HttpGet]
        [Route("users/{userId:guid}/users/{targetUserId:guid}/update")]
        [TypeFilter(typeof(ETagFilter))]
        public async Task<IActionResult> GetMemberForUpdateAsync(Guid userId, Guid targetUserId, CancellationToken cancellationToken)
        {        
           var member = await _userService.GetMemberAsync(userId, targetUserId, cancellationToken);

           if (member is null)
               return NotFound();

           return Ok(member);
        }

        [HttpPut]
        [DisableFormValueModelBinding]
        [Route("users/{userId:guid}/users/{targetUserId:guid}/update")]
        public async Task<IActionResult> UpdateMemberAsync(Guid userId, Guid targetUserId, CancellationToken cancellationToken)
        {
            if (Request.ContentType != null && !MultipartRequestHelper.IsMultipartContentType(Request.ContentType))
            {
                return BadRequest("The data submitted is not in the multiform format");
            }

            var rowVersion = _etagService.GetIfMatch();

            await _userService.UpdateMemberAsync(userId, targetUserId, Request.Body, Request.ContentType, rowVersion, cancellationToken);

            return Ok();
        }
    }
}