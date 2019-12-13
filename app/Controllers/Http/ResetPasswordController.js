'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const User = use('App/Models/User')
/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Token = use('App/Models/Token')

class ResetPasswordController {
  async store ({ request, response }) {
    try {
      const { token: tokenReceived, password } = request.only(['token', 'password'])

      const token = await Token.findByOrFail('token', tokenReceived)

      if (token.type !== 'forgot_password') {
        return response.status(400).send('This token not is to reset password.')
      }

      if (token.expired()) {
        return response.status(400).send('Token has been expired.')
      }

      const user = await User.findOrFail(token.user_id)

      await user.tokens().where('type', 'forgot_password').delete()

      user.password = password

      await user.save()

      return 'Password has been update'
    } catch (error) {
      throw new Error(error)
    }
  }
}

module.exports = ResetPasswordController
