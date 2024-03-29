'use strict'

/*
|--------------------------------------------------------------------------
| Factory
|--------------------------------------------------------------------------
|
| Factories are used to define blueprints for database tables or Lucid
| models. Later you can use these blueprints to seed your database
| with dummy data.
|
*/

/** @type {import('@adonisjs/lucid/src/Factory')} */
const Factory = use('Factory')

Factory.blueprint('App/Models/User', (faker, i, data = {}) => {
  return {
    name: faker.name(),
    email: faker.email(),
    cpf: faker.string({ length: 11, numeric: true }),
    is_admin: faker.integer({ min: 0, max: 1 }),
    ...data
  }
})

Factory.blueprint('App/Models/Token', (faker, i, data = {}) => {
  return {
    token: faker.string({ length: 11, numeric: true }),
    type: data.type || 'refreshtoken'
  }
})
