const { test, trait } = use('Test/Suite')('Session')

/** @type {import('@adonisjs/lucid/src/Factory')} */
const Factory = use('Factory')

trait('DatabaseTransactions')
trait('Test/ApiClient')

const sessionPayloadToTest = {
  email: 'suporte@futuresolucoes.com.br',
  password: '12345678'
}

test('it should return JWT token and user data without password',
  async ({ client, assert }) => {
    const sessionPayloadToTest = {
      email: 'suporte@futuresolucoes.com.br',
      password: '12345678'
    }
    await Factory
      .model('App/Models/User')
      .create(sessionPayloadToTest)

    const response = await client.post('/session')
      .send(sessionPayloadToTest)
      .end()

    response.assertStatus(200)
    assert.exists(response.body.token)
    assert.exists(response.body.user)
    assert.isUndefined(response.body.user.password)
  })

test('it should return status 401 when password does not match in session create',
  async ({ client }) => {
    const payloadWithWrongPassword = {
      email: 'suporte@futuresolucoes.com.br',
      password: '123456789'
    }

    await Factory
      .model('App/Models/User')
      .create(sessionPayloadToTest)

    const response = await client.post('/session')
      .send(payloadWithWrongPassword)
      .end()

    response.assertStatus(401)
    response.assertText('Password incorrect')
  }
)
