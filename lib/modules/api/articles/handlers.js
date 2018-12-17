const replyHelper = require('../helpers')

module.exports = (server) => {
  return {
    /**
     * GET /api/articles
     */
    getArticles (request, h) {
      let user = request.auth.isAuthenticated ? request.auth.credentials.user : null
      let query = request.query

      server.methods.services.articles.list(user, query, (err, articles) => {
        if (err) return replyHelper.constructErrorResponse(err, h)
        return articles
      })
    },
    /**
     * GET /api/articles/feed
     */
    getArticlesFeed (request, h) {
      let user = request.auth.credentials.user
      let query = request.query

      server.methods.services.articles.feedFor(user, query, (err, articles) => {
        if (err) return replyHelper.constructErrorResponse(err, h)
        return articles
      })
    },
    /**
     * GET /api/articles/{slug}
     * @param {*} request
     * @param {*} reply
     */
    getArticle (request, h) {
      var article = request.pre.article.toJSONFor(null)
      if (request.auth.isAuthenticated) {
        article = request.pre.article.toJSONFor(request.auth.credentials.user)
      }
      return {
        article
      }
    },
    /**
     * POST /api/articles
     * @param {*} request
     * @param {*} reply
     */
    createArticle (request, h) {
      server.methods.services.articles.create(
        request.auth.credentials.user,
        request.payload.article,
        (err, article) => {
          if (err) return replyHelper.constructErrorResponse(err, h)
          return h.response({
            article: article.toJSONFor(request.auth.credentials.user)
          }).type('application/json').code(201)
        })
    },
    /**
     * PUT /api/articles/{slug}
     * @param {*} request
     * @param {*} reply
     */
    updateArticle (request, h) {
      server.methods.services.articles.update(
        request.pre.article,
        request.payload.article,
        (err, article) => {
          if (err) return replyHelper.constructErrorResponse(err, h)
          return {
            article: article.toJSONFor(request.auth.credentials.user)
          }
        })
    },
    /**
     * DELETE /api/articles/{slug}
     * @param {*} request
     * @param {*} reply
     */
    deleteArticle (request, h) {
      server.methods.services.articles.delete(
        request.pre.article,
        (err, article) => {
          if (err) return replyHelper.constructErrorResponse(err, h)
          return h.response().code(204)
        })
    },
    /**
     * POST /api/articles/{slug}/favorite
     * @param {*} request
     * @param {*} reply
     */
    favoriteArticle (request, h) {
      server.methods.services.users.favoriteArticle(
        request.auth.credentials.user,
        request.pre.article,
        (err, article) => {
          if (err) return replyHelper.constructErrorResponse(err, h)
          return {
            article: article.toJSONFor(request.auth.credentials.user)
          }
        })
    },
    /**
     * DELETE /api/articles/{slug}/favorite
     * @param {*} request
     * @param {*} reply
     */
    unfavoriteArticle (request, reply) {
      server.methods.services.users.unfavoriteArticle(
        request.auth.credentials.user,
        request.pre.article,
        (err, article) => {
          if (err) return replyHelper.constructErrorResponse(err, reply)
          return {
            article: article.toJSONFor(request.auth.credentials.user)
          }
        })
    },
    /**
     * GET /api/articles/{slug}/comments
     * @param {*} request
     * @param {*} reply
     */
    getComments (request, h) {
      server.methods.services.comments.getCommentsFor(request.pre.article, (err, comments) => {
        if (err) return replyHelper.constructErrorResponse(err, h)
        if (request.auth.isAuthenticated) {
          return {
            comments: comments.map(c => c.toJSONFor(request.auth.credentials.user))
          }
        }
        return {
          comments: comments.map(c => c.toJSONFor(null))
        }
      })
    },
    /**
     * POST /api/articles/{slug}/comments
     * @param {*} request
     * @param {*} reply
     */
    addComment (request, h) {
      server.methods.services.articles.addComment(
        request.pre.article,
        request.auth.credentials.user,
        request.payload.comment,
        (err, comment) => {
          if (err) return replyHelper.constructErrorResponse(err, h)
          return h.response({
            comment: comment.toJSONFor(request.auth.credentials.user)
          }).type('application/json').code(201)
        })
    },
    /**
     * DELETE /api/articles/{slug}/comments/{commentID}
     * @param {*} request
     * @param {*} reply
     */
    deleteComment (request, h) {
      server.methods.services.articles.deleteComment(
        request.pre.article,
        request.pre.comment._id,
        (err, _) => {
          if (err) return replyHelper.constructErrorResponse(err, h)
          return h.response().code(204)
        })
    }
  }
}
