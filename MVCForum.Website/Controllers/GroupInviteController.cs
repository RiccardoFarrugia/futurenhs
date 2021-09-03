﻿namespace MvcForum.Web.Controllers
{
    using MvcForum.Core.Interfaces.Services;
    using MvcForum.Core.Models.Enums;
    using MvcForum.Core.Models.GroupAddMember;
    using MvcForum.Core.Repositories.Models;
    using System;
    using System.Net.Mail;
    using System.Threading;
    using System.Threading.Tasks;
    using System.Web.Mvc;

    public class GroupInviteController : Controller
    {
        private const string StandardMemberRole = "Standard Members";

        private readonly IGroupInviteService _inviteService;
        private readonly IGroupAddMemberService _addMemberService;

        public GroupInviteController(IGroupInviteService inviteService, IGroupAddMemberService addMemberService)
        {
            if (inviteService is null)
            {
                throw new ArgumentNullException(nameof(inviteService));
            }

            if (addMemberService is null)
            {
                throw new ArgumentNullException(nameof(addMemberService));
            }

            _inviteService = inviteService;
            _addMemberService = addMemberService;
        }

        [HttpGet]
        [AsyncTimeout(30000)]
        [HandleError(ExceptionType = typeof(TimeoutException), View = "TimeoutError")]
        [Authorize]
        [ActionName("InviteMember")]
        public async Task<ActionResult> InviteMemberAsync(string slug, Guid groupId, bool success = false, CancellationToken cancellationToken = default(CancellationToken))
        {
            if (!await IsCurrentUserAGroupAdministratorAsync(cancellationToken))
            {
                return RedirectToRoute("GroupUrls", new { slug = slug });
            }

            ViewBag.HideSideBar = true;

            var model = new GroupInviteViewModel
            {
                GroupId = groupId,
                Slug = slug,
                Success = success
            };

            return View(model);
        }

        [HttpPost]
        [ValidateAntiForgeryToken]
        [AsyncTimeout(30000)]
        [HandleError(ExceptionType = typeof(TimeoutException), View = "TimeoutError")]
        [Authorize]
        [ActionName("InviteMember")]
        public async Task<ActionResult> InviteMemberAsync(GroupInviteViewModel model, CancellationToken cancellationToken)
        {
            ViewBag.HideSideBar = true;
            model.Success = false;

            if (!ModelState.IsValid)
            {
                return View(model);
            }

            var inviteMailAddress = new MailAddress(model.EmailAddress);

            //check if a user is already in the group
            if (await _inviteService.MemberExistsInGroupAsync(model.GroupId, inviteMailAddress, cancellationToken))
            {
                ModelState.AddModelError(nameof(model.EmailAddress), "A user with that email address is already a member of this group");
                return View(model);
            }

            //check if a user has is already in the system
            if (await _inviteService.MemberExistsInSystemAsync(inviteMailAddress, cancellationToken))
            {
                ModelState.AddModelError(nameof(model.EmailAddress), "A user with that email address is already registered on the platform - you may add them to your group");
                return View(model);
            }

            //check if a user already has an invite for this group
            if (await _inviteService.InviteExistsForGroupAsync(model.GroupId, inviteMailAddress, cancellationToken))
            {
                ModelState.AddModelError(nameof(model.EmailAddress), "This email address has already been invited to this group");
                return View(model);
            }
            
            var result = await _inviteService.CreateInviteAsync(model, cancellationToken);
            
            if (result == Guid.Empty)
            {
                ModelState.AddModelError("EmailSendError", "Failed to send email");
                return View(model);
            }

            return RedirectToAction("Create", new { slug = model.Slug, groupId = model.GroupId, success = true});
        }

        [HttpGet]
        [AsyncTimeout(30000)]
        [HandleError(ExceptionType = typeof(TimeoutException), View = "TimeoutError")]
        [Authorize]
        [ActionName("AddMember")]
        public async Task<ActionResult> AddMemberAsync(string slug, CancellationToken cancellationToken)
        {
            var currentMemberUsername = System.Web.HttpContext.Current.User.Identity.Name;

            if (!await _addMemberService.IsCurrentMemberAdminAsync(currentMemberUsername, slug, cancellationToken))
            {
                return RedirectToRoute("GroupUrls", new { slug });
            }

            ViewBag.HideSideBar = true;

            var model = new GroupAddMemberViewModel
            {
                Slug = slug,
            };

            return View(model);
        }

        [HttpPost]
        [ValidateAntiForgeryToken]
        [AsyncTimeout(30000)]
        [HandleError(ExceptionType = typeof(TimeoutException), View = "TimeoutError")]
        [Authorize]
        [ActionName("AddMember")]
        public async Task<ActionResult> AddMemberAsync(GroupAddMemberViewModel model, CancellationToken cancellationToken)
        {
            ViewBag.HideSideBar = true;

            if (!ModelState.IsValid)
            {
                return View(model);
            }

            var invitedMemberMailAddress = new MailAddress(model.Email);
            var isMailAddressValidResponse = await _addMemberService.IsMemberMailAddressValidAsync(invitedMemberMailAddress, model.Slug, cancellationToken);
            if (!(ResponseType.Success == isMailAddressValidResponse))
            {
                if (ResponseType.DoesntExist == isMailAddressValidResponse)
                {
                    ModelState.AddModelError(nameof(model.Email), "This user is not registered on the platform.  The platform is not open for new registrations at present, please contact support for more information.");
                    return View(model);
                }

                if (ResponseType.AlreadyExists == isMailAddressValidResponse)
                {
                    ModelState.AddModelError(nameof(model.Email), "The email address belongs to a member of this group.");
                    return View(model);
                }
            }

            //Dont want to use IMembershipService
            var addedByUsername = System.Web.HttpContext.Current.User.Identity.Name;
            
            var response = await _addMemberService.AddMemberToGroupAsync(invitedMemberMailAddress, StandardMemberRole, addedByUsername, model.Slug, cancellationToken);

            if (ResponseType.Success == response.Response)
            {
                var newModel = new GroupAddMemberViewModel
                {
                    Slug = model.Slug,
                    Response = ResponseType.Success
                };
                return View(newModel);
            }

            ModelState.AddModelError(nameof(model.Email), response.Response.ToString());
            return View(model);
        }

        private async Task<bool> IsCurrentUserAGroupAdministratorAsync(CancellationToken cancellationToken)
        {
            var currentUsername = System.Web.HttpContext.Current.User.Identity.Name;
            return await _inviteService.IsMemberAdminAsync(currentUsername, cancellationToken);
        }
    }
}