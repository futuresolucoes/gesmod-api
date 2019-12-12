'use strict'

const Antl = use('Antl')


class ConfirmRegisterStore {
  get validateAll () {
    return true
  }

  get rules () {
    return {
      token: 'required|exists:tokens,token'
    }
  }

  get messages () {
    return Antl.list('validation')
  }
}

module.exports = ConfirmRegisterStore
