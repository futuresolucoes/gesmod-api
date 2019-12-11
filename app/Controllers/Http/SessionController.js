'use strict'

/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const User = use('App/Models/User')

class SessionController {
  async store ({ request, response, auth }) {
    try {
      const { email, password } = request.only([
        'email',
        'password'
      ])

      const { token } = await auth.attempt(email, password)

      const user = await User.findBy('email', email)

      return { user, token }
    } catch (error) {
      if (error.passwordField) {
        return response.status(401).send('Password incorrect')
      }
    }
  }
}

module.exports = SessionController
