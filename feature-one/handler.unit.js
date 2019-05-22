const handler = require('./handler')
const generateJsonResponse = require('../utils/utils').generateJsonResponse

beforeAll(() => {})

afterAll(() => {})

describe('get function', () => {
  it('returns the correct response', async () => {
    const expectedBody = generateJsonResponse(200, 'Feature one response')
    expect.assertions(1)
    try {
      const data = await handler.get()
      expect(data).toEqual(expectedBody)
    } catch (e) {
      console.log(e)
    }
  })
})
