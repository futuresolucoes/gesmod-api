const { test, trait } = use('Test/Suite')('Forgot Password')

/** @type {import('@adonisjs/lucid/src/Factory')} */
const Factory = use('Factory')

trait('DatabaseTransactions')
trait('Test/ApiClient')

test('it should return status 201, send e-mail to recovery password',
  async ({ client, assert }) => {
    const user = await Factory
      .model('App/Models/User')
      .create()

    const response = await client.post('/forgot_password')
      .send({ email: user.email })
      .end()

    const countTokens = await user.tokens().where('type', 'forgot_password').count('* as total')

    response.assertStatus(201)
    response.assertText('Email sent.')
    assert.equal(1, countTokens[0].total)
  })
