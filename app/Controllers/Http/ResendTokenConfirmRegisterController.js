'use strict'

const crypto = require('crypto')

const Kue = use('Kue')
const jobToSendEmailConfirmRegister = use('App/Jobs/SendMailToConfirmRegister')

/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const User = use('App/Models/User')

class ResendTokenConfirmRegisterController {
  async store ({ request, response }) {
    try {
      const { email } = request.only(['email'])

      const user = await User.findByOrFail('email', email)

      if (user.is_confirmed) {
        return response.status(400).send('Email already confirmed')
      }

      await user.tokens().where('type', 'confirm_register').delete()

      const token = crypto.randomBytes(32).toString('hex')

      const infoToEmail = {
        name: user.name,
        email: user.email,
        token
      }

      Kue.dispatch(jobToSendEmailConfirmRegister.key, infoToEmail, { attemps: 3 })

      await user.tokens().create({
        token,
        type: 'confirm_register'
      })

      return response.status(201).send('Resubmitted email to confirm register')
    } catch (error) {
      throw new Error(error)
    }
  }
}

module.exports = ResendTokenConfirmRegisterController
