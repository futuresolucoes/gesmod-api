const { test, trait } = use('Test/Suite')('Confirm Register')

const { subHours, format, parseISO } = require('date-fns')

/** @type {import('@adonisjs/lucid/src/Factory')} */
const Factory = use('Factory')
const Database = use('Database')

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const User = use('App/Models/User')

trait('DatabaseTransactions')
trait('Test/ApiClient')
trait('Auth/Client')

test('it should return status 200, active user, create password and delete token',
  async ({ client, assert }) => {
    const payloadToTest = {
      name: 'nome demonstração',
      email: 'demo@email.com'
    }

    const userLoged = await Factory
      .model('App/Models/User')
      .create({ is_admin: 1 })

    const responseRouteUser = await client.post('/user')
      .send(payloadToTest)
      .loginVia(userLoged, 'jwt')
      .end()

    const user = await User.find(responseRouteUser.body.id)

    const userToken = await user.tokens().first()

    const responseRouteConfirmRegister = await client.post('/confirm_register')
      .send({ token: userToken.token })
      .end()

    const userReload = await User.query()
      .where('id', user.id)
      .setVisible(['password'])
      .first()

    responseRouteConfirmRegister.assertStatus(200)
    assert.isNotNull(userReload.password)
    assert.isTrue(userReload.isActive())

    const tokenReload = await user.tokens().where('token', userToken.token).first()

    assert.isNull(tokenReload)
  })

test('it should return status 400 when token has been expired',
  async ({ client }) => {
    const user = await Factory.model('App/Models/User').create()
    const userToken = await Factory.model('App/Models/Token').make({ type: 'confirm_register' })

    await user.tokens().save(userToken)

    const createdAtOfTokenWithSubHours = format(subHours(parseISO(userToken.created_at), 25), 'yyyy-MM-dd HH:mm:ss')

    await Database.table('tokens')
      .where('token', userToken.token)
      .update('created_at', createdAtOfTokenWithSubHours)

    await userToken.reload()

    const response = await client.post('/confirm_register')
      .send({ token: userToken.token })
      .end()

    response.assertStatus(400)
    response.assertText('Token has been expired.')
  })

test('it should return status 400 when type token not is equal confirm register',
  async ({ client }) => {
    const user = await Factory.model('App/Models/User').create()
    const userToken = await Factory.model('App/Models/Token').make({ type: 'refreshtoken' })

    await user.tokens().save(userToken)

    const response = await client.post('/confirm_register')
      .send({ token: userToken.token })
      .end()

    response.assertStatus(400)
    response.assertText('This token not is to confirm register.')
  }
)

test('it should return status 400 when type token not is equal confirm register',
  async ({ client }) => {
    const response = await client.post('/confirm_register')
      .send()
      .end()

    response.assertStatus(400)
    response.assertError([
      {
        message: 'required validation failed on token',
        field: 'token',
        validation: 'required'
      }
    ])
  }
)

test('it should return status 404 when token not found',
  async ({ client }) => {
    const response = await client.post('/confirm_register')
      .send({ token: 'anystring' })
      .end()

    response.assertStatus(404)
    response.assertText('Token not found.')
  })
