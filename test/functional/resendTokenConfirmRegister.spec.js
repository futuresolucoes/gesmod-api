const { test, trait } = use('Test/Suite')('Resend Token Confirm Register')

/** @type {import('@adonisjs/lucid/src/Factory')} */
const Factory = use('Factory')

trait('DatabaseTransactions')
trait('Test/ApiClient')
trait('Auth/Client')

test('it should return status 201 and the number of confirm register tokens equal to one',
  async ({ client, assert }) => {
    const user = await Factory.model('App/Models/User').create()
    const userToken = await Factory.model('App/Models/Token')
      .make({ type: 'confirm_register' })

    await user.tokens().save(userToken)

    const response = await client.post('/resend_token_confirm_register')
      .send({ email: user.email })
      .end()

    await user.reload()

    const countTokens = await user.tokens().where('type', 'confirm_register').count('* as total')

    response.assertStatus(201)
    response.assertText('Resubmitted email to confirm register')
    assert.equal(1, countTokens[0].total)
  })

test('it should return status 400 when user is already confirmed',
  async ({ client, assert }) => {
    const user = await Factory.model('App/Models/User').create({ is_confirmed: 1 })

    const response = await client.post('/resend_token_confirm_register')
      .send({ email: user.email })
      .end()

    response.assertStatus(400)
    response.assertText('Email already confirmed')
  })
