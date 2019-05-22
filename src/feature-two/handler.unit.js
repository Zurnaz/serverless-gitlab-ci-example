const AWSMock = require('aws-sdk-mock')
const AWS = require('aws-sdk')
AWSMock.setSDKInstance(AWS)
const handler = require('./handler')
const generateJsonResponse = require('../utils/utils').generateJsonResponse

beforeAll(() => {
  handler.AWS = AWS
  AWSMock.mock('DynamoDB.DocumentClient', 'scan', async (params) => {
    return 'success'
  })
  AWSMock.mock('DynamoDB.DocumentClient', 'put', async (params) => {
    return 'success'
  })
  AWSMock.mock('DynamoDB.DocumentClient', 'get', async (params) => {
    return 'success'
  })
  AWSMock.mock('DynamoDB.DocumentClient', 'delete', async (params) => {
    return 'success'
  })
})

afterAll(() => {
  AWSMock.restore()
})

describe('dynamo', () => {
  beforeAll(() => {
    handler.dynamo = new AWS.DynamoDB.DocumentClient()
  })
  it('scans', async () => {
    const expected = generateJsonResponse(200, 'success')
    return expect(handler.scan()).resolves.toEqual(expected)
  })
  it('puts', async () => {
    const expected = generateJsonResponse(200, 'success')
    return expect(handler.put()).resolves.toEqual(expected)
  })
  it('gets', async () => {
    const expected = generateJsonResponse(200, 'success')
    return expect(handler.get()).resolves.toEqual(expected)
  })
  it('deletes', async () => {
    const expected = generateJsonResponse(200, 'success')
    return expect(handler.delete()).resolves.toEqual(expected)
  })
})
