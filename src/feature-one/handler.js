module.exports.AWS = require('aws-sdk')
// module.exports = require('@iopipe/iopipe')
const middy = require('middy')
const { validator, jsonBodyParser } = require('middy/middlewares')

// Middy example grabbed from https://middy.js.org/docs/middlewares.html
const outSchema = {
  required: ['body', 'statusCode'],
  properties: {
    body: {
      type: 'string',
    },
    statusCode: {
      type: 'number',
    },
  },
}

const get = middy(async (event, context) => {
  const response = {
    body: JSON.stringify({ result: 'Feature one response' }),
    statusCode: 200,
  }
  return response
})

get.use(validator({ outputSchema: outSchema }))

const post = middy(async (event, context) => {
  const response = {
    body: JSON.stringify({ result: event.body.text }),
    statusCode: 200,
  }
  if (event.body.text === 0) {
    response.statusCode = 'text'
  }
  return response
})

const inSchema = {
  required: ['body'],
  properties: {
    body: {
      type: 'string',
    },
  },
}
post.use(validator({ inputSchema: inSchema, outputSchema: outSchema }))
post.use(jsonBodyParser())
module.exports = { get, post }
