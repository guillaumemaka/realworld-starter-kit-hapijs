// const hapiJWT = require('hapi-auth-jwt2')
const config = require('../../config')
const mongoose = require('mongoose')

const register = async (server, options) => {
  var validateFunc = async (decoded, request, callback) => {
    var id = mongoose.Types.ObjectId(decoded.id)

    server.app.db.User.findById(id, (err, user) => {
      if (err) return callback(err, false)

      if (!user) {
        return callback(null, false)
      }

      return callback(null, true, {
        user
      })
    })
  }

  server.auth.strategy('jwt', 'jwt', {
    key: config.auth.secret,
    validate: validateFunc,
    tokenType: config.auth.tokenType,
    verifyOptions: config.auth.verifyOptions
  })
}

module.exports = { register, pkg: require('./package.json') }
