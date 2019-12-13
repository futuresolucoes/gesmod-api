'use strict'

const Env = use('Env')
const Mail = use('Mail')

class SendMailToForgotPassword {
  // If this getter isn't provided, it will default to 1.
  // Increase this number to increase processing concurrency.
  static get concurrency () {
    return 1
  }

  // This is required. This is a unique key used to identify this job.
  static get key () {
    return 'SendMailToForgotPassword-job'
  }

  // This is where the work is done.
  async handle ({ name, email, token }) {
    const link = `${Env.get('URL_FRONT')}`
    const linkWithToken = `${Env.get('URL_FRONT')}reset_password?token=${token}`

    await Mail.send(
      ['mails.forgot_password', 'mails.forgot_password-text'],
      {
        name,
        email,
        token,
        link,
        linkWithToken
      },
      message => {
        message
          .to(email)
          .from('noreply@futuresolucoes.com.br', 'Equipe Future Soluções')
          .subject('Pedido de recuperação de senha [ Future Soluções ]')
      }
    )
  }
}

module.exports = SendMailToForgotPassword
