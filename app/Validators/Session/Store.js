'use strict'

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
    return {
      'email.max': 'max validation failed on email, expected max 100 characters',
      'password.min': 'min validation failed on password, expected min 8 characters',
      'password.max': 'max validation failed on password, expected max 32 characters'
    }
  }

  get sanitizationRules () {
    return {
      email: 'normalize_email'
    }
  }
}

module.exports = SessionStore
