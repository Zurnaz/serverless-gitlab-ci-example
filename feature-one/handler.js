module.exports.AWS = require('aws-sdk')
const generatejson = require('../utils/utils').generateJsonResponse

module.exports.get = async (event, context) => {
  const response = 'Feature one response'
  const generated = generatejson(200, response)
  return generated
}
