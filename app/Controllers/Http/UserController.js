'use strict'

const crypto = require('crypto')

const Mail = use('Mail')
const Env = use('Env')

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

      await Mail.send(
        ['mails.confirm_email_new_user', 'mails.confirm_email_new_user-text'],
        {
          name: dataToNewUser.name,
          email: dataToNewUser.email,
          token: dataToNewUser.token,
          link: `${Env.get('URL_FRONT')}confirm?token=${dataToNewUser.token}`
        },
        message => {
          message
            .to(dataToNewUser.email)
            .from('noreply@futuresolucoes.com.br', 'Equipe Future Soluções')
            .subject('Confirm your registration')
        }
      )

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
