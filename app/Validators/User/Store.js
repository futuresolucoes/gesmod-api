'use strict'

class UserStore {
  get validateAll () {
    return true
  }

  get rules () {
    return {
      name: 'required|string|min:3|max:100',
      email: 'required|email|max:60|unique:users,email',
      cpf: 'string|min:11|max:11|unique:users,cpf',
      phone: 'string|min:10|max:20'
    }
  }

  get messages () {
    return {
      'name.min': 'min validation failed on first_name, expected min 3 characters',
      'name.max': 'max validation failed on first_name, expected max 60 characters',
      'cpf.min': 'min validation failed on cpf, expected min 11 characters',
      'cpf.max': 'max validation failed on cpf, expected max 11 characters',
      'email.max': 'max validation failed on email, expected max 100 characters',
      'phone.min': 'min validation failed on phone, expected min 10 characters',
      'phone.max': 'max validation failed on phone, expected max 20 characters'
    }
  }

  get sanitizationRules () {
    return {
      name: 'escape',
      cpf: 'escape',
      email: 'normalize_email',
      phone: 'escape'
    }
  }
}

module.exports = UserStore
