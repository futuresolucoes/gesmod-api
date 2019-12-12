'use strict'

const { addHours, isBefore } = require('date-fns')

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class Token extends Model {
  expired () {
    const expirationDateTimeToken = addHours(this.created_at, 24)

    if (!isBefore(new Date(), expirationDateTimeToken)) {
      return true
    }

    return false
  }
}

module.exports = Token
