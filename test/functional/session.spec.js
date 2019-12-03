const { test, trait } = use('Test/Suite')('Session')

/** @type {import('@adonisjs/lucid/src/Factory')} */
const Factory = use('Factory')

trait('DatabaseTransactions')
trait('Test/ApiClient')

const sessionPayload = {
  email: 'suporte@futuresolucoes.com.br',
  password: '12345678'
}

test('it should return JWT token when session created', async ({client, assert }) => {
  await Factory
    .model('App/Models/User')
    .create(sessionPayload)

  const response = await client.post('/sessions')
    .send(sessionPayload)
    .end()

  response.assertStatus(200)
  assert.exists(response.body.token)
})

test('it should return data user when session created', async({client}) => {
  const user = await Factory
    .model('App/Models/User')
    .create(sessionPayload)

  const response = await client.post('/sessions')
    .send(sessionPayload)
    .end()

  response.assertStatus(200)
  response.assertJSONSubset({
    user: {
      name: user.name,
      email: user.email,
      cpf: user.cpf,
      is_admin: user.is_admin
    }
  })
})

test('it should return without user password when session created', async ({client, assert}) => {
  await Factory
    .model('App/Models/User')
    .create(sessionPayload)

  const response = await client.post('/sessions')
    .send(sessionPayload)
    .end()

  assert.isUndefined(response.body.user.password);
})




