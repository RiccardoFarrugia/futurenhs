﻿using Dapper;
using FutureNHS.Api.Application.Application.HardCodedSettings;
using FutureNHS.Api.DataAccess.Database.Providers.Interfaces;
using FutureNHS.Api.DataAccess.Database.Read.Interfaces;
using FutureNHS.Api.DataAccess.Models.Comment;
using FutureNHS.Api.DataAccess.Models.User;

namespace FutureNHS.Api.DataAccess.Database.Read
{
    public class CommentsDataProvider : ICommentsDataProvider
    {
        private readonly IAzureSqlDbConnectionFactory _connectionFactory;
        private readonly ILogger<CommentsDataProvider> _logger;

        public CommentsDataProvider(IAzureSqlDbConnectionFactory connectionFactory, ILogger<CommentsDataProvider> logger)
        {
            _logger = logger;
            _connectionFactory = connectionFactory;
        }
        public async Task<(uint total, IEnumerable<Comment>?)> GetCommentsForDiscussionAsync(Guid? userId, string groupSlug, Guid topicId, uint offset, uint limit, CancellationToken cancellationToken)
        {
            if (limit is < PaginationSettings.MinLimit or > PaginationSettings.MaxLimit)
            {
                throw new ArgumentOutOfRangeException(nameof(limit));
            }

            const string query =
                @$"SELECT
                                [{nameof(CommentData.Id)}]                  = comment.Entity_Id,
                                [{nameof(CommentData.Content)}]             = ( SELECT      CASE 
																				WHEN        comment.IsDeleted = 0
																				THEN        comment.Content
																				ELSE        NULL
																				END
																			  ), 
	                            [{nameof(CommentData.CreatedByThisUser)}]	= ( SELECT      CASE 
                                                                                WHEN        comment.CreatedBy = @UserId 
                                                                                THEN        CAST(1 as bit) 
                                                                                ELSE        CAST(0 as bit) 
                                                                                END
                                                                              ),               
                                [{nameof(CommentData.CreatedAtUtc)}]        = FORMAT(comment.CreatedAtUTC,'yyyy-MM-ddTHH:mm:ssZ'),
                                [{nameof(CommentData.CreatedById)}]         = comment.CreatedBy,
                                [{nameof(CommentData.CreatedByName)}]       = createUser.FirstName + ' ' + createUser.Surname,
                                [{nameof(CommentData.CreatedBySlug)}]       = createUser.Slug,
								[{nameof(CommentData.RepliesCount)}]        = ( SELECT      COUNT(*) 
                                                                                FROM        Comment replies 
                                                                                WHERE       replies.ThreadId = comment.Entity_Id
                                                                              ),
								[{nameof(CommentData.Likes)}]				= ( SELECT      COUNT(*) 
                                                                                FROM        [Entity_Like] 
                                                                                WHERE       Entity_Id = comment.Entity_Id
                                                                              ),                                                                          
								[{nameof(CommentData.LikedByThisUser)}]		= ( SELECT      CASE 
                                                                                WHEN        [Entity_Like].Entity_Id IS NULL 
                                                                                THEN        CAST(0 as bit) 
                                                                                ELSE        CAST(1 as bit) 
                                                                                END 
                                                                                FROM        [Entity_Like]  
                                                                                WHERE       [Entity_Like].Entity_Id = comment.Entity_Id 
                                                                                AND         [Entity_Like].MembershipUser_Id = @UserId
                                                                              )

                    FROM            Comment comment
					Join		    Discussion discussion
					ON			    discussion.Entity_Id = comment.Parent_EntityId
					JOIN		    [Group] groups
					ON			    groups.Id = discussion.Group_Id
                    LEFT JOIN       MembershipUser createUser 
                    ON              CreateUser.Id = comment.CreatedBy		
					WHERE           comment.Parent_EntityId = @DiscussionId 
                    AND             comment.ThreadId IS NULL
                    AND             groups.Slug = @Slug
                    ORDER BY        comment.CreatedAtUTC

                    OFFSET          @Offset ROWS
                    FETCH NEXT      @Limit ROWS ONLY;

                    SELECT          COUNT(*) 

                    FROM            Comment comment		
					Join		    Discussion discussion
					ON			    discussion.Entity_Id = comment.Parent_EntityId
					JOIN		    [Group] groups
					ON			    groups.Id = discussion.Group_Id
					WHERE           comment.Parent_EntityId = @DiscussionId 
                    AND             comment.ThreadId IS NULL
                    AND             groups.Slug = @Slug";

            using var dbConnection = await _connectionFactory.GetReadOnlyConnectionAsync(cancellationToken);

            var reader = await dbConnection.QueryMultipleAsync(query, new
            {
                Offset = Convert.ToInt32(offset),
                Limit = Convert.ToInt32(limit),
                Slug = groupSlug,
                DiscussionId = topicId,
                UserId = userId
            });

            var commentsData = await reader.ReadAsync<CommentData>();

            var totalCount = Convert.ToUInt32(await reader.ReadFirstAsync<int>());

            return (totalCount, GenerateCommentModelFromData(commentsData));
        }


        public async Task<(uint total, IEnumerable<Comment>?)> GetRepliesForCommentAsync(Guid? userId, string groupSlug, Guid threadId, uint offset, uint limit, CancellationToken cancellationToken)
        {
            const string query =
                @$"SELECT
                                [{nameof(CommentData.Id)}]                  = comment.Entity_Id,
                                [{nameof(CommentData.Content)}]             = ( SELECT      CASE 
																				WHEN        comment.IsDeleted = 0
																				THEN        comment.Content
																				ELSE        NULL
																				END
																			  ), 
	                            [{nameof(CommentData.CreatedByThisUser)}]	= ( SELECT      CASE 
                                                                                WHEN        comment.CreatedBy = @UserId
                                                                                THEN        CAST(1 as bit) 
                                                                                ELSE        CAST(0 as bit) 
                                                                                END
                                                                              ),               
                                [{nameof(CommentData.CreatedAtUtc)}]        = FORMAT(comment.CreatedAtUTC,'yyyy-MM-ddTHH:mm:ssZ'),
                                [{nameof(CommentData.CreatedById)}]         = comment.CreatedBy,
                                [{nameof(CommentData.CreatedByName)}]       = createUser.FirstName + ' ' + createUser.Surname,
                                [{nameof(CommentData.CreatedBySlug)}]       = createUser.Slug,
								[{nameof(CommentData.Likes)}]				= ( SELECT      COUNT(*) 
                                                                                FROM        [Entity_Like] 
                                                                                WHERE       Entity_Id = comment.Entity_Id
                                                                              ),
								[{nameof(CommentData.LikedByThisUser)}]		= ( SELECT      CASE 
                                                                                WHEN        Entity_Id IS NULL 
                                                                                THEN        CAST(0 as bit) 
                                                                                ELSE        CAST(1 as bit) 
                                                                                END 
                                                                                FROM        [Entity_Like]  
                                                                                WHERE       [Entity_Like].Entity_Id = comment.Entity_Id 
                                                                                AND         [Entity_Like].MembershipUser_Id = @UserId
                                                                              ),
                                [{nameof(CommentData.InReplyTo)}]           = comment.InReplyTo

                    FROM            Comment comment
					JOIN		    Discussion discussion
					ON			    discussion.Entity_Id = comment.Parent_EntityId
					JOIN		    [Group] groups
					ON			    groups.Id = discussion.Group_Id
                    LEFT JOIN       MembershipUser createUser 
                    ON              CreateUser.Id = comment.CreatedBy		
					WHERE           comment.ThreadId = @ThreadId
                    AND             groups.Slug = @Slug
                    ORDER BY        comment.CreatedAtUTC

                    OFFSET          @Offset ROWS
                    FETCH NEXT      @Limit ROWS ONLY;

                    SELECT          COUNT(*) 

                    FROM            Comment comment
					JOIN		    Discussion discussion
					ON			    discussion.Entity_Id = comment.Parent_EntityId
					JOIN		    [Group] groups
					ON			    groups.Id = discussion.Group_Id
					WHERE           comment.ThreadId = @ThreadId
                    AND             groups.Slug = @Slug";

            using var dbConnection = await _connectionFactory.GetReadOnlyConnectionAsync(cancellationToken);

            var reader = await dbConnection.QueryMultipleAsync(query, new
            {
                Offset = Convert.ToInt32(offset),
                Limit = Convert.ToInt32(limit),
                Slug = groupSlug,
                ThreadId = threadId,
                UserId = userId
            });

            var commentsData = await reader.ReadAsync<CommentData>();

            var totalCount = Convert.ToUInt32(await reader.ReadFirstAsync<int>());

            return (totalCount, GenerateCommentModelFromData(commentsData));
        }

        private IEnumerable<Comment> GenerateCommentModelFromData(IEnumerable<CommentData> commentData)
        {
            return commentData.Select
            (
                item => new Comment()
                {
                    Id = item.Id,
                    Content = item.Content,
                    RepliesCount = item.RepliesCount,
                    LikesCount = item.Likes,
                    InReplyTo = item.InReplyTo,
                    FirstRegistered = new Models.Shared.Properties
                    {
                        AtUtc = item.CreatedAtUtc,
                        By = new UserNavProperty
                        {
                            Id = item.CreatedById,
                            Name = item.CreatedByName,
                            Slug = item.CreatedBySlug
                        }
                    },
                    CurrentUser = new UserCommentDetails
                    {
                        Created = item.CreatedByThisUser,
                        Liked = item.LikedByThisUser
                    }
                });
        }
    }
}
