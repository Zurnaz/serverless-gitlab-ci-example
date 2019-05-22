module.exports.AWS = require('aws-sdk')
const generatejson = require('../utils/utils').generateJsonResponse

module.exports.dynamo = new this.AWS.DynamoDB.DocumentClient()

module.exports.scan = async (event, context) => {
  const params = {
    TableName: process.env.DYNAMODB_TABLE_NAME,
  }
  return this.dynamo
    .scan(params)
    .promise()
    .then((response) => {
      return generatejson(200, response)
    })
    .catch((error) => {
      console.log(error)
      return generatejson(500, 'error')
    })
}

module.exports.put = async (event, context) => {
  const params = {
    TableName: process.env.DYNAMODB_TABLE_NAME,
    Item: { PK: '123', SK: 'item' },
  }
  return this.dynamo
    .put(params)
    .promise()
    .then((response) => {
      return generatejson(200, response)
    })
    .catch((error) => {
      console.log(error)
      return generatejson(500, 'error')
    })
}

module.exports.get = async (event, context) => {
  const params = {
    TableName: process.env.DYNAMODB_TABLE_NAME,
    Key: {
      PK: '123',
      SK: 'item',
    },
  }
  return this.dynamo
    .get(params)
    .promise()
    .then((response) => {
      return generatejson(200, response)
    })
    .catch((error) => {
      console.log(error)
      return generatejson(500, 'error')
    })
}

module.exports.delete = async (event, context) => {
  const params = {
    TableName: process.env.DYNAMODB_TABLE_NAME,
    Key: {
      PK: { S: '123' },
    },
  }
  return this.dynamo
    .delete(params)
    .promise()
    .then((response) => {
      return generatejson(200, response)
    })
    .catch((error) => {
      console.log(error)
      return generatejson(500, 'error')
    })
}
