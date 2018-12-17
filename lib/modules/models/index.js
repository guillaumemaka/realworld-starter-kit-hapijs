const mongoose = require('mongoose')
const config = require('../../config')

const register = async (server, options, next) => {
  try {
    let db = await mongoose.connect(config.database.uri, config.database.options)
    require('./User')
    require('./Comment')
    require('./Article')
    server.app.db = {
      link: db.db,
      User: db.model('User'),
      Article: db.model('Article'),
      Comment: db.model('Comment')
    }
  } catch (error) {
    console.log(error)
  }
}

module.exports = { register, pkg: require('./package.json') }
