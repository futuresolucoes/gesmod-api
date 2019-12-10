'use strict'

const { addHours, isBefore, parseISO } = require('date-fns')

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class Token extends Model {
  expired () {
    const createdAt = typeof (this.created_at) !== 'string'
      ? parseISO(this.created_at.toJSON()) : parseISO(this.created_at)

    const expirationDateTimeToken = addHours(createdAt, 24)

    if (!isBefore(new Date(), expirationDateTimeToken)) {
      return true
    }

    return false
  }
}

module.exports = Token
