const test = require('ava')
const SignatureParser = require('../src/signature-parser')
const { DummyCommand } = require('./stubs')

test('parses signature', t => {
  t.deepEqual(DummyCommand.parsedSignature, new SignatureParser(DummyCommand.signature))
})
