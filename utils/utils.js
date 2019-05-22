const _ = require('lodash')

module.exports.generateJsonResponse = (statusCode, message) => {
  if (typeof statusCode !== 'number') {
    throw new Error('generateJsonResponse:: Invalid status code')
  }
  const prebody = typeof message === 'string' ? { message } : message
  const body = JSON.stringify(prebody)
  return {
    statusCode,
    headers: { 'Content-Type': 'application/json' },
    body: '' + body,
  }
}

module.exports.removeEmptyProps = (obj) => {
  for (const key in obj) {
    if (_.isEmpty(obj[key])) {
      delete obj[key]
    }
  }
  return obj
}

module.exports.removeEmptyPropsDeep = (obj) => {
  for (const prop in obj) {
    if (
      (!_.isString(obj[prop]) &&
        !_.isArray(obj[prop]) &&
        !_.isObject(obj[prop]) &&
        obj[prop] !== null) ||
      _.isDate(obj[prop])
    ) {
      // Do nothing
    } else if (_.isEmpty(obj[prop])) {
      delete obj[prop]
    } else if (_.isArray(obj[prop])) {
      obj[prop] = obj[prop].filter((arrayItem) => {
        if (_.isEmpty(arrayItem)) {
          return false
        } else if (typeof arrayItem === 'object') {
          arrayItem = this.removeEmptyPropsDeep(arrayItem)
          if (_.isEmpty(arrayItem)) {
            return false
          }
        }
        return true
      })
      if (_.isEmpty(obj[prop])) {
        delete obj[prop]
      }
    } else if (typeof obj[prop] === 'object') {
      // if prop an object recursively remove
      obj[prop] = this.removeEmptyPropsDeep(obj[prop])
      // if it is now empty delete it
      if (_.isEmpty(obj[prop])) {
        delete obj[prop]
      }
    }
  }
  return obj
}

module.exports.checkForEmptyPropertiesInObject = (obj) => {
  for (const prop in obj) {
    if (_.isEmpty(obj[prop])) {
      return false
    }
  }
  return true
}

module.exports.checkForEmptyPropsInNestedObject = (obj) => {
  for (const prop in obj) {
    if (_.isEmpty(obj[prop])) {
      return false
    } else if (typeof obj[prop] === 'object') {
      if (!this.checkForEmptyPropsInNestedObject(obj[prop])) {
        return false
      }
    } else if (_.isArray(obj[prop])) {
      for (const subObj of obj[prop]) {
        if (!this.checkForEmptyPropsInNestedObject(subObj)) {
          return false
        }
      }
    }
  }
  return true
}
