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

test('it should return the user ID when the user is created by an admin user',
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

test('it should return status 400 when NAME parameter does not passed',
  async ({ client }) => {
    const payloadToTest = {
      email: 'demo5@email.com',
      cpf: '00077711587',
      phone: '54992663344'
    }

    const response = await client.post('/user')
      .send(payloadToTest)
      .end()

    response.assertStatus(400)
    response.assertJSONSubset([
      {
        message: 'required validation failed on name',
        field: 'name',
        validation: 'required'
      }
    ])
  })

test('it should return status 400 when EMAIL parameter does not passed',
  async ({ client }) => {
    const payloadToTest = {
      name: 'nome demonstração',
      cpf: '00077711666',
      phone: '54992663344'
    }

    const response = await client.post('/user')
      .send(payloadToTest)
      .end()

    response.assertStatus(400)
    response.assertJSONSubset([
      {
        message: 'required validation failed on email',
        field: 'email',
        validation: 'required'
      }
    ])
  })

test('it should return status 400 when EMAIL parameter already exists',
  async ({ client }) => {
    const payloadToTest = await Factory
      .model('App/Models/User')
      .create()

    const response = await client.post('/user')
      .send(payloadToTest.toJSON())
      .end()

    response.assertStatus(400)
    response.assertJSONSubset([
      {
        message: 'unique validation failed on email',
        field: 'email',
        validation: 'unique'
      }
    ])
  })

test('it should return status 400 when CPF parameter already exists',
  async ({ client }) => {
    const payloadToTest = await Factory
      .model('App/Models/User')
      .create()

    const response = await client.post('/user')
      .send(payloadToTest.toJSON())
      .end()

    response.assertStatus(400)
    response.assertJSONSubset([
      {
        message: 'unique validation failed on cpf',
        field: 'cpf',
        validation: 'unique'
      }
    ])
  })

test('it should return with token and token_created_at when created user',
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
    assert.exists(response.body.token)
    assert.exists(response.body.token_created_at)
  }
)
