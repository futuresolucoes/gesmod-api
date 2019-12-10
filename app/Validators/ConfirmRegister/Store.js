'use strict'

class ConfirmRegisterStore {
  get rules () {
    return {
      token: 'required'
    }
  }
}

module.exports = ConfirmRegisterStore
