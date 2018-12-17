const register = async (server, options) => {
  let services = [].concat(
    require('./users'),
    require('./articles'),
    require('./comments'),
    require('./tags')
  )
  server.method(services)
}

module.exports = { register, pkg: require('./package.json') }
