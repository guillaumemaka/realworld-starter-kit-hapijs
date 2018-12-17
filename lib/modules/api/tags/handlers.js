const replyHelper = require('../helpers')

module.exports = (server) => {
  return {
    /**
     * GET /api/tags
     * @param {*} request
     * @param {*} reply
     */
    getTags (request, reply) {
      server.methods.services.tags.getAll((err, tags) => {
        if (err) return replyHelper.constructErrorResponse(err, reply)
        return { tags }
      })
    }
  }
}
