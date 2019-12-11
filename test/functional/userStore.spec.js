const { test, trait } = use('Test/Suite')('User')

/** @type {import('@adonisjs/lucid/src/Factory')} */
const Factory = use('Factory')

trait('DatabaseTransactions')
trait('Test/ApiClient')
trait('Auth/Client')

test('it should return status 401 when user dont is admin',
  async ({ client }) => {
    const payloadToTest = {
      name: 'nome demonstração',
      email: 'demo@email.com'
    }

    const userLoged = await Factory
      .model('App/Models/User')
      .create({ is_admin: 0 })

    const response = await client.post('/user')
      .send(payloadToTest)
      .loginVia(userLoged, 'jwt')
      .end()

    response.assertStatus(401)
    response.assertText('Without permission to create user.')
  })

test('it should return the user ID when the user is created',
  async ({ client, assert }) => {
    const payloadToTest = {
      name: 'nome demonstração',
      email: 'demo@email.com'
    }

    const userLoged = await Factory
      .model('App/Models/User')
      .create({ is_admin: 1 })

    const response = await client.post('/user')
      .send(payloadToTest)
      .loginVia(userLoged, 'jwt')
      .end()

    response.assertStatus(200)
    assert.exists(response.body.id)
  })
