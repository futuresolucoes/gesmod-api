'use strict'

const Antl = use('Antl')

class SessionStore {
  get validateAll () {
    return true
  }

  get rules () {
    return {
      email: 'required|exists:users,email|email|max:100',
      password: 'required|string|min:8|max:32'
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

module.exports = SessionStore
