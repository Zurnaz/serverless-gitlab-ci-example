const handler = require('./handler')

beforeAll(() => {})

afterAll(() => {})

describe('get function', () => {
  it('returns the correct response', async (endTest) => {
    const expectedBody = JSON.stringify({ result: 'Feature one response' })
    handler.get({}, {}, (err, response) => {
      expect(response.statusCode).not.toBe(null)
      expect(response.body).not.toBe(null)
      expect(response.body).toEqual(expectedBody)
      expect(err).toBe(null)
      endTest()
    })
  })
})

describe('post function', () => {
  it('Validates input schema gets', async (endTest) => {
    const event = {
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ text: 'This is text' }),
    }
    handler.post(event, {}, (err, response) => {
      expect(response.body).toEqual(JSON.stringify({ result: 'This is text' }))
      expect(err).toBe(null)
      endTest()
    })
  })

  it('Causes an input schema related error', async (endTest) => {
    handler.post({}, {}, (err, response) => {
      expect(err).not.toBe(null)
      // TODO fix this, no clue whats going wrong
      expect(err.message).toEqual('Event object failed validation')
      endTest()
    })
  })

  it('Causes an output schema related error', async (endTest) => {
    const event = {
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ text: 0 }),
    }
    handler.post(event, {}, (err, response) => {
      expect(err).not.toBe(null)
      // TODO fix this, no clue whats going wrong
      expect(err.message).toEqual('Response object failed validation')
      endTest()
    })
  })
})
