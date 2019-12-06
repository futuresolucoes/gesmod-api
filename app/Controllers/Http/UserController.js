'use strict'

const crypto = require('crypto')

const Kue = use('Kue')
const jobToSendEmailConfirmRegister = use('App/Jobs/SendMailToConfirmRegister')

/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/auth/src/Schemes/Session')} AuthSession */

const User = use('App/Models/User')

class UserController {
  async index ({ request, response }) {
  }

  async store ({ request, response, auth }) {
    try {
      const dataToNewUser = request.only(['name', 'email', 'cpf', 'phone'])

      const logedUser = await auth.getUser()

      if (!logedUser.is_admin) {
        return response.status(401).send('Without permission to create user.')
      }

      dataToNewUser.token = crypto.randomBytes(10).toString('hex')
      dataToNewUser.token_created_at = new Date()

      Kue.dispatch(jobToSendEmailConfirmRegister.key, dataToNewUser, { attemps: 3 })

      const newUser = await User.create(dataToNewUser)

      return newUser
    } catch (error) {
      throw new Error(error)
    }
  }

  async show ({ params, request, response }) {
  }

  async update ({ params, request, response }) {
  }

  async destroy ({ params, request, response }) {
  }
}

module.exports = UserController
