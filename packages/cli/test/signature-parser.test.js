const test = require('ava')
const SignatureParser = require('../src/signature-parser')
const testCases = require('./grammar/command.test-cases')

testCases.forEach(([signature, name, parameters]) => {
  test(`name | [${signature}]`, t => {
    t.is(new SignatureParser(signature).command, name)
  })
})

testCases.forEach(([signature, _, parameters]) => {
  test(`parameters | [${signature}]`, t => {
    t.deepEqual(new SignatureParser(signature).parameters, parameters)
  })
})
