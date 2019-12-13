'use strict'

/** @type {typeof import('@adonisjs/framework/src/Route/Manager')} */
const Route = use('Route')

Route.post('/session', 'SessionController.store')
  .validator('Session/Store')

Route.post('/confirm_register', 'ConfirmRegisterController.store')
  .validator('ConfirmRegister/Store')

Route.post('/reset_password', 'ResetPasswordController.store')
  .validator('ResetPassword/Store')

Route.post('/resend_token_confirm_register', 'ResendTokenConfirmRegisterController.store')
  .validator('ResendTokenConfirmRegister/Store')

Route.post('/forgot_password', 'ForgotPasswordController.store')
  .validator('ForgotPassword/Store')

Route.resource('user', 'UserController')
  .apiOnly()
  .validator(new Map([
    [['user.store'], ['User/Store']]
  ]))
