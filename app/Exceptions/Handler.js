'use strict'

const BaseExceptionHandler = use('BaseExceptionHandler')
const Env = use('Env')
const Youch = use('Youch')

/**
 * This class handles all exceptions thrown during
 * the HTTP request lifecycle.
 *
 * @class ExceptionHandler
 */
class ExceptionHandler extends BaseExceptionHandler {
  /**
   * Handle exception thrown during the HTTP lifecycle
   *
   * @method handle
   *
   * @param  {Object} error
   * @param  {Object} options.request
   * @param  {Object} options.response
   *
   * @return {void}
   */
  async handle (error, { request, response }) {
    if (error.name === 'ValidationException') {
      return response.status(error.status).send(error.messages)
    }

    if (error.name === 'CustomException') {
      return response.status(error.status).send(error.message)
    }

    if (error.name === 'InvalidJwtToken') {
      return response.status(error.status)
        .send({ Error: { message: 'Invalid or unsent token' } })
    }

    // if (error.message.includes('ModelNotFoundException')) {
    //   const getNameModel = error.message.split(' ')

    //   return response.status(400)
    //     .send({ Error: { message: `Not found ${getNameModel[7]}` } })
    // }

    if (Env.get('NODE_ENV') === 'development' || Env.get('NODE_ENV') === 'testing') {
      const youch = new Youch(error, request.request)
      const errorJSON = await youch.toJSON()
      return response.status(error.status).send(errorJSON)
    }

    return response.status(error.status).send('Contact support')
  }

  /**
   * Report exception for logging or debugging.
   *
   * @method report
   *
   * @param  {Object} error
   * @param  {Object} options.request
   *
   * @return {void}
   */
  async report (error, { request }) {
    // if (Env.get('NODE_ENV') === 'testing') {
    //   return
    // }
    console.log(error)
  }
}

module.exports = ExceptionHandler
