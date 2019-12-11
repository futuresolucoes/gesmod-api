'use strict'

class ConfirmRegisterStore {
  get rules () {
    return {
      token: 'required|exists:tokens,token'
    }
  }
}

module.exports = ConfirmRegisterStore
