'use strict'

const Antl = use('Antl')

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
    return Antl.list('validation')
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
