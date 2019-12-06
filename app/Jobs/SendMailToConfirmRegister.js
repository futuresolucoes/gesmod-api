'use strict'

const Env = use('Env')
const Mail = use('Mail')

class SendMailToConfirmRegister {
  // If this getter isn't provided, it will default to 1.
  // Increase this number to increase processing concurrency.
  static get concurrency () {
    return 1
  }

  // This is required. This is a unique key used to identify this job.
  static get key () {
    return 'SendMailToConfirmRegister-job'
  }

  // This is where the work is done.
  async handle ({ name, email, token }) {
    const link = `${Env.get('URL_FRONT')}confirm?token=${token}`

    await Mail.send(
      ['mails.confirm_new_user', 'mails.confirm_new_user-text'],
      {
        name,
        email,
        token,
        link
      },
      message => {
        message
          .to(email)
          .from('noreply@futuresolucoes.com.br', 'Equipe Future Soluções')
          .subject('Confirme seu cadastro [ Future Soluções ]')
      }
    )
  }
}

module.exports = SendMailToConfirmRegister
