'use strict'

/** @type {typeof import('@adonisjs/framework/src/Route/Manager')} */
const Route = use('Route')

Route.post('/session', 'SessionController.store')
  .validator('Session/Store')

Route.resource('user', 'UserController')
  .apiOnly()
  .validator(new Map([
    [['user.store'], ['User/Store']]
  ]))
