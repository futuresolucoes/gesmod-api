'use strict'

const Antl = use('Antl')

class ForgotPasswordStore {
  get validateAll () {
    return true
  }

  get rules () {
    return {
      email: 'required|exists:users,email|email|max:100'
    }
  }

  get messages () {
    return Antl.list('validation')
  }

  get sanitizationRules () {
    return {
      email: 'normalize_email'
    }
  }
}

module.exports = ForgotPasswordStore
