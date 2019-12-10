'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class UserSchema extends Schema {
  up () {
    this.create('users', (table) => {
      table.increments()
      table.string('name', 60).notNullable()
      table.string('email', 100).notNullable().unique()
      table.string('password', 60)
      table.string('cpf', 11).unique()
      table.string('phone', 20)
      table.boolean('is_admin').defaultTo(0)
      table.boolean('is_active').defaultTo(0)
      table.timestamps()
    })
  }

  down () {
    this.drop('users')
  }
}

module.exports = UserSchema
