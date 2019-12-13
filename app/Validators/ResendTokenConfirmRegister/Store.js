'use strict'

const Antl = use('Antl')

class ResendTokenConfirmRegisterStore {
  get validateAll () {
    return true
  }

  get rules () {
    return {
      email: 'required|exists:users,email'
    }
  }

  get messages () {
    return Antl.list('validation')
  }
}

module.exports = ResendTokenConfirmRegisterStore
