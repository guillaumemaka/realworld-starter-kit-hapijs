const inputValidations = require('./validations/input')
const outputValidations = require('./validations/output')

module.exports = (server) => {
  const handlers = require('./handlers')(server)
  return [
    // Get current user
    {
      method: 'GET',
      path: '/user',
      options: {
        auth: 'jwt',
        validate: inputValidations.GetCurrentPayload,
        response: outputValidations.AuthOutputValidationConfig,
        description: 'Get the current user',
        tags: ['api', 'users']
      },
      handler: handlers.getCurrentUser
    },
    // Update user
    {
      method: 'PUT',
      path: '/user',
      options: {
        auth: 'jwt',
        validate: inputValidations.UpdatePayload,
        response: outputValidations.AuthOnPutOutputValidationConfig,
        description: 'Update user credentials',
        tags: ['api', 'users']
      },
      handler: handlers.updateUser
    },
    // Register
    {
      method: 'POST',
      path: '/users',
      options: {
        validate: inputValidations.RegisterPayload,
        response: outputValidations.AuthOnRegisterOutputValidationConfig,
        description: 'Register a user',
        tags: ['api', 'users']
      },
      handler: handlers.registerUser
    },
    // Login
    {
      method: 'POST',
      path: '/users/login',
      options: {
        validate: inputValidations.LoginPayload,
        response: outputValidations.AuthOnLoginOutputValidationConfig,
        description: 'Log in a user',
        tags: ['api', 'users']
      },
      handler: handlers.loginUser
    }
  ]
}
