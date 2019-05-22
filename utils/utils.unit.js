const assert = require('chai').assert

const generateJsonResponse = require('./utils').generateJsonResponse
const removeEmptyPropsDeep = require('./utils').removeEmptyPropsDeep

describe('Generate json', () => {
  it('generate json response string', (done) => {
    const response = generateJsonResponse(200, 'Great success')
    const expectedBody = JSON.stringify({ message: 'Great success' })
    assert.equal(expectedBody, response.body)
    assert.equal(200, response.statusCode)
    done()
  })

  it('generate response dynamodb with no items', (done) => {
    const input = { Items: [], Count: 0, ScannedCount: 0 }
    const response = generateJsonResponse(200, input)
    const expectedBody = JSON.stringify(input)
    assert.equal(response.body, expectedBody)
    assert.equal(200, response.statusCode)
    done()
  })
})

describe('Remove empty props deep', () => {
  it('removes empty strings from first layer', (done) => {
    const input = { a: 'a test', b: 'b test', c: 'c test', d: '' }
    const expected = { a: 'a test', b: 'b test', c: 'c test' }
    assert.deepEqual(removeEmptyPropsDeep(input), expected)
    done()
  })

  it('removes second layer empty strings', (done) => {
    const input = { a: 'a test', b: {}, c: 'c test' }
    const expected = { a: 'a test', c: 'c test' }
    assert.deepEqual(removeEmptyPropsDeep(input), expected)
    done()
  })

  it('numeric fields are not removed', (done) => {
    const input = { a: 'a test', b: 'b test', c: 12345 }
    const expected = { a: 'a test', b: 'b test', c: 12345 }
    assert.deepEqual(removeEmptyPropsDeep(input), expected)
    done()
  })

  it('boolean fields are not removed', (done) => {
    const input = { a: 'a test', b: 'b test', c: false }
    const expected = { a: 'a test', b: 'b test', c: false }
    assert.deepEqual(removeEmptyPropsDeep(input), expected)
    done()
  })

  it('Date fields are not removed', (done) => {
    const input = { a: 'a test', b: new Date('Mon April 23 2012') }
    const expected = { a: 'a test', b: new Date('Mon April 23 2012') }
    assert.deepEqual(removeEmptyPropsDeep(input), expected)
    done()
  })

  it('removes empty strings from an array', (done) => {
    const input = { a: ['test', ''], b: 'b test', c: 'c test' }
    const expected = { a: ['test'], b: 'b test', c: 'c test' }
    assert.deepEqual(removeEmptyPropsDeep(input), expected)
    done()
  })

  it('removes empty objects from array', (done) => {
    const input = { a: ['test', {}], b: 'b test', c: 'c test' }
    const expected = { a: ['test'], b: 'b test', c: 'c test' }
    assert.deepEqual(removeEmptyPropsDeep(input), expected)
    done()
  })

  it('removes array with empty objects ', (done) => {
    const input = { a: [{}, {}], b: 'b test', c: 'c test' }
    const expected = { b: 'b test', c: 'c test' }
    assert.deepEqual(removeEmptyPropsDeep(input), expected)
    done()
  })

  it('removes empty strings from nested object', (done) => {
    const input = { a: { d: 'test', e: '' }, b: 'b test', c: 'c test' }
    const expected = { a: { d: 'test' }, b: 'b test', c: 'c test' }
    assert.deepEqual(removeEmptyPropsDeep(input), expected)
    done()
  })

  it('removes nested object with only empty strings', (done) => {
    const input = { a: { d: '', e: '', f: '' }, b: 'b test', c: 'c test' }
    const expected = { b: 'b test', c: 'c test' }
    assert.deepEqual(removeEmptyPropsDeep(input), expected)
    done()
  })

  it('removes empty string from nested object inside array', (done) => {
    const input = {
      a: 'a test',
      b: 'b test',
      c: 'c test',
      d: [{ e: 'e test', f: 'f test', g: '' }],
    }
    const output = removeEmptyPropsDeep(input)
    const expected = {
      a: 'a test',
      b: 'b test',
      c: 'c test',
      d: [{ e: 'e test', f: 'f test' }],
    }
    assert.deepEqual(output, expected)
    done()
  })

  it('removes nested object in array with only empty strings including array', (done) => {
    const input = {
      a: 'a test',
      b: 'b test',
      c: 'c test',
      d: [{ e: '', f: '' }],
    }
    const output = removeEmptyPropsDeep(input)
    const expected = {
      a: 'a test',
      b: 'b test',
      c: 'c test',
    }
    assert.deepEqual(output, expected)
    done()
  })

  it('removes empty strings inside array inside object inside array', (done) => {
    const input = {
      a: 'a test',
      b: 'b test',
      c: 'c test',
      d: [{ e: ['test', ''] }],
    }
    const output = removeEmptyPropsDeep(input)
    const expected = {
      a: 'a test',
      b: 'b test',
      c: 'c test',
      d: [{ e: ['test'] }],
    }
    assert.deepEqual(output, expected)
    done()
  })

  it('removes empty array with empty deeply nested objects and arrays', (done) => {
    const input = {
      a: 'a test',
      b: 'b test',
      c: 'c test',
      d: [{ e: [{ f: '' }] }],
    }
    const output = removeEmptyPropsDeep(input)
    const expected = {
      a: 'a test',
      b: 'b test',
      c: 'c test',
    }
    assert.deepEqual(output, expected)
    done()
  })

  it('removes empty strings from deeply nested objects', (done) => {
    const input = {
      a: 'a test',
      b: 'b test',
      c: 'c test',
      d: { e: { f: { g: 'g test', h: 'test', l: '' } } },
    }
    const output = removeEmptyPropsDeep(input)
    const expected = {
      a: 'a test',
      b: 'b test',
      c: 'c test',
      d: { e: { f: { g: 'g test', h: 'test' } } },
    }
    assert.deepEqual(output, expected)
    done()
  })
})
