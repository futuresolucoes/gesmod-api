'use strict'

const Antl = use('Antl')

class ResetPasswordStore {
  get validateAll () {
    return true
  }

  get rules () {
    return {
      token: 'required|exists:tokens,token',
      password: 'confirmed'
    }
  }

  get messages () {
    return Antl.list('validation')
  }
}

module.exports = ResetPasswordStore
