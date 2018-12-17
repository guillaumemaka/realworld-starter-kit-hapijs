const Routes = require('./routes')

const register = async (server, options) => {
  server.route(Routes(server))
}

module.exports = { register, pkg: require('./package.json') }
