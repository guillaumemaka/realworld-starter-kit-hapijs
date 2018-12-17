module.exports = (server) => {
  const inputValidations = require('./validations/input')
  const outputValidations = require('./validations/output')
  const fetchArticle = require('./routes_prerequisites').fetchArticle(server)
  const fetchComment = require('./routes_prerequisites').fetchComment(server)
  const authorizeArticle = require('./routes_prerequisites').authorizeArticle(server)
  const authorizeComment = require('./routes_prerequisites').authorizeComment(server)
  const handlers = require('./handlers')(server)

  return [
    // GET /api/articles
    {
      method: 'GET',
      path: '/articles',
      options: {
        description: 'Get a list of articles',
        notes: 'Returm a list of articles',
        tags: ['api', 'articles'],
        response: outputValidations.ListArticleOutputValidationsConfig,
        validate: inputValidations.ArticlesQueryValidations
      },
      handler: handlers.getArticles
    },
    // GET /api/articles/feed
    {
      method: 'GET',
      path: '/articles/feed',
      options: {
        description: 'Get the current logged user articles feed',
        notes: 'Return all articles followed users of the current logged user',
        tags: ['api', 'articles'],
        auth: 'jwt',
        response: outputValidations.ListArticleWithAuthOutputValidationsConfig,
        validate: inputValidations.ArticlesFeedQueryValidations
      },
      handler: handlers.getArticlesFeed
    },
    // POST /api/articles
    {
      method: 'POST',
      path: '/articles',
      options: {
        description: 'Create a new article',
        tags: ['api', 'articles'],
        auth: 'jwt',
        response: outputValidations.ArticleOnPostOutputValidationsConfig,
        validate: inputValidations.ArticleCreatePayloadValidations
      },
      handler: handlers.createArticle
    },
    // GET /api/articles/{slug}
    {
      method: 'GET',
      path: '/articles/{slug}',
      options: {
        description: 'Get an article by its slug',
        tags: ['api', 'articles'],
        auth: { mode: 'try', strategy: 'jwt' },
        pre: [
          fetchArticle
        ],
        response: outputValidations.ArticleOnGetOutputValidationsConfig,
        validate: inputValidations.ArticleParamsValidations
      },
      handler: handlers.getArticle
    },
    // PUT /api/articles/{slug}
    {
      method: 'PUT',
      path: '/articles/{slug}',
      options: {
        description: 'Update an article',
        tags: ['api', 'articles'],
        auth: 'jwt',
        pre: [
          fetchArticle,
          authorizeArticle
        ],
        response: outputValidations.ArticleOnPutOutputValidationsConfig,
        validate: inputValidations.ArticleUpdatePayloadValidations
      },
      handler: handlers.updateArticle
    },
    // DELETE /api/articles/{slug}
    {
      method: 'DELETE',
      path: '/articles/{slug}',
      options: {
        description: 'Delete an article',
        tags: ['api', 'articles'],
        auth: 'jwt',
        pre: [
          fetchArticle,
          authorizeArticle
        ],
        response: outputValidations.ArticleDeleteOutputValidationsConfig,
        validate: inputValidations.ArticleDeletePayloadValidations
      },
      handler: handlers.deleteArticle
    },
    // POST /api/articles/{slug}/favorite
    {
      method: 'POST',
      path: '/articles/{slug}/favorite',
      options: {
        description: 'Favorite an article',
        tags: ['api', 'articles'],
        auth: 'jwt',
        pre: [
          fetchArticle
        ],
        response: outputValidations.ArticleFavoriteOutputValidationsConfig,
        validate: inputValidations.ArticleFavoritePayloadValidations
      },
      handler: handlers.favoriteArticle
    },
    // DELETE /api/articles/{slug}/favorite
    {
      method: 'DELETE',
      path: '/articles/{slug}/favorite',
      options: {
        description: 'Unfavorite an article',
        tags: ['api', 'articles'],
        auth: 'jwt',
        pre: [
          fetchArticle
        ],
        response: outputValidations.ArticleFavoriteOutputValidationsConfig,
        validate: inputValidations.ArticleFavoritePayloadValidations
      },
      handler: handlers.unfavoriteArticle
    },
    // GET /api/articles/{slug}/comments
    {
      method: 'GET',
      path: '/articles/{slug}/comments',
      options: {
        description: 'List all comment of an article',
        tags: ['api', 'articles', 'comments'],
        auth: { mode: 'try', strategy: 'jwt' },
        pre: [
          fetchArticle
        ],
        response: outputValidations.ListCommentOutputValidationsConfig,
        validate: inputValidations.ArticleParamsValidations
      },
      handler: handlers.getComments
    },
    // POST /api/articles/{slug}/comments
    {
      method: 'POST',
      path: '/articles/{slug}/comments',
      options: {
        description: 'Add a comment to an article',
        tags: ['api', 'articles', 'comments'],
        auth: 'jwt',
        pre: [
          fetchArticle
        ],
        response: outputValidations.CommentsOnPostOutputValidationsConfig,
        validate: inputValidations.CommentCreatePayloadValidations
      },
      handler: handlers.addComment
    },
    // DELETE /api/articles/{slug}/comments/{commentId}
    {
      method: 'DELETE',
      path: '/articles/{slug}/comments/{commentId}',
      options: {
        description: 'Delete a comment',
        tags: ['api', 'articles', 'comments'],
        auth: 'jwt',
        pre: [
          fetchArticle,
          fetchComment,
          authorizeComment
        ],
        response: outputValidations.CommentOnDeleteOutputValidationsConfig,
        validate: inputValidations.CommentDeletePayloadValidations
      },
      handler: handlers.deleteComment
    }
  ]
}
