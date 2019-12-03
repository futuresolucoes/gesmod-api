'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class UserSchema extends Schema {
  up () {
    this.create('users', (table) => {
      table.increments()
      table.string('name', 60).notNullable()
      table.string('email', 100).notNullable().unique()
      table.string('cpf', 14).unique()
      table.string('password', 60)
      table.boolean('is_admin').defaultTo(0)
      table.boolean('email_is_confirmed').defaultTo(0)
      table.string('token')
      table.datetime('token_created_at')
      table.timestamps()
    })
  }

  down () {
    this.drop('users')
  }
}

module.exports = UserSchema
