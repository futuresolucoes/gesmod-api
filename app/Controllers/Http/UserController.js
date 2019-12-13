'use strict'

const crypto = require('crypto')

const Kue = use('Kue')
const jobToSendEmailConfirmRegister = use('App/Jobs/SendMailToConfirmRegister')

/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/auth/src/Schemes/Session')} AuthSession */

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
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

      const newUser = await User.create(dataToNewUser)

      const token = crypto.randomBytes(32).toString('hex')

      const infoToEmail = {
        name: newUser.name,
        email: newUser.email,
        token
      }

      Kue.dispatch(jobToSendEmailConfirmRegister.key, infoToEmail, { attemps: 3 })

      await newUser.tokens().create({
        token,
        type: 'confirm_register'
      })

      return response.status(201).send(newUser)
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
