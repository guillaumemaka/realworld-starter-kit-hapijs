module.exports = (server) => {
  const replyHelper = require('../helpers')

  function constructProfileResponse (user, authenticatedUser = null) {
    let profile = { user: user.toProfileJSONFor(authenticatedUser) }
    return profile
  }

  return {
    /**
     * GET /api/profiles/{username}
     * @param {*} request
     * @param {*} reply
     */
    getProfile (request, h) {
      var username = request.params.username
      server.methods.services.users.getByUsername(username, (err, user) => {
        if (err) return replyHelper.constructErrorResponse(err, h)

        if (!user) {
          return h.response({
            errors: {
              404: [`User with username "${username} not found !"`]
            }
          }).type('application/json').code(422)
        }

        if (request.auth.isAuthenticated) {
          return constructProfileResponse(user, request.auth.credentials.user)
        }

        return constructProfileResponse(user)
      })
    },
    /**
     * POST /api/profiles/{username}/follow
     * @param {*} request
     * @param {*} reply
     */
    followProfile (request, h) {
      let username = request.params.username
      let currentUser = request.auth.credentials.user

      server.methods.services.users.getByUsername(username, (err, userToFollow) => {
        if (err) return replyHelper.constructErrorResponse(err, h)

        if (!userToFollow) {
          return h.response({
            errors: {
              404: [`User with username "${username} not found !"`]
            }
          }).code(404)
        }

        server.methods.services.users.follow(currentUser, userToFollow._id, (err, me) => {
          if (err) return replyHelper.constructErrorResponse(err, h)
          return constructProfileResponse(userToFollow, me)
        })
      })
    },
    /**
     * DELETE /api/profiles/{username}/follow
     * @param {*} request
     * @param {*} reply
     */
    unfollowProfile (request, h) {
      let username = request.params.username
      let currentUser = request.auth.credentials.user

      server.methods.services.users.getByUsername(username, (err, userToFollow) => {
        if (err) return replyHelper.constructErrorResponse(err, h)

        if (!userToFollow) {
          return h.response({
            errors: {
              404: [`User with username "${username} not found !"`]
            }
          }).code(404)
        }

        server.methods.services.users.unfollow(currentUser, userToFollow._id, (err, me) => {
          if (err) return replyHelper.constructErrorResponse(err, h)
          return constructProfileResponse(userToFollow, me)
        })
      })
    }
  }
}
