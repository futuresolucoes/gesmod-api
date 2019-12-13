const { test, trait } = use('Test/Suite')('Reset Password')

const { subHours, format, parseISO } = require('date-fns')

/** @type {import('@adonisjs/lucid/src/Factory')} */
const Factory = use('Factory')
const Database = use('Database')

trait('DatabaseTransactions')
trait('Test/ApiClient')

test('it should return status 200, 0 tokens type forgot_password and return token when try create session with new password',
  async ({ client, assert }) => {
    const user = await Factory.model('App/Models/User').create()
    const userToken = await Factory.model('App/Models/Token')
      .make({ type: 'forgot_password' })

    await user.tokens().save(userToken)

    const response = await client.post('/reset_password')
      .send({
        token: userToken.token,
        password: '11111111',
        password_confirmation: '11111111'
      })
      .end()

    const countTokens = await user.tokens()
      .where('type', 'forgot_password')
      .count('* as total')

    response.assertStatus(200)
    response.assertText('Password has been update')
    assert.equal(0, countTokens[0].total)

    const responseCreateSession = await client.post('/session')
      .send({
        email: user.email,
        password: '11111111'
      })
      .end()

    responseCreateSession.assertStatus(201)
    assert.exists(responseCreateSession.body.user)
    assert.exists(responseCreateSession.body.token)
  })

test('it should return status 400 when token has been expired',
  async ({ client }) => {
    const user = await Factory.model('App/Models/User').create()
    const userToken = await Factory.model('App/Models/Token').make({ type: 'forgot_password' })

    await user.tokens().save(userToken)

    const createdAtOfTokenWithSubHours = format(subHours(parseISO(userToken.created_at), 25), 'yyyy-MM-dd HH:mm:ss')

    await Database.table('tokens')
      .where('token', userToken.token)
      .update('created_at', createdAtOfTokenWithSubHours)

    await userToken.reload()

    const response = await client.post('/reset_password')
      .send({
        token: userToken.token,
        password: '11111111',
        password_confirmation: '11111111'
      })
      .end()

    response.assertStatus(400)
    response.assertText('Token has been expired.')
  })

test('it should return status 400 when type token not is equal forgot password',
  async ({ client }) => {
    const user = await Factory.model('App/Models/User').create()
    const userToken = await Factory.model('App/Models/Token').make({ type: 'refreshtoken' })

    await user.tokens().save(userToken)

    const response = await client.post('/reset_password')
      .send({
        token: userToken.token,
        password: '11111111',
        password_confirmation: '11111111'
      })
      .end()

    response.assertStatus(400)
    response.assertText('This token not is to reset password.')
  }
)
