﻿namespace MvcForum.Web.Controllers
{
    using System;
    using System.Linq;
    using System.Web.Mvc;
    using Core.ExtensionMethods;
    using Core.Interfaces;
    using Core.Interfaces.Services;
    using Core.Models.Entities;
    using ViewModels;
    using ViewModels.Favourite;
    using ViewModels.Mapping;

    [Authorize]
    public partial class FavouriteController : BaseController
    {
        private readonly IFavouriteService _favouriteService;
        private readonly IPostService _postService;
        private readonly ITopicService _topicService;

        public FavouriteController(ILoggingService loggingService, IMembershipService membershipService,
            IRoleService roleService, ITopicService topicService, IPostService postService,
            ILocalizationService localizationService, ISettingsService settingsService,
            IFavouriteService favouriteService, ICacheService cacheService, IMvcForumContext context)
            : base(loggingService, membershipService, localizationService, roleService,
                settingsService, cacheService, context)
        {
            _topicService = topicService;
            _postService = postService;
            _favouriteService = favouriteService;
        }

        public virtual ActionResult Index()
        {
            User.GetMembershipUser(MembershipService);

            // Get the favourites
            var favourites = _favouriteService.GetAllByMember(LoggedOnReadOnlyUser.Id);

            // Pull out the posts
            var posts = favourites.Select(x => x.Post);

            // Create the view Model
            var viewModel = new MyFavouritesViewModel();

            // Map the view models
            // TODO - Need to improve performance of this
            foreach (var post in posts)
            {
                var permissions = RoleService.GetPermissions(post.Topic.Group,
                    LoggedOnReadOnlyUser.Roles.FirstOrDefault());
                var postViewModel = ViewModelMapping.CreatePostViewModel(post, post.Votes.ToList(), permissions,
                    post.Topic, LoggedOnReadOnlyUser, SettingsService.GetSettings(), post.Favourites.ToList());
                postViewModel.ShowTopicName = true;
                viewModel.Posts.Add(postViewModel);
            }

            return View(viewModel);
        }


        [HttpPost]
        public virtual JsonResult FavouritePost(EntityIdViewModel viewModel)
        {
            var returnValue = new FavouriteJsonReturnModel();
            User.GetMembershipUser(MembershipService);
            if (Request.IsAjaxRequest() && LoggedOnReadOnlyUser != null)
            {
                try
                {
                    var post = _postService.Get(viewModel.Id);
                    var topic = _topicService.Get(post.Topic.Id);

                    // See if this is a user adding or removing the favourite
                    Guid? user;
                    if (LoggedOnReadOnlyUser == null)
                    {
                        user = null;
                    }
                    else
                    {
                        user = LoggedOnReadOnlyUser.Id;
                    }
                    ;
                    var loggedOnUser = MembershipService.GetUser(user);
                    var existingFavourite = _favouriteService.GetByMemberAndPost(loggedOnUser.Id, post.Id);
                    if (existingFavourite != null)
                    {
                        _favouriteService.Delete(existingFavourite);
                        returnValue.Message = LocalizationService.GetResourceString("Post.Favourite");
                    }
                    else
                    {
                        var favourite = new Favourite
                        {
                            DateCreated = DateTime.UtcNow,
                            Member = loggedOnUser,
                            Post = post,
                            Topic = topic
                        };
                        _favouriteService.Add(favourite);
                        returnValue.Message = LocalizationService.GetResourceString("Post.Favourited");
                        returnValue.Id = favourite.Id;
                    }

                    Context.SaveChanges();
                    return Json(returnValue, JsonRequestBehavior.DenyGet);
                }
                catch (Exception ex)
                {
                    Context.RollBack();
                    LoggingService.Error(ex);
                    throw new Exception(LocalizationService.GetResourceString("Errors.Generic"));
                }
            }
            return Json(returnValue);
        }
    }
}