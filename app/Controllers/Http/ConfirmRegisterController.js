'use strict'

const chance = use('Chance').Chance()
const Kue = use('Kue')
const jobToSendMailWithPasswordToLogin = use('App/Jobs/SendMailWithPasswordToLogin')

/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Token = use('App/Models/Token')
const User = use('App/Models/User')

class ConfirmRegisterController {
  async store ({ request, response }) {
    try {
      const { token: tokenReceived } = request.only(['token'])

      const token = await Token.findBy('token', tokenReceived)

      if (token.expired()) {
        return response.status(400).send('Token has been expired.')
      }

      if (token.type !== 'confirm_register') {
        return response.status(400).send('This token not is to confirm register.')
      }

      const user = await User.find(token.user_id)

      user.password = chance.string({ length: 8, alpha: true, numeric: true })
      user.is_active = true

      const infoToEmail = {
        name: user.name,
        email: user.email,
        password: user.password
      }

      Kue.dispatch(jobToSendMailWithPasswordToLogin.key, infoToEmail, { attemps: 3 })

      await user.save()

      return user
    } catch (error) {
      return response.status(500).send(error)
    }
  }
}

module.exports = ConfirmRegisterController
