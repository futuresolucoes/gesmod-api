'use strict'

/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const User = use('App/Models/User')

class SessionController {
  async store ({ request, response, auth }) {
    const { email, password } = request.only([
      'email',
      'password'
    ])

    const user = await User.findByOrFail('email', email)

    const { token } = await auth.attempt(email, password)

    return { user, token }
  }
}

module.exports = SessionController
