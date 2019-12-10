'use strict'

const Mail = use('Mail')
const Env = use('Env')

class SendMailWithPasswordToLogin {
  // If this getter isn't provided, it will default to 1.
  // Increase this number to increase processing concurrency.
  static get concurrency () {
    return 1
  }

  // This is required. This is a unique key used to identify this job.
  static get key () {
    return 'SendMailWithPasswordToLogin-job'
  }

  // This is where the work is done.
  async handle ({ name, password, email }) {
    const link = `${Env.get('URL_FRONT')}`

    await Mail.send(
      ['mails.send_first_password', 'mails.send_first_password-text'],
      {
        name: name,
        password: password,
        link
      },
      message => {
        message
          .to(email)
          .from('noreply@futuresolucoes.com.br', 'Equipe Future Soluções')
          .subject('Parabéns, cadastro confirmado. [ Future Soluções ]')
      }
    )
  }
}

module.exports = SendMailWithPasswordToLogin
