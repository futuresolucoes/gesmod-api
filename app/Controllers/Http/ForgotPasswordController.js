'use strict'
const crypto = require('crypto')
const Kue = use('Kue')
const jobToSendMailToForgotPassword = use('App/Jobs/SendMailToForgotPassword')

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const User = use('App/Models/User')

class ForgotPasswordController {
  async store ({ request, response }) {
    try {
      const { email } = request.only(['email'])

      const user = await User.findByOrFail('email', email)

      await user.tokens().where('type', 'forgot_password').delete()

      const token = crypto.randomBytes(32).toString('hex')

      const infoToEmail = {
        name: user.name,
        email: user.email,
        token
      }

      Kue.dispatch(jobToSendMailToForgotPassword.key, infoToEmail, { attemps: 3 })

      await user.tokens().create({
        token,
        type: 'forgot_password'
      })

      return response.status(201).send('Email sent.')
    } catch (error) {
      throw new Error(error)
    }
  }
}

module.exports = ForgotPasswordController
